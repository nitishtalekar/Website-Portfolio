import type { Metadata } from "next";
import { Suspense } from "react";
import { getResume } from "@/lib/backbone";
import { getAdmin } from "@/lib/session";
import Editor from "./Editor";
import LoginForm from "./LoginForm";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className={styles.root}>
      <Suspense fallback={<p className={styles.note}>Loading…</p>}>
        <Gate />
      </Suspense>
    </div>
  );
}

/** Reads the session cookie, so it must stay behind the Suspense boundary above. */
async function Gate() {
  const admin = await getAdmin();
  if (!admin) return <LoginForm />;

  // Always the live Backbone copy, never the cached public one, so edits start from the latest save.
  const resume = await getResume().catch((err) => {
    console.error("Admin could not load resume:", err);
    return null;
  });
  if (!resume) return <p className={styles.note}>Could not load the resume from the backend. Reload to retry.</p>;
  return <Editor initial={resume} username={admin.username} />;
}
