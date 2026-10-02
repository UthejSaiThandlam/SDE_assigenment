"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleDarkMode,
  setViewMode,
  setLiveUpdatesEnabled,
} from "@/store/preferencesSlice";
import { ViewMode } from "@/types/content";
import {
  Search,
  X,
  Sun,
  Moon,
  LayoutGrid,
  List,
  Columns3,
  Menu,
  LogIn,
  User as UserIcon,
} from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onOpenMobileMenu?: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const { darkMode, viewMode, liveUpdatesEnabled, userName } = useAppSelector(
    (state) => state.preferences
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [inputVal, setInputVal] = useState(searchQuery);

  useEffect(() => {
    setInputVal(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    onSearchChange(val);
  };

  const handleClear = () => {
    setInputVal("");
    onSearchChange("");
  };

  const handleThemeToggle = () => {
    const nextMode = !darkMode;
    dispatch(toggleDarkMode());
    if (nextMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              placeholder="Search news, movies, tweets, hashtags..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden transition-all shadow-inner"
            />
            {inputVal && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Live Simulator Ticker Indicator */}
          <button
            onClick={() => dispatch(setLiveUpdatesEnabled(!liveUpdatesEnabled))}
            title={liveUpdatesEnabled ? "Live sync active" : "Live sync paused"}
            className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              liveUpdatesEnabled
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                liveUpdatesEnabled ? "bg-emerald-500 animate-live-pulse" : "bg-slate-400"
              }`}
            />
            <span>{liveUpdatesEnabled ? "Live Feed" : "Paused"}</span>
          </button>

          {/* View Mode Density Toggle */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
            <button
              onClick={() => dispatch(setViewMode("comfortable"))}
              title="Comfortable View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "comfortable"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setViewMode("compact"))}
              title="Compact View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "compact"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setViewMode("grid"))}
              title="Compact Grid"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Columns3 className="w-4 h-4" />
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={handleThemeToggle}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Profile Avatar / Sign In Link */}
          {isAuthenticated && user ? (
            <Link
              href="/settings"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 group"
              title="Account Settings"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {user.name}
                </div>
                <div className="text-[10px] text-emerald-500 font-medium leading-none">
                  JWT Verified
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
