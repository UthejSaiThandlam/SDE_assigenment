import { NextResponse } from "next/server";
import { AuthUtil } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      // Backend not running/unreachable, register locally
    }

    try {
      const result = await AuthUtil.register(name, email, password);
      return NextResponse.json(
        {
          message: "User registered successfully",
          token: result.token,
          user: result.user,
        },
        { status: 201 }
      );
    } catch (authErr: any) {
      return NextResponse.json(
        { error: authErr.message || "Registration failed" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
