"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AmbientBackground } from "./AmbientBackground";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
