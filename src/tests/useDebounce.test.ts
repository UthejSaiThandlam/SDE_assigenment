import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 400));
    expect(result.current).toBe("initial");
  });

  it("does not update value before delay expires", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: "first" } }
    );

    rerender({ value: "second" });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("first");
  });

  it("updates value after specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: "first" } }
    );

    rerender({ value: "second" });
    act(() => {
      vi.advanceTimersByTime(450);
    });

    expect(result.current).toBe("second");
  });
});
