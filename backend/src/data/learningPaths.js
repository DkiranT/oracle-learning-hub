const learningPaths = [
  {
    id: "path-oci-beginner-architect",
    title: "OCI Beginner to Architect",
    level: "Beginner to Advanced",
    description:
      "A structured path to move from OCI fundamentals to architecture and security design decisions.",
    estimatedDuration: "5-7 weeks",
    tags: ["OCI", "Architecture", "Certification"],
    steps: [
      {
        step: 1,
        title: "Start with OCI core concepts",
        resourceId: "res-001"
      },
      {
        step: 2,
        title: "Practice first cloud deployment",
        resourceId: "res-003"
      },
      {
        step: 3,
        title: "Learn IAM policy design",
        resourceId: "res-002"
      },
      {
        step: 4,
        title: "Build observability basics",
        resourceId: "res-020"
      },
      {
        step: 5,
        title: "Deepen cloud governance and security",
        resourceId: "res-024"
      }
    ]
  },
  {
    id: "path-streaming-deep-dive",
    title: "Streaming Deep Dive",
    level: "Intermediate to Advanced",
    description:
      "Master event-driven architecture and streaming data pipelines on Oracle Cloud.",
    estimatedDuration: "3-4 weeks",
    tags: ["Streaming", "Kafka", "Architecture"],
    steps: [
      {
        step: 1,
        title: "Understand OCI Streaming fundamentals",
        resourceId: "res-013"
      },
      {
        step: 2,
        title: "Design event pipelines",
        resourceId: "res-014"
      },
      {
        step: 3,
        title: "Implement Kafka-compatible producers",
        resourceId: "res-015"
      },
      {
        step: 4,
        title: "Add enterprise data replication",
        resourceId: "res-025"
      }
    ]
  },
  {
    id: "path-autonomous-db-builder",
    title: "Autonomous DB Builder Path",
    level: "Beginner to Intermediate",
    description:
      "Build practical Oracle database development skills with Autonomous Database and APEX.",
    estimatedDuration: "4-5 weeks",
    tags: ["Autonomous DB", "APEX", "Developer"],
    steps: [
      {
        step: 1,
        title: "Set up Autonomous Database",
        resourceId: "res-005"
      },
      {
        step: 2,
        title: "Build your first APEX app",
        resourceId: "res-006"
      },
      {
        step: 3,
        title: "Explore JSON-native patterns",
        resourceId: "res-007"
      },
      {
        step: 4,
        title: "Optimize performance",
        resourceId: "res-008"
      }
    ]
  }
];

module.exports = learningPaths;
