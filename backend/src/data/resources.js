const resources = [
  {
    id: "res-001",
    title: "OCI Getting Started Guide",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Beginner",
    description:
      "Official introduction to OCI core services, tenancy setup, and first cloud resources.",
    link: "https://docs.oracle.com/en-us/iaas/Content/home.htm",
    category: "OCI",
    tags: ["OCI", "Foundations", "Tenancy", "Cloud"],
    duration: "25 min",
    featured: {
      trending: true,
      beginnerPath: true,
      handsOnLab: false
    }
  },
  {
    id: "res-002",
    title: "Identity and Access Management Best Practices on OCI",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Intermediate",
    description:
      "Learn policy design patterns, compartment strategy, and least-privilege access controls.",
    link: "https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/overview.htm",
    category: "OCI",
    tags: ["IAM", "Security", "OCI", "Policies"],
    duration: "35 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-003",
    title: "Hands-on Lab: Launch Your First Compute Instance",
    type: "labs",
    source: "Oracle Learning Library",
    difficulty: "Beginner",
    description:
      "A practical lab that walks through network setup, VM provisioning, and SSH access.",
    link: "https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/home",
    category: "OCI",
    tags: ["Compute", "VCN", "SSH", "Hands-on"],
    duration: "45 min",
    featured: {
      trending: false,
      beginnerPath: true,
      handsOnLab: true
    }
  },
  {
    id: "res-004",
    title: "OCI Foundations Certification Prep Session",
    type: "videos",
    source: "YouTube",
    difficulty: "Beginner",
    description:
      "Overview of exam domains and practical tips for OCI Foundations certification.",
    link: "https://www.youtube.com/watch?v=9hF7l66tR9Q",
    youtubeId: "9hF7l66tR9Q",
    category: "OCI",
    tags: ["Certification", "OCI", "Foundations"],
    duration: "58 min",
    featured: {
      trending: true,
      beginnerPath: true,
      handsOnLab: false
    }
  },
  {
    id: "res-005",
    title: "Autonomous Database Quick Start",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Beginner",
    description:
      "Set up and connect to an Autonomous Database instance, including wallet download and tools.",
    link: "https://docs.oracle.com/en/cloud/paas/autonomous-database/",
    category: "Autonomous DB",
    tags: ["ADB", "Database", "Quickstart"],
    duration: "30 min",
    featured: {
      trending: true,
      beginnerPath: true,
      handsOnLab: false
    }
  },
  {
    id: "res-006",
    title: "Lab: Build an Oracle APEX App on Autonomous Database",
    type: "labs",
    source: "Oracle GitHub",
    difficulty: "Intermediate",
    description:
      "Create a low-code business application using Oracle APEX with Autonomous Database.",
    link: "https://github.com/oracle/learning-library/tree/master/data-management-library/autonomous-database",
    category: "Autonomous DB",
    tags: ["APEX", "ADB", "Low-code", "Hands-on"],
    duration: "70 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: true
    }
  },
  {
    id: "res-007",
    title: "Autonomous JSON Database Explained",
    type: "videos",
    source: "YouTube",
    difficulty: "Intermediate",
    description:
      "Explore JSON-native development patterns and API workflows in Oracle Autonomous JSON DB.",
    link: "https://www.youtube.com/watch?v=YxVJ4k3KQ5w",
    youtubeId: "YxVJ4k3KQ5w",
    category: "Autonomous DB",
    tags: ["JSON", "API", "Autonomous DB"],
    duration: "32 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-008",
    title: "Performance Tuning in Autonomous Database",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Advanced",
    description:
      "Deep dive into workload optimization, SQL monitoring, and automated indexing insights.",
    link: "https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/",
    category: "Autonomous DB",
    tags: ["Performance", "SQL", "Indexing", "ADB"],
    duration: "50 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-009",
    title: "OCI DevOps Service Overview",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Beginner",
    description:
      "Understand build pipelines, deployment pipelines, artifacts, and code repositories in OCI DevOps.",
    link: "https://docs.oracle.com/en-us/iaas/Content/devops/using/home.htm",
    category: "DevOps",
    tags: ["DevOps", "CI/CD", "OCI"],
    duration: "28 min",
    featured: {
      trending: false,
      beginnerPath: true,
      handsOnLab: false
    }
  },
  {
    id: "res-010",
    title: "End-to-End CI/CD with OCI DevOps",
    type: "videos",
    source: "YouTube",
    difficulty: "Intermediate",
    description:
      "Build and deploy a microservice using managed CI/CD pipelines and approvals in OCI.",
    link: "https://www.youtube.com/watch?v=qj0h2v4YQxM",
    youtubeId: "qj0h2v4YQxM",
    category: "DevOps",
    tags: ["CI/CD", "Pipelines", "Microservices", "DevOps"],
    duration: "40 min",
    featured: {
      trending: true,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-011",
    title: "Lab: Deploy Containerized Apps with OCI DevOps and OKE",
    type: "labs",
    source: "Oracle Learning Library",
    difficulty: "Advanced",
    description:
      "Hands-on project using OKE, container registry, and deployment stages with rollback checks.",
    link: "https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=873",
    category: "DevOps",
    tags: ["OKE", "Containers", "DevOps", "Hands-on"],
    duration: "90 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: true
    }
  },
  {
    id: "res-012",
    title: "Terraform Patterns for OCI Platform Teams",
    type: "docs",
    source: "GitHub",
    difficulty: "Intermediate",
    description:
      "Reusable infrastructure-as-code examples for networking, compute, and security baselines.",
    link: "https://github.com/oracle-terraform-modules",
    category: "DevOps",
    tags: ["Terraform", "IaC", "OCI", "Automation"],
    duration: "35 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-013",
    title: "OCI Streaming Service Fundamentals",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Beginner",
    description:
      "Concepts, partitions, retention, and producer-consumer architecture with OCI Streaming.",
    link: "https://docs.oracle.com/en-us/iaas/Content/Streaming/home.htm",
    category: "Streaming",
    tags: ["Streaming", "Events", "Architecture"],
    duration: "24 min",
    featured: {
      trending: true,
      beginnerPath: true,
      handsOnLab: false
    }
  },
  {
    id: "res-014",
    title: "Real-time Event Pipelines on OCI",
    type: "videos",
    source: "YouTube",
    difficulty: "Intermediate",
    description:
      "Learn design choices for high-throughput event ingestion, processing, and downstream consumers.",
    link: "https://www.youtube.com/watch?v=8o23fQ2qWtU",
    youtubeId: "8o23fQ2qWtU",
    category: "Streaming",
    tags: ["Streaming", "Event-driven", "Architecture"],
    duration: "36 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-015",
    title: "Lab: Kafka-Compatible Producers with OCI Streaming",
    type: "labs",
    source: "GitHub",
    difficulty: "Advanced",
    description:
      "Implement Java and Python producers using OCI Streaming's Kafka compatibility layer.",
    link: "https://github.com/oracle/oci-java-sdk/tree/master/bmc-examples/src/main/java/StreamingExample.java",
    category: "Streaming",
    tags: ["Kafka", "Streaming", "Java", "Python", "Hands-on"],
    duration: "75 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: true
    }
  },
  {
    id: "res-016",
    title: "Oracle Kubernetes Engine Quickstart",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Beginner",
    description:
      "Create your first OKE cluster, node pools, and deploy workloads in a managed environment.",
    link: "https://docs.oracle.com/en-us/iaas/Content/ContEng/Concepts/contengoverview.htm",
    category: "Kubernetes",
    tags: ["OKE", "Kubernetes", "Containers"],
    duration: "30 min",
    featured: {
      trending: false,
      beginnerPath: true,
      handsOnLab: false
    }
  },
  {
    id: "res-017",
    title: "Secure OKE Workloads with Vault and IAM",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Advanced",
    description:
      "Apply secure secret management, policy constraints, and workload identity for cluster apps.",
    link: "https://docs.oracle.com/en-us/iaas/Content/ContEng/Tasks/contengusingsecretswithconteng.htm",
    category: "Kubernetes",
    tags: ["OKE", "Security", "Vault", "IAM"],
    duration: "42 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-018",
    title: "Lab: Blue/Green Deployments on OKE",
    type: "labs",
    source: "Oracle GitHub",
    difficulty: "Intermediate",
    description:
      "Practice progressive delivery with Kubernetes services and traffic switching strategies.",
    link: "https://github.com/oracle-devrel/terraform-oci-oke",
    category: "Kubernetes",
    tags: ["OKE", "Blue/Green", "Hands-on", "DevOps"],
    duration: "65 min",
    featured: {
      trending: true,
      beginnerPath: false,
      handsOnLab: true
    }
  },
  {
    id: "res-019",
    title: "Kubernetes on OCI: Zero to Production",
    type: "videos",
    source: "YouTube",
    difficulty: "Intermediate",
    description:
      "A practical walkthrough from cluster setup to production readiness and observability.",
    link: "https://www.youtube.com/watch?v=0v7J5f6vBq8",
    youtubeId: "0v7J5f6vBq8",
    category: "Kubernetes",
    tags: ["Kubernetes", "OKE", "Production"],
    duration: "48 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-020",
    title: "OCI Logging and Monitoring Essentials",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Beginner",
    description:
      "Configure logs, metrics, and alarms to establish an operations-ready cloud environment.",
    link: "https://docs.oracle.com/en-us/iaas/Content/Logging/Concepts/loggingoverview.htm",
    category: "Operations",
    tags: ["Logging", "Monitoring", "Observability", "OCI"],
    duration: "27 min",
    featured: {
      trending: true,
      beginnerPath: true,
      handsOnLab: false
    }
  },
  {
    id: "res-021",
    title: "Lab: Build Dashboards with OCI Logging Analytics",
    type: "labs",
    source: "Oracle Learning Library",
    difficulty: "Intermediate",
    description:
      "Hands-on analysis of application logs and custom dashboards for operational insights.",
    link: "https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=678",
    category: "Operations",
    tags: ["Logging Analytics", "Dashboards", "Hands-on"],
    duration: "60 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: true
    }
  },
  {
    id: "res-022",
    title: "Oracle Integration Cloud Basics",
    type: "videos",
    source: "YouTube",
    difficulty: "Beginner",
    description:
      "Get started with visual integrations, adapters, and event-driven automation patterns.",
    link: "https://www.youtube.com/watch?v=cjY9oU8q8iQ",
    youtubeId: "cjY9oU8q8iQ",
    category: "Integration",
    tags: ["Integration Cloud", "Adapters", "Automation"],
    duration: "34 min",
    featured: {
      trending: false,
      beginnerPath: true,
      handsOnLab: false
    }
  },
  {
    id: "res-023",
    title: "Lab: Build Serverless APIs with API Gateway and Functions",
    type: "labs",
    source: "Oracle Docs",
    difficulty: "Intermediate",
    description:
      "Create and secure REST APIs using Oracle Functions behind API Gateway with policy controls.",
    link: "https://docs.oracle.com/en-us/iaas/Content/APIGateway/Concepts/apigatewayoverview.htm",
    category: "DevOps",
    tags: ["API Gateway", "Functions", "Serverless", "Hands-on"],
    duration: "80 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: true
    }
  },
  {
    id: "res-024",
    title: "Cloud Guard and Security Zones Deep Dive",
    type: "videos",
    source: "YouTube",
    difficulty: "Advanced",
    description:
      "Understand threat detection workflows, responder recipes, and secure cloud guardrails.",
    link: "https://www.youtube.com/watch?v=3u8Ivm5xGmY",
    youtubeId: "3u8Ivm5xGmY",
    category: "Security",
    tags: ["Cloud Guard", "Security Zones", "Governance"],
    duration: "44 min",
    featured: {
      trending: true,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-025",
    title: "Oracle GoldenGate for Real-time Data Replication",
    type: "docs",
    source: "Oracle Docs",
    difficulty: "Intermediate",
    description:
      "Learn replication architecture and setup patterns for low-latency data movement.",
    link: "https://docs.oracle.com/en/middleware/goldengate/core/",
    category: "Streaming",
    tags: ["GoldenGate", "Replication", "Streaming"],
    duration: "33 min",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: false
    }
  },
  {
    id: "res-026",
    title: "Lab: Data Science Notebook on OCI Data Science",
    type: "labs",
    source: "Oracle Learning Library",
    difficulty: "Beginner",
    description:
      "Launch a notebook session, train a model, and track artifacts in OCI Data Science.",
    link: "https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=824",
    category: "AI/ML",
    tags: ["Data Science", "Notebook", "ML", "Hands-on"],
    duration: "55 min",
    featured: {
      trending: true,
      beginnerPath: true,
      handsOnLab: true
    }
  }
];

module.exports = resources;
