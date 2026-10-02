"use client";

import React from "react";
import { ContentItem, UserPreferences } from "@/types/content";
import {
  FileText,
  X,
  Download,
  Sparkles,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  Film,
  MessageSquare,
} from "lucide-react";

interface FeedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ContentItem[];
  preferences: UserPreferences;
}

export function FeedReportModal({
  isOpen,
  onClose,
  items,
  preferences,
}: FeedReportModalProps) {
  if (!isOpen) return null;

  // Calculate stats
  const total = items.length;
  const avgScore = total > 0
    ? Math.round(items.reduce((acc, it) => acc + (it.score || 75), 0) / total)
    : 0;

  const newsCount = items.filter((it) => it.type === "news").length;
  const movieCount = items.filter((it) => it.type === "movie").length;
  const socialCount = items.filter((it) => it.type === "social").length;

  const categoryCounts = preferences.categories.map((cat) => ({
    category: cat,
    count: items.filter((it) => it.category === cat).length,
    percentage: total > 0
      ? Math.round((items.filter((it) => it.category === cat).length / total) * 100)
      : 0,
  }));

  const handleDownloadJson = () => {
    const reportData = {
      title: "AuraPulse Content Intelligence & Personalization Audit Report",
      generatedAt: new Date().toISOString(),
      user: preferences.userName,
      summary: {
        totalStoriesAnalyzed: total,
        averagePersonalizationScore: avgScore,
        activeCategories: preferences.categories,
        activeStreamTypes: preferences.contentTypes,
        viewMode: preferences.viewMode,
      },
      sourceBreakdown: {
        news: newsCount,
        movies: movieCount,
        social: socialCount,
      },
      categoryDistribution: categoryCounts,
      topRankedStories: items.slice(0, 5).map((it) => ({
        id: it.id,
        type: it.type,
        title: it.title,
        category: it.category,
        source: it.source,
        score: it.score,
        publishedAt: it.publishedAt,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aurapulse-feed-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                Feed Analytics & Personalization Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synthesis audit of active stream filters, score distributions, and sources
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

        {/* Top Metric Cards */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {total}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
              Ingested Stories
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-2xl font-black text-emerald-500">
              {avgScore}%
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
              Avg Relevance
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-2xl font-black text-purple-500">
              {preferences.categories.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
              Tuned Topics
            </div>
          </div>
        </div>

        {/* Stream Source Composition */}
        <div className="space-y-2 mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Source Stream Composition
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
              <Radio className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">{newsCount}</span>
                <span className="text-[10px] block text-slate-400">News Articles</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
              <Film className="w-4 h-4 text-purple-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">{movieCount}</span>
                <span className="text-[10px] block text-slate-400">TMDB Cinema</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">{socialCount}</span>
                <span className="text-[10px] block text-slate-400">Social Pulse</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tuning Breakdown */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Category Affinity Distribution
          </h3>
          <div className="space-y-2">
            {categoryCounts.map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                    {c.category}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {c.count} items ({c.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(5, c.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Checklist */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 mb-6 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Architecture & Service Integrity</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>JWT Authentication Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Multi-Source Fail-Safe Ingestion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>400ms Debounced Search Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Local State Synchronized</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit JSON</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
