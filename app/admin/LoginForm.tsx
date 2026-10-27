"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import styles from "./admin.module.css";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className={styles.login}>
      <h1 className={styles.title}>Admin</h1>
      <label className={styles.field}>
        <span>Username</span>
        <input name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
      </label>
      <label className={styles.field}>
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.error && (
        <p role="alert" className={styles.error}>
          {state.error}
        </p>
      )}
      <button type="submit" className={styles.primary} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
