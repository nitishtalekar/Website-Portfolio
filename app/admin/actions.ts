"use server";

import { revalidatePath, updateTag } from "next/cache";
import { RESUME_TAG, loginUser, saveResume } from "@/lib/backbone";
import { cleanResume } from "@/lib/resume-schema";
import { ADMIN_USERNAME, createSession, destroySession, getAdmin } from "@/lib/session";
import type { ResumeData } from "@/content/types";

export interface LoginState {
  error?: string;
}

export interface SaveState {
  ok: boolean;
  message: string;
}

// Backbone has no rate limiting (sop-user-auth.md), so throttle failed logins here.
// In-memory: per server instance, which is enough to blunt guessing on a personal site.
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; first: number }>();

function throttled(key: string) {
  const f = failures.get(key);
  if (!f) return false;
  if (Date.now() - f.first > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return f.count >= MAX_FAILURES;
}

function recordFailure(key: string) {
  const f = failures.get(key);
  if (!f || Date.now() - f.first > WINDOW_MS) failures.set(key, { count: 1, first: Date.now() });
  else f.count++;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Enter your username and password." };

  if (throttled(username)) return { error: "Too many attempts. Try again in 15 minutes." };

  const result = await loginUser(username, password);
  if (!result.ok) {
    if (result.reason === "unavailable") return { error: "Sign-in is unavailable right now." };
    recordFailure(username);
    return { error: "Invalid username or password." };
  }

  // Valid Backbone account, but only one is allowed in. Same message as a bad
  // password so the page doesn't reveal which accounts exist.
  if (result.user.username.toLowerCase() !== ADMIN_USERNAME) {
    recordFailure(username);
    return { error: "Invalid username or password." };
  }

  failures.delete(username);
  await createSession({ user_id: result.user.user_id, username: ADMIN_USERNAME });
  revalidatePath("/admin");
  return {};
}

export async function logout() {
  await destroySession();
  revalidatePath("/admin");
}

export async function save(resume: unknown): Promise<SaveState> {
  // Re-check on every call: a Server Action is a public POST endpoint, whatever the page showed.
  if (!(await getAdmin())) return { ok: false, message: "Your session has expired. Reload and sign in again." };

  const cleaned = cleanResume(resume);
  if (!cleaned.ok) return { ok: false, message: cleaned.error };

  try {
    await saveResume(cleaned.value as unknown as ResumeData);
  } catch (err) {
    console.error("Saving resume failed:", err);
    return { ok: false, message: "Could not save to the backend. Nothing was changed." };
  }

  updateTag(RESUME_TAG);
  revalidatePath("/");
  return { ok: true, message: "Saved. The site is updated." };
}
