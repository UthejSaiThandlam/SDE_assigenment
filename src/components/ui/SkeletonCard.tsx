import React from "react";

export function SkeletonCard({ viewMode = "comfortable" }: { viewMode?: "comfortable" | "compact" | "grid" }) {
  if (viewMode === "compact") {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 animate-pulse">
        <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
        <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 overflow-hidden animate-pulse flex flex-col">
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-800" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        </div>
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
