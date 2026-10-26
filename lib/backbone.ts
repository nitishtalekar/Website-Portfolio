import "server-only";

import type { Resume } from "@/content/types";

/**
 * Server-side client for the Backbone `db_query` API
 * (docs/backend-arch-docs/sop-db-query.md). The API key never leaves the server.
 */
function config() {
  const url = process.env.BACKBONE_URL;
  const key = process.env.BACKBONE_DB_QUERY_API_KEY;
  if (!url || !key) throw new Error("BACKBONE_URL and BACKBONE_DB_QUERY_API_KEY must be set");
  const table = process.env.BACKBONE_TABLE ?? "resume";
  const id = process.env.BACKBONE_ID ?? "1";
  return { endpoint: `${url.replace(/\/$/, "")}/db_query/${table}/${id}`, key };
}

/** Fetch the resume document (the `pjson` of the configured row). */
export async function getResume(): Promise<Resume> {
  const { endpoint, key } = config();
  const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Backbone responded ${res.status}`);
  const body = (await res.json()) as { id: number; pjson: Resume };
  return body.pjson;
}
