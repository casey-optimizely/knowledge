// Always fetch live data from Optimizely Graph — never serve a cached static build.
// Without this, Vercel would pre-render the page at build time (when Graph credentials
// may be absent) and serve stale / fallback content until the next deploy.
export const dynamic = "force-dynamic";

import { fetchDiagramData, fetchPageTitle } from "@/lib/fetch-diagram-data";
import DiagramApp from "@/components/DiagramApp";

export default async function Home() {
  const [layers, title] = await Promise.all([fetchDiagramData(), fetchPageTitle()]);
  return <DiagramApp layers={layers} title={title} />;
}
