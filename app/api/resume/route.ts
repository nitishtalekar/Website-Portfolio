import { getResume } from "@/lib/backbone";

/** GET /api/resume: the resume JSON stored in Backbone. Read-only; writes go through scripts/push-resume.mjs. */
export async function GET() {
  try {
    return Response.json(await getResume());
  } catch (err) {
    console.error("GET /api/resume failed:", err);
    return Response.json({ error: "Could not load resume" }, { status: 502 });
  }
}
