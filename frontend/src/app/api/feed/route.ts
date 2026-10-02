import { NextResponse } from "next/server";
import { ALL_INITIAL_CONTENT } from "@/data/mockData";
import { ContentItem } from "@/types/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category")?.toLowerCase() || "";
  const type = searchParams.get("type")?.toLowerCase() || "";

  let items: ContentItem[] = [...ALL_INITIAL_CONTENT];

  if (type) {
    items = items.filter((item) => item.type === type);
  }

  if (category && category !== "all") {
    items = items.filter((item) => item.category.toLowerCase() === category);
  }

  if (query) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        (item.metadata?.author && item.metadata.author.toLowerCase().includes(query)) ||
        (item.metadata?.hashtag && item.metadata.hashtag.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    items,
    total: items.length,
    timestamp: new Date().toISOString(),
  });
}
