export interface DiagramNode {
  id: string;
  label: string;
  icon: string;
  layerId: string;
  colorClass: string;       // border + text accent color
  bgClass: string;          // node background
  description: string;
  responsibilities: string[];
  techExamples: string[];
  learnMoreUrl?: string;
}

export interface DiagramLayer {
  id: string;
  label: string;
  nodes: DiagramNode[];
}

export const layers: DiagramLayer[] = [
  {
    id: "client",
    label: "Client",
    nodes: [
      {
        id: "browser",
        label: "Browser / Client",
        icon: "🌐",
        layerId: "client",
        colorClass: "border-sky-400 text-sky-300",
        bgClass: "bg-sky-950",
        description:
          "The end-user's browser or native app that renders the experience. It requests pages, loads assets, and executes client-side JavaScript.",
        responsibilities: [
          "Render HTML, CSS, and JavaScript",
          "Execute hydration for interactive components",
          "Manage client-side routing (SPA transitions)",
          "Handle user interactions and form submissions",
          "Cache assets via service workers",
        ],
        techExamples: ["Chrome", "Safari", "Firefox", "React Native", "Electron"],
        learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web",
      },
    ],
  },
  {
    id: "edge",
    label: "Edge / CDN",
    nodes: [
      {
        id: "cdn",
        label: "CDN",
        icon: "🌍",
        layerId: "edge",
        colorClass: "border-indigo-400 text-indigo-300",
        bgClass: "bg-indigo-950",
        description:
          "A Content Delivery Network caches static assets and pages at geographically distributed Points of Presence (PoPs), reducing latency for global users.",
        responsibilities: [
          "Cache static assets (JS, CSS, images, fonts)",
          "Serve cached HTML pages (ISR/SSG)",
          "Reduce origin server load",
          "Handle DDoS protection and WAF rules",
          "Route traffic to the nearest PoP",
        ],
        techExamples: ["Cloudflare", "Fastly", "Akamai", "AWS CloudFront", "Vercel Edge Network"],
        learnMoreUrl: "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/",
      },
      {
        id: "edge-functions",
        label: "Edge Functions",
        icon: "⚡",
        layerId: "edge",
        colorClass: "border-violet-400 text-violet-300",
        bgClass: "bg-violet-950",
        description:
          "Serverless functions that run at the CDN edge, enabling logic like A/B testing, auth token validation, geo-redirects, and request rewriting without hitting the origin.",
        responsibilities: [
          "A/B testing and feature flagging at the edge",
          "Authentication token validation",
          "Geo-based routing and redirects",
          "Request/response transformation",
          "Bot detection and rate limiting",
        ],
        techExamples: ["Vercel Edge Middleware", "Cloudflare Workers", "Fastly Compute@Edge", "AWS Lambda@Edge"],
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    nodes: [
      {
        id: "nextjs",
        label: "Next.js App",
        icon: "▲",
        layerId: "frontend",
        colorClass: "border-white text-gray-200",
        bgClass: "bg-gray-800",
        description:
          "The React-based frontend framework that handles server-side rendering, static generation, and client-side interactivity. It fetches content from the CMS and composes the page experience.",
        responsibilities: [
          "Server-side rendering (SSR) and static generation (SSG/ISR)",
          "Route handling and page composition",
          "Fetch and transform content from APIs",
          "Manage component hydration",
          "Implement design system and UI components",
        ],
        techExamples: ["Next.js", "Nuxt", "Astro", "Remix", "SvelteKit"],
        learnMoreUrl: "https://nextjs.org/docs",
      },
      {
        id: "personalization",
        label: "Personalization",
        icon: "🎯",
        layerId: "frontend",
        colorClass: "border-pink-400 text-pink-300",
        bgClass: "bg-pink-950",
        description:
          "Adapts the content experience for individual users based on segments, behavior, preferences, or A/B test variants. Can operate at the edge or client level.",
        responsibilities: [
          "Audience segmentation and targeting",
          "A/B and multivariate testing",
          "Behavioral personalization (visit history, preferences)",
          "Geo and device-based content variants",
          "Merchandising rules for commerce surfaces",
        ],
        techExamples: ["Ninetailed", "Uniform", "Optimizely", "Contentful Personalization", "LaunchDarkly"],
      },
    ],
  },
  {
    id: "integration",
    label: "Integration / API",
    nodes: [
      {
        id: "api-gateway",
        label: "API Gateway",
        icon: "🔀",
        layerId: "integration",
        colorClass: "border-amber-400 text-amber-300",
        bgClass: "bg-amber-950",
        description:
          "A single entry point that routes, aggregates, and secures calls to downstream microservices and third-party APIs. Reduces frontend complexity by exposing a unified interface.",
        responsibilities: [
          "Request routing to downstream services",
          "Rate limiting and throttling",
          "Authentication and authorization enforcement",
          "Response caching",
          "API versioning and documentation",
        ],
        techExamples: ["AWS API Gateway", "Kong", "Apigee", "Next.js API Routes", "GraphQL Mesh"],
      },
      {
        id: "webhooks",
        label: "Webhooks",
        icon: "🔔",
        layerId: "integration",
        colorClass: "border-orange-400 text-orange-300",
        bgClass: "bg-orange-950",
        description:
          "Event-driven HTTP callbacks that notify downstream systems when content is published, updated, or deleted in the CMS — triggering cache invalidations, builds, or workflow steps.",
        responsibilities: [
          "Trigger build/deploy pipelines on publish",
          "Invalidate CDN cache for updated content",
          "Sync data to external search indexes",
          "Notify third-party systems (Slack, email, ERP)",
          "Drive editorial workflow automation",
        ],
        techExamples: ["CMS Webhooks", "Zapier", "Make (Integromat)", "AWS EventBridge", "Inngest"],
      },
      {
        id: "graphql",
        label: "GraphQL / REST API",
        icon: "◈",
        layerId: "integration",
        colorClass: "border-rose-400 text-rose-300",
        bgClass: "bg-rose-950",
        description:
          "The content delivery API that the frontend queries to fetch structured content. GraphQL APIs allow precise field selection; REST APIs return fixed schemas.",
        responsibilities: [
          "Serve structured content to the frontend",
          "Support field-level queries (GraphQL)",
          "Paginate and filter content collections",
          "Handle media URL transformations",
          "Expose preview / draft content endpoints",
        ],
        techExamples: ["Contentful GraphQL", "Sanity GROQ", "Strapi REST", "WPGraphQL", "Hygraph"],
      },
    ],
  },
  {
    id: "services",
    label: "Core Services",
    nodes: [
      {
        id: "cms",
        label: "Headless CMS",
        icon: "📝",
        layerId: "services",
        colorClass: "border-blue-400 text-blue-300",
        bgClass: "bg-blue-950",
        description:
          "The content management system where editors create, edit, schedule, and publish content. In a headless setup, it exposes content via APIs rather than rendering HTML itself.",
        responsibilities: [
          "Content modeling (types, fields, relationships)",
          "Editorial UI for authors and editors",
          "Content versioning and draft/publish workflow",
          "Localization and multi-language support",
          "Role-based access control for editors",
        ],
        techExamples: ["Contentful", "Sanity", "Strapi", "Payload CMS", "Storyblok"],
        learnMoreUrl: "https://www.contentful.com/headless-cms/",
      },
      {
        id: "commerce",
        label: "Commerce",
        icon: "🛒",
        layerId: "services",
        colorClass: "border-purple-400 text-purple-300",
        bgClass: "bg-purple-950",
        description:
          "The eCommerce platform managing product catalog, inventory, pricing, cart, checkout, and order management. Exposed via APIs and composed with the CMS frontend.",
        responsibilities: [
          "Product catalog and variant management",
          "Pricing, promotions, and discounts",
          "Cart and checkout orchestration",
          "Order management and fulfillment",
          "Inventory and warehouse sync",
        ],
        techExamples: ["Shopify", "Commercetools", "BigCommerce", "Medusa", "Elastic Path"],
        learnMoreUrl: "https://www.shopify.com/enterprise",
      },
      {
        id: "dam",
        label: "DAM",
        icon: "🖼️",
        layerId: "services",
        colorClass: "border-amber-400 text-amber-300",
        bgClass: "bg-amber-950",
        description:
          "A Digital Asset Management system stores, organizes, transforms, and delivers rich media (images, video, documents). Provides on-the-fly image optimization and global delivery.",
        responsibilities: [
          "Centralized asset storage and organization",
          "Metadata tagging and search",
          "On-the-fly image resizing and format conversion",
          "Video transcoding and streaming",
          "Brand asset governance and usage rights",
        ],
        techExamples: ["Cloudinary", "Bynder", "Widen", "Canto", "Imgix"],
        learnMoreUrl: "https://cloudinary.com/blog/dam_digital_asset_management",
      },
      {
        id: "search",
        label: "Search",
        icon: "🔍",
        layerId: "services",
        colorClass: "border-teal-400 text-teal-300",
        bgClass: "bg-teal-950",
        description:
          "A dedicated search service that indexes content from the CMS and commerce platform, providing fast full-text search, faceting, filtering, and relevance ranking.",
        responsibilities: [
          "Full-text search across content and products",
          "Faceted navigation and filtering",
          "Relevance tuning and synonym management",
          "Real-time index updates via webhooks",
          "Analytics on search queries and no-results",
        ],
        techExamples: ["Algolia", "Elasticsearch / OpenSearch", "Typesense", "Meilisearch", "Coveo"],
        learnMoreUrl: "https://www.algolia.com/doc/",
      },
    ],
  },
  {
    id: "foundation",
    label: "Foundation",
    nodes: [
      {
        id: "database",
        label: "Database",
        icon: "🗄️",
        layerId: "foundation",
        colorClass: "border-green-400 text-green-300",
        bgClass: "bg-green-950",
        description:
          "Persistent storage for application data — user accounts, orders, sessions, and CMS content when self-hosted. May include relational and document databases.",
        responsibilities: [
          "Persist user and application data",
          "Store CMS content (self-hosted CMSs)",
          "Manage transactional records (orders, payments)",
          "Support migrations and schema versioning",
          "Enable backups and point-in-time recovery",
        ],
        techExamples: ["PostgreSQL", "MySQL", "MongoDB", "PlanetScale", "Supabase"],
      },
      {
        id: "cache",
        label: "Cache",
        icon: "⚡",
        layerId: "foundation",
        colorClass: "border-yellow-400 text-yellow-300",
        bgClass: "bg-yellow-950",
        description:
          "An in-memory data store that caches expensive database queries, API responses, and sessions to reduce latency and backend load.",
        responsibilities: [
          "Cache API responses and database queries",
          "Manage user session storage",
          "Rate limiting counters",
          "Pub/sub messaging between services",
          "Invalidate stale data on content publish",
        ],
        techExamples: ["Redis", "Upstash", "Memcached", "Vercel KV", "AWS ElastiCache"],
      },
      {
        id: "auth",
        label: "Auth / Identity",
        icon: "🔐",
        layerId: "foundation",
        colorClass: "border-red-400 text-red-300",
        bgClass: "bg-red-950",
        description:
          "Manages user authentication and authorization across the stack. Provides SSO, social login, role-based permissions, and secure token issuance.",
        responsibilities: [
          "User registration, login, and logout",
          "Social OAuth (Google, GitHub, etc.)",
          "JWT / session token issuance",
          "Role-based access control (RBAC)",
          "Multi-factor authentication (MFA)",
        ],
        techExamples: ["Auth0", "Clerk", "NextAuth.js", "Supabase Auth", "AWS Cognito"],
      },
      {
        id: "cicd",
        label: "CI/CD & Hosting",
        icon: "🚀",
        layerId: "foundation",
        colorClass: "border-lime-400 text-lime-300",
        bgClass: "bg-lime-950",
        description:
          "The pipeline that tests, builds, and deploys the frontend automatically on every code push or content publish event. Hosting provides serverless compute and global distribution.",
        responsibilities: [
          "Automated testing on pull requests",
          "Build and bundle the Next.js application",
          "Deploy preview environments per branch",
          "Trigger production deployments on merge",
          "Monitor uptime, errors, and performance",
        ],
        techExamples: ["Vercel", "Netlify", "AWS Amplify", "GitHub Actions", "CircleCI"],
        learnMoreUrl: "https://vercel.com/docs",
      },
    ],
  },
];
