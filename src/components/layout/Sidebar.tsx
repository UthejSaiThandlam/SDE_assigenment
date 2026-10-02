"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleCategory, toggleContentType } from "@/store/preferencesSlice";
import { ContentCategory, ContentType } from "@/types/content";
import {
  Compass,
  TrendingUp,
  Bookmark,
  Settings,
  Sparkles,
  Layers,
  Radio,
  Film,
  MessageSquare,
  Cpu,
  Brain,
  DollarSign,
  Trophy,
  Clapperboard,
  X,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const CATEGORIES: { id: ContentCategory; label: string; icon: React.ReactNode }[] = [
  { id: "technology", label: "Technology", icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: "ai", label: "AI & Agents", icon: <Brain className="w-3.5 h-3.5" /> },
  { id: "finance", label: "Finance & Crypto", icon: <DollarSign className="w-3.5 h-3.5" /> },
  { id: "sports", label: "Sports & F1", icon: <Trophy className="w-3.5 h-3.5" /> },
  { id: "entertainment", label: "Cinema & Arts", icon: <Clapperboard className="w-3.5 h-3.5" /> },
];

const CONTENT_TYPES: { id: ContentType; label: string; icon: React.ReactNode }[] = [
  { id: "news", label: "News Articles", icon: <Radio className="w-3.5 h-3.5" /> },
  { id: "movie", label: "Movie Picks", icon: <Film className="w-3.5 h-3.5" /> },
  { id: "social", label: "Social Feeds", icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { categories, contentTypes } = useAppSelector((state) => state.preferences);
  const favorites = useAppSelector((state) => state.favorites.items);

  const navLinks = [
    { href: "/", label: "Personalized Feed", icon: <Compass className="w-4 h-4" /> },
    { href: "/trending", label: "Trending Stream", icon: <TrendingUp className="w-4 h-4" /> },
    {
      href: "/favorites",
      label: "Saved Favorites",
      icon: <Bookmark className="w-4 h-4" />,
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
    { href: "/settings", label: "Preferences & State", icon: <Settings className="w-4 h-4" /> },
  ];

  const content = (
    <aside className="w-64 h-full flex flex-col justify-between py-6 px-4 bg-white/90 dark:bg-slate-900/90 border-r border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1">
                Aura<span className="text-blue-600 dark:text-blue-400">Pulse</span>
              </span>
              <span className="text-[10px] block font-medium text-slate-400 -mt-1 tracking-wider uppercase">
                Content Engine
              </span>
            </div>
          </Link>

          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
            Navigation
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Priority Topics Filter */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Topics
            </span>
            <span className="text-[10px] text-blue-500 font-medium">
              {categories.length} selected
            </span>
          </div>

          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const isSelected = categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => dispatch(toggleCategory(cat.id))}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/40"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}>
                      {cat.icon}
                    </span>
                    <span>{cat.label}</span>
                  </div>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-blue-600 dark:bg-blue-400" : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Streams Filter */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
            Sources
          </div>
          <div className="space-y-1">
            {CONTENT_TYPES.map((type) => {
              const isEnabled = contentTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => dispatch(toggleContentType(type.id))}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isEnabled
                      ? "text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/70"
                      : "text-slate-400 line-through opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span>{type.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1 rounded ${
                      isEnabled
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    {isEnabled ? "ON" : "OFF"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info Badge */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 px-2">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Architecture Shield</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            Multi-source fail-safe engine with live RTK Query caching & local state sync.
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64">
        {content}
      </div>

      {/* Mobile Backdrop & Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 w-72 max-w-xs h-full animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
