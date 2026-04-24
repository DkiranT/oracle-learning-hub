const headerPresets = {
  authOnly: ["Authorization: Basic <base64 or OAuth token>"],
  authJson: [
    "Authorization: Basic <base64 or OAuth token>",
    "Content-Type: application/json"
  ],
  authJsonFramework: [
    "Authorization: Basic <base64 or OAuth token>",
    "Content-Type: application/json",
    "REST-Framework-Version: 4"
  ]
};

const fusionApiPlaybooks = [
  {
    id: "api-erp-ap-invoices-create",
    suite: "ERP",
    module: "AP",
    operation: "Create AP Invoice",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/invoices",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-invoices.html",
    description: "Create a payables invoice header in Oracle Financials.",
    difficulty: "Intermediate",
    tags: ["ERP", "AP", "Invoices"],
    requiredHeaders: headerPresets.authJsonFramework,
    sampleRequest: {
      BusinessUnit: "Vision Operations",
      Supplier: "ABC SUPPLIER",
      InvoiceNumber: "APINV-2026-00412",
      InvoiceAmount: 1250.75
    },
    sampleResponse: {
      InvoiceId: 300100987654321,
      InvoiceNumber: "APINV-2026-00412",
      ApprovalStatus: "Initiated"
    },
    tips: [
      "Use supplier names exactly as configured in Fusion.",
      "For lines and distributions, call invoice child resources."
    ]
  },
  {
    id: "api-erp-ap-invoices-get",
    suite: "ERP",
    module: "AP",
    operation: "Get AP Invoices",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/invoices",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-invoices.html",
    description: "Retrieve payables invoices for reconciliation and tracking.",
    difficulty: "Beginner",
    tags: ["ERP", "AP", "Read API"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=InvoiceNumber=APINV-2026-00412&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ InvoiceNumber: "APINV-2026-00412", ApprovalStatus: "Validated" }]
    },
    tips: [
      "Use q filters for invoice number and supplier.",
      "Avoid wide pulls without pagination."
    ]
  },
  {
    id: "api-erp-ar-standard-receipts-create",
    suite: "ERP",
    module: "AR",
    operation: "Create Standard Receipt",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/standardReceipts",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25c/farfa/api-standard-receipts.html",
    description: "Create AR receipts for customer payment capture.",
    difficulty: "Intermediate",
    tags: ["ERP", "AR", "Receipts"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      BusinessUnit: "Vision Operations",
      ReceiptNumber: "RCPT-2026-00691",
      Amount: 990,
      CustomerNumber: "1006"
    },
    sampleResponse: {
      StandardReceiptId: 300100998112233,
      ReceiptNumber: "RCPT-2026-00691",
      Status: "Unapplied"
    },
    tips: [
      "Validate receipt methods in setup first.",
      "Use child APIs to apply receipts against invoices."
    ]
  },
  {
    id: "api-erp-gl-journal-batches-get",
    suite: "ERP",
    module: "GL",
    operation: "Get Journal Batches",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/journalBatches",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/24b/farfa/api-journal-batches.html",
    description: "Fetch journal batches for posting and audit checks.",
    difficulty: "Beginner",
    tags: ["ERP", "GL", "Journal"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=LedgerName=Vision%20Operations&limit=25"
    },
    sampleResponse: {
      count: 1,
      items: [{ Name: "APR-ADJ-001", Status: "Unposted" }]
    },
    tips: [
      "Query by ledger and period for better performance.",
      "Use journal header child resources for lines."
    ]
  },
  {
    id: "api-erp-fixed-assets-get",
    suite: "ERP",
    module: "Fixed Assets",
    operation: "Get Fixed Assets",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/assets",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25c/farfa/api-assets.html",
    description: "Read fixed asset records for finance integrations.",
    difficulty: "Intermediate",
    tags: ["ERP", "Fixed Assets"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=AssetNumber=FA-100112&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ AssetNumber: "FA-100112", Book: "CORP" }]
    },
    tips: [
      "Use incremental loads by updated date.",
      "Keep technical IDs for downstream reconciliation."
    ]
  },
  {
    id: "api-erp-cash-management-get-bank-statements",
    suite: "ERP",
    module: "Cash Management",
    operation: "Get Bank Statements",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/bankStatements",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-bank-statements.html",
    description: "Retrieve bank statement headers for reconciliation flows.",
    difficulty: "Intermediate",
    tags: ["ERP", "Cash Management", "Bank Statements"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=StatementNumber=BNK-APR-1008&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ StatementNumber: "BNK-APR-1008", Status: "Ready for Reconciliation" }]
    },
    tips: [
      "Use account + statement filters for accuracy.",
      "Fetch statement lines only when needed."
    ]
  },
  {
    id: "api-erp-tax-rates-get",
    suite: "ERP",
    module: "Tax",
    operation: "Get Tax Rates",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/taxRates",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-tax-rates.html",
    description: "Read tax rate setup used in AR/AP transactions.",
    difficulty: "Beginner",
    tags: ["ERP", "Tax"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=Tax=US_SALES_TAX&limit=30"
    },
    sampleResponse: {
      count: 1,
      items: [{ TaxRateCode: "US-CA-STATE-7.25", PercentageRate: 7.25 }]
    },
    tips: [
      "Sync tax references before posting transactions.",
      "Treat tax mappings as master data."
    ]
  },
  {
    id: "api-procurement-purchase-orders-create",
    suite: "Procurement",
    module: "Purchase Orders",
    operation: "Create Purchase Order",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/purchaseOrders",
    docLink: "https://docs.oracle.com/en/cloud/saas/procurement/26a/fapra/api-purchase-orders.html",
    description: "Create procurement purchase orders.",
    difficulty: "Advanced",
    tags: ["Procurement", "PO"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      ProcurementBU: "Vision Operations",
      Supplier: "ABC SUPPLIER",
      CurrencyCode: "USD",
      lines: [{ LineNumber: 1, Description: "Laptop Purchase", Quantity: 10, UnitPrice: 1150 }]
    },
    sampleResponse: {
      OrderNumber: "1001426",
      DocumentStatus: "Open"
    },
    tips: [
      "Validate supplier and BU mappings first.",
      "Use source reference IDs for retry-safe calls."
    ]
  },
  {
    id: "api-procurement-requisitions-create",
    suite: "Procurement",
    module: "Requisitions",
    operation: "Create Requisition",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/requisitions",
    docLink: "https://docs.oracle.com/en/cloud/saas/procurement/25d/fapra/api-requisitions.html",
    description: "Create requisitions for approval-driven procurement.",
    difficulty: "Intermediate",
    tags: ["Procurement", "Requisitions"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      RequisitioningBU: "Vision Operations",
      Description: "Q2 hardware request",
      lines: [{ LineNumber: 1, ItemDescription: "Developer Workstation", Quantity: 4 }]
    },
    sampleResponse: {
      RequisitionNumber: "REQ-100992",
      ApprovalStatus: "In Process"
    },
    tips: [
      "Confirm requester and category values are valid.",
      "Track approval status via callbacks."
    ]
  },
  {
    id: "api-procurement-suppliers-create",
    suite: "Procurement",
    module: "Suppliers",
    operation: "Create Supplier",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/suppliers",
    docLink: "https://docs.oracle.com/en/cloud/saas/procurement/24c/fapra/api-suppliers.html",
    description: "Create supplier master records for source-to-pay.",
    difficulty: "Intermediate",
    tags: ["Procurement", "Suppliers"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      Supplier: "ACME TECHNOLOGIES LLC",
      SupplierNumber: "SUP-ACME-2041",
      TaxOrganizationType: "Corporation"
    },
    sampleResponse: {
      SupplierId: 300100321654987,
      Status: "Active"
    },
    tips: [
      "Run duplicate checks before create.",
      "Create supplier sites as next step."
    ]
  },
  {
    id: "api-procurement-agreements-get",
    suite: "Procurement",
    module: "Agreements",
    operation: "Get Purchasing Agreements",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/purchasingAgreements",
    docLink: "https://docs.oracle.com/en/cloud/saas/procurement/25d/fapra/api-purchasing-agreements.html",
    description: "Read blanket/contract purchasing agreements.",
    difficulty: "Intermediate",
    tags: ["Procurement", "Agreements"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=AgreementNumber=AG-10021&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ AgreementNumber: "AG-10021", Status: "Active" }]
    },
    tips: [
      "Filter active agreements for operational sync.",
      "Expand lines only when price data is required."
    ]
  },
  {
    id: "api-procurement-receiving-create-receipt",
    suite: "Procurement",
    module: "Receiving",
    operation: "Create Receipt",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/receivingReceiptRequests",
    docLink: "https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/25d/fasrp/api-receiving-receipt-requests.html",
    description: "Create PO receipts for goods receiving automation.",
    difficulty: "Advanced",
    tags: ["Procurement", "Receiving"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      ShipmentNumber: "RCV-100331",
      lines: [{ PurchaseOrderNumber: "1001426", POLineNumber: 1, Quantity: 10 }]
    },
    sampleResponse: {
      ReceiptRequestHeaderId: 300100772006719,
      Status: "Submitted"
    },
    tips: [
      "Validate PO and line references before POST.",
      "Handle async receipt status updates."
    ]
  },
  {
    id: "api-hcm-workers-create",
    suite: "HCM",
    module: "Workers",
    operation: "Create Worker",
    method: "POST",
    endpoint: "/hcmRestApi/resources/11.13.18.05/workers",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-workers.html",
    description: "Create worker records for HR onboarding integrations.",
    difficulty: "Advanced",
    tags: ["HCM", "Workers", "Onboarding"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      PersonNumber: "E10427",
      names: [{ FirstName: "Ava", LastName: "Sharma", LegislationCode: "US" }],
      workRelationships: [{ LegalEmployerName: "Vision Corporation", WorkerType: "E" }]
    },
    sampleResponse: {
      workersUniqID: "300100789451223",
      PersonNumber: "E10427",
      Status: "Active"
    },
    tips: [
      "Use proper legislation and legal employer mappings.",
      "Keep integration retries idempotent."
    ]
  },
  {
    id: "api-hcm-workers-get",
    suite: "HCM",
    module: "Workers",
    operation: "Get Workers",
    method: "GET",
    endpoint: "/hcmRestApi/resources/11.13.18.05/workers",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-workers.html",
    description: "Retrieve workers for identity and HR data sync.",
    difficulty: "Beginner",
    tags: ["HCM", "Workers", "Read API"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=PersonNumber=E10427&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ PersonNumber: "E10427", DisplayName: "Ava Sharma", AssignmentStatusType: "ACTIVE" }]
    },
    tips: [
      "Use incremental filters whenever possible.",
      "Avoid full data scans in large tenants."
    ]
  },
  {
    id: "api-hcm-jobs-get",
    suite: "HCM",
    module: "Jobs",
    operation: "Get Jobs",
    method: "GET",
    endpoint: "/hcmRestApi/resources/11.13.18.05/jobs",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-jobs.html",
    description: "Read job definitions for assignment validations.",
    difficulty: "Beginner",
    tags: ["HCM", "Jobs"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=JobCode=DEV3&limit=30"
    },
    sampleResponse: {
      count: 1,
      items: [{ JobCode: "DEV3", Name: "Senior Developer" }]
    },
    tips: [
      "Sync jobs before worker assignment calls.",
      "Use effective-date aware integrations."
    ]
  },
  {
    id: "api-hcm-departments-create",
    suite: "HCM",
    module: "Departments",
    operation: "Create Department",
    method: "POST",
    endpoint: "/hcmRestApi/resources/11.13.18.05/departments",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-departments.html",
    description: "Create departments for org hierarchy management.",
    difficulty: "Intermediate",
    tags: ["HCM", "Departments"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      Name: "Cloud Platform Engineering",
      DepartmentSet: "Vision Department Set",
      EffectiveStartDate: "2026-04-24"
    },
    sampleResponse: {
      DepartmentId: 300100770890661,
      Status: "A"
    },
    tips: [
      "Department set must match enterprise setup.",
      "Add manager details with follow-up updates."
    ]
  },
  {
    id: "api-hcm-locations-get",
    suite: "HCM",
    module: "Locations",
    operation: "Get Locations",
    method: "GET",
    endpoint: "/hcmRestApi/resources/11.13.18.05/locations",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-locations.html",
    description: "Retrieve location master records for HCM flows.",
    difficulty: "Beginner",
    tags: ["HCM", "Locations"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=LocationCode=BLR-HQ&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ LocationCode: "BLR-HQ", LocationName: "Bangalore Headquarters" }]
    },
    tips: [
      "Keep location code mappings environment-safe.",
      "Use location IDs for stable references."
    ]
  },
  {
    id: "api-hcm-absences-create",
    suite: "HCM",
    module: "Absences",
    operation: "Create Absence",
    method: "POST",
    endpoint: "/hcmRestApi/resources/11.13.18.05/absences",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-absences.html",
    description: "Create worker leave transactions.",
    difficulty: "Intermediate",
    tags: ["HCM", "Absences"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      PersonNumber: "E10427",
      AbsenceType: "Sick Leave",
      StartDate: "2026-05-08",
      EndDate: "2026-05-09"
    },
    sampleResponse: {
      AbsenceEntryId: 300100771991452,
      ApprovalStatus: "Pending"
    },
    tips: [
      "Validate absence type against employee plan.",
      "Plan for approval-state polling or events."
    ]
  },
  {
    id: "api-scm-items-create",
    suite: "SCM",
    module: "Items",
    operation: "Create Item",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/itemsV2",
    docLink: "https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/25d/fasrp/api-itemsv2.html",
    description: "Create item masters in Product Information Management.",
    difficulty: "Advanced",
    tags: ["SCM", "Items"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      OrganizationCode: "V1",
      ItemNumber: "CLOUD-LAP-15",
      Description: "Cloud Certified Laptop 15-inch",
      PrimaryUOMValue: "Each"
    },
    sampleResponse: {
      InventoryItemId: 300100881774901,
      ItemStatusValue: "Active"
    },
    tips: [
      "Validate item class and org context first.",
      "Use stable item numbers for idempotency."
    ]
  },
  {
    id: "api-scm-inventory-get-onhand",
    suite: "SCM",
    module: "Inventory",
    operation: "Get On-hand Balances",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/inventoryOnhandBalances",
    docLink: "https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/25d/fasrp/api-inventory-onhand-balances.html",
    description: "Read on-hand quantities for planning and fulfillment.",
    difficulty: "Intermediate",
    tags: ["SCM", "Inventory"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=ItemNumber=CLOUD-LAP-15;OrganizationCode=V1&limit=30"
    },
    sampleResponse: {
      count: 1,
      items: [{ ItemNumber: "CLOUD-LAP-15", OrganizationCode: "V1", QuantityOnHand: 42 }]
    },
    tips: [
      "Use org+item filters to avoid large responses.",
      "Include snapshot timestamp in downstream records."
    ]
  },
  {
    id: "api-scm-shipping-get-shipment-lines",
    suite: "SCM",
    module: "Shipping",
    operation: "Get Shipment Lines",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/shipmentLines",
    docLink: "https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/25d/fasrp/api-shipment-lines.html",
    description: "Track shipment lines for logistics integrations.",
    difficulty: "Intermediate",
    tags: ["SCM", "Shipping"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=ShipmentNumber=SHIP-23088&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ ShipmentNumber: "SHIP-23088", ItemNumber: "CLOUD-LAP-15", ShipmentStatus: "Shipped" }]
    },
    tips: [
      "Combine with order references for traceability.",
      "Use status filter for event-based notifications."
    ]
  },
  {
    id: "api-scm-order-management-create-sales-order",
    suite: "SCM",
    module: "Order Management",
    operation: "Create Sales Order",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/salesOrdersForOrderHubRequests",
    docLink: "https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/25d/fasrp/api-sales-orders-for-order-hub-requests.html",
    description: "Create sales orders from commerce channels.",
    difficulty: "Advanced",
    tags: ["SCM", "Order Management", "Sales Orders"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      SourceTransactionSystem: "B2B_PORTAL",
      SourceTransactionNumber: "WEB-ORD-100251",
      lines: [{ SourceTransactionLineNumber: 1, ProductNumber: "CLOUD-LAP-15", OrderedQuantity: 3 }]
    },
    sampleResponse: {
      OrderNumber: "670021",
      RequestStatus: "Accepted"
    },
    tips: [
      "Keep source transaction IDs unique.",
      "Validate customer and ship-to mappings."
    ]
  },
  {
    id: "api-cx-leads-create",
    suite: "CX",
    module: "Leads",
    operation: "Create Sales Lead",
    method: "POST",
    endpoint: "/crmRestApi/resources/11.13.18.05/leads",
    docLink: "https://docs.oracle.com/en/cloud/saas/sales/faaps/api-sales-leads.html",
    description: "Create leads from campaigns and web forms.",
    difficulty: "Intermediate",
    tags: ["CX", "Leads"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      LeadName: "Cloud ERP Expansion - North Region",
      LeadNumber: "LEAD-8901",
      CompanyName: "Northwind Manufacturing"
    },
    sampleResponse: {
      leadsUniqID: "300100781909911",
      StatusCode: "QUALIFIED"
    },
    tips: [
      "Capture source channel for analytics.",
      "Use lead actions for conversion workflows."
    ]
  },
  {
    id: "api-cx-accounts-create",
    suite: "CX",
    module: "Accounts",
    operation: "Create Account",
    method: "POST",
    endpoint: "/crmRestApi/resources/11.13.18.05/accounts",
    docLink: "https://docs.oracle.com/en/cloud/saas/sales/faaps/api-accounts.html",
    description: "Create account master records in Fusion CX.",
    difficulty: "Intermediate",
    tags: ["CX", "Accounts"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      OrganizationName: "Northwind Manufacturing",
      AccountNumber: "ACC-7811",
      Country: "US"
    },
    sampleResponse: {
      PartyId: 300100890554201,
      Status: "Active"
    },
    tips: [
      "Perform dedupe checks before account creation.",
      "Standardize names and addresses upstream."
    ]
  },
  {
    id: "api-cx-contacts-create",
    suite: "CX",
    module: "Contacts",
    operation: "Create Contact",
    method: "POST",
    endpoint: "/crmRestApi/resources/11.13.18.05/contacts",
    docLink: "https://docs.oracle.com/en/cloud/saas/sales/faaps/api-contacts.html",
    description: "Create contacts linked to CX accounts.",
    difficulty: "Intermediate",
    tags: ["CX", "Contacts"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      FirstName: "Rohan",
      LastName: "Mehta",
      EmailAddress: "rohan.mehta@northwind.example",
      AccountNumber: "ACC-7811"
    },
    sampleResponse: {
      PartyId: 300100890554612,
      FullName: "Rohan Mehta"
    },
    tips: [
      "Validate account link before create.",
      "Normalize email and phone formats."
    ]
  },
  {
    id: "api-cx-opportunities-create",
    suite: "CX",
    module: "Opportunities",
    operation: "Create Opportunity",
    method: "POST",
    endpoint: "/crmRestApi/resources/11.13.18.05/opportunities",
    docLink: "https://docs.oracle.com/en/cloud/saas/sales/faaps/api-opportunities.html",
    description: "Create opportunities for pipeline and forecast integration.",
    difficulty: "Advanced",
    tags: ["CX", "Opportunities"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      Name: "Northwind ERP Modernization",
      Revenue: 420000,
      CloseDate: "2026-07-31",
      AccountNumber: "ACC-7811"
    },
    sampleResponse: {
      OptyNumber: "OPTY-20089",
      SalesStage: "Qualification"
    },
    tips: [
      "Map stage codes based on your environment setup.",
      "Push updates to analytics/forecast tools."
    ]
  },
  {
    id: "api-projects-projects-create",
    suite: "Projects",
    module: "Projects",
    operation: "Create Project",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/projects",
    docLink: "https://docs.oracle.com/en/cloud/saas/project-management/25d/fapra/api-projects.html",
    description: "Create project headers in Fusion Projects.",
    difficulty: "Advanced",
    tags: ["Projects", "Project Financial Management"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      ProjectNumber: "PRJ-2026-1108",
      ProjectName: "Global ERP Rollout",
      ProjectType: "Billable"
    },
    sampleResponse: {
      ProjectId: 300100799410221,
      ProjectStatus: "Approved"
    },
    tips: [
      "Project type controls defaults and validations.",
      "Store source-system references for traceability."
    ]
  },
  {
    id: "api-projects-tasks-create",
    suite: "Projects",
    module: "Tasks",
    operation: "Create Project Task",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/projectTasks",
    docLink: "https://docs.oracle.com/en/cloud/saas/project-management/25d/fapra/api-project-tasks.html",
    description: "Create tasks under project structures.",
    difficulty: "Intermediate",
    tags: ["Projects", "Tasks"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      ProjectNumber: "PRJ-2026-1108",
      TaskNumber: "1.10",
      TaskName: "Data Migration"
    },
    sampleResponse: {
      ProjectTaskId: 300100799993114,
      TaskNumber: "1.10"
    },
    tips: [
      "Ensure project exists and is open for updates.",
      "Use a deterministic task numbering convention."
    ]
  },
  {
    id: "api-projects-costs-create-expenditure",
    suite: "Projects",
    module: "Costs",
    operation: "Create Expenditure Item",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/projectCosts",
    docLink: "https://docs.oracle.com/en/cloud/saas/project-management/25d/fapra/api-project-costs.html",
    description: "Create project cost transactions from feeder systems.",
    difficulty: "Advanced",
    tags: ["Projects", "Costs"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      ProjectNumber: "PRJ-2026-1108",
      TaskNumber: "1.10",
      ExpenditureType: "Consulting Labor",
      RawCostInProjectCurrency: 960
    },
    sampleResponse: {
      ExpenditureItemId: 300100803119220,
      ProcessingStatus: "Accepted"
    },
    tips: [
      "Validate expenditure type and org mappings first.",
      "Batch by source/date for easier reconciliation."
    ]
  },
  {
    id: "api-projects-budgets-get",
    suite: "Projects",
    module: "Budgets",
    operation: "Get Project Budgets",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/projectBudgets",
    docLink: "https://docs.oracle.com/en/cloud/saas/project-management/25d/fapra/api-project-budgets.html",
    description: "Read project budget versions for variance reporting.",
    difficulty: "Intermediate",
    tags: ["Projects", "Budgets"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=ProjectNumber=PRJ-2026-1108&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ ProjectNumber: "PRJ-2026-1108", BudgetAmount: 850000, Status: "Baseline" }]
    },
    tips: [
      "Filter by approved baseline versions.",
      "Use snapshots for BI and governance reports."
    ]
  }
];

module.exports = fusionApiPlaybooks;
