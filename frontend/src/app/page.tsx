"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetFeedQuery } from "@/store/contentApi";
import {
  rankContentItems,
  calculateFeedDiversity,
  calculateTotalReadingTime,
} from "@/lib/personalization";
import { useDebounce } from "@/hooks/useDebounce";
import {
  toggleCategory,
  toggleContentType,
  resetPreferences,
} from "@/store/preferencesSlice";
import { togglePerspectiveMode } from "@/store/adaptiveSlice";
import { addNotification } from "@/store/notificationSlice";
import { ContentCategory, ContentType } from "@/types/content";
import { FeedReportModal } from "@/components/modals/FeedReportModal";
import { AdaptiveInsightsModal } from "@/components/modals/AdaptiveInsightsModal";
import {
  Sparkles,
  SlidersHorizontal,
  Flame,
  Radio,
  Film,
  MessageSquare,
  RefreshCw,
  BarChart3,
  Compass,
  Target,
  Clock,
  PieChart,
  Eye,
  CheckCircle2,
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
  const { categoryWeights, perspectiveMode, hiddenIds, totalReadingMinutes } =
    useAppSelector((state) => state.adaptive);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [activeTypeTab, setActiveTypeTab] = useState<string>("all");
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const [isFeedReportOpen, setIsFeedReportOpen] = useState(false);
  const [isAdaptiveModalOpen, setIsAdaptiveModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // RTK Query unified feed
  const { data: rawFeed, isLoading, isError, refetch } = useGetFeedQuery({
    query: debouncedSearch,
  });

  // Simulated live event stream: if enabled, periodically show dynamic live toast
  useEffect(() => {
    if (!preferences.liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      const updates = [
        "Live Update: Breaking tech coverage synchronized from NewsAPI.",
        "Watchmode: Fresh cinema releases and streaming availability updated.",
        "Social Pulse: High engagement discussion on #AI models.",
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
      // Exclude items marked "Not Interested"
      if (hiddenIds.includes(item.id)) return false;

      // In perspective mode, surface cross-category discoveries; otherwise filter by active categories
      const categoryMatch =
        perspectiveMode || preferences.categories.includes(item.category);

      // Type filtering
      const typeAllowedByUser = preferences.contentTypes.includes(item.type);
      const tabMatch = activeTypeTab === "all" || item.type === activeTypeTab;

      return categoryMatch && typeAllowedByUser && tabMatch;
    });

    // Score and rank using adaptive interaction weights and perspective mode
    return rankContentItems(
      items,
      preferences,
      categoryWeights,
      perspectiveMode
    );
  }, [
    rawFeed,
    preferences,
    activeTypeTab,
    hiddenIds,
    categoryWeights,
    perspectiveMode,
  ]);

  // Calculate Feed Diversity and Total Reading Time
  const feedDiversity = useMemo(
    () => calculateFeedDiversity(filteredAndRanked),
    [filteredAndRanked]
  );
  const totalFeedMinutes = useMemo(
    () => calculateTotalReadingTime(filteredAndRanked),
    [filteredAndRanked]
  );

  const handleResetFilters = () => {
    setSearchInput("");
    setActiveTypeTab("all");
    dispatch(resetPreferences());
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    dispatch(
      addNotification({
        title: "Feed Synchronized",
        description: `Refreshed multi-source streams. Feed diversity is ${feedDiversity}/100.`,
        type: "sync",
      })
    );
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleTogglePerspective = () => {
    const nextMode = !perspectiveMode;
    dispatch(togglePerspectiveMode());
    dispatch(
      addNotification({
        title: nextMode ? "Perspective Shift Active" : "Standard Feed Restored",
        description: nextMode
          ? "Surfacing 40% outside your primary topics to broaden your discovery horizon."
          : "Returned to standard preference rankings.",
        type: "perspective",
      })
    );
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
              <span className="font-semibold">Live Stream:</span>
              <span>{liveToast}</span>
            </div>
            <button
              onClick={() => setLiveToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
              Your customized multi-source stream synthesized across NewsAPI,
              Watchmode Cinema releases, and community social trends. Ranked
              transparently to your active interests.
            </p>
          </div>
        </div>

        {/* Perspective Shift Mode Active Banner */}
        {perspectiveMode && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Compass className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <strong className="font-bold text-sm block sm:inline">
                  Perspective Shift Mode Active:
                </strong>{" "}
                Surfacing 40% outside your core preferences, 30% trending, and 30%
                tailored content to prevent filter bubbles.
              </div>
            </div>
            <button
              onClick={handleTogglePerspective}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Restore Core Feed
            </button>
          </div>
        )}

        {/* Stream Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          {/* Content Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTypeTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTypeTab === "all"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              All Streams
            </button>
            <button
              onClick={() => setActiveTypeTab("news")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTypeTab === "news"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> News
            </button>
            <button
              onClick={() => setActiveTypeTab("movie")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTypeTab === "movie"
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Movies
            </button>
            <button
              onClick={() => setActiveTypeTab("social")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTypeTab === "social"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Social
            </button>
          </div>

          {/* Category Chips Switcher */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = preferences.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => dispatch(toggleCategory(cat.id))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs shadow-blue-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Intelligence Differentiator Bar: Diversity Score, Reading Time, Perspective Shift, Adaptive Insights */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Feed Diversity Score */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Feed Diversity:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {feedDiversity}/100
                </span>
                <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${feedDiversity}%` }}
                  />
                </div>
              </div>
            </div>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

            {/* Reading Time */}
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Est. Reading: ~{totalFeedMinutes} min</span>
            </div>
          </div>

          {/* Action Toolbar: Perspective Shift, Adaptive Insights, Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTogglePerspective}
              title="Surfaces 40% outside your preferences to discover diverse topics"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                perspectiveMode
                  ? "bg-amber-500 text-white shadow-xs shadow-amber-500/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Refresh Perspective</span>
            </button>

            <button
              onClick={() => setIsAdaptiveModalOpen(true)}
              title="View evolved user affinity weights"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 font-semibold transition-all cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Adaptive Scoring</span>
            </button>

            <button
              onClick={() => setIsFeedReportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-semibold transition-all cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Feed Report</span>
            </button>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Synchronize live feed from NewsAPI & Watchmode"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`}
              />
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
              className="text-blue-500 hover:underline cursor-pointer"
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

        {/* Adaptive Preference Telemetry Modal */}
        <AdaptiveInsightsModal
          isOpen={isAdaptiveModalOpen}
          onClose={() => setIsAdaptiveModalOpen(false)}
        />
      </div>
    </DashboardShell>
  );
}
