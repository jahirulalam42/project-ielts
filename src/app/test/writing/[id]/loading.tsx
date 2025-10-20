"use client";
import React from "react";

export default function LoadingWritingTest() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-base-content/70">
        <span className="loading loading-spinner loading-lg text-primary" aria-label="Loading" />
        <span className="text-sm">Loading writing test…</span>
      </div>
    </div>
  );
}


