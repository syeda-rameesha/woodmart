"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      // keep it floating above everything and NON-blocking
      containerClassName="!pointer-events-none z-[9999]"
      toastOptions={{
        duration: 2200,
        className:
          // dark glassy card w/ subtle border & shadow
          "!pointer-events-auto !rounded-md !bg-neutral-900/95 !text-white !shadow-xl !border !border-white/10",
        style: {
          padding: "10px 14px",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#16a34a", secondary: "#ffffff" }, // green
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#ffffff" }, // red
        },
      }}
    />
  );
}