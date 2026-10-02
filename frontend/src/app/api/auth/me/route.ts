import { NextResponse } from "next/server";
import { AuthUtil } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or malformed Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    // Attempt backend verification first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${backendUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      // Backend not running/unreachable, verify locally
    }

    try {
      const user = AuthUtil.verifyToken(token);
      return NextResponse.json({ user });
    } catch (err: any) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
