import { GraphClient } from "@optimizely/cms-sdk";

export const graphClient = new GraphClient(
  process.env.OPTIMIZELY_GRAPH_SINGLE_KEY!,
  { graphUrl: `${process.env.OPTIMIZELY_GRAPH_GATEWAY}/content/v2` }
);
