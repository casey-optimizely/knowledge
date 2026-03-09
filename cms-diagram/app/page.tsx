import { fetchDiagramData } from "@/lib/fetch-diagram-data";
import DiagramApp from "@/components/DiagramApp";

export default async function Home() {
  const layers = await fetchDiagramData();
  return <DiagramApp layers={layers} />;
}
