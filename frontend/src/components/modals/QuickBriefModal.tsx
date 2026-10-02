"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ContentItem } from "@/types/content";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleReadLater, recordInteraction } from "@/store/adaptiveSlice";
import {
  X,
  Zap,
  Clock,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Share2,
  Radio,
  Star,
  MessageCircle,
} from "lucide-react";

interface QuickBriefModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export function QuickBriefModal({ item, onClose }: QuickBriefModalProps) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const readLaterIds = useAppSelector((state) => state.adaptive.readLaterIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item || !mounted) return null;

  const isReadLater = readLaterIds.includes(item.id);

  // Derive crisp 20-second takeaways
  const generateTakeaways = (content: ContentItem) => {
    const title = content.title;
    const desc = content.description || "";
    const takeaways: string[] = [];

    if (content.type === "movie") {
      takeaways.push(`Cinema highlight starring notable talent with ${content.metadata?.rating ? `${content.metadata.rating.toFixed(1)}/10 TMDB rating` : "high audience anticipation"}.`);
      takeaways.push(desc.length > 80 ? desc.slice(0, 110) + "..." : desc);
      takeaways.push("Available for streaming exploration and watchlist addition.");
    } else if (content.type === "news") {
      takeaways.push(`Primary coverage published via verified outlet ${content.source}.`);
      takeaways.push(desc.length > 80 ? desc.slice(0, 110) + "..." : desc);
      takeaways.push(`Categorized under ${content.category.toUpperCase()} matching your algorithmic interest profile.`);
    } else {
      takeaways.push(`High engagement community discussion with ${content.metadata?.likes ? `${content.metadata.likes.toLocaleString()} positive interactions` : "active debate"}.`);
      takeaways.push(desc.length > 80 ? desc.slice(0, 110) + "..." : desc);
      takeaways.push("Reflects real-time community sentiment on trending topics.");
    }

    return takeaways;
  };

  const takeaways = generateTakeaways(item);
  const estimatedReadMinutes = item.type === "movie" ? 1 : 2;

  const handleOpenSource = () => {
    dispatch(
      recordInteraction({
        category: item.category,
        type: "click",
        minutes: estimatedReadMinutes,
      })
    );
    window.open(item.url, "_blank", "noopener,noreferrer");
  };

  const handleToggleReadLater = () => {
    dispatch(toggleReadLater(item.id));
    dispatch(
      recordInteraction({
        category: item.category,
        type: "save",
      })
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 overflow-y-auto relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Zap className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                20-Second Executive Brief
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ~{estimatedReadMinutes} min read
                </span>
                <span>•</span>
                <span className="capitalize">{item.category}</span>
                <span>•</span>
                <span>{item.source}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Item Title */}
        <div className="py-4">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug">
            {item.title}
          </h3>
        </div>

        {/* Takeaway Bullets Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3 mb-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Key Takeaways</span>
          </div>

          <div className="space-y-2.5">
            {takeaways.map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleToggleReadLater}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isReadLater
                ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isReadLater ? "fill-purple-600" : ""}`} />
            <span>{isReadLater ? "In Read Later" : "Read Later"}</span>
          </button>

          <button
            onClick={handleOpenSource}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span>Read Full Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
