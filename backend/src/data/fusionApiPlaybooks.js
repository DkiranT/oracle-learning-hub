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
    id: "api-erp-ap-payments-create",
    suite: "ERP",
    module: "AP",
    operation: "Create AP Payment",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/payments",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-payments.html",
    description: "Create supplier payment transactions in Payables.",
    difficulty: "Advanced",
    tags: ["ERP", "AP", "Payments"],
    requiredHeaders: headerPresets.authJsonFramework,
    sampleRequest: {
      BusinessUnit: "Vision Operations",
      Supplier: "ABC SUPPLIER",
      PaymentNumber: "PAY-2026-1011",
      PaymentAmount: 1250.75
    },
    sampleResponse: {
      PaymentId: 300100777001236,
      PaymentNumber: "PAY-2026-1011",
      PaymentStatus: "Issued"
    },
    tips: [
      "Validate payment process profile and bank setup first.",
      "Keep upstream invoice references for reconciliation."
    ]
  },
  {
    id: "api-erp-ap-payments-get",
    suite: "ERP",
    module: "AP",
    operation: "Get AP Payments",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/payments",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-payments.html",
    description: "Retrieve supplier payment records for payment status and reconciliation.",
    difficulty: "Beginner",
    tags: ["ERP", "AP", "Payments", "Read API"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=PaymentNumber=PAY-2026-1011&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ PaymentNumber: "PAY-2026-1011", PaymentAmount: 1250.75, PaymentStatus: "Issued" }]
    },
    tips: [
      "Filter by payment number, supplier, or payment date for faster lookup.",
      "Use this before triggering downstream bank reconciliation."
    ]
  },
  {
    id: "api-erp-ap-invoice-installments-get",
    suite: "ERP",
    module: "AP",
    operation: "Get AP Invoice Installments",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/invoices/{InvoiceId}/child/installments",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-invoices.html",
    description: "Read invoice installment schedules for due-date and cash-planning flows.",
    difficulty: "Intermediate",
    tags: ["ERP", "AP", "Invoices", "Installments"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { InvoiceId: "300100987654321" },
      queryExample: "?limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ InstallmentNumber: 1, DueDate: "2026-05-15", AmountRemaining: 1250.75 }]
    },
    tips: [
      "Use installment data when payment timing matters.",
      "Fetch header first, then drill into child resources."
    ]
  },
  {
    id: "api-erp-ar-transactions-get",
    suite: "ERP",
    module: "AR",
    operation: "Get Receivables Transactions",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/receivablesTransactions",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-receivables-transactions.html",
    description: "Read AR transaction headers for billing and collections integrations.",
    difficulty: "Intermediate",
    tags: ["ERP", "AR", "Transactions"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=TransactionNumber=INV-100892&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ TransactionNumber: "INV-100892", TransactionAmount: 4200, TransactionStatus: "Complete" }]
    },
    tips: [
      "Use transaction number and date filters for targeted sync.",
      "Fetch child lines only when finance detail is required."
    ]
  },
  {
    id: "api-erp-ar-transactions-create",
    suite: "ERP",
    module: "AR",
    operation: "Create Receivables Transaction",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/receivablesTransactions",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-receivables-transactions.html",
    description: "Create receivables transaction headers for invoice integration scenarios.",
    difficulty: "Advanced",
    tags: ["ERP", "AR", "Transactions", "Invoices"],
    requiredHeaders: headerPresets.authJsonFramework,
    sampleRequest: {
      BusinessUnit: "Vision Operations",
      TransactionNumber: "INV-2026-77891",
      TransactionDate: "2026-04-29",
      BillToCustomerNumber: "1006"
    },
    sampleResponse: {
      CustomerTransactionId: 300100887771203,
      TransactionNumber: "INV-2026-77891",
      TransactionStatus: "Complete"
    },
    tips: [
      "Validate customer account, transaction type, and business unit before POST.",
      "Add child transaction lines when itemized billing is required."
    ]
  },
  {
    id: "api-erp-ar-standard-receipts-get",
    suite: "ERP",
    module: "AR",
    operation: "Get Standard Receipts",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/standardReceipts",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25c/farfa/api-standard-receipts.html",
    description: "Retrieve AR receipts for customer payment and cash application status.",
    difficulty: "Beginner",
    tags: ["ERP", "AR", "Receipts", "Read API"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=ReceiptNumber=RCPT-2026-00691&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ ReceiptNumber: "RCPT-2026-00691", Amount: 990, Status: "Unapplied" }]
    },
    tips: [
      "Use receipt status to drive collections and reconciliation workflows.",
      "Apply receipt to transactions only after customer and amount validation."
    ]
  },
  {
    id: "api-erp-customers-get",
    suite: "ERP",
    module: "Customers",
    operation: "Get Customers",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/customers",
    docLink: "https://docs.oracle.com/en/cloud/saas/sales/faaps/api-customers.html",
    description: "Retrieve customer master records used in Receivables flows.",
    difficulty: "Beginner",
    tags: ["ERP", "Customers", "Master Data"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=OrganizationName=Northwind%20Manufacturing&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ OrganizationName: "Northwind Manufacturing", CustomerNumber: "1006", Status: "Active" }]
    },
    tips: [
      "Treat customer sync as foundational master-data integration.",
      "Use stable customer IDs in downstream AR transactions."
    ]
  },
  {
    id: "api-erp-gl-journals-create",
    suite: "ERP",
    module: "GL",
    operation: "Create Journal",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/journals",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-journals.html",
    description: "Create GL journals for accounting event integrations.",
    difficulty: "Advanced",
    tags: ["ERP", "GL", "Journals"],
    requiredHeaders: headerPresets.authJsonFramework,
    sampleRequest: {
      LedgerName: "Vision Operations",
      JournalName: "INTF-APR-ADJ-11",
      AccountingDate: "2026-04-27",
      JournalLines: [{ LineNumber: 1, AccountCombination: "01-000-2210-0000", EnteredDrAmount: 500 }]
    },
    sampleResponse: {
      JournalId: 300100700220981,
      JournalName: "INTF-APR-ADJ-11",
      Status: "Unposted"
    },
    tips: [
      "Validate account combinations and period status before post.",
      "Use source/batch identifiers for audit traceability."
    ]
  },
  {
    id: "api-erp-gl-journals-get",
    suite: "ERP",
    module: "GL",
    operation: "Get Journals",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/journals",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-journals.html",
    description: "Retrieve journals for accounting validation, reconciliation, and audit.",
    difficulty: "Beginner",
    tags: ["ERP", "GL", "Journals", "Read API"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=JournalName=INTF-APR-ADJ-11&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ JournalName: "INTF-APR-ADJ-11", LedgerName: "Vision Operations", Status: "Unposted" }]
    },
    tips: [
      "Use journal name, ledger, period, and source filters.",
      "Avoid wide journal extracts without pagination."
    ]
  },
  {
    id: "api-erp-gl-journal-lines-get",
    suite: "ERP",
    module: "GL",
    operation: "Get Journal Lines",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/journals/{JournalId}/child/journalLines",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-journals.html",
    description: "Retrieve journal line details for accounting analysis and downstream reporting.",
    difficulty: "Intermediate",
    tags: ["ERP", "GL", "Journals", "Lines"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { JournalId: "300100700220981" },
      queryExample: "?limit=100"
    },
    sampleResponse: {
      count: 2,
      items: [
        { LineNumber: 1, AccountCombination: "01-000-2210-0000", EnteredDrAmount: 500 },
        { LineNumber: 2, AccountCombination: "01-000-1100-0000", EnteredCrAmount: 500 }
      ]
    },
    tips: [
      "Fetch lines only after narrowing journal headers.",
      "Keep account combinations intact for reconciliation."
    ]
  },
  {
    id: "api-erp-gl-period-statuses-get",
    suite: "ERP",
    module: "GL",
    operation: "Get Period Statuses",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/accountingPeriods",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-accounting-periods.html",
    description: "Read accounting period statuses to control posting windows.",
    difficulty: "Intermediate",
    tags: ["ERP", "GL", "Periods"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=LedgerName=Vision%20Operations;PeriodName=APR-26&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ PeriodName: "APR-26", ClosingStatus: "Open", LedgerName: "Vision Operations" }]
    },
    tips: [
      "Check period status before creating journals.",
      "Use this API as a gate in posting orchestration flows."
    ]
  },
  {
    id: "api-erp-fixed-assets-create",
    suite: "ERP",
    module: "Fixed Assets",
    operation: "Create Asset",
    method: "POST",
    endpoint: "/fscmRestApi/resources/11.13.18.05/assets",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25c/farfa/api-assets.html",
    description: "Create asset records for capitalization integrations.",
    difficulty: "Advanced",
    tags: ["ERP", "Fixed Assets", "Capitalization"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      AssetNumber: "FA-2026-00091",
      Book: "CORP",
      AssetType: "CAPITALIZED",
      Description: "Cloud Security Appliance"
    },
    sampleResponse: {
      AssetId: 300100881001228,
      AssetNumber: "FA-2026-00091",
      Status: "Active"
    },
    tips: [
      "Depreciation book and category mappings must be valid.",
      "Capture source references for audit and rollback flows."
    ]
  },
  {
    id: "api-erp-cash-management-bank-accounts-get",
    suite: "ERP",
    module: "Cash Management",
    operation: "Get Bank Accounts",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/bankAccounts",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-bank-accounts.html",
    description: "Retrieve bank account setup for payment and reconciliation interfaces.",
    difficulty: "Intermediate",
    tags: ["ERP", "Cash Management", "Bank Accounts"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=BankAccountName=Vision%20Operating%20Account&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ BankAccountName: "Vision Operating Account", CurrencyCode: "USD", AccountType: "PAYMENT" }]
    },
    tips: [
      "Secure account data and mask sensitive values in logs.",
      "Use account IDs for downstream payment orchestration."
    ]
  },
  {
    id: "api-erp-tax-regimes-get",
    suite: "ERP",
    module: "Tax",
    operation: "Get Tax Regimes",
    method: "GET",
    endpoint: "/fscmRestApi/resources/11.13.18.05/taxRegimes",
    docLink: "https://docs.oracle.com/en/cloud/saas/financials/25d/farfa/api-tax-regimes.html",
    description: "Read tax regime configurations for global tax compliance mappings.",
    difficulty: "Intermediate",
    tags: ["ERP", "Tax", "Regimes"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=TaxRegimeCode=US_VAT&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ TaxRegimeCode: "US_VAT", TaxRegimeName: "US VAT Regime", EffectiveFrom: "2024-01-01" }]
    },
    tips: [
      "Sync regimes before tax rate/transaction integrations.",
      "Map tax codes centrally to avoid duplicate logic."
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
    id: "api-hcm-assignments-get",
    suite: "HCM",
    module: "Assignments",
    operation: "Get Assignments",
    method: "GET",
    endpoint: "/hcmRestApi/resources/11.13.18.05/assignments",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-assignments.html",
    description: "Retrieve worker assignments for workforce and org-sync integrations.",
    difficulty: "Intermediate",
    tags: ["HCM", "Assignments", "Work Relationship"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=PersonNumber=E10427;AssignmentStatusType=ACTIVE&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ AssignmentNumber: "E10427-1", BusinessUnitName: "Vision Operations", AssignmentStatusType: "ACTIVE" }]
    },
    tips: [
      "Pull only active assignments unless historical data is needed.",
      "Use assignment IDs for downstream payroll joins."
    ]
  },
  {
    id: "api-hcm-benefits-enrollments-get",
    suite: "HCM",
    module: "Benefits",
    operation: "Get Benefit Enrollments",
    method: "GET",
    endpoint: "/hcmRestApi/resources/11.13.18.05/benefitsEnrollments",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-benefits-enrollments.html",
    description: "Read employee benefit enrollments for insurance and policy integrations.",
    difficulty: "Intermediate",
    tags: ["HCM", "Benefits", "Enrollments"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=PersonNumber=E10427;PlanName=Medical&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ PersonNumber: "E10427", PlanName: "Medical PPO", CoverageLevel: "Employee + Family" }]
    },
    tips: [
      "Align plan names with tenant-specific benefit setup.",
      "Use effective dates while reconciling open enrollment changes."
    ]
  },
  {
    id: "api-hcm-salaries-create",
    suite: "HCM",
    module: "Compensation",
    operation: "Create Salary",
    method: "POST",
    endpoint: "/hcmRestApi/resources/11.13.18.05/salaries",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-salaries.html",
    description: "Create salary records for compensation management integrations.",
    difficulty: "Advanced",
    tags: ["HCM", "Compensation", "Salary"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      PersonNumber: "E10427",
      SalaryAmount: 98000,
      CurrencyCode: "USD",
      EffectiveStartDate: "2026-05-01"
    },
    sampleResponse: {
      SalaryId: 300100772209901,
      PersonNumber: "E10427",
      Status: "Approved"
    },
    tips: [
      "Ensure grade/step and legal employer rules are satisfied.",
      "Use secure integration users because compensation is sensitive."
    ]
  },
  {
    id: "api-hcm-positions-create",
    suite: "HCM",
    module: "Positions",
    operation: "Create Position",
    method: "POST",
    endpoint: "/hcmRestApi/resources/11.13.18.05/positions",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-positions.html",
    description: "Create positions used in hiring and organizational planning.",
    difficulty: "Intermediate",
    tags: ["HCM", "Positions", "Organization"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      PositionCode: "ENG-PLAT-SR-01",
      Name: "Senior Platform Engineer",
      DepartmentName: "Cloud Platform Engineering"
    },
    sampleResponse: {
      PositionId: 300100778845210,
      PositionCode: "ENG-PLAT-SR-01",
      HiringStatus: "Approved"
    },
    tips: [
      "Position creation rules can depend on business unit and department setup.",
      "Use position IDs for requisition and assignment mappings."
    ]
  },
  {
    id: "api-hcm-grades-get",
    suite: "HCM",
    module: "Grades",
    operation: "Get Grades",
    method: "GET",
    endpoint: "/hcmRestApi/resources/11.13.18.05/grades",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-grades.html",
    description: "Read grade structures for assignment and salary validations.",
    difficulty: "Beginner",
    tags: ["HCM", "Grades", "Compensation"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=GradeCode=IC4&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ GradeCode: "IC4", GradeName: "Individual Contributor 4" }]
    },
    tips: [
      "Sync grade references before worker or salary updates.",
      "Treat grade and ladder mappings as master data."
    ]
  },
  {
    id: "api-hcm-payroll-relationships-get",
    suite: "HCM",
    module: "Payroll",
    operation: "Get Payroll Relationships",
    method: "GET",
    endpoint: "/hcmRestApi/resources/11.13.18.05/payrollRelationships",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-payroll-relationships.html",
    description: "Retrieve payroll relationships for payroll run orchestration and sync.",
    difficulty: "Intermediate",
    tags: ["HCM", "Payroll", "Relationships"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=PersonNumber=E10427&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ PersonNumber: "E10427", PayrollName: "US Monthly Payroll", PayrollRelationshipNumber: "PR-7712" }]
    },
    tips: [
      "Relationship data is essential before posting payroll elements.",
      "Join with assignments for complete payroll context."
    ]
  },
  {
    id: "api-hcm-element-entries-create",
    suite: "HCM",
    module: "Payroll",
    operation: "Create Element Entry",
    method: "POST",
    endpoint: "/hcmRestApi/resources/11.13.18.05/elementEntries",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-element-entries.html",
    description: "Create payroll element entries such as allowances and deductions.",
    difficulty: "Advanced",
    tags: ["HCM", "Payroll", "Element Entries"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      PersonNumber: "E10427",
      ElementName: "Transport Allowance",
      EntryType: "Amount",
      EntryValue: 150
    },
    sampleResponse: {
      ElementEntryId: 300100780005227,
      PersonNumber: "E10427",
      Status: "Processed"
    },
    tips: [
      "Validate input values and eligibility rules for each payroll element.",
      "Control retries carefully to avoid duplicate element entries."
    ]
  },
  {
    id: "api-hcm-work-schedules-get",
    suite: "HCM",
    module: "Time and Labor",
    operation: "Get Work Schedules",
    method: "GET",
    endpoint: "/hcmRestApi/resources/11.13.18.05/workSchedules",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-work-schedules.html",
    description: "Read work schedule definitions for time, attendance, and shift integrations.",
    difficulty: "Intermediate",
    tags: ["HCM", "Time and Labor", "Schedules"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=ScheduleName=India%205-Day%20Standard&limit=20"
    },
    sampleResponse: {
      count: 1,
      items: [{ ScheduleName: "India 5-Day Standard", Periodicity: "Weekly" }]
    },
    tips: [
      "Align schedule IDs with external time systems.",
      "Fetch shifts and exceptions only when needed for performance."
    ]
  },
  {
    id: "api-hcm-goals-create",
    suite: "HCM",
    module: "Talent Management",
    operation: "Create Performance Goal",
    method: "POST",
    endpoint: "/hcmRestApi/resources/11.13.18.05/goals",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-goals.html",
    description: "Create goals for employee performance and talent processes.",
    difficulty: "Intermediate",
    tags: ["HCM", "Talent Management", "Goals"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      PersonNumber: "E10427",
      GoalName: "Implement Oracle Integration automation framework",
      TargetCompletionDate: "2026-09-30"
    },
    sampleResponse: {
      GoalId: 300100782118744,
      GoalName: "Implement Oracle Integration automation framework",
      Status: "In Progress"
    },
    tips: [
      "Goal plans and review periods should be configured before create calls.",
      "Use goal IDs to sync progress updates from external systems."
    ]
  },
  {
    id: "api-hcm-learning-records-get",
    suite: "HCM",
    module: "Learning",
    operation: "Get Learning Records",
    method: "GET",
    endpoint: "/hcmRestApi/resources/11.13.18.05/learningRecords",
    docLink: "https://docs.oracle.com/en/cloud/saas/human-resources/farws/api-learning-records.html",
    description: "Retrieve learning assignments and completion records for L&D integrations.",
    difficulty: "Beginner",
    tags: ["HCM", "Learning", "Training"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?q=PersonNumber=E10427&limit=30"
    },
    sampleResponse: {
      count: 1,
      items: [{ PersonNumber: "E10427", CourseName: "Secure OCI Foundations", CompletionStatus: "Completed" }]
    },
    tips: [
      "Use completion timestamps for compliance reporting.",
      "Batch by learning item IDs for scalable sync jobs."
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
