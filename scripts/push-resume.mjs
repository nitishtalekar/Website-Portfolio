// Saves content/resume.json to Backbone (PUT replaces the whole document).
// Usage: npm run push:resume
import { readFile } from "node:fs/promises";

const { BACKBONE_URL, BACKBONE_DB_QUERY_API_KEY: key, BACKBONE_TABLE = "resume", BACKBONE_ID = "1" } = process.env;
if (!BACKBONE_URL || !key) {
  console.error("Set BACKBONE_URL and BACKBONE_DB_QUERY_API_KEY (npm run push:resume loads .env.local).");
  process.exit(1);
}

const base = `${BACKBONE_URL.replace(/\/$/, "")}/db_query/${BACKBONE_TABLE}`;
const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const pjson = JSON.parse(await readFile(new URL("../content/resume.json", import.meta.url), "utf8"));

const put = (id) => fetch(`${base}/${id}`, { method: "PUT", headers, body: JSON.stringify({ pjson }) });

let res = await put(BACKBONE_ID);
if (res.status === 404) {
  // Ids are server-assigned, so the row has to be created first; it may not get BACKBONE_ID.
  const created = await fetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: "resume", description: "Portfolio resume" }),
  });
  if (!created.ok) await fail("create", created);
  const { project_id } = await created.json();
  console.log(`Row ${BACKBONE_ID} did not exist; created row ${project_id}.`);
  if (String(project_id) !== BACKBONE_ID) console.warn(`Set BACKBONE_ID=${project_id} in .env.local.`);
  res = await put(project_id);
}
if (!res.ok) await fail("update", res);
console.log(`Saved content/resume.json to ${BACKBONE_TABLE}/${BACKBONE_ID} (${res.status}).`);

async function fail(step, r) {
  console.error(`Backbone ${step} failed: ${r.status} ${await r.text()}`);
  process.exit(1);
}
