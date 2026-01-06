"use client";

export default function Loader({
  size = 28,
}: {
  size?: number;
}) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-black"
      style={{
        width: size,
        height: size,
      }}
      aria-label="Loading"
    />
  );
}