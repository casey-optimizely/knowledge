// ─── /api/preview ─────────────────────────────────────────────────────────────
// Entry-point for Optimizely SaaS CMS preview mode.
//
// The CMS calls this URL when an editor clicks "Preview" on an optiNode item.
// It passes four query parameters:
//   preview_token  — short-lived JWT that unlocks draft content in Graph
//   key            — content item key (GUID)
//   ver            — content version number
//   loc            — locale (e.g. "en")
//
// Register this URL in the CMS:
//   Settings → Content Types → optiNode → Preview URL:
//   https://<your-app>/api/preview?preview_token={preview_token}&key={key}&ver={ver}&loc={loc}
//
// Flow:
//   1. Store preview params in cookies so the preview page can read them.
//   2. Enable Next.js draft mode (disables static caching for preview route).
//   3. Redirect to /preview?key={key}.
// ──────────────────────────────────────────────────────────────────────────────

import { draftMode } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const previewToken = searchParams.get("preview_token") ?? "";
  const key          = searchParams.get("key") ?? "";
  const ver          = searchParams.get("ver") ?? "";
  const loc          = searchParams.get("loc") ?? "en";

  if (!key) {
    return new Response("Missing required parameter: key", { status: 400 });
  }

  // Enable Next.js draft mode — this disables static caching for /preview.
  (await draftMode()).enable();

  // Persist the preview params in cookies so the page can use them server-side.
  const cookieStore = await cookies();
  cookieStore.set("opti_preview_token", previewToken, { path: "/", httpOnly: true, sameSite: "none", secure: true });
  cookieStore.set("opti_preview_key",   key,          { path: "/", httpOnly: true, sameSite: "none", secure: true });
  cookieStore.set("opti_preview_ver",   ver,          { path: "/", httpOnly: true, sameSite: "none", secure: true });
  cookieStore.set("opti_preview_loc",   loc,          { path: "/", httpOnly: true, sameSite: "none", secure: true });

  // Redirect to the visual preview page.
  redirect(`/preview?key=${encodeURIComponent(key)}`);
}
