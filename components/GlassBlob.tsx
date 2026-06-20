"use client";

import { useEffect, useRef } from "react";

/**
 * Raymarched "liquid glass" metaballs floating over the given text, so the
 * rotating blob refracts / magnifies the name through the glass. Clear where
 * the blob isn't; lensed where it passes over. Fills its positioned parent.
 * Static under prefers-reduced-motion.
 */
export default function GlassBlob({ lines, className }: { lines: string[]; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;
    const fs = `
      precision highp float;
      uniform vec2 uRes;
      uniform float uTime;
      uniform sampler2D uName;
      mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
      float smin(float a, float b, float k){
        float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
        return mix(b, a, h) - k*h*(1.0-h);
      }
      float map(vec3 p){
        p.xz *= rot(uTime * 0.45);
        p.xy *= rot(sin(uTime * 0.3) * 0.25);
        float t = uTime;
        vec3 a = vec3(-0.78 + 0.12*sin(t),        0.0,             0.0);
        vec3 b = vec3( 0.80 + 0.12*sin(t + 1.6),  0.0,             0.0);
        vec3 c = vec3( 0.0,                        0.22*sin(t*0.7), 0.05*sin(t));
        float d = length(p - a) - 0.55;
        d = smin(d, length(p - b) - 0.62, 0.42);
        d = smin(d, length(p - c) - 0.46, 0.5);
        return d;
      }
      vec3 calcN(vec3 p){
        vec2 e = vec2(0.0012, 0.0);
        return normalize(vec3(
          map(p+e.xyy) - map(p-e.xyy),
          map(p+e.yxy) - map(p-e.yxy),
          map(p+e.yyx) - map(p-e.yyx)));
      }
      // background plane = light grid + the name (dark ink)
      vec3 bg(vec2 uv){
        vec3 base = mix(vec3(0.93), vec3(0.84), clamp(uv.y, 0.0, 1.0));
        vec2 g = abs(fract(uv * 6.0) - 0.5);
        float line = smoothstep(0.47, 0.5, max(g.x, g.y));
        base -= line * 0.04;
        float na = texture2D(uName, vec2(uv.x, 1.0 - uv.y)).a;
        base = mix(base, vec3(0.09, 0.09, 0.12), na);
        return base;
      }
      void main(){
        vec2 uv = gl_FragCoord.xy / uRes;
        vec2 p = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
        vec3 ro = vec3(0.0, 0.0, 3.2);
        vec3 rd = normalize(vec3(p, -1.7));
        float t = 0.0;
        bool hit = false;
        for(int i = 0; i < 72; i++){
          vec3 pos = ro + rd * t;
          float d = map(pos);
          if(d < 0.001){ hit = true; break; }
          t += d;
          if(t > 7.0) break;
        }
        vec3 col;
        if(hit){
          vec3 pos = ro + rd * t;
          vec3 n = calcN(pos);
          float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
          // lens: magnify + refract the name plane through the glass
          vec2 luv = (uv - 0.5) * (1.0 - 0.28 * (1.0 - fres)) + 0.5; // gentle magnification
          vec3 refr = bg(luv + n.xy * 0.16);
          vec3 refl = bg(uv - n.xy * 0.10);
          col = mix(refr, refl, 0.28);
          col = mix(col, vec3(1.0), fres * 0.45);          // bright glassy rim
          vec3 L = normalize(vec3(0.6, 0.9, 0.7));
          float spec = pow(max(dot(reflect(rd, n), L), 0.0), 60.0);
          col += spec * 0.85;                               // sharp highlight
          col *= 0.95 + 0.07 * n.y;
        } else {
          col = bg(uv);
        }
        gl_FragColor = vec4(col, 1.0);
      }`;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uName = gl.getUniformLocation(prog, "uName");

    // name texture (white glyphs on transparent → alpha = coverage)
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const tCanvas = document.createElement("canvas");
    const tCtx = tCanvas.getContext("2d")!;

    const bakeName = () => {
      tCanvas.width = canvas.width;
      tCanvas.height = canvas.height;
      const W = tCanvas.width, H = tCanvas.height;
      tCtx.clearRect(0, 0, W, H);
      const pad = W * 0.06;
      const lineH = H / (lines.length + 0.6);
      const fontSize = lineH * 0.8;
      tCtx.font = `700 ${fontSize}px "Bodoni Moda", Georgia, serif`;
      tCtx.fillStyle = "#fff";
      tCtx.textBaseline = "middle";
      tCtx.textAlign = "left";
      const blockH = lineH * lines.length;
      const startY = (H - blockH) / 2;
      lines.forEach((l, i) => tCtx.fillText(l, pad, startY + lineH * (i + 0.5)));
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tCanvas);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      bakeName();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (document.fonts && document.fonts.load) {
      document.fonts.load('700 100px "Bodoni Moda"').then(bakeName).catch(() => {});
    }

    let raf = 0;
    const t0 = performance.now();
    const render = () => {
      const t = reduced ? 1.2 : (performance.now() - t0) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1i(uName, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, [lines]);

  return <canvas ref={canvasRef} aria-hidden className={`w-full h-full block ${className ?? ""}`} />;
}
