"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleCategory } from "@/store/preferencesSlice";
import { logout } from "@/store/authSlice";
import { ContentCategory } from "@/types/content";
import { FeedReportModal } from "@/components/modals/FeedReportModal";
import { UserProfileModal } from "@/components/modals/UserProfileModal";
import { useGetFeedQuery } from "@/store/contentApi";
import {
  Compass,
  TrendingUp,
  Bookmark,
  Settings,
  Sparkles,
  BarChart3,
  Cpu,
  Brain,
  DollarSign,
  Trophy,
  Clapperboard,
  X,
  LogOut,
  LogIn,
  User as UserIcon,
} from "lucide-react";

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const CATEGORIES: { id: ContentCategory; label: string; icon: React.ReactNode }[] = [
  { id: "technology", label: "Tech", icon: <Cpu className="w-3 h-3" /> },
  { id: "ai", label: "AI", icon: <Brain className="w-3 h-3" /> },
  { id: "finance", label: "Finance", icon: <DollarSign className="w-3 h-3" /> },
  { id: "sports", label: "Sports", icon: <Trophy className="w-3 h-3" /> },
  { id: "entertainment", label: "Cinema", icon: <Clapperboard className="w-3 h-3" /> },
];

export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const favorites = useAppSelector((state) => state.favorites.items);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load feed items for report
  const { data: rawFeed } = useGetFeedQuery();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Personalized Feed", icon: <Compass className="w-4 h-4" /> },
    { href: "/trending", label: "Trending Stream", icon: <TrendingUp className="w-4 h-4" /> },
    {
      href: "/favorites",
      label: "Saved Favorites",
      icon: <Bookmark className="w-4 h-4" />,
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
    { href: "/settings", label: "Preferences", icon: <Settings className="w-4 h-4" /> },
  ];

  const content = (
    <aside className="w-64 h-screen max-h-screen overflow-hidden flex flex-col justify-between py-4 px-3.5 bg-white/95 dark:bg-slate-900/95 border-r border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl transition-colors">
      <div className="space-y-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1">
                Aura<span className="text-blue-600 dark:text-blue-400">Pulse</span>
              </span>
            </div>
          </Link>

          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5">
            Navigation
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100"
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

          {/* Feed Report Button */}
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100 transition-all text-left"
          >
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span>Feed Report</span>
          </button>
        </div>

        {/* Priority Topics (Compact 2-column Grid) */}
        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Topics
            </span>
            <span className="text-[10px] text-blue-500 font-semibold">
              {preferences.categories.length} on
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = preferences.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => dispatch(toggleCategory(cat.id))}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}>
                      {cat.icon}
                    </span>
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ml-1 ${
                      isSelected ? "bg-blue-600 dark:bg-blue-400" : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer User / Authentication Section */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 px-1">
        {isAuthenticated && user ? (
          <div
            onClick={() => setIsProfileOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 flex items-center justify-between cursor-pointer transition-all group"
            title="Click to view full user profile & session telemetry"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {user.name}
                </div>
                <div className="text-[10px] text-emerald-500 font-medium truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  JWT Verified
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Demo</span>
          </Link>
        )}
      </div>

      {/* Feed Report Modal */}
      <FeedReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        items={rawFeed || []}
        preferences={preferences}
      />

      {/* User Profile & Telemetry Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Zero Scroll, Strict h-screen) */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 h-screen max-h-screen overflow-hidden">
        {content}
      </div>

      {/* Mobile Drawer */}
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
