"use client";

import React, { useState, useMemo } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { useGetFeedQuery } from "@/store/contentApi";
import { useAppSelector } from "@/store/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { Flame, TrendingUp, Star, Award, Zap } from "lucide-react";


export default function TrendingPage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: rawFeed, isLoading } = useGetFeedQuery({
    query: debouncedSearch,
  });

  // Calculate trending score based purely on engagement, ratings, or recency
  const trendingItems = useMemo(() => {
    if (!rawFeed) return [];

    let filtered = [...rawFeed];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort by engagement: rating or likes
    return filtered.sort((a, b) => {
      const getScore = (item: typeof a) => {
        if (item.type === "movie" && item.metadata?.rating) {
          return item.metadata.rating * 1000;
        }
        if (item.type === "social" && item.metadata?.likes) {
          return item.metadata.likes;
        }
        if (item.metadata?.isBreaking) {
          return 2500;
        }
        return (item.metadata?.likes || 400);
      };

      return getScore(b) - getScore(a);
    });
  }, [rawFeed, selectedCategory]);

  return (
    <DashboardShell
      searchQuery={searchInput}
      onSearchChange={(q) => setSearchInput(q)}
    >
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
              <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Trending Stream</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Global Velocity & Buzz
            </h1>
            <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed">
              Stories and media capturing maximum momentum across global feeds, high-engagement tech discussions, and highest-rated cinematic releases.
            </p>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {["all", "ai", "technology", "finance", "entertainment", "sports"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-orange-600 text-white shadow-xs shadow-orange-500/25"
                  : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat === "all" ? "All Trending" : cat}
            </button>
          ))}
        </div>

        {/* Feed Grid */}
        <FeedGrid
          items={trendingItems}
          isLoading={isLoading}
          viewMode={viewMode}
          onResetFilters={() => {
            setSelectedCategory("all");
            setSearchInput("");
          }}
        />
      </div>
    </DashboardShell>
  );
}
