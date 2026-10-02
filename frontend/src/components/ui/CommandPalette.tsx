"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDarkMode, resetPreferences } from "@/store/preferencesSlice";
import { togglePerspectiveMode } from "@/store/adaptiveSlice";
import {
  Search,
  X,
  Compass,
  Bookmark,
  Sliders,
  Sun,
  Moon,
  BarChart3,
  Target,
  Zap,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFeedReport?: () => void;
  onOpenAdaptive?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenFeedReport,
  onOpenAdaptive,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.preferences);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const actions = [
    {
      id: "perspective",
      label: "↻ Refresh My Perspective (Diverse Discovery)",
      category: "Intelligence",
      icon: <Compass className="w-4 h-4 text-amber-500" />,
      run: () => {
        dispatch(togglePerspectiveMode());
        onClose();
      },
    },
    {
      id: "adaptive",
      label: "🎯 Adaptive Scoring Telemetry (Evolved Interests)",
      category: "Intelligence",
      icon: <Target className="w-4 h-4 text-purple-500" />,
      run: () => {
        onClose();
        if (onOpenAdaptive) onOpenAdaptive();
      },
    },
    {
      id: "report",
      label: "📊 View Feed Analytics & Audit Report",
      category: "Intelligence",
      icon: <BarChart3 className="w-4 h-4 text-blue-500" />,
      run: () => {
        onClose();
        if (onOpenFeedReport) onOpenFeedReport();
      },
    },
    {
      id: "favorites",
      label: "❤️ Open Saved Favorites",
      category: "Navigation",
      icon: <Bookmark className="w-4 h-4 text-rose-500" />,
      run: () => {
        onClose();
        router.push("/favorites");
      },
    },
    {
      id: "settings",
      label: "⚙️ Personalization Preferences",
      category: "Navigation",
      icon: <Sliders className="w-4 h-4 text-slate-500" />,
      run: () => {
        onClose();
        router.push("/settings");
      },
    },
    {
      id: "theme",
      label: darkMode ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode",
      category: "Display",
      icon: darkMode ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-500" />
      ),
      run: () => {
        dispatch(toggleDarkMode());
        onClose();
      },
    },
    {
      id: "reset",
      label: "🔄 Reset Category Filters & Stream Defaults",
      category: "Action",
      icon: <RotateCcw className="w-4 h-4 text-slate-400" />,
      run: () => {
        dispatch(resetPreferences());
        onClose();
      },
    },
  ];

  const filteredActions = query.trim()
    ? actions.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : actions;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search feature (e.g. perspective, dark, feed)..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
          />
          <kbd className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filteredActions.map((act) => (
              <button
                key={act.id}
                onClick={act.run}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    {act.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {act.label}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {act.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with arrows • Press Enter to select</span>
          <span>AuraPulse Command Hub</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
