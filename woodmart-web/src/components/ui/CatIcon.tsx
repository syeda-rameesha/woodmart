// src/components/ui/CatIcon.tsx
"use client";

import {
  ClockIcon,
  LightBulbIcon,
  HomeModernIcon,
  PuzzlePieceIcon,
  FireIcon,
  GiftTopIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

type Props = { name: string; className?: string };

export default function CatIcon({ name, className }: Props) {
  const key = name.toLowerCase();
  const common = `h-5 w-5 ${className ?? ""}`;

  switch (key) {
    case "clocks":
    case "clock":
      return <ClockIcon className={common} />;
    case "lighting":
    case "light":
      return <LightBulbIcon className={common} />;
    case "furniture":
      return <HomeModernIcon className={common} />;
    case "accessories":
      return <PuzzlePieceIcon className={common} />;
    case "cooking":
      return <FireIcon className={common} />;
    case "toys":
      return <GiftTopIcon className={common} />;
    case "fashion":
      return <ShoppingBagIcon className={common} />;
    default:
      return <PuzzlePieceIcon className={common} />;
  }
}