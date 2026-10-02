import { Request, Response } from "express";
import { FeedService } from "../services/feedService";

const feedService = new FeedService();

export async function getFeed(req: Request, res: Response) {
  try {
    const query = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const type = req.query.type as string | undefined;

    const result = await feedService.getAggregatedFeed({ query, category, type });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve aggregated feed" });
  }
}
