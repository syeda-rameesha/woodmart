// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import ToasterProvider from "@/components/ToasterProvider"; // direct import of client component

export const metadata: Metadata = {
  title: "WoodMart",
  description: "WoodMart demo built with Next.js + Tailwind",
};
{ /* FORCE REBUILD */}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {/* Client-only toaster (imported directly) */}
        <ToasterProvider />

        <Header />

        {/* Page container */}
        <div className="max-w-screen-xl mx-auto px-4">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
