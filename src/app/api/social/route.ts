import { NextResponse } from "next/server";
import { MOCK_SOCIAL_POSTS } from "@/data/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hashtag = searchParams.get("hashtag") || "";
  const query = searchParams.get("q") || "";

  let filtered = [...MOCK_SOCIAL_POSTS];

  if (hashtag) {
    const tag = hashtag.startsWith("#") ? hashtag.toLowerCase() : `#${hashtag.toLowerCase()}`;
    filtered = filtered.filter(
      (p) => p.metadata?.hashtag?.toLowerCase() === tag
    );
  }

  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(qLower) ||
        p.description.toLowerCase().includes(qLower) ||
        (p.metadata?.hashtag && p.metadata.hashtag.toLowerCase().includes(qLower)) ||
        (p.metadata?.author && p.metadata.author.toLowerCase().includes(qLower))
    );
  }

  return NextResponse.json({
    source: "curated_mock_social",
    items: filtered,
    note: "Public social media platforms require OAuth 2.0 user credentials; serving high-fidelity structured social posts.",
  });
}
