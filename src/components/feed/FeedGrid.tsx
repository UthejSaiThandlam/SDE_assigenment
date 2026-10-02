"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ContentItem, ViewMode } from "@/types/content";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCustomCardOrder } from "@/store/preferencesSlice";
import { SortableCard } from "./SortableCard";
import { ExplainabilityModal } from "@/components/modals/ExplainabilityModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Sparkles, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface FeedGridProps {
  items: ContentItem[];
  isLoading?: boolean;
  viewMode?: ViewMode;
  onResetFilters?: () => void;
  title?: string;
  subtitle?: string;
}

export function FeedGrid({
  items,
  isLoading,
  viewMode = "comfortable",
  onResetFilters,
  title,
  subtitle,
}: FeedGridProps) {
  const dispatch = useAppDispatch();
  const [selectedExplainItem, setSelectedExplainItem] = useState<ContentItem | null>(null);

  // DnD Sensors: 5px movement required so button clicks work without triggering drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(items, oldIndex, newIndex);
        const newOrderIds = reordered.map((item) => item.id);
        dispatch(setCustomCardOrder(newOrderIds));
      }
    }
  };

  const itemIds = items.map((item) => item.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} viewMode={viewMode} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        type="feed"
        onAction={onResetFilters}
        actionText="Clear Search & Reset Filters"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Subheader info bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Showing {items.length} personalized stories
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> AI Ranked
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Drag handle to reorder</span>
          </div>
        </div>
      </div>

      {/* Dnd Sortable Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itemIds}
          strategy={viewMode === "compact" ? verticalListSortingStrategy : rectSortingStrategy}
        >
          <div
            className={
              viewMode === "compact"
                ? "flex flex-col space-y-3"
                : viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          >
            {items.map((item) => (
              <SortableCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                onExplain={(it) => setSelectedExplainItem(it)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Explainability Modal */}
      <ExplainabilityModal
        item={selectedExplainItem}
        onClose={() => setSelectedExplainItem(null)}
      />
    </div>
  );
}
