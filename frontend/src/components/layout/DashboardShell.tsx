"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AmbientBackground } from "./AmbientBackground";
import { Sparkles } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function DashboardShell({
  children,
  searchQuery,
  onSearchChange,
}: DashboardShellProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  // While checking hydration, show a sleek loading state to prevent flash
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Securing Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-500/20">
      {/* Ambient Flowing Glowing Background Graphics */}
      <AmbientBackground />

      {/* Sidebar */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Area */}
      <div className="relative z-10 flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
