"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetFeedQuery } from "@/store/contentApi";
import { rankContentItems } from "@/lib/personalization";
import { useDebounce } from "@/hooks/useDebounce";
import {
  toggleCategory,
  toggleContentType,
  resetPreferences,
} from "@/store/preferencesSlice";
import { ContentCategory, ContentType } from "@/types/content";
import { FeedReportModal } from "@/components/modals/FeedReportModal";
import {
  Sparkles,
  SlidersHorizontal,
  Flame,
  Radio,
  Film,
  MessageSquare,
  RefreshCw,
  BellRing,
  BarChart3,
} from "lucide-react";

const ALL_CATEGORIES: { id: ContentCategory; label: string }[] = [
  { id: "technology", label: "Technology" },
  { id: "ai", label: "AI & Agents" },
  { id: "finance", label: "Finance & Crypto" },
  { id: "sports", label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [activeTypeTab, setActiveTypeTab] = useState<string>("all");
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const [isFeedReportOpen, setIsFeedReportOpen] = useState(false);

  // RTK Query unified feed
  const { data: rawFeed, isLoading, isError, refetch } = useGetFeedQuery({
    query: debouncedSearch,
  });

  // Simulated live event stream: if enabled, periodically show dynamic live toast
  useEffect(() => {
    if (!preferences.liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      const updates = [
        "Live Update: Breaking tech report from TechCrunch ingested.",
        "TMDB: New trending sci-fi cinema ratings synchronized.",
        "Social Stream: High velocity discussion detected on #AI.",
      ];
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      setLiveToast(randomUpdate);

      const timer = setTimeout(() => setLiveToast(null), 5000);
      return () => clearTimeout(timer);
    }, 28000);

    return () => clearInterval(interval);
  }, [preferences.liveUpdatesEnabled]);

  // Filter raw items by user selected categories and active type tab
  const filteredAndRanked = useMemo(() => {
    if (!rawFeed) return [];

    let items = rawFeed.filter((item) => {
      // Category filtering: item category must match user preferences
      const categoryMatch = preferences.categories.includes(item.category);

      // Type filtering
      const typeAllowedByUser = preferences.contentTypes.includes(item.type);
      const tabMatch = activeTypeTab === "all" || item.type === activeTypeTab;

      return categoryMatch && typeAllowedByUser && tabMatch;
    });

    // Score and rank based on algorithm
    return rankContentItems(items, preferences);
  }, [rawFeed, preferences, activeTypeTab]);

  const handleResetFilters = () => {
    setSearchInput("");
    setActiveTypeTab("all");
    dispatch(resetPreferences());
  };

  return (
    <DashboardShell
      searchQuery={searchInput}
      onSearchChange={(q) => setSearchInput(q)}
    >
      <div className="space-y-6">
        {/* Live Toast Banner */}
        {liveToast && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs animate-in slide-in-from-top-2 duration-300 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-live-pulse" />
              <span className="font-semibold">Live Feed:</span>
              <span>{liveToast}</span>
            </div>
            <button
              onClick={() => setLiveToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hero Personalized Welcome */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-6 -mr-6 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Personalized Intelligence Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Good evening, {preferences.userName} 👋
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Your customized multi-source stream synthesized across News, TMDB
              recommendations, and community pulse. Ranked transparently to your
              active interests.
            </p>
          </div>
        </div>

        {/* Stream Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          {/* Content Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTypeTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTypeTab === "all"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              All Streams
            </button>
            <button
              onClick={() => setActiveTypeTab("news")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTypeTab === "news"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> News
            </button>
            <button
              onClick={() => setActiveTypeTab("movie")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTypeTab === "movie"
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Movies
            </button>
            <button
              onClick={() => setActiveTypeTab("social")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTypeTab === "social"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Social
            </button>
          </div>

          {/* Category Chips Switcher & Feed Report Button */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = preferences.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => dispatch(toggleCategory(cat.id))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs shadow-blue-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            <button
              onClick={() => setIsFeedReportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Feed Report</span>
            </button>
          </div>
        </div>

        {/* Search Feedback Info */}
        {debouncedSearch && (
          <div className="flex items-center justify-between text-xs px-2 text-slate-500 dark:text-slate-400">
            <span>
              Searching for: <strong className="text-blue-500">"{debouncedSearch}"</strong>
            </span>
            <button
              onClick={() => setSearchInput("")}
              className="text-blue-500 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Dynamic Feed Grid with Drag & Drop */}
        <FeedGrid
          items={filteredAndRanked}
          isLoading={isLoading}
          viewMode={preferences.viewMode}
          onResetFilters={handleResetFilters}
        />

        {/* Feed Report Modal */}
        <FeedReportModal
          isOpen={isFeedReportOpen}
          onClose={() => setIsFeedReportOpen(false)}
          items={filteredAndRanked}
          preferences={preferences}
        />
      </div>
    </DashboardShell>
  );
}
