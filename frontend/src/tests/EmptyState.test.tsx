import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { EmptyState } from "@/components/ui/EmptyState";

describe("EmptyState Component", () => {
  it("renders custom title and description properly", () => {
    render(
      <EmptyState
        title="Custom No Results"
        description="Nothing here today"
      />
    );

    expect(screen.getByText("Custom No Results")).toBeInTheDocument();
    expect(screen.getByText("Nothing here today")).toBeInTheDocument();
  });

  it("triggers action callback when CTA button is clicked", () => {
    const handleAction = vi.fn();

    render(
      <EmptyState
        title="Empty Feed"
        onAction={handleAction}
        actionText="Try Again"
      />
    );

    const button = screen.getByRole("button", { name: /try again/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
