import { fetchDiagramData, fetchPageTitle } from "@/lib/fetch-diagram-data";
import DiagramApp from "@/components/DiagramApp";

export default async function Home() {
  const [layers, title] = await Promise.all([fetchDiagramData(), fetchPageTitle()]);
  return <DiagramApp layers={layers} title={title} />;
}
