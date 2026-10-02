"use client";

import React, { useState, useRef, useEffect } from "react";
import { ContentItem, ViewMode } from "@/types/content";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/favoritesSlice";
import {
  toggleReadLater,
  recordInteraction,
  hideItem,
} from "@/store/adaptiveSlice";
import {
  Bookmark,
  Star,
  ExternalLink,
  HelpCircle,
  GripVertical,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Radio,
  Zap,
  MoreVertical,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ContentCardProps {
  item: ContentItem;
  viewMode?: ViewMode;
  onExplain?: (item: ContentItem) => void;
  onQuickBrief?: (item: ContentItem) => void;
  dragHandleProps?: Record<string, any>;
  isDragging?: boolean;
}

export function ContentCard({
  item,
  viewMode = "comfortable",
  onExplain,
  onQuickBrief,
  dragHandleProps,
  isDragging,
}: ContentCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const readLaterIds = useAppSelector((state) => state.adaptive.readLaterIds);

  const isFavorited = favorites.some((fav) => fav.id === item.id);
  const isReadLater = readLaterIds.includes(item.id);

  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));

    if (!isFavorited) {
      dispatch(recordInteraction({ category: item.category, type: "save" }));
      try {
        confetti({
          particleCount: 26,
          spread: 45,
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          },
          colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
        });
      } catch (err) {
        // Safe ignore
      }
    }
  };

  const handleToggleReadLater = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleReadLater(item.id));
    if (!isReadLater) {
      dispatch(recordInteraction({ category: item.category, type: "save" }));
    }
  };

  const handleNotInterested = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    dispatch(hideItem(item.id));
    dispatch(recordInteraction({ category: item.category, type: "notInterested" }));
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url || window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setMenuOpen(false);
    }, 1500);
  };

  const handleOpenSource = () => {
    dispatch(
      recordInteraction({
        category: item.category,
        type: "click",
        minutes: item.type === "movie" ? 1 : 3,
      })
    );
  };

  const getTypeBadge = () => {
    switch (item.type) {
      case "news":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Radio className="w-3 h-3" /> News
          </span>
        );
      case "movie":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Star className="w-3 h-3 fill-purple-500/30" /> Movie
          </span>
        );
      case "social":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <MessageCircle className="w-3 h-3" /> Social
          </span>
        );
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
        return `${diffMins}m ago`;
      }
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "recently";
    }
  };

  const estReadTime = item.type === "movie" ? "1m" : "2m";

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
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <Radio className="w-10 h-10 text-slate-400" />
          </div>
        )}

        {/* Floating Type & Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {getTypeBadge()}
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white capitalize">
            {item.category}
          </span>
        </div>

        {/* Top Right Actions: Drag Handle & Quick Menu */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {dragHandleProps && (
            <div
              {...dragHandleProps}
              className="p-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white/80 hover:text-white cursor-grab active:cursor-grabbing transition-colors"
              title="Drag to reorder card"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white/80 hover:text-white transition-colors cursor-pointer"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleToggleReadLater}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isReadLater ? "fill-purple-600 text-purple-600" : ""}`} />
                  <span>{isReadLater ? "Remove Read Later" : "Read Later"}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={handleNotInterested}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Not Interested (-4)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Score indicator badge */}
        {item.score && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
            {item.score}% Match
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Subheader */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <span className="font-medium truncate">{item.source}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {estReadTime}
              </span>
              <span>•</span>
              <span>{formatRelativeTime(item.publishedAt)}</span>
            </div>
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
                {item.metadata.rating.toFixed(1)} TMDB
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
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {onExplain && (
              <button
                onClick={() => onExplain(item)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Understand why this item was ranked for your feed"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>Why this?</span>
              </button>
            )}

            {onQuickBrief && (
              <button
                onClick={() => onQuickBrief(item)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer"
                title="20-Second Takeaway Brief"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-500/20" />
                <span>Quick Brief</span>
              </button>
            )}

            <button
              onClick={handleToggleFavorite}
              title={isFavorited ? "Saved in Favorites" : "Save Favorite"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
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
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors shadow-xs"
          >
            <span>{item.type === "movie" ? "Watch" : "Open"}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
