const knowledgeBaseItems = [
  {
    id: "kb-oic-gen3-overview",
    sourceType: "docs",
    product: "Oracle Integration",
    topic: "OIC Gen3",
    title: "Oracle Integration 3 guides and release track",
    source: "Oracle Docs",
    url: "https://docs.oracle.com/en/cloud/paas/application-integration/books.html",
    version: "Gen3",
    difficulty: "Beginner",
    tags: ["OIC", "Gen3", "Architecture", "Getting Started"],
    summary:
      "Central entry point for Oracle Integration 3 guides, including design, administration, adapters, connectivity, and release-specific documentation.",
    technicalSignals: [
      "Use as the canonical doc index before jumping into adapters or recipes.",
      "Good starting point for identifying current Gen3 terminology and guide boundaries."
    ],
    chunkText:
      "Oracle Integration 3 guides cover getting started, designing integrations, using adapters, administration, connectivity, recipes, and upgrade guidance. Use this as the parent knowledge source for OIC Gen3 topics."
  },
  {
    id: "kb-oic-training-hub",
    sourceType: "docs",
    product: "Oracle Integration",
    topic: "OIC Training",
    title: "Oracle Integration training hub",
    source: "Oracle Docs",
    url: "https://docs.oracle.com/en/cloud/paas/application-integration/training.html",
    version: "Gen3",
    difficulty: "Beginner",
    tags: ["OIC", "Training", "Agentic AI", "Labs"],
    summary:
      "Training hub that collects tutorials, videos, and labs for Oracle Integration learning paths.",
    technicalSignals: [
      "Use for learner-facing training flows.",
      "Useful when matching beginner queries to labs or videos."
    ],
    chunkText:
      "Oracle Integration training content includes tutorials, labs, videos, and guided enablement material for integration builders, including newer AI-assisted and agentic integration scenarios."
  },
  {
    id: "kb-oic-rest-adapter-index",
    sourceType: "docs",
    product: "Oracle Integration",
    topic: "REST Adapter",
    title: "Using the REST Adapter with Oracle Integration 3",
    source: "Oracle Docs",
    url: "https://docs.oracle.com/en/cloud/paas/application-integration/rest-adapter/index.html",
    version: "Gen3",
    difficulty: "Beginner",
    tags: ["OIC", "REST Adapter", "Trigger", "Invoke"],
    summary:
      "Primary documentation entry point for REST Adapter trigger and invoke use cases in Oracle Integration.",
    technicalSignals: [
      "Use when users ask how to expose OIC as REST or call external REST APIs.",
      "Pair with capability docs and expose-as-REST configuration steps."
    ],
    chunkText:
      "REST Adapter in Oracle Integration can be used as a trigger to expose integrations as REST APIs or as an invoke connection to call external REST services. Key topics include endpoint configuration, security, request and response schemas, and adapter capabilities."
  },
  {
    id: "kb-oic-rest-adapter-capabilities",
    sourceType: "docs",
    product: "Oracle Integration",
    topic: "REST Adapter",
    title: "REST Adapter capabilities",
    source: "Oracle Docs",
    url: "https://docs.oracle.com/en/cloud/paas/application-integration/rest-adapter/rest-adapter-capabilities.html",
    version: "Gen3",
    difficulty: "Intermediate",
    tags: ["OIC", "REST Adapter", "Capabilities", "Security"],
    summary:
      "Capability matrix for REST Adapter features, including supported patterns and constraints.",
    technicalSignals: [
      "Use before proposing REST design patterns.",
      "Important for checking limitations, payload behavior, and supported authentication patterns."
    ],
    chunkText:
      "REST Adapter capabilities help decide whether a requirement fits trigger, invoke, schema, security, attachments, or OpenAPI patterns. Capability checks reduce wrong implementation choices."
  },
  {
    id: "kb-oic-expose-rest-api",
    sourceType: "docs",
    product: "Oracle Integration",
    topic: "REST Adapter",
    title: "Configure REST Adapter to expose an integration as a REST API",
    source: "Oracle Docs",
    url: "https://docs.oracle.com/en/cloud/paas/integration-cloud/rest-adapter/configure-rest-adapter-expose-integration-rest-api.html",
    version: "Gen3",
    difficulty: "Intermediate",
    tags: ["OIC", "REST Adapter", "Expose API", "OpenAPI"],
    summary:
      "Step-focused documentation for creating REST trigger integrations and exposing OIC flows as REST endpoints.",
    technicalSignals: [
      "Best match for configure REST trigger questions.",
      "Use with request schema, response schema, and endpoint security notes."
    ],
    chunkText:
      "To expose an OIC integration as a REST API, configure REST Adapter as the trigger, define resource path and method, configure request and response payloads, apply security, activate the integration, and test the generated endpoint."
  },
  {
    id: "kb-oic-connectivity-agent",
    sourceType: "docs",
    product: "Oracle Integration",
    topic: "Connectivity Agent",
    title: "Oracle Integration connectivity agent",
    source: "Oracle Docs",
    url: "https://docs.oracle.com/en/cloud/paas/application-integration/integrations-user/manage-connectivity-agents.html",
    version: "Gen3",
    difficulty: "Intermediate",
    tags: ["OIC", "Connectivity Agent", "On Premise", "Hybrid"],
    summary:
      "Connectivity agent guidance for accessing private or on-premise systems from Oracle Integration.",
    technicalSignals: [
      "Use when user asks about on-premise ERP, database, file server, or private endpoint connectivity.",
      "Check agent group, firewall, and runtime placement."
    ],
    chunkText:
      "Connectivity agents let Oracle Integration communicate with resources that are not directly reachable from the public cloud. Common implementation steps include install agent, configure agent group, open required outbound connectivity, associate connection with agent group, and test."
  },
  {
    id: "kb-oic-lookups",
    sourceType: "docs",
    product: "Oracle Integration",
    topic: "Lookups",
    title: "Lookups in Oracle Integration",
    source: "Oracle Docs",
    url: "https://docs.oracle.com/en/cloud/paas/application-integration/integrations-user/create-lookups.html",
    version: "Gen3",
    difficulty: "Beginner",
    tags: ["OIC", "Lookups", "Mapping", "Reference Data"],
    summary:
      "Lookups help map values between applications, such as status codes, business units, and external system identifiers.",
    technicalSignals: [
      "Use for lightweight code/value translations.",
      "Use packages or export/import when moving lookup data across environments."
    ],
    chunkText:
      "OIC lookups support value mappings used by integrations. Typical steps include create lookup, define columns, add domain-specific values, reference lookup in mapper expressions, and migrate lookup with related integration artifacts."
  },
  {
    id: "kb-oic-error-handling",
    sourceType: "docs",
    product: "Oracle Integration",
    topic: "Error Handling",
    title: "Fault handling in Oracle Integration",
    source: "Oracle Docs",
    url: "https://docs.oracle.com/en/cloud/paas/application-integration/integrations-user/handle-faults.html",
    version: "Gen3",
    difficulty: "Intermediate",
    tags: ["OIC", "Fault Handling", "Errors", "Retry"],
    summary:
      "Fault handling patterns for integration failures, scoped faults, global faults, and controlled error responses.",
    technicalSignals: [
      "Use for retry, notification, logging, and business fault design questions.",
      "Pair with tracking and observability topics."
    ],
    chunkText:
      "Fault handling in OIC lets integration builders catch adapter or mapping failures, route exceptions, enrich error payloads, notify support teams, and return controlled REST responses. Design fault handlers near risky invokes and add global handling for unexpected failures."
  },
  {
    id: "kb-oic-agentic-ai-lab",
    sourceType: "labs",
    product: "Oracle Integration",
    topic: "Agentic AI",
    title: "Get started with Agentic AI in Oracle Integration",
    source: "Oracle LiveLabs",
    url: "https://livelabs.oracle.com/pls/apex/r/dbpm/livelabs/view-workshop?wid=4283",
    version: "Gen3",
    difficulty: "Intermediate",
    tags: ["OIC", "Agentic AI", "LiveLabs", "Hands On"],
    summary:
      "Hands-on lab for learning agentic AI scenarios in Oracle Integration.",
    technicalSignals: [
      "Best match for practical agentic AI enablement.",
      "Use as the lab target when users want guided practice instead of docs."
    ],
    chunkText:
      "The Agentic AI OIC lab is useful for guided implementation. It should be recommended when the user asks for practice, setup steps, hands-on exercises, or how to build agentic AI flows in Oracle Integration."
  },
  {
    id: "kb-oic-rest-adapter-video",
    sourceType: "videos",
    product: "Oracle Integration",
    topic: "REST Adapter",
    title: "Oracle Integration Cloud REST Adapter video walkthrough",
    source: "YouTube",
    url: "https://www.youtube.com/watch?v=NDwTCKDC8LM",
    youtubeId: "NDwTCKDC8LM",
    version: "Gen3",
    difficulty: "Beginner",
    tags: ["OIC", "REST Adapter", "Video", "Tutorial"],
    summary:
      "Video walkthrough for REST Adapter usage patterns and configuration basics.",
    technicalSignals: [
      "Use when user asks for a visual REST Adapter tutorial.",
      "Prefer docs for exact version-specific steps, video for explanation."
    ],
    chunkText:
      "REST Adapter video content is useful for explaining how trigger and invoke configuration looks in the UI. Match it to beginner REST Adapter searches, especially when users ask for a video."
  },
  {
    id: "kb-oic-gen3-video",
    sourceType: "videos",
    product: "Oracle Integration",
    topic: "OIC Gen3",
    title: "First glimpse of Oracle Integration 3",
    source: "YouTube",
    url: "https://www.youtube.com/watch?v=yW3TEBWkFbg",
    youtubeId: "yW3TEBWkFbg",
    version: "Gen3",
    difficulty: "Beginner",
    tags: ["OIC", "Gen3", "Video", "Overview"],
    summary:
      "Introductory video for Oracle Integration 3 capabilities and experience.",
    technicalSignals: [
      "Use for high-level OIC Gen3 overview queries.",
      "Do not use as the main source for deep configuration details."
    ],
    chunkText:
      "Oracle Integration 3 overview video is useful for orientation, product positioning, and first-look learning. It should rank below docs for exact configuration steps."
  },
  {
    id: "kb-oic-rest-adapter-blog",
    sourceType: "blogs",
    product: "Oracle Integration",
    topic: "REST Adapter",
    title: "Oracle Integration Cloud REST Adapter capabilities blog",
    source: "Oracle Blogs",
    url: "https://blogs.oracle.com/soacommunity/post/oracle-integration-cloud-rest-adapter-capabilities-by-ankur-jain",
    version: "Gen3",
    difficulty: "Beginner",
    tags: ["OIC", "REST Adapter", "Blog", "Capabilities"],
    summary:
      "Blog-style explanation of REST Adapter capabilities with practical framing.",
    technicalSignals: [
      "Use as a companion to official docs.",
      "Good for quick conceptual explanation and community context."
    ],
    chunkText:
      "REST Adapter capability blogs help explain concepts in practical language. Use them after official docs when the user wants a shorter explanation or example-driven overview."
  }
];

module.exports = knowledgeBaseItems;
