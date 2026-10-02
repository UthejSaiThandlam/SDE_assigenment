import React from "react";
import { Sparkles, RefreshCw, BookmarkX, SearchX } from "lucide-react";

interface EmptyStateProps {
  type?: "search" | "favorites" | "feed" | "error";
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
}

export function EmptyState({
  type = "feed",
  title,
  description,
  onAction,
  actionText,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "search":
        return <SearchX className="w-10 h-10 text-blue-500 dark:text-blue-400" />;
      case "favorites":
        return <BookmarkX className="w-10 h-10 text-amber-500 dark:text-amber-400" />;
      default:
        return <Sparkles className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />;
    }
  };

  const defaultTitle =
    type === "search"
      ? "No matching stories found"
      : type === "favorites"
      ? "No saved items yet"
      : "No content matches your active filters";

  const defaultDesc =
    type === "search"
      ? "Try searching for broader terms like 'AI', 'Quantum', 'Nolan', or clear your search input."
      : type === "favorites"
      ? "Click the star or bookmark icon on any card across your feed to collect articles and movies here."
      : "Enable more categories or reset your stream preferences in the Settings panel.";

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 my-8">
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-4 shadow-sm">
        {getIcon()}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description || defaultDesc}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all duration-200 shadow-sm shadow-blue-500/25 active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          {actionText || "Reset Filters"}
        </button>
      )}
    </div>
  );
}
