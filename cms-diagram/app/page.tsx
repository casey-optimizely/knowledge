// Always fetch live data from Optimizely Graph — never serve a cached static build.
// Without this, Vercel would pre-render the page at build time (when Graph credentials
// may be absent) and serve stale / fallback content until the next deploy.
//
// When the CMS preview route (type=domain) redirects here, draft mode is enabled
// and opti_preview_token is set in cookies — fetchDiagramData / fetchPageTitle
// will use that token to include unpublished content in the Graph response.
export const dynamic = "force-dynamic";

import { draftMode } from "next/headers";
import { cookies } from "next/headers";
import { fetchDiagramData, fetchPageTitle } from "@/lib/fetch-diagram-data";
import DiagramApp from "@/components/DiagramApp";

export default async function Home() {
  const { isEnabled: isDraft } = await draftMode();
  const cookieStore = await cookies();
  const previewToken = isDraft ? (cookieStore.get("opti_preview_token")?.value ?? undefined) : undefined;

  const [layers, title] = await Promise.all([
    fetchDiagramData(previewToken),
    fetchPageTitle(previewToken),
  ]);

  return <DiagramApp layers={layers} title={title} isDraft={isDraft} />;
}
