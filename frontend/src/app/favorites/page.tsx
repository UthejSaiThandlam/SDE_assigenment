"use client";

import React, { useState, useMemo } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearFavorites } from "@/store/favoritesSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { Bookmark, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const filteredFavorites = useMemo(() => {
    if (!debouncedSearch) return favorites;
    const q = debouncedSearch.toLowerCase();
    return favorites.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
    );
  }, [favorites, debouncedSearch]);

  return (
    <DashboardShell
      searchQuery={searchInput}
      onSearchChange={(q) => setSearchInput(q)}
    >
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 text-white shadow-xl shadow-amber-500/15 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
                <Bookmark className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Personal Library</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Saved Favorites ({favorites.length})
              </h1>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                Articles, movies, and social posts you have bookmarked for later reading and reference. Persisted safely to your local session.
              </p>
            </div>

            {favorites.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear all bookmarked items?")) {
                    dispatch(clearFavorites());
                  }
                }}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Content list */}
        {favorites.length === 0 ? (
          <EmptyState
            type="favorites"
            title="Your favorites collection is empty"
            description="Explore the personalized feed or trending stream and click the bookmark icon on any card to save it here."
            actionText="Browse Personalized Feed"
            onAction={() => (window.location.href = "/")}
          />
        ) : (
          <FeedGrid
            items={filteredFavorites}
            viewMode={viewMode}
            onResetFilters={() => setSearchInput("")}
          />
        )}
      </div>
    </DashboardShell>
  );
}
