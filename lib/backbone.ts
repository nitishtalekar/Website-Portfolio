import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { compose } from "@/content/compose";
import { resumeData as bundled } from "@/content/resume";
import type { Resume, ResumeData } from "@/content/types";

/**
 * Server-side client for the Backbone API (docs/backend-arch-docs).
 * The API key never leaves the server.
 */
export const RESUME_TAG = "resume";

function config() {
  const url = process.env.BACKBONE_URL;
  const key = process.env.BACKBONE_DB_QUERY_API_KEY;
  if (!url || !key) throw new Error("BACKBONE_URL and BACKBONE_DB_QUERY_API_KEY must be set");
  const table = process.env.BACKBONE_TABLE ?? "resume";
  const id = process.env.BACKBONE_ID ?? "1";
  return { base: url.replace(/\/$/, ""), endpoint: `${url.replace(/\/$/, "")}/db_query/${table}/${id}`, key };
}

/** Fetch the resume document (the `pjson` of the configured row), uncached. */
export async function getResume(): Promise<ResumeData> {
  const { endpoint, key } = config();
  const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`Backbone responded ${res.status}`);
  const body = (await res.json()) as { id: number; pjson: ResumeData };
  return body.pjson;
}

/** Replace the whole resume document. `pjson` must be present or Backbone double-encodes the value. */
export async function saveResume(resume: ResumeData): Promise<void> {
  const { endpoint, key } = config();
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ pjson: resume }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Backbone responded ${res.status}`);
}

/**
 * What the public site renders: the Backbone copy merged with the site's own
 * structure, cached until an admin save invalidates it. Falls back to the
 * bundled content/resume.json if Backbone is unreachable or holds a document
 * of the wrong shape, so the site never goes down with the backend.
 */
export async function getPublicResume(): Promise<Resume> {
  try {
    return compose(await cachedResume());
  } catch (err) {
    console.error("Falling back to bundled resume:", err);
    return compose(bundled);
  }
}

async function cachedResume(): Promise<ResumeData> {
  "use cache";
  cacheTag(RESUME_TAG);
  cacheLife("hours");
  return getResume();
}

export type LoginResult =
  | { ok: true; user: { user_id: string; username: string } }
  | { ok: false; reason: "invalid" | "unavailable" };

/** Verify credentials via POST /auth/login. Public endpoint: no API key is sent. */
export async function loginUser(username: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${config().base}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
    if (res.status === 400 || res.status === 401) return { ok: false, reason: "invalid" };
    if (!res.ok) return { ok: false, reason: "unavailable" };
    const { user } = (await res.json()) as { user: { user_id: string; username: string } };
    return { ok: true, user };
  } catch (err) {
    console.error("Backbone login failed:", err);
    return { ok: false, reason: "unavailable" };
  }
}
