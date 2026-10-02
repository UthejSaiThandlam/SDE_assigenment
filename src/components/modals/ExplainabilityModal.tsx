import React from "react";
import { ContentItem } from "@/types/content";
import { X, Sparkles, CheckCircle2, TrendingUp, Clock, Award } from "lucide-react";

interface ExplainabilityModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export function ExplainabilityModal({ item, onClose }: ExplainabilityModalProps) {
  if (!item) return null;

  const explanation = item.scoreExplanation || {
    totalScore: item.score || 75,
    categoryScore: 40,
    recencyScore: 20,
    engagementScore: 15,
    reasons: [
      `Selected based on your active interest in ${item.category}`,
      `Verified high quality source: ${item.source}`,
    ],
  };

  const score = explanation.totalScore;
  const scoreColor =
    score >= 80 ? "text-emerald-500" : score >= 60 ? "text-blue-500" : "text-amber-500";
  const progressBg =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-blue-500" : "bg-amber-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Personalization Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent ranking breakdown for this item
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

        {/* Item Title Preview */}
        <div className="py-4">
          <span className="text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mr-2">
            {item.type}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
            {item.category}
          </span>
          <h4 className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
            {item.title}
          </h4>
        </div>

        {/* Score Meter */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/80 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Composite Relevance Score
            </span>
            <span className={`text-xl font-bold ${scoreColor}`}>
              {score}<span className="text-xs text-slate-400 font-normal">/100</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${progressBg} transition-all duration-500`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Breakdown Factors */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Award className="w-4 h-4 text-blue-500" />
              <span>Category Affinity (Preferences match)</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {explanation.categoryScore} / 45 pts
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Publication Recency & Freshness</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {explanation.recencyScore} / 25 pts
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Engagement / Ratings Authority</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {explanation.engagementScore} / 15 pts
            </span>
          </div>
        </div>

        {/* Explainability Reasons */}
        <div className="space-y-2 mb-6">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Why you are seeing this:
          </h5>
          <div className="space-y-1.5">
            {explanation.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
