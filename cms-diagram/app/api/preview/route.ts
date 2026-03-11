// ─── /api/preview ─────────────────────────────────────────────────────────────
// Entry-point for Optimizely SaaS CMS preview mode.
//
// The CMS calls this URL when an editor clicks "Preview" on a content item.
// It passes these query parameters:
//   preview_token  — short-lived JWT that unlocks draft content in Graph
//   key            — content item key (GUID)
//   ver            — content version number
//   loc            — locale (e.g. "en")
//
// We also read an optional `type` param we inject into the URL template per
// content type so we know where to redirect:
//   type=domain    → LaunchOptiDomain  → redirect to / (full diagram, draft mode)
//   type=node      → optiNode          → redirect to /preview?key={key}
//   (omitted)      → falls back to /preview?key={key}
//
// ── CMS Preview URL registration ─────────────────────────────────────────────
//
// Settings → Content Types → LaunchOptiDomain → Preview URL:
//   https://<your-app>/api/preview?type=domain&preview_token={preview_token}&key={key}&ver={ver}&loc={loc}
//
// optiNode is a _component type — no built-in Preview URL field.
// Use the /preview page directly for manual previews (see /2 below).
//
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
  const type         = searchParams.get("type") ?? "node"; // "domain" | "node"

  if (!key) {
    return new Response("Missing required parameter: key", { status: 400 });
  }

  // Enable Next.js draft mode — disables static caching for preview routes.
  (await draftMode()).enable();

  // Persist the preview params in cookies so pages can read them server-side.
  const cookieStore = await cookies();
  cookieStore.set("opti_preview_token", previewToken, { path: "/", httpOnly: true, sameSite: "none", secure: true });
  cookieStore.set("opti_preview_key",   key,          { path: "/", httpOnly: true, sameSite: "none", secure: true });
  cookieStore.set("opti_preview_ver",   ver,          { path: "/", httpOnly: true, sameSite: "none", secure: true });
  cookieStore.set("opti_preview_loc",   loc,          { path: "/", httpOnly: true, sameSite: "none", secure: true });

  // LaunchOptiDomain → show the full diagram (home page) in draft mode.
  // optiNode / anything else → show the individual node preview page.
  if (type === "domain") {
    redirect("/");
  } else {
    redirect(`/preview?key=${encodeURIComponent(key)}`);
  }
}
