"use client";
import React from "react";

export default function LoadingSpeakingTest() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-base-content/70">
        <span className="loading loading-spinner loading-lg text-primary" aria-label="Loading" />
        <span className="text-sm">Loading speaking test…</span>
      </div>
    </div>
  );
}


