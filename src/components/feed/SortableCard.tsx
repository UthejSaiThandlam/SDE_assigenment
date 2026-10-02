"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContentItem, ViewMode } from "@/types/content";
import { ContentCard } from "@/components/cards/ContentCard";

interface SortableCardProps {
  item: ContentItem;
  viewMode?: ViewMode;
  onExplain?: (item: ContentItem) => void;
}

export function SortableCard({ item, viewMode, onExplain }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ContentCard
        item={item}
        viewMode={viewMode}
        onExplain={onExplain}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}
