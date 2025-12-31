// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import ToasterProvider from "@/components/ToasterProvider";

export const metadata: Metadata = {
  title: "WoodMart",
  description: "WoodMart demo built with Next.js + Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {/* Client-only toaster */}
        <ToasterProvider />

        <Header />

        {/* Page container */}
        <div className="max-w-screen-xl mx-auto px-4">
          {/* 
            pb-[76px] → reserves space for mobile bottom bar
            md:pb-0   → removes padding on desktop
          */}
          <main className="pb-[76px] md:pb-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}