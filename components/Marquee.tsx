"use client";

const words = ["Atmosphere", "Kinetics", "Objects", "Interior"];

function Group() {
  return (
    <div className="flex items-center shrink-0" aria-hidden>
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span
            className="font-[family-name:var(--font-space)] text-sm md:text-base font-medium tracking-[0.25em] uppercase whitespace-nowrap"
            style={{ color: "var(--text-secondary)" }}
          >
            <span style={{ color: "var(--accent)" }}>{w[0]}</span>
            {w.slice(1)}
          </span>
          <span className="mx-6 md:mx-9 text-[7px]" style={{ color: "var(--accent)" }}>
            ●
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      className="akoi-marquee relative overflow-hidden border-y py-4 md:py-5"
      style={{ borderColor: "var(--border)" }}
    >
      <span className="sr-only">Atmosphere · Kinetics · Objects · Interior — AKOI</span>
      <div className="akoi-marquee-track flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex">
            {[0, 1, 2, 3].map((i) => (
              <Group key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
