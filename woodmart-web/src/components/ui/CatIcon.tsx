"use client";

type Props = {
  name: string;
  className?: string;
};

export default function CatIcon({ name, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      aria-hidden
      title={name}
    >
      ●
    </span>
  );
}