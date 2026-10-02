"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleCategory,
  toggleContentType,
  setDarkMode,
  setViewMode,
  setLiveUpdatesEnabled,
  setUserName,
  resetPreferences,
} from "@/store/preferencesSlice";
import { ContentCategory, ContentType, ViewMode } from "@/types/content";
import {
  Settings,
  Cpu,
  Brain,
  DollarSign,
  Trophy,
  Clapperboard,
  Sun,
  Moon,
  Radio,
  Film,
  MessageSquare,
  RotateCcw,
  Check,
  User,
  Sliders,
  Code2,
  Sparkles,
} from "lucide-react";

const AVAILABLE_CATEGORIES: { id: ContentCategory; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "technology", label: "Technology", desc: "Software, developer tooling, web architecture & hardware", icon: <Cpu className="w-4 h-4" /> },
  { id: "ai", label: "AI & Autonomous Agents", desc: "Large language models, reinforcement learning & agentic loops", icon: <Brain className="w-4 h-4" /> },
  { id: "finance", label: "Finance & Fintech", desc: "Markets, interest rates, capital flows & cryptography", icon: <DollarSign className="w-4 h-4" /> },
  { id: "sports", label: "Sports & Racing", desc: "Motorsport, Premier League biometrics & athletics", icon: <Trophy className="w-4 h-4" /> },
  { id: "entertainment", label: "Cinema & Arts", desc: "TMDB trending blockbusters, visionary directors & cinema", icon: <Clapperboard className="w-4 h-4" /> },
];

const AVAILABLE_TYPES: { id: ContentType; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "news", label: "News Articles", desc: "Live headlines from verified publications", icon: <Radio className="w-4 h-4" /> },
  { id: "movie", label: "TMDB Movies", desc: "Cinema ratings, posters and release overviews", icon: <Film className="w-4 h-4" /> },
  { id: "social", label: "Social Feeds", desc: "Curated engineering & tech influencer discourse", icon: <MessageSquare className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const [nameInput, setNameInput] = useState(preferences.userName);
  const [savedNameNotice, setSavedNameNotice] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      dispatch(setUserName(nameInput.trim()));
      setSavedNameNotice(true);
      setTimeout(() => setSavedNameNotice(false), 2500);
    }
  };

  const handleToggleTheme = (isDark: boolean) => {
    dispatch(setDarkMode(isDark));
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <DashboardShell searchQuery="" onSearchChange={() => {}}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Preferences & Personalization
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tune the algorithms driving your feed, control stream sources, and customize your theme.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm("Reset all settings to default values?")) {
                dispatch(resetPreferences());
                setNameInput("Uthej");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Section 1: User Profile */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              User Profile
            </h2>
          </div>

          <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Display Name (Appears in greetings & feeds)
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="sm:self-end px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              {savedNameNotice ? "Saved!" : "Update Name"}
            </button>
          </form>
        </div>

        {/* Section 2: Favorite Categories */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Priority Content Topics
              </h2>
            </div>
            <span className="text-xs text-blue-500 font-semibold">
              {preferences.categories.length} Active
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Selected categories are weighted with higher score multipliers in the deterministic ranking algorithm.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {AVAILABLE_CATEGORIES.map((cat) => {
              const isSelected = preferences.categories.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => dispatch(toggleCategory(cat.id))}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex items-start justify-between gap-3 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 dark:border-slate-700"}`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Content Stream Types */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Content Stream Sources
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AVAILABLE_TYPES.map((type) => {
              const isEnabled = preferences.contentTypes.includes(type.id);
              return (
                <div
                  key={type.id}
                  onClick={() => dispatch(toggleContentType(type.id))}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isEnabled
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : "border-slate-200 dark:border-slate-800 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {type.icon}
                      <span>{type.label}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isEnabled ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {isEnabled ? "ACTIVE" : "MUTED"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {type.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Visuals & Density */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Appearance & Layout Density
            </h2>
          </div>

          {/* Theme Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Interface Color Scheme
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select between modern high-contrast Dark Mode or crisp Light Mode
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => handleToggleTheme(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !preferences.darkMode
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
              </button>
              <button
                onClick={() => handleToggleTheme(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  preferences.darkMode
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-blue-400" /> Dark
              </button>
            </div>
          </div>

          {/* Density Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Feed Layout Density
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose how content cards are structured in your unified feed
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              {(["comfortable", "compact", "grid"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => dispatch(setViewMode(mode))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    preferences.viewMode === mode
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Live Updates Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Real-Time Stream Simulation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Periodically listen for breaking updates and pulse live indicators
              </p>
            </div>

            <button
              onClick={() => dispatch(setLiveUpdatesEnabled(!preferences.liveUpdatesEnabled))}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                preferences.liveUpdatesEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  preferences.liveUpdatesEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 5: State Inspector & Evaluation Aid */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Redux State & LocalStorage Inspector
              </h2>
            </div>
            <button
              onClick={() => setShowJsonInspector(!showJsonInspector)}
              className="text-xs text-blue-500 hover:underline font-semibold"
            >
              {showJsonInspector ? "Hide State" : "Inspect Raw State"}
            </button>
          </div>

          {showJsonInspector && (
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-800">
              {JSON.stringify(preferences, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
