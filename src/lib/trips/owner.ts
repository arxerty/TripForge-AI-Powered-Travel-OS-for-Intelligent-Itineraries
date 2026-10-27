import { cookies } from "next/headers";
import { randomUUID } from "crypto";

// Trips are scoped to an anonymous per-browser id until accounts are backed by a live DB.
const OWNER_COOKIE = "tf_uid";

export async function getOwnerId() {
  return (await cookies()).get(OWNER_COOKIE)?.value ?? null;
}

/** Returns the owner id, creating the cookie if needed. Only callable from Route Handlers / Server Actions. */
export async function ensureOwnerId() {
  const store = await cookies();
  const existing = store.get(OWNER_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(OWNER_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return id;
}
