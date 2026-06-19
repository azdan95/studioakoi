"use client";

import { useEffect, useRef } from "react";

/**
 * Renders multi-line display text as a WebGL "glass" headline with chromatic
 * dispersion + a soft sheen. A styled DOM copy underneath provides the
 * accessible / no-WebGL / reduced-motion fallback (and sizes the box).
 */
export default function GlassText({
  lines,
  className,
  ariaLabel,
}: {
  lines: string[];
  className?: string;
  ariaLabel: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!wrap || !canvas || !fallback) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true });
    if (!gl) return; // keep DOM fallback visible

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- shaders ---- */
    const vsSrc = `
      attribute vec2 p; varying vec2 vUv;
      void main(){ vUv = p * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(p, 0.0, 1.0); }`;
    const fsSrc = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uAberr;
      uniform vec3 uInk;
      void main(){
        vec2 uv = vUv;
        vec2 toM = uMouse - uv;
        float amp = uAberr * (0.65 + 0.35 * sin(uTime * 0.8));
        vec2 off = normalize(toM + vec2(0.0001)) * amp + vec2(amp * 0.5, 0.0);
        float ar = texture2D(uTex, uv + off).a;
        float ag = texture2D(uTex, uv).a;
        float ab = texture2D(uTex, uv - off).a;
        vec3 col = uInk * ag;
        col += vec3(1.0, 0.15, 0.35) * max(ar - ag, 0.0);
        col += vec3(0.10, 0.60, 1.00) * max(ab - ag, 0.0);
        float a = max(ar, max(ag, ab));
        // soft sheen sweeping across the glyphs
        float band = abs(fract(uv.x * 0.55 - uTime * 0.04) - 0.5);
        float sheen = smoothstep(0.46, 0.5, band);
        col += vec3(1.0) * sheen * a * 0.12;
        gl_FragColor = vec4(col, a);
      }`;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return; // fallback stays
    gl.useProgram(prog);

    // fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uTex = gl.getUniformLocation(prog, "uTex");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uAberr = gl.getUniformLocation(prog, "uAberr");
    const uInk = gl.getUniformLocation(prog, "uInk");

    // text texture (white glyphs on transparent → alpha = coverage)
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const tCanvas = document.createElement("canvas");
    const tCtx = tCanvas.getContext("2d")!;

    let W = 0, H = 0, dpr = 1;

    const drawTexture = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      tCanvas.width = canvas.width;
      tCanvas.height = canvas.height;

      tCtx.clearRect(0, 0, tCanvas.width, tCanvas.height);
      tCtx.save();
      tCtx.scale(dpr, dpr);
      const lineH = H / lines.length;
      const fontSize = lineH * 0.86;
      tCtx.font = `700 ${fontSize}px "Bodoni Moda", Georgia, serif`;
      tCtx.fillStyle = "#ffffff";
      tCtx.textBaseline = "middle";
      tCtx.textAlign = "left";
      lines.forEach((line, i) => tCtx.fillText(line, 0, lineH * (i + 0.5)));
      tCtx.restore();

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tCanvas);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const readInk = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--text-primary").trim();
      let r = 0.13, g = 0.14, b = 0.19;
      const hx = raw.replace("#", "");
      if (/^[0-9a-fA-F]{6}$/.test(hx)) {
        r = parseInt(hx.slice(0, 2), 16) / 255;
        g = parseInt(hx.slice(2, 4), 16) / 255;
        b = parseInt(hx.slice(4, 6), 16) / 255;
      }
      return [r, g, b] as const;
    };
    let ink = readInk();

    const mouse = { x: 0.3, y: 0.4, tx: 0.3, ty: 0.4 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / Math.max(1, rect.width);
      mouse.ty = (e.clientY - rect.top) / Math.max(1, rect.height);
    };
    window.addEventListener("mousemove", onMove);

    const ro = new ResizeObserver(() => drawTexture());
    ro.observe(wrap);

    const themeObs = new MutationObserver(() => { ink = readInk(); });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // make sure the editorial font is loaded before baking the texture
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      drawTexture();
      // reveal canvas, hide DOM fallback (still present for a11y/layout)
      canvas.style.opacity = "1";
      fallback.style.opacity = "0";
    };
    if (document.fonts && document.fonts.load) {
      document.fonts.load('700 100px "Bodoni Moda"').then(start).catch(start);
    } else {
      start();
    }

    let raf = 0;
    const t0 = performance.now();
    const render = () => {
      const t = reduced ? 0 : (performance.now() - t0) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1i(uTex, 0);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uAberr, reduced ? 0.004 : 0.012);
      gl.uniform3f(uInk, ink[0], ink[1], ink[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      themeObs.disconnect();
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, [lines]);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`} aria-label={ariaLabel} role="heading" aria-level={2}>
      {/* DOM fallback: visible until WebGL takes over; sizes the box; read by SR */}
      <div
        ref={fallbackRef}
        aria-hidden
        className="font-[family-name:var(--font-editorial)] font-bold leading-[0.9] tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 6.5vw, 4.75rem)", color: "var(--text-primary)", transition: "opacity 0.4s ease" }}
      >
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0, transition: "opacity 0.5s ease" }}
      />
    </div>
  );
}
