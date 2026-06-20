"use client";

import { useEffect, useRef } from "react";

/**
 * Radial chromatic diffraction burst (rainbow rays from a dark center, with
 * chromatic aberration + film grain), rendered procedurally in WebGL.
 * Fills its positioned parent. Static under prefers-reduced-motion.
 */
export default function ChromaBurst({ className }: { className?: string }) {
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
      vec3 hsv2rgb(vec3 c){
        vec3 q = abs(fract(c.xxx + vec3(0.0, 2.0/3.0, 1.0/3.0)) * 6.0 - 3.0);
        return c.z * mix(vec3(1.0), clamp(q - 1.0, 0.0, 1.0), c.y);
      }
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      void main(){
        vec2 uv = gl_FragCoord.xy / uRes;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= uRes.x / uRes.y;
        float r = length(p);
        float ang = atan(p.y, p.x);
        float t = uTime * 0.03;

        float hue = fract(ang / 6.2831853 + t + r * 0.15);
        float rayPhase = ang * 200.0;
        float ca = 0.5 * r;                       // chromatic aberration grows outward
        float rr = 0.5 + 0.5 * sin(rayPhase + ca * 6.0);
        float gg = 0.5 + 0.5 * sin(rayPhase);
        float bb = 0.5 + 0.5 * sin(rayPhase - ca * 6.0);
        vec3 rayCol = pow(vec3(rr, gg, bb), vec3(1.4));

        vec3 base = hsv2rgb(vec3(hue, 0.95, 1.0));
        float ring = smoothstep(0.12, 0.5, r) * (1.0 - smoothstep(0.6, 1.3, r));
        vec3 col = base * rayCol * ring * 1.35;

        float g = hash(uv * uRes * 0.5 + t * 60.0);
        col += (g - 0.5) * 0.10;
        col = max(col, 0.0);
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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    const t0 = performance.now();
    const render = () => {
      const t = reduced ? 12.0 : (performance.now() - t0) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
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
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`w-full h-full block ${className ?? ""}`} />;
}
