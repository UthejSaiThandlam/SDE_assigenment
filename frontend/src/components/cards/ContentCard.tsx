import React, { useState } from "react";
import { ContentItem, ViewMode } from "@/types/content";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/favoritesSlice";
import { recordInteraction } from "@/store/adaptiveSlice";
import { addNotification } from "@/store/notificationSlice";
import {
  Heart,
  ExternalLink,
  HelpCircle,
  Zap,
  Radio,
  Film,
  MessageSquare,
  Clock,
  Sparkles,
  GripVertical,
  Star,
} from "lucide-react";

interface ContentCardProps {
  item: ContentItem;
  viewMode?: ViewMode;
  onExplain?: (item: ContentItem) => void;
  onQuickBrief?: (item: ContentItem) => void;
  isDragging?: boolean;
  dragHandleProps?: Record<string, any>;
}

export function ContentCard({
  item,
  viewMode = "comfortable",
  onExplain,
  onQuickBrief,
  isDragging,
  dragHandleProps,
}: ContentCardProps) {
  const dispatch = useAppDispatch();
  const isFavorited = useAppSelector((state) =>
    state.favorites.items.some((fav) => fav.id === item.id)
  );

  const [imgError, setImgError] = useState(false);

  // Format type badges
  const getTypeBadge = () => {
    switch (item.type) {
      case "news":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 backdrop-blur-xs">
            <Radio className="w-3 h-3" />
            <span>News</span>
          </span>
        );
      case "movie":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 backdrop-blur-xs">
            <Film className="w-3 h-3" />
            <span>Movie</span>
          </span>
        );
      case "social":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-xs">
            <MessageSquare className="w-3 h-3" />
            <span>Social</span>
          </span>
        );
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));

    if (!isFavorited) {
      dispatch(
        recordInteraction({
          category: item.category,
          type: "save",
        })
      );
      dispatch(
        addNotification({
          title: "Saved to Library",
          description: `"${item.title.slice(0, 32)}..." added to your personal favorites.`,
          type: "adaptive",
        })
      );
    }
  };

  const handleOpenSource = () => {
    dispatch(
      recordInteraction({
        category: item.category,
        type: "click",
        minutes: 2,
      })
    );
  };

  // Format time display
  const formattedTime = () => {
    try {
      const now = new Date();
      const past = new Date(item.publishedAt);
      const diffMs = now.getTime() - past.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Recently";
    }
  };

  // Estimated reading or runtime
  const estReadTime = item.type === "movie" ? "2h runtime" : "3m read";

  // Relevance match percent badge
  const matchPercent = item.score
    ? Math.min(99, Math.max(65, Math.round(item.score * 100)))
    : 80;

  // Compact layout
  if (viewMode === "compact") {
    return (
      <div
        className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-lg scale-102"
            : "border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {dragHandleProps && (
            <div
              {...dragHandleProps}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing p-1 shrink-0"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          {item.image && !imgError && (
            <img
              src={item.image}
              alt={item.title}
              onError={() => setImgError(true)}
              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-800"
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getTypeBadge()}
              <span className="text-xs text-slate-400 capitalize">{item.category}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {estReadTime}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {item.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-4">
          {onQuickBrief && (
            <button
              onClick={() => onQuickBrief(item)}
              title="20-Second Quick Brief"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-500/20" />
              <span>Brief</span>
            </button>
          )}

          {onExplain && (
            <button
              onClick={() => onExplain(item)}
              title="Why am I seeing this?"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleToggleFavorite}
            title={isFavorited ? "Remove from favorites" : "Save favorite"}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFavorited
                ? "text-rose-500 bg-rose-50 dark:bg-rose-950/40"
                : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500" : ""}`} />
          </button>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenSource}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Comfortable / Grid Layout
  return (
    <div
      className={`group flex flex-col justify-between rounded-2xl border transition-all duration-200 overflow-hidden relative ${
        isDragging
          ? "border-blue-500 shadow-2xl bg-white dark:bg-slate-900 opacity-95 scale-102 ring-2 ring-blue-500/20"
          : "border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
      }`}
    >
      {/* Top Media / Thumbnail */}
      <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-400">
            {item.type === "news" ? (
              <Radio className="w-10 h-10 stroke-[1.5]" />
            ) : item.type === "movie" ? (
              <Film className="w-10 h-10 stroke-[1.5]" />
            ) : (
              <MessageSquare className="w-10 h-10 stroke-[1.5]" />
            )}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Top Badges (Category & Drag Handle) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5">
            {getTypeBadge()}
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-900/70 text-slate-200 backdrop-blur-md capitalize border border-white/10">
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {dragHandleProps && (
              <div
                {...dragHandleProps}
                className="p-1 rounded-md bg-slate-900/60 hover:bg-slate-900/90 text-white/80 hover:text-white backdrop-blur-md cursor-grab active:cursor-grabbing transition-colors"
                title="Drag card to reorder your personalized queue"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Match Percentage Pill */}
        <div className="absolute bottom-3 right-3">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 backdrop-blur-md shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{matchPercent}% Match</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Subheading */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {item.source}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {estReadTime}
            </span>
            <span>•</span>
            <span>{formattedTime()}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {item.description}
          </p>

          {/* Specific Type Badges (Author, Rating, Likes) */}
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {item.metadata?.rating && (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                {item.metadata.rating.toFixed(1)} Rating
              </span>
            )}

            {item.metadata?.likes && (
              <span className="inline-flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                {item.metadata.likes.toLocaleString()}
              </span>
            )}

            {item.metadata?.hashtag && (
              <span className="text-blue-500 font-medium">
                {item.metadata.hashtag}
              </span>
            )}

            {item.metadata?.author && !item.metadata.hashtag && (
              <span className="truncate">By {item.metadata.author}</span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1 flex-wrap">
          <div className="flex items-center gap-1 shrink-0">
            {onExplain && (
              <button
                onClick={() => onExplain(item)}
                className="inline-flex items-center gap-1 px-1.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Understand why this item was ranked for your feed"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Why this?</span>
              </button>
            )}

            {onQuickBrief && (
              <button
                onClick={() => onQuickBrief(item)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer shrink-0"
                title="20-Second Takeaway Brief"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-500/20" />
                <span>Quick Brief</span>
              </button>
            )}

            <button
              onClick={handleToggleFavorite}
              title={isFavorited ? "Saved in Favorites" : "Save Favorite"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                isFavorited
                  ? "text-rose-500 bg-rose-50 dark:bg-rose-950/40"
                  : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500" : ""}`} />
            </button>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenSource}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors shadow-xs shrink-0"
          >
            <span>{item.type === "movie" ? "Watch" : "Open"}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
