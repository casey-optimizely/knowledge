// ─── /api/preview ─────────────────────────────────────────────────────────────
// Entry-point for Optimizely SaaS CMS preview mode.
//
// The CMS calls this URL when an editor clicks "Preview" on a content item.
// Standard parameters sent by the CMS:
//   preview_token  — short-lived JWT that unlocks draft content in Graph
//   key            — content item key (GUID)
//   ver            — content version number
//   loc            — locale (e.g. "en")
//
// ── Preview URL to register in CMS ───────────────────────────────────────────
//
// Settings → Applications → [your app] → Preview URL  (used for ALL types):
//
//   https://<your-app>/api/preview?preview_token={preview_token}&key={key}&ver={ver}&loc={loc}
//
// No `type=` parameter needed — the route auto-detects whether the key belongs
// to an optiNode (→ /preview?key=) or a LaunchOptiDomain (→ /).
//
// If you ever need to force a specific target, add ?type=domain or ?type=node.
//
// ──────────────────────────────────────────────────────────────────────────────

import { draftMode } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { fetchNodePreview } from "@/lib/fetch-diagram-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const previewToken = searchParams.get("preview_token") ?? "";
  const key          = searchParams.get("key") ?? "";
  const ver          = searchParams.get("ver") ?? "";
  const loc          = searchParams.get("loc") ?? "en";

  // `type` can be forced in the URL template for manual overrides, but is
  // optional — without it we auto-detect via a lightweight Graph probe below.
  const explicitType = searchParams.get("type"); // "domain" | "node" | null

  if (!key) {
    return new Response("Missing required parameter: key", { status: 400 });
  }

  // ── Auto-detect content type ───────────────────────────────────────────────
  // Probe Graph with the preview token to determine what kind of content this
  // key belongs to.  If fetchNodePreview returns a result → optiNode.
  // If it returns null → assume LaunchOptiDomain (page / domain).
  // Explicit `type=` param always wins (useful for per-content-type URL templates
  // or manual /api/preview?type=domain links).
  let type = explicitType ?? "node";
  if (!explicitType && previewToken) {
    const node = await fetchNodePreview(key, previewToken);
    type = node ? "node" : "domain";
  }

  // Enable Next.js draft mode — disables static caching for preview routes.
  (await draftMode()).enable();

  // Persist the preview params in cookies so pages can read them server-side.
  const cookieStore = await cookies();
  const cookieOpts = { path: "/", httpOnly: true, sameSite: "none" as const, secure: true };
  cookieStore.set("opti_preview_token", previewToken, cookieOpts);
  cookieStore.set("opti_preview_key",   key,          cookieOpts);
  cookieStore.set("opti_preview_ver",   ver,          cookieOpts);
  cookieStore.set("opti_preview_loc",   loc,          cookieOpts);

  // LaunchOptiDomain → show the full diagram in draft mode.
  // optiNode / anything else → show the individual node preview page.
  if (type === "domain") {
    redirect("/");
  } else {
    redirect(`/preview?key=${encodeURIComponent(key)}`);
  }
}
