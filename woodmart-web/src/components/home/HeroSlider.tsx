// src/components/home/HeroSlider.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Slide = {
  image: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  align?: "left" | "center" | "right";
};

type Props = {
  slides: Slide[];
  intervalMs?: number;
  children?: React.ReactNode;
};

export default function HeroSlider({
  slides,
  intervalMs = 4500,
  children,
}: Props) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hovering = useRef(false);

  const go = (n: number) =>
    setIdx((p) => (p + n + slides.length) % slides.length);
  const next = () => go(1);
  const prev = () => go(-1);

  useEffect(() => {
    if (hovering.current) return;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(next, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [idx, intervalMs, slides.length]);

  if (!slides.length) return null;

  const s = slides[idx];

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      {/* image */}
      <div className="aspect-[16/6] sm:aspect-[16/6] md:aspect-[16/6] lg:aspect-[16/5] xl:aspect-[16/5] bg-gray-100">
        <img
          src={s.image}
          alt={s.title || "slide"}
          className="h-full w-full object-cover"
        />
      </div>

      {/* arrows (already correct) */}
      <button
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 hover:bg-white shadow"
        onClick={prev}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 hover:bg-white shadow"
        onClick={next}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* headline / copy */}
      <div
        className={[
          "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-6",
          s.align === "left"
            ? "text-left"
            : s.align === "right"
            ? "text-right"
            : "text-center",
        ].join(" ")}
      >
        <div className="pointer-events-auto mx-auto max-w-5xl">
          {s.title && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow">
              {s.title}
            </h2>
          )}
          {s.subtitle && (
            <p className="mt-2 text-white/90 drop-shadow">
              {s.subtitle}
            </p>
          )}
          {s.href && s.ctaLabel && (
            <Link
              href={s.href}
              className="inline-block mt-4 px-4 py-2 rounded-md bg-white/90 hover:bg-white transition text-sm font-medium"
            >
              {s.ctaLabel}
            </Link>
          )}
        </div>
      </div>

      {/* bottom gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="h-24 bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      {/* centered chips overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5">
        <div className="pointer-events-auto mx-auto w-full max-w-5xl px-4">
          {children}
        </div>
      </div>
    </div>
  );
}