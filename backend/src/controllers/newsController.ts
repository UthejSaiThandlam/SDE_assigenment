import { Request, Response } from "express";
import { NewsService } from "../services/newsService";

const newsService = new NewsService();

export async function getNews(req: Request, res: Response) {
  try {
    const category = req.query.category as string | undefined;
    const q = req.query.q as string | undefined;

    const result = await newsService.getNews(category, q);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve news stream" });
  }
}
