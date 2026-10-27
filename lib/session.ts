import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { io } from "next/cache";
import { cookies } from "next/headers";

/**
 * Backbone's /auth/login only verifies credentials; it issues no session
 * (docs/backend-arch-docs/sop-user-auth.md). So this app keeps its own: an
 * HMAC-signed cookie holding the Backbone `user_id` and `username`.
 */
const COOKIE = "admin_session";
const MAX_AGE_S = 60 * 60 * 8;

/** The only account allowed into /admin. Compared against the username Backbone returns. */
export const ADMIN_USERNAME = "swatkat";

interface Session {
  uid: string;
  username: string;
  exp: number;
}

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set to at least 32 characters");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export async function createSession(user: { user_id: string; username: string }) {
  const session: Session = { uid: user.user_id, username: user.username, exp: Date.now() + MAX_AGE_S * 1000 };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in admin, or null. Re-checks the allowed username on every read, not just at login. */
export async function getAdmin(): Promise<{ username: string } | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, mac] = raw.split(".");
  if (!payload || !mac) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    await io(); // the expiry check reads the clock, which must not be frozen into a prerender
    if (typeof s.exp !== "number" || s.exp < Date.now()) return null;
    if (s.username !== ADMIN_USERNAME) return null;
    return { username: s.username };
  } catch {
    return null;
  }
}
