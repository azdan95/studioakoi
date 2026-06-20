import type { CSSProperties, ReactNode } from "react";

type Pos = "tl" | "tr" | "bl" | "br";

const expand: Record<Pos, string> = {
  tl: "group-hover/cf:-translate-x-1.5 group-hover/cf:-translate-y-1.5",
  tr: "group-hover/cf:translate-x-1.5 group-hover/cf:-translate-y-1.5",
  bl: "group-hover/cf:-translate-x-1.5 group-hover/cf:translate-y-1.5",
  br: "group-hover/cf:translate-x-1.5 group-hover/cf:translate-y-1.5",
};

function Corner({
  pos, size, color, offset, interactive,
}: { pos: Pos; size: number; color: string; offset: number; interactive: boolean }) {
  const place: Record<Pos, CSSProperties> = {
    tl: { top: offset, left: offset, borderTopWidth: 1, borderLeftWidth: 1 },
    tr: { top: offset, right: offset, borderTopWidth: 1, borderRightWidth: 1 },
    bl: { bottom: offset, left: offset, borderBottomWidth: 1, borderLeftWidth: 1 },
    br: { bottom: offset, right: offset, borderBottomWidth: 1, borderRightWidth: 1 },
  };
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute ${interactive ? `transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${expand[pos]}` : ""}`}
      style={{ width: size, height: size, borderStyle: "solid", borderColor: color, ...place[pos] }}
    />
  );
}

/** Wraps content in four L-shaped corner accent marks. `interactive` makes the
 *  corners spread open on hover (pair with a group-hover text effect inside). */
export default function CornerFrame({
  children,
  className,
  color = "var(--accent)",
  size = 16,
  offset = -8,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: number;
  offset?: number;
  interactive?: boolean;
}) {
  return (
    <div className={`relative ${interactive ? "group/cf" : ""} ${className ?? ""}`}>
      <Corner pos="tl" size={size} color={color} offset={offset} interactive={interactive} />
      <Corner pos="tr" size={size} color={color} offset={offset} interactive={interactive} />
      <Corner pos="bl" size={size} color={color} offset={offset} interactive={interactive} />
      <Corner pos="br" size={size} color={color} offset={offset} interactive={interactive} />
      {children}
    </div>
  );
}
