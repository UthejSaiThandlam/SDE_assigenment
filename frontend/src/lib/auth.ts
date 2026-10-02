import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface StoredUser extends UserPayload {
  passwordHash: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "aurapulse-jwt-secret-key-2026-production";
const JWT_EXPIRES_IN = "7d";

// Global cache to maintain registered users in serverless/Next.js memory
const globalUsers = global as unknown as { __AURAPULSE_USERS_DB__?: StoredUser[] };

if (!globalUsers.__AURAPULSE_USERS_DB__) {
  globalUsers.__AURAPULSE_USERS_DB__ = [
    {
      id: "user-1",
      name: "Uthej",
      email: "uthej@aurapulse.io",
      role: "Senior SDE Evaluator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      passwordHash: bcrypt.hashSync("password123", 10),
    },
    {
      id: "user-demo",
      name: "Demo Candidate",
      email: "demo@aurapulse.io",
      role: "Frontend Engineer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      passwordHash: bcrypt.hashSync("password123", 10),
    },
  ];
}

const USERS_DB = globalUsers.__AURAPULSE_USERS_DB__;

export class AuthUtil {
  static async login(email: string, password: string): Promise<{ token: string; user: UserPayload }> {
    const user = USERS_DB.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const payload: UserPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token, user: payload };
  }

  static async register(name: string, email: string, password: string): Promise<{ token: string; user: UserPayload }> {
    const existing = USERS_DB.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "Standard Member",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      passwordHash,
    };

    USERS_DB.push(newUser);

    const payload: UserPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token, user: payload };
  }

  static verifyToken(token: string): UserPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      return decoded;
    } catch {
      throw new Error("Invalid or expired session token");
    }
  }
}
