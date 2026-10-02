import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import feedRoutes from "./routes/feedRoutes";
import newsRoutes from "./routes/newsRoutes";
import moviesRoutes from "./routes/moviesRoutes";
import socialRoutes from "./routes/socialRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AuraPulse Content Engine Backend",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/feed", feedRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/social", socialRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`⚡ AuraPulse Backend Server running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});

export default app;
