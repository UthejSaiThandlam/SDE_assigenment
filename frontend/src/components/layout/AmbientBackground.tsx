"use client";

import React from "react";

export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-40" />

      {/* Floating Aura Orb 1 - Deep Indigo / Blue */}
      <div
        className="absolute -top-[12%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-transparent blur-[110px] animate-aura-1 dark:from-blue-600/20 dark:via-indigo-500/15 will-change-transform"
      />

      {/* Floating Aura Orb 2 - Cyan / Sky Glow */}
      <div
        className="absolute top-[35%] -right-[15%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-cyan-500/15 via-sky-600/10 to-transparent blur-[120px] animate-aura-2 dark:from-cyan-400/20 dark:via-sky-500/15 will-change-transform"
      />

      {/* Floating Aura Orb 3 - Violet / Purple Accent */}
      <div
        className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-600/12 via-fuchsia-500/8 to-transparent blur-[100px] animate-aura-3 dark:from-purple-600/18 dark:via-fuchsia-500/12 will-change-transform"
      />

      {/* Floating Subtle Emerald Beacon Glow for Live Intelligence */}
      <div
        className="absolute top-[60%] left-[5%] w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-[90px] animate-aura-1 dark:from-emerald-500/15 will-change-transform"
      />
    </div>
  );
}
