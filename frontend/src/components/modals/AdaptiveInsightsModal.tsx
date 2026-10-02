"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetAdaptiveScores } from "@/store/adaptiveSlice";
import {
  X,
  Target,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Zap,
  Bookmark,
  CheckCircle2,
  Clock,
  Activity,
} from "lucide-react";

interface AdaptiveInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdaptiveInsightsModal({
  isOpen,
  onClose,
}: AdaptiveInsightsModalProps) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();

  const { categoryWeights, interactionCount, totalReadingMinutes, readLaterIds, hiddenIds } =
    useAppSelector((state) => state.adaptive);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const categories = [
    { id: "ai", label: "Artificial Intelligence", weight: categoryWeights.ai, color: "from-blue-600 to-indigo-500" },
    { id: "technology", label: "Technology & Software", weight: categoryWeights.technology, color: "from-cyan-500 to-blue-500" },
    { id: "finance", label: "Finance & Crypto", weight: categoryWeights.finance, color: "from-emerald-500 to-teal-500" },
    { id: "entertainment", label: "Entertainment & Cinema", weight: categoryWeights.entertainment, color: "from-purple-500 to-fuchsia-500" },
    { id: "sports", label: "Sports & Athletics", weight: categoryWeights.sports, color: "from-amber-500 to-orange-500" },
  ].sort((a, b) => b.weight - a.weight);

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
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                Adaptive Preference Scoring
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live interaction-derived interest weights tuning your feed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {interactionCount}
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Interactions
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-2xl font-black text-emerald-500">
              {totalReadingMinutes}m
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Reading Time
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {readLaterIds.length}
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Read Later
            </div>
          </div>
        </div>

        {/* Dynamic Category Evolution Bars */}
        <div className="space-y-3.5 mb-6">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Your Interests Have Evolved</span>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
              Live Weights
            </span>
          </div>

          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-800 dark:text-slate-200">{cat.label}</span>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                  {cat.weight}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(5, cat.weight))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Scoring Rule Explainer */}
        <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mb-5">
          <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>How Adaptive Scoring Works:</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <div>• Click story: <strong className="text-emerald-600">+3 pts</strong></div>
            <div>• Bookmark/Save: <strong className="text-emerald-600">+5 pts</strong></div>
            <div>• Quick Brief: <strong className="text-emerald-600">+2 pts</strong></div>
            <div>• Not Interested: <strong className="text-rose-500">-4 pts</strong></div>
          </div>
        </div>

        {/* Reset / Done Toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => dispatch(resetAdaptiveScores())}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Weights</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
