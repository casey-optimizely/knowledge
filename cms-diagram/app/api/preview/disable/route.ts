// ─── /api/preview/disable ─────────────────────────────────────────────────────
// Exits preview mode and clears all preview cookies.
// Accessible via a button on the /preview page.
// ──────────────────────────────────────────────────────────────────────────────

import { draftMode } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET() {
  (await draftMode()).disable();

  const cookieStore = await cookies();
  cookieStore.delete("opti_preview_token");
  cookieStore.delete("opti_preview_key");
  cookieStore.delete("opti_preview_ver");
  cookieStore.delete("opti_preview_loc");

  redirect("/");
}
