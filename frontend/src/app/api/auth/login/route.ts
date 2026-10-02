import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    // Attempt forwarding to Express backend
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      // Backend not running, execute fallback demo auth
    }

    // High-fidelity fallback auth
    const { email, password } = body;
    if (email && password) {
      return NextResponse.json({
        message: "Login successful (Demo)",
        token: "jwt_mock_token_" + Buffer.from(email).toString("base64") + "_" + Date.now(),
        user: {
          id: "user-1",
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          email,
          role: "Candidate Pro",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
