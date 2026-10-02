import { Request, Response } from "express";
import { SocialService } from "../services/socialService";

const socialService = new SocialService();

export async function getSocial(req: Request, res: Response) {
  try {
    const hashtag = req.query.hashtag as string | undefined;
    const q = req.query.q as string | undefined;

    const result = await socialService.getPosts(hashtag, q);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve social streams" });
  }
}
