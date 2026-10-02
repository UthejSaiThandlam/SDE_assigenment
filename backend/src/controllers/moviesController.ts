import { Request, Response } from "express";
import { MoviesService } from "../services/moviesService";

const moviesService = new MoviesService();

export async function getMovies(req: Request, res: Response) {
  try {
    const q = req.query.q as string | undefined;

    const result = await moviesService.getMovies(q);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cinema recommendations" });
  }
}
