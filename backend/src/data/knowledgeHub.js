const manualTopicCollections = [
  {
    id: "topic-oic-gen3-foundations",
    title: "Oracle Integration 3 Foundations",
    summary:
      "Start with Oracle Integration 3 core concepts, release tracks, guides, and hands-on launch resources.",
    keywords: ["oic", "gen3", "oracle integration 3", "foundation", "getting started"],
    resources: [
      {
        id: "kb-res-001",
        title: "Oracle Integration 3 - Version History",
        type: "docs",
        source: "Oracle Docs",
        difficulty: "Beginner",
        description:
          "Official overview of Oracle Integration Generation 2 and Oracle Integration 3 versions.",
        link: "https://docs.oracle.com/en/cloud/paas/application-integration/versions.html",
        category: "OIC Gen3",
        tags: ["OIC", "Gen3", "Versioning"],
        duration: "15 min",
        featured: { trending: true, beginnerPath: true, handsOnLab: false }
      },
      {
        id: "kb-res-002",
        title: "Oracle Integration 3 Guides Index",
        type: "docs",
        source: "Oracle Docs",
        difficulty: "Beginner",
        description:
          "Central documentation index for Oracle Integration 3 getting started, whats new, and administration guides.",
        link: "https://docs.oracle.com/en/cloud/paas/application-integration/books.html",
        category: "OIC Gen3",
        tags: ["OIC", "Documentation", "Guides"],
        duration: "20 min",
        featured: { trending: true, beginnerPath: true, handsOnLab: false }
      },
      {
        id: "kb-res-003",
        title: "Oracle Integration 3 Latest Features",
        type: "blogs",
        source: "Oracle Blogs",
        difficulty: "Intermediate",
        description:
          "Oracle integration product team updates for bimonthly feature releases and roadmap references.",
        link: "https://blogs.oracle.com/integration/oracle-integration-latest-features",
        category: "Oracle Blogs",
        tags: ["OIC", "Release Updates", "Whats New"],
        duration: "10 min",
        featured: { trending: true, beginnerPath: false, handsOnLab: false }
      },
      {
        id: "kb-res-004",
        title: "First Glimpse - Oracle Integration 3",
        type: "videos",
        source: "YouTube",
        difficulty: "Beginner",
        description:
          "Oracle Learning overview video introducing Oracle Integration 3 experience and capabilities.",
        link: "https://www.youtube.com/watch?v=yW3TEBWkFbg",
        youtubeId: "yW3TEBWkFbg",
        category: "Oracle Video",
        tags: ["OIC", "Gen3", "Overview"],
        duration: "8 min",
        featured: { trending: false, beginnerPath: true, handsOnLab: false }
      },
      {
        id: "kb-res-005",
        title: "Oracle Integration LiveLabs",
        type: "labs",
        source: "Oracle LiveLabs",
        difficulty: "Beginner",
        description:
          "Self-paced practical workshop for Oracle Integration core scenarios.",
        link: "https://livelabs.oracle.com/pls/apex/r/dbpm/livelabs/view-workshop?wid=3694",
        category: "Hands-on Labs",
        tags: ["OIC", "Lab", "Hands-on"],
        duration: "90 min",
        featured: { trending: false, beginnerPath: true, handsOnLab: true }
      }
    ]
  },
  {
    id: "topic-rest-adapter",
    title: "REST Adapter Mastery (OIC Gen3)",
    summary:
      "Design trigger and invoke integrations confidently using Oracle Integration REST Adapter capabilities.",
    keywords: ["rest adapter", "oic rest", "invoke", "trigger", "api exposure"],
    resources: [
      {
        id: "kb-res-006",
        title: "Using the REST Adapter with Oracle Integration 3",
        type: "docs",
        source: "Oracle Docs",
        difficulty: "Beginner",
        description:
          "Primary REST Adapter documentation for Oracle Integration 3.",
        link: "https://docs.oracle.com/en/cloud/paas/application-integration/rest-adapter/index.html",
        category: "OIC REST Adapter",
        tags: ["REST Adapter", "OIC", "Docs"],
        duration: "25 min",
        featured: { trending: true, beginnerPath: true, handsOnLab: false }
      },
      {
        id: "kb-res-007",
        title: "Understand the REST Adapter",
        type: "docs",
        source: "Oracle Docs",
        difficulty: "Beginner",
        description:
          "Concepts, restrictions, use cases, and workflow for REST Adapter design.",
        link: "https://docs.oracle.com/en/cloud/paas/integration-cloud/rest-adapter/understand-rest-adapter.html",
        category: "OIC REST Adapter",
        tags: ["REST Adapter", "Concepts", "Integration"],
        duration: "30 min",
        featured: { trending: true, beginnerPath: true, handsOnLab: false }
      },
      {
        id: "kb-res-008",
        title: "REST Adapter Capabilities",
        type: "docs",
        source: "Oracle Docs",
        difficulty: "Intermediate",
        description:
          "Detailed trigger/invoke capability matrix for Oracle Integration REST Adapter.",
        link: "https://docs.oracle.com/en/cloud/paas/application-integration/rest-adapter/rest-adapter-capabilities.html",
        category: "OIC REST Adapter",
        tags: ["REST Adapter", "Capabilities", "Trigger", "Invoke"],
        duration: "35 min",
        featured: { trending: false, beginnerPath: false, handsOnLab: false }
      },
      {
        id: "kb-res-009",
        title: "Configure REST Adapter to Expose an Integration as REST API",
        type: "docs",
        source: "Oracle Docs",
        difficulty: "Intermediate",
        description:
          "Step-by-step setup for exposing integrations as secured REST endpoints.",
        link: "https://docs.oracle.com/en/cloud/paas/integration-cloud/rest-adapter/configure-rest-adapter-expose-integration-rest-api.html",
        category: "OIC REST Adapter",
        tags: ["REST Adapter", "API Exposure", "Swagger"],
        duration: "30 min",
        featured: { trending: false, beginnerPath: false, handsOnLab: false }
      },
      {
        id: "kb-res-010",
        title: "Oracle Integration Cloud REST Adapter Capabilities",
        type: "blogs",
        source: "Oracle Blogs",
        difficulty: "Beginner",
        description:
          "Community blog summary and video reference for REST Adapter capabilities.",
        link: "https://blogs.oracle.com/soacommunity/post/oracle-integration-cloud-rest-adapter-capabilities-by-ankur-jain",
        category: "Oracle Blogs",
        tags: ["REST Adapter", "Community", "Video"],
        duration: "12 min",
        featured: { trending: false, beginnerPath: true, handsOnLab: false }
      },
      {
        id: "kb-res-011",
        title: "Oracle Integration Cloud REST Adapter (Video)",
        type: "videos",
        source: "YouTube",
        difficulty: "Beginner",
        description:
          "Practical explanation of REST Adapter configuration and usage patterns.",
        link: "https://www.youtube.com/watch?v=NDwTCKDC8LM",
        youtubeId: "NDwTCKDC8LM",
        category: "Oracle Video",
        tags: ["REST Adapter", "OIC", "Tutorial"],
        duration: "35 min",
        featured: { trending: false, beginnerPath: true, handsOnLab: false }
      },
      {
        id: "kb-res-012",
        title: "Understand the REST Adapter (LiveLabs)",
        type: "labs",
        source: "Oracle LiveLabs",
        difficulty: "Intermediate",
        description:
          "Guided lab for REST Adapter patterns and practical implementation.",
        link: "https://livelabs.oracle.com/pls/apex/r/dbpm/livelabs/view-workshop?wid=3697",
        category: "Hands-on Labs",
        tags: ["REST Adapter", "Lab", "Hands-on"],
        duration: "75 min",
        featured: { trending: false, beginnerPath: false, handsOnLab: true }
      }
    ]
  },
  {
    id: "topic-agentic-ai-oic",
    title: "Agentic AI with Oracle Integration",
    summary:
      "Agentic AI learning path references for Oracle Integration including videos and LiveLabs.",
    keywords: ["agentic ai", "ai agent", "oracle integration ai", "oic ai"],
    resources: [
      {
        id: "kb-res-013",
        title: "Oracle Integration 3 Training",
        type: "docs",
        source: "Oracle Docs",
        difficulty: "Beginner",
        description:
          "Official Oracle Integration training hub with tutorials, AI agent labs, and videos.",
        link: "https://docs.oracle.com/en/cloud/paas/application-integration/training.html",
        category: "OIC Gen3",
        tags: ["Agentic AI", "Training", "OIC"],
        duration: "20 min",
        featured: { trending: true, beginnerPath: true, handsOnLab: false }
      },
      {
        id: "kb-res-014",
        title: "Get Started with Agentic AI in Oracle Integration",
        type: "labs",
        source: "Oracle LiveLabs",
        difficulty: "Intermediate",
        description:
          "Hands-on workshop for building and testing agentic AI use cases in Oracle Integration.",
        link: "https://livelabs.oracle.com/pls/apex/r/dbpm/livelabs/view-workshop?wid=4283",
        category: "Hands-on Labs",
        tags: ["Agentic AI", "OIC", "LiveLabs"],
        duration: "120 min",
        featured: { trending: true, beginnerPath: false, handsOnLab: true }
      },
      {
        id: "kb-res-015",
        title: "Elements of an Integration (Oracle Video)",
        type: "videos",
        source: "Oracle Training Video",
        difficulty: "Beginner",
        description:
          "Video lesson on Oracle Integration fundamentals that prepares you for advanced AI flows.",
        link: "https://apexapps.oracle.com/pls/apex/f?p=44785:112:0:::P112_CONTENT_ID:32880",
        category: "Oracle Video",
        tags: ["OIC", "Video", "Integration Basics"],
        duration: "10 min",
        featured: { trending: false, beginnerPath: true, handsOnLab: false }
      },
      {
        id: "kb-res-016",
        title: "Integration Patterns: A First Look (Oracle Video)",
        type: "videos",
        source: "Oracle Training Video",
        difficulty: "Beginner",
        description:
          "Pattern basics for selecting orchestration design before introducing AI agents.",
        link: "https://apexapps.oracle.com/pls/apex/f?p=44785:112:0:::P112_CONTENT_ID:28683",
        category: "Oracle Video",
        tags: ["Patterns", "OIC", "Video"],
        duration: "12 min",
        featured: { trending: false, beginnerPath: true, handsOnLab: false }
      }
    ]
  },
  {
    id: "topic-fusion-rest-integration",
    title: "Fusion Apps REST + OIC Integration",
    summary:
      "Focused resources for integrating Fusion Apps REST APIs using Oracle Integration, APEX, and related patterns.",
    keywords: ["fusion rest", "erp rest api", "oic fusion", "payload", "postman"],
    resources: [
      {
        id: "kb-res-017",
        title: "Faster Extension Development with Fusion Apps REST Catalog",
        type: "blogs",
        source: "Oracle Blogs",
        difficulty: "Intermediate",
        description:
          "APEX and Fusion REST catalog workflow for faster API discovery and extension development.",
        link: "https://blogs.oracle.com/apex/post/faster-extension-development-with-oracle-apex-and-fusion-apps-rest-catalog",
        category: "Fusion REST",
        tags: ["Fusion", "REST Catalog", "APEX"],
        duration: "15 min",
        featured: { trending: true, beginnerPath: false, handsOnLab: false }
      },
      {
        id: "kb-res-018",
        title: "Identity-Aware Integration with Oracle Fusion",
        type: "blogs",
        source: "Oracle Blogs",
        difficulty: "Advanced",
        description:
          "Security pattern for making Fusion REST API calls in end-user context.",
        link: "https://blogs.oracle.com/cloud-infrastructure/identity-aware-integration-with-oracle-fusion",
        category: "Fusion REST",
        tags: ["Fusion", "Security", "Identity"],
        duration: "18 min",
        featured: { trending: false, beginnerPath: false, handsOnLab: false }
      },
      {
        id: "kb-res-019",
        title: "Transition to /workers Resource for HCM REST APIs",
        type: "blogs",
        source: "Oracle Blogs",
        difficulty: "Intermediate",
        description:
          "Migration guidance for modern HCM workers REST resource usage.",
        link: "https://blogs.oracle.com/fusionhcmcoe/transitioning-to-the-workers-resource-from-emps-for-hcm-rest-apis",
        category: "Fusion REST",
        tags: ["HCM", "Workers API", "Migration"],
        duration: "12 min",
        featured: { trending: false, beginnerPath: false, handsOnLab: false }
      },
      {
        id: "kb-res-020",
        title: "Rest APIs for Oracle Fusion Cloud (Reference Video)",
        type: "videos",
        source: "YouTube",
        difficulty: "Beginner",
        description:
          "Introductory walkthrough of finding and testing Fusion REST APIs.",
        link: "https://www.youtube.com/watch?v=nG1gtQIJCdw",
        youtubeId: "nG1gtQIJCdw",
        category: "Fusion REST",
        tags: ["Fusion", "REST", "Postman"],
        duration: "20 min",
        featured: { trending: false, beginnerPath: true, handsOnLab: false }
      }
    ]
  }
];

const fusionApiPlaybooks = require("./fusionApiPlaybooks");

module.exports = {
  manualTopicCollections,
  fusionApiPlaybooks
};

