import { NextResponse } from "next/server";
import { AuthUtil } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    // Attempt forwarding to Express backend first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      // Backend not running/unreachable, verify strictly with local AuthUtil
    }

    try {
      const result = await AuthUtil.login(email, password);
      return NextResponse.json({
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
    } catch (authErr: any) {
      return NextResponse.json(
        { error: authErr.message || "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
