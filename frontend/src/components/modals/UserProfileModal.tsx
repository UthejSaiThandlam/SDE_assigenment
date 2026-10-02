"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import {
  X,
  User,
  ShieldCheck,
  Key,
  Sliders,
  Bookmark,
  Radio,
  LogOut,
  ExternalLink,
  Download,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  const preferences = useAppSelector((state) => state.preferences);
  const favorites = useAppSelector((state) => state.favorites.items);

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

  const displayName = user?.name || preferences.userName || "Uthej";
  const displayEmail = user?.email || "uthej@aurapulse.io";

  const handleSignOut = () => {
    dispatch(logout());
    onClose();
    router.push("/login");
  };

  const handleExportProfile = () => {
    const profileData = {
      user: {
        name: displayName,
        email: displayEmail,
        role: "Lead SDE Evaluator",
        authenticated: isAuthenticated,
        tokenType: "Bearer JWT",
        tokenSnippet: token ? `${token.substring(0, 16)}...` : "Demo Token",
      },
      preferences: {
        activeCategories: preferences.categories,
        viewMode: preferences.viewMode,
        liveUpdatesEnabled: preferences.liveUpdatesEnabled,
      },
      savedBookmarksCount: favorites.length,
      savedBookmarks: favorites.map((f) => ({
        id: f.id,
        title: f.title,
        category: f.category,
        source: f.source,
      })),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(profileData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aurapulse-profile-${displayName.toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[92vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-y-auto relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-[10px] text-white"
              title="Online & Verified"
            >
              ✓
            </span>
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Sparkles className="w-3 h-3 text-blue-500" />
                SDE Evaluator
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {displayEmail}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>JWT Authenticated</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>Real-Time Stream Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Intelligence Telemetry Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {preferences.categories.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Tuned Topics
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {favorites.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Saved Reads
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-2xl font-black text-emerald-500">
              {preferences.viewMode.toUpperCase()}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              View Layout
            </div>
          </div>
        </div>

        {/* Active Topics & Interest Matrix */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Active Category Interests</span>
              <span className="text-slate-400 text-[10px] lowercase">
                influencing algorithmic feed
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {preferences.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs capitalize"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Multi-Source API Stream Gateway Card */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                Connected Stream Gateways
              </span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>NewsAPI & Movie Feeds:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live & Authenticated
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Credential Source:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  Environment (.env / secure)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Security Protocol:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  HS256 Signed JWT Bearer
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              router.push("/settings");
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Tune Preferences</span>
          </button>

          <button
            onClick={() => {
              onClose();
              router.push("/favorites");
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Bookmarks ({favorites.length})</span>
          </button>

          <button
            onClick={handleExportProfile}
            title="Export Profile & Activity Telemetry JSON"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          {isAuthenticated && (
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
