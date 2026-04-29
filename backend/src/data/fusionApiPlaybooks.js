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

const epmQuickReferenceLink =
  "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/quick_reference_table_rest_api_resource_view.html";

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
    id: "api-epm-planning-get-api-versions",
    suite: "EPM",
    module: "Planning",
    operation: "Get Planning API Versions",
    method: "GET",
    endpoint: "/HyperionPlanning/rest/",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/get_rest_api_versions_for_planning.html",
    description: "List supported Planning REST API versions before calling application APIs.",
    difficulty: "Beginner",
    tags: ["EPM", "Planning", "API Versions"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      baseUrl: "https://<your-epm-host>",
      note: "No request body required."
    },
    sampleResponse: {
      items: [{ version: "v3", lifecycle: "active", isLatest: true }]
    },
    tips: [
      "Use this first when connecting to a new EPM environment.",
      "Prefer latest active version unless a legacy integration requires otherwise."
    ]
  },
  {
    id: "api-epm-planning-get-applications",
    suite: "EPM",
    module: "Planning",
    operation: "Get Planning Applications",
    method: "GET",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/get_applications.html",
    description: "Retrieve Planning or FreeForm applications assigned to the integration user.",
    difficulty: "Beginner",
    tags: ["EPM", "Planning", "FreeForm", "Applications"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { api_version: "v3" }
    },
    sampleResponse: {
      items: [{ name: "Vision", type: "HP", adminMode: false }]
    },
    tips: [
      "Use application names from this response in downstream job calls.",
      "Check user assignment if expected applications are missing."
    ]
  },
  {
    id: "api-epm-planning-run-job",
    suite: "EPM",
    module: "Planning",
    operation: "Run Planning Job",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/jobs",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/planning_rest_apis.html",
    description: "Start a Planning business rule, import, export, or other supported Planning job.",
    difficulty: "Intermediate",
    tags: ["EPM", "Planning", "Jobs", "Automation"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobType: "Rules",
      jobName: "Calculate Revenue",
      parameters: { Scenario: "Plan", Version: "Working" }
    },
    sampleResponse: {
      jobId: 10291,
      status: -1,
      details: "Processing"
    },
    tips: [
      "Polling job status is usually required because EPM jobs are asynchronous.",
      "Keep rule parameters aligned with prompt names configured in Planning."
    ]
  },
  {
    id: "api-epm-planning-get-ai-summary",
    suite: "EPM",
    module: "Planning",
    operation: "Get Application Summary",
    method: "GET",
    endpoint: "/HyperionPlanning/rest/v3/applications/{application}/summary",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/get_applications_summary.html",
    description: "Return an AI-focused application structure summary for an EPM Planning application.",
    difficulty: "Intermediate",
    tags: ["EPM", "Planning", "AI REST API", "Application Summary"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { application: "Vision" },
      queryExample: "?fullHierarchyThreshold=100&aliasTableName=Default"
    },
    sampleResponse: {
      application: "Vision",
      dimensions: ["Account", "Entity", "Scenario", "Version", "Period"]
    },
    tips: [
      "This is designed for AI-driven understanding, not stable transactional integration.",
      "Use filters when large dimensions would make the response too broad."
    ]
  },
  {
    id: "api-epm-arcs-import-premapped-balances",
    suite: "EPM",
    module: "Account Reconciliation",
    operation: "Import Pre-Mapped Balances",
    method: "POST",
    endpoint: "/armARCS/rest/{api_version}/jobs",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/arcs_rest_import_pre_mapped_balances.html",
    description: "Import pre-mapped balances into Account Reconciliation.",
    difficulty: "Intermediate",
    tags: ["EPM", "Account Reconciliation", "Balances", "ARCS"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobName: "IMPORT_PREMAPPED_BALANCES",
      parameters: {
        period: "Jan-26",
        balanceType: "SRC",
        file: "balances.csv",
        currencyBucket: "Functional"
      }
    },
    sampleResponse: {
      type: "ARCS",
      status: -1,
      details: "In Process"
    },
    tips: [
      "Upload the input file to the repository before starting the import job.",
      "Use status polling from the returned link to detect completion."
    ]
  },
  {
    id: "api-epm-arcs-import-tm-transactions",
    suite: "EPM",
    module: "Account Reconciliation",
    operation: "Import Transaction Matching Transactions",
    method: "POST",
    endpoint: "/arm/rest/{api_version}/jobs",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/arcs_rest_import_tm_premapped_transactions.html",
    description: "Import pre-mapped transactions into Transaction Matching.",
    difficulty: "Intermediate",
    tags: ["EPM", "Account Reconciliation", "Transaction Matching"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobName: "importtmpremappedtransactions",
      parameters: {
        matchTypeId: "BANK_TO_GL",
        dataSource: "BANK",
        file: "transactions.csv"
      }
    },
    sampleResponse: {
      type: "ARCS",
      status: -1,
      details: "In Process"
    },
    tips: [
      "Use the correct match type ID and data source text ID.",
      "Coordinate with Transaction Matching setup before automating imports."
    ]
  },
  {
    id: "api-epm-fcc-get-journals",
    suite: "EPM",
    module: "Financial Consolidation and Close",
    operation: "Retrieve FCC Journals",
    method: "GET",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/journals",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/fccs_retrieve_journals.html",
    description: "Retrieve FCC journals using scenario, year, period, consolidation, and status filters.",
    difficulty: "Intermediate",
    tags: ["EPM", "FCC", "Journals"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { api_version: "v3", application: "FCCVision" },
      queryExample:
        "?q={\"scenario\":\"Actual\",\"year\":\"FY26\",\"period\":\"Jan\",\"status\":\"WORKING\"}&offset=0&limit=25"
    },
    sampleResponse: {
      items: [{ label: "FCC-JRN-1001", status: "WORKING", period: "Jan" }]
    },
    tips: [
      "Always filter journals by scenario, year, and period.",
      "Use paging for large close cycles."
    ]
  },
  {
    id: "api-epm-fcc-get-journal-details",
    suite: "EPM",
    module: "Financial Consolidation and Close",
    operation: "Retrieve FCC Journal Details",
    method: "GET",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/journals/{journalLabel}",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/fccs_retrieve_journal_details.html",
    description: "Retrieve detail lines for a specific FCC journal.",
    difficulty: "Intermediate",
    tags: ["EPM", "FCC", "Journal Details"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { api_version: "v3", application: "FCCVision", journalLabel: "FCC-JRN-1001" },
      queryExample: "?q={\"scenario\":\"Actual\",\"year\":\"FY26\",\"period\":\"Jan\"}&lineItems=true"
    },
    sampleResponse: {
      label: "FCC-JRN-1001",
      lineItems: [{ account: "Cash", debit: 1000, credit: 0 }]
    },
    tips: [
      "Use journal detail retrieval after narrowing the journal header list.",
      "Include line items when downstream ERP posting needs full accounting detail."
    ]
  },
  {
    id: "api-epm-enterprise-journals-execute-job",
    suite: "EPM",
    module: "Enterprise Journals",
    operation: "Execute Enterprise Journals Job",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/ej/{api_version}/jobs",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/enterprise_journals_execute_jobs.html",
    description: "Run Enterprise Journals jobs such as export journals, set status, or deploy templates.",
    difficulty: "Advanced",
    tags: ["EPM", "Enterprise Journals", "FCC", "Jobs"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobType: "exportEJJournals",
      parameters: {
        Filename: "export.zip",
        Year: "FY26",
        Period: "Jan",
        Operation: "validation"
      }
    },
    sampleResponse: {
      jobId: 14013,
      details: "In Process",
      status: -1
    },
    tips: [
      "Use the job status link returned by the response.",
      "Match jobType and parameters exactly to the Enterprise Journals operation."
    ]
  },
  {
    id: "api-epm-enterprise-journals-get",
    suite: "EPM",
    module: "Enterprise Journals",
    operation: "Retrieve Enterprise Journals",
    method: "GET",
    endpoint: "/HyperionPlanning/rest/ej/{api_version}/ejjournals",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/fccs_get_enterprise_journals.html",
    description: "Retrieve Enterprise Journals ready to validate or post.",
    difficulty: "Intermediate",
    tags: ["EPM", "Enterprise Journals", "Retrieve"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?Year=FY26&Period=Jan&PostingStatus=ReadyToPost"
    },
    sampleResponse: {
      items: [{ instanceId: "100000000008821", year: "FY26", period: "Jan", postingStatus: "ReadyToPost" }]
    },
    tips: [
      "Filter by year, period, and posting status during close orchestration.",
      "Use instance IDs to retrieve detailed journal content."
    ]
  },
  {
    id: "api-epm-data-integration-run-job",
    suite: "EPM",
    module: "Data Integration",
    operation: "Run Data Integration Job",
    method: "POST",
    endpoint: "/aif/rest/{api_version}/jobs",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/fdmee_rest_apis.html",
    description: "Run Data Integration or Data Management jobs for EPM data loads and extracts.",
    difficulty: "Intermediate",
    tags: ["EPM", "Data Integration", "Data Management", "Jobs"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobType: "INTEGRATION",
      jobName: "Load_GL_Actuals",
      periodName: "Jan-26",
      importMode: "Replace",
      exportMode: "Merge"
    },
    sampleResponse: {
      jobId: 78122,
      status: -1,
      details: "In Process"
    },
    tips: [
      "Use predefined Data Integration job names from your EPM environment.",
      "Poll status before triggering downstream validation."
    ]
  },
  {
    id: "api-epm-migration-get-snapshot-info",
    suite: "EPM",
    module: "Migration",
    operation: "Get Snapshot Information",
    method: "GET",
    endpoint: "/interop/rest/{api_version}/applicationsnapshots/{applicationSnapshotName}",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/get_information_about_a_specific_application_snapshot.html",
    description: "Return details and available actions for an EPM application snapshot.",
    difficulty: "Beginner",
    tags: ["EPM", "Migration", "Snapshots"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: {
        api_version: "11.1.2.3.600",
        applicationSnapshotName: "Artifact Snapshot"
      }
    },
    sampleResponse: {
      name: "Artifact Snapshot",
      status: 0,
      items: [{ name: "download", action: "GET" }]
    },
    tips: [
      "Use migration APIs for lifecycle and backup automation.",
      "Check snapshot compatibility before moving artifacts between environments."
    ]
  },
  {
    id: "api-epm-narrative-reporting-get-packages",
    suite: "EPM",
    module: "Narrative Reporting",
    operation: "Get Report Packages",
    method: "GET",
    endpoint: "/epm/rest/v1/reportPackages",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-reporting-cloud/raepr/api-report-packages.html",
    description: "Retrieve Narrative Reporting report packages and metadata.",
    difficulty: "Beginner",
    tags: ["EPM", "Narrative Reporting", "Report Packages"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?fields=all&limit=25&offset=0"
    },
    sampleResponse: {
      items: [{ reportPackageId: "RP1001", name: "Board Book", description: "Monthly board package" }]
    },
    tips: [
      "Use report package APIs for controlled management reporting workflows.",
      "Request only needed fields to keep responses smaller."
    ]
  },
  {
    id: "api-epm-narrative-reporting-get-reports",
    suite: "EPM",
    module: "Narrative Reporting",
    operation: "Get Reports",
    method: "GET",
    endpoint: "/epm/rest/v1/reports",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-reporting-cloud/raepr/api-reports.html",
    description: "Retrieve Narrative Reporting reports available in the library.",
    difficulty: "Beginner",
    tags: ["EPM", "Narrative Reporting", "Reports"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?fields=all&limit=25"
    },
    sampleResponse: {
      items: [{ id: "RPT1007", name: "Income Statement", description: "Monthly income statement" }]
    },
    tips: [
      "Use report IDs for output and prompt APIs.",
      "Pair with executedReport calls when you need generated report files."
    ]
  },
  {
    id: "api-epm-edm-get-applications",
    suite: "EPM",
    module: "Enterprise Data Management",
    operation: "Get EDM Applications",
    method: "GET",
    endpoint: "/epm/rest/v1/applications",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-data-management-cloud/edmra/rest-endpoints.html",
    description: "Retrieve Enterprise Data Management applications.",
    difficulty: "Beginner",
    tags: ["EPM", "EDM", "Applications"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      note: "No request body required."
    },
    sampleResponse: {
      items: [{ id: "edm-app-1001", name: "Corporate Chart of Accounts", applicationType: "Universal" }]
    },
    tips: [
      "Use application IDs for connection, dimension, and extract operations.",
      "EDM APIs are useful for metadata governance integrations."
    ]
  },
  {
    id: "api-epm-edm-run-extract-package",
    suite: "EPM",
    module: "Enterprise Data Management",
    operation: "Run EDM Extract Package",
    method: "POST",
    endpoint: "/epm/rest/v1/applications/extractPackage",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-data-management-cloud/edmra/rest-endpoints.html",
    description: "Run an EDM extract package for governed metadata export.",
    difficulty: "Intermediate",
    tags: ["EPM", "EDM", "Extract Package"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      applicationId: "edm-app-1001",
      extractPackageName: "COA_Downstream_Extract",
      fileName: "coa_extract.zip"
    },
    sampleResponse: {
      jobId: "EDM-JOB-9912",
      status: "RUNNING"
    },
    tips: [
      "Use extract packages for repeatable downstream metadata feeds.",
      "Track job status and archive export files with run timestamps."
    ]
  },
  {
    id: "api-epm-profitability-run-job",
    suite: "EPM",
    module: "Enterprise Profitability and Cost Management",
    operation: "Run Profitability Job",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/jobs",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/cloud_epm_rest_api_resources.html",
    description: "Run supported Enterprise Profitability or Profitability jobs from EPM REST APIs.",
    difficulty: "Intermediate",
    tags: ["EPM", "Profitability", "EPCM", "PCM", "Jobs"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobType: "Rules",
      jobName: "Allocate Shared Services",
      parameters: { POV: "FY26_Jan_Actual" }
    },
    sampleResponse: {
      jobId: 77211,
      status: -1,
      details: "Processing"
    },
    tips: [
      "Confirm the job type supported by your Profitability business process.",
      "Use POV and rule-set parameters consistently across environments."
    ]
  },
  {
    id: "api-epm-tax-reporting-run-job",
    suite: "EPM",
    module: "Tax Reporting",
    operation: "Run Tax Reporting Job",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/jobs",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/compatibility_table_rest_apis.html",
    description: "Run supported Tax Reporting jobs using Cloud EPM REST automation patterns.",
    difficulty: "Intermediate",
    tags: ["EPM", "Tax Reporting", "Jobs"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobType: "Rules",
      jobName: "Calculate Tax Provision",
      parameters: { Scenario: "Actual", Year: "FY26", Period: "Jan" }
    },
    sampleResponse: {
      jobId: 88190,
      status: -1,
      details: "Processing"
    },
    tips: [
      "Validate period and scenario before running tax jobs.",
      "Poll status before publishing close-cycle dashboards."
    ]
  },
  {
    id: "api-epm-freeform-run-job",
    suite: "EPM",
    module: "FreeForm",
    operation: "Run FreeForm Job",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Run jobs for a FreeForm application using the Planning-compatible EPM REST pattern.",
    difficulty: "Intermediate",
    tags: ["EPM", "FreeForm", "Jobs"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      pathParams: { api_version: "v3", application: "FreeFormVision" },
      jobType: "Rules",
      jobName: "Calculate Workforce Expense",
      parameters: { Scenario: "Plan", Version: "Working" }
    },
    sampleResponse: {
      jobId: 91021,
      status: -1,
      details: "Processing"
    },
    tips: [
      "FreeForm apps share many Planning REST resources, but job names are application-specific.",
      "Poll job status before starting downstream validation."
    ]
  },
  {
    id: "api-epm-strategic-workforce-run-job",
    suite: "EPM",
    module: "Strategic Workforce Planning",
    operation: "Run Strategic Workforce Job",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Run Strategic Workforce Planning rules or automation jobs.",
    difficulty: "Intermediate",
    tags: ["EPM", "Strategic Workforce Planning", "SWP", "Jobs"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      pathParams: { api_version: "v3", application: "SWPVision" },
      jobType: "Rules",
      jobName: "Calculate Workforce Demand",
      parameters: { Scenario: "Plan", Year: "FY26" }
    },
    sampleResponse: {
      jobId: 91037,
      status: -1,
      details: "Processing"
    },
    tips: [
      "Use prompts exactly as they are configured in the business rule.",
      "Keep workforce dimensional members synchronized with HCM if integrated."
    ]
  },
  {
    id: "api-epm-sales-planning-run-job",
    suite: "EPM",
    module: "Sales Planning",
    operation: "Run Sales Planning Job",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Run Sales Planning jobs such as territory, quota, or forecast calculations.",
    difficulty: "Intermediate",
    tags: ["EPM", "Sales Planning", "Jobs"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      pathParams: { api_version: "v3", application: "SalesPlan" },
      jobType: "Rules",
      jobName: "Calculate Quota Forecast",
      parameters: { Territory: "North America", Scenario: "Forecast" }
    },
    sampleResponse: {
      jobId: 91044,
      status: -1,
      details: "Processing"
    },
    tips: [
      "Confirm sales hierarchy and territory member names before automation.",
      "Use job status polling before publishing forecast outputs."
    ]
  },
  {
    id: "api-epm-platform-get-build-maintenance",
    suite: "EPM",
    module: "EPM Platform",
    operation: "Get Build and Maintenance Window",
    method: "GET",
    endpoint: "/interop/rest/{api_version}/services/dailymaintenance",
    docLink:
      "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/lcm_get_build_version_and_maintenance_time.html",
    description: "Read the EPM environment build version and configured daily maintenance start time.",
    difficulty: "Beginner",
    tags: ["EPM", "Platform", "Maintenance"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { api_version: "v1" }
    },
    sampleResponse: {
      buildVersion: "26.01.55",
      dailyMaintenanceTime: "23:00 UTC",
      status: 0
    },
    tips: [
      "Use this in health checks and environment readiness pages.",
      "Capture build version before opening support tickets."
    ]
  },
  {
    id: "api-epm-platform-list-files",
    suite: "EPM",
    module: "EPM Platform",
    operation: "List Inbox Outbox Files",
    method: "GET",
    endpoint: "/interop/rest/v2/files/list",
    docLink: epmQuickReferenceLink,
    description: "List files available in the EPM inbox/outbox repository for integration jobs.",
    difficulty: "Beginner",
    tags: ["EPM", "Platform", "Files", "Inbox Outbox"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      note: "No request body required."
    },
    sampleResponse: {
      items: [{ name: "Load_GL_Actuals.csv", type: "file", size: 20480 }]
    },
    tips: [
      "Use file listing before starting imports to confirm upstream uploads completed.",
      "Archive files with run IDs to prevent accidental reprocessing."
    ]
  },
  {
    id: "api-epm-daily-maintenance-set-time",
    suite: "EPM",
    module: "Daily Maintenance",
    operation: "Set Daily Maintenance Start Time",
    method: "PUT",
    endpoint: "/interop/rest/v2/maintenance/setdailymaintenancestarttime",
    docLink:
      "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/lcm_update_maintenance_time.html",
    description: "Set the daily maintenance start time using the simplified v2 EPM maintenance API.",
    difficulty: "Advanced",
    tags: ["EPM", "Daily Maintenance", "Admin"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      startTime: "23:00",
      timeZone: "UTC"
    },
    sampleResponse: {
      details: "Daily maintenance start time updated.",
      status: 0
    },
    tips: [
      "Coordinate this with close windows and integration schedules.",
      "Oracle may reject changes if maintenance has not run recently enough."
    ]
  },
  {
    id: "api-epm-daily-maintenance-run-now",
    suite: "EPM",
    module: "Daily Maintenance",
    operation: "Run Daily Maintenance Now",
    method: "POST",
    endpoint: "/interop/rest/v2/maintenance/rundailymaintenance",
    docLink: epmQuickReferenceLink,
    description: "Trigger daily maintenance immediately while skipping the scheduled run.",
    difficulty: "Advanced",
    tags: ["EPM", "Daily Maintenance", "Admin"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      comment: "Run after migration validation"
    },
    sampleResponse: {
      jobId: 62017,
      status: -1,
      details: "Maintenance request accepted."
    },
    tips: [
      "Use only during planned admin windows.",
      "Notify users because the environment can become temporarily unavailable."
    ]
  },
  {
    id: "api-epm-users-list",
    suite: "EPM",
    module: "Users, Groups, and Roles",
    operation: "List Users",
    method: "POST",
    endpoint: "/interop/rest/security/v1/users/list",
    docLink: epmQuickReferenceLink,
    description: "List EPM users and optionally include group and application role information.",
    difficulty: "Beginner",
    tags: ["EPM", "Users", "Security", "IAM"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      searchText: "dev",
      includeGroups: true,
      includeApplicationRoles: true
    },
    sampleResponse: {
      items: [{ userLogin: "dev.user@example.com", firstName: "Dev", groups: ["EPM_ADMIN"] }]
    },
    tips: [
      "Use this for access review dashboards.",
      "Filter by login or email for fast troubleshooting."
    ]
  },
  {
    id: "api-epm-groups-list",
    suite: "EPM",
    module: "Users, Groups, and Roles",
    operation: "List Groups",
    method: "POST",
    endpoint: "/interop/rest/security/v1/groups/list",
    docLink: epmQuickReferenceLink,
    description: "List EPM groups with membership and application role assignment details.",
    difficulty: "Beginner",
    tags: ["EPM", "Groups", "Security", "IAM"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      searchText: "FIN",
      includeMembers: true,
      includeApplicationRoles: true
    },
    sampleResponse: {
      items: [{ groupName: "FIN_CLOSE_POWER_USERS", type: "Native", membersCount: 18 }]
    },
    tips: [
      "Group reports are safer than one-off user checks during audits.",
      "Use naming standards to map groups to modules and environments."
    ]
  },
  {
    id: "api-epm-role-assign-user",
    suite: "EPM",
    module: "Users, Groups, and Roles",
    operation: "Assign User Role",
    method: "PUT",
    endpoint: "/interop/rest/security/v2/role/assign/user",
    docLink: epmQuickReferenceLink,
    description: "Assign a predefined role or application role to EPM users.",
    difficulty: "Advanced",
    tags: ["EPM", "Roles", "Security", "Provisioning"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      users: ["dev.user@example.com"],
      roles: ["Service Administrator"],
      comment: "Temporary project provisioning"
    },
    sampleResponse: {
      status: 0,
      details: "Role assignment request completed."
    },
    tips: [
      "Keep role assignment changes auditable and time-bound.",
      "Run a role assignment report after bulk role changes."
    ]
  },
  {
    id: "api-epm-roles-get-available",
    suite: "EPM",
    module: "Users, Groups, and Roles",
    operation: "Get Available Roles",
    method: "GET",
    endpoint: "/interop/rest/security/v2/role/getavailableroles",
    docLink: epmQuickReferenceLink,
    description: "Retrieve available predefined and application roles for an EPM environment.",
    difficulty: "Beginner",
    tags: ["EPM", "Roles", "Security"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?type=all"
    },
    sampleResponse: {
      items: [{ roleName: "Power User", roleType: "predefined" }]
    },
    tips: [
      "Use this before provisioning automation so role names stay valid.",
      "Role availability can vary by business process."
    ]
  },
  {
    id: "api-epm-user-access-report",
    suite: "EPM",
    module: "Security",
    operation: "Generate User Access Report",
    method: "POST",
    endpoint: "/interop/rest/v2/reports/useraccess",
    docLink: epmQuickReferenceLink,
    description: "Generate a user access report for audit and compliance checks.",
    difficulty: "Intermediate",
    tags: ["EPM", "Security", "Report", "Audit"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      fileName: "user_access_report.csv",
      format: "simplified",
      userType: "serviceusers"
    },
    sampleResponse: {
      jobId: 70091,
      status: -1,
      details: "Report generation started."
    },
    tips: [
      "Schedule this monthly for SOX or access certification cycles.",
      "Download the generated file after the job reaches success."
    ]
  },
  {
    id: "api-epm-role-assignment-report",
    suite: "EPM",
    module: "Security",
    operation: "Role Assignment Report",
    method: "GET",
    endpoint: "/interop/rest/security/v2/report/roleassignmentreport/user",
    docLink: epmQuickReferenceLink,
    description: "Return role assignment information for users by login, role, or user attribute.",
    difficulty: "Intermediate",
    tags: ["EPM", "Security", "Roles", "Audit"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?userlogin=dev.user@example.com&rolename=Power%20User"
    },
    sampleResponse: {
      items: [{ userLogin: "dev.user@example.com", roleName: "Power User", source: "Direct" }]
    },
    tips: [
      "Use this before removing users from groups or roles.",
      "Group-based assignments may require group role report checks too."
    ]
  },
  {
    id: "api-epm-user-login-report",
    suite: "EPM",
    module: "Security",
    operation: "User Login Report",
    method: "GET",
    endpoint: "/interop/rest/security/v1/report/userloginreport",
    docLink: epmQuickReferenceLink,
    description: "Generate user login activity data for audit and adoption reporting.",
    difficulty: "Intermediate",
    tags: ["EPM", "Security", "Login Report", "Audit"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      queryExample: "?userlogin=dev.user@example.com&from_date=2026-01-01&to_date=2026-01-31"
    },
    sampleResponse: {
      items: [{ userLogin: "dev.user@example.com", lastLogin: "2026-01-18T08:31:00Z" }]
    },
    tips: [
      "Use date filters to keep audit extracts smaller.",
      "Combine with access reports to find inactive privileged users."
    ]
  },
  {
    id: "api-epm-migration-upload-file",
    suite: "EPM",
    module: "Migration",
    operation: "Upload File",
    method: "POST",
    endpoint: "/interop/rest/v2/files/upload",
    docLink: epmQuickReferenceLink,
    description: "Upload files to the EPM inbox/outbox repository for imports, migration, or Data Integration.",
    difficulty: "Intermediate",
    tags: ["EPM", "Migration", "Files", "Upload"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      fileName: "metadata_import.zip",
      contentType: "multipart/form-data",
      note: "Send the binary file as multipart form data."
    },
    sampleResponse: {
      status: 0,
      details: "File uploaded successfully."
    },
    tips: [
      "Use exact file names expected by Data Integration or Migration jobs.",
      "Large files may require chunked upload patterns in real integrations."
    ]
  },
  {
    id: "api-epm-migration-download-file",
    suite: "EPM",
    module: "Migration",
    operation: "Download File",
    method: "POST",
    endpoint: "/interop/rest/v2/files/download",
    docLink: epmQuickReferenceLink,
    description: "Download files or generated reports from the EPM inbox/outbox repository.",
    difficulty: "Beginner",
    tags: ["EPM", "Migration", "Files", "Download"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      fileName: "user_access_report.csv"
    },
    sampleResponse: {
      contentType: "text/csv",
      fileName: "user_access_report.csv"
    },
    tips: [
      "Download generated reports only after their job status is successful.",
      "Keep downloaded artifacts encrypted if they contain user or financial data."
    ]
  },
  {
    id: "api-epm-migration-export-snapshot",
    suite: "EPM",
    module: "Migration",
    operation: "Export Snapshot",
    method: "POST",
    endpoint: "/interop/rest/v2/snapshots/export",
    docLink: epmQuickReferenceLink,
    description: "Export an application snapshot for backup or environment promotion.",
    difficulty: "Advanced",
    tags: ["EPM", "Migration", "Snapshot", "Export"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      snapshotName: "Artifact Snapshot",
      exportMode: "all"
    },
    sampleResponse: {
      jobId: 44590,
      status: -1,
      details: "Export snapshot job submitted."
    },
    tips: [
      "Run snapshot exports before major config changes.",
      "Download and store snapshots according to your retention policy."
    ]
  },
  {
    id: "api-epm-migration-import-snapshot",
    suite: "EPM",
    module: "Migration",
    operation: "Import Snapshot",
    method: "POST",
    endpoint: "/interop/rest/v2/snapshots/import",
    docLink: epmQuickReferenceLink,
    description: "Import an EPM application snapshot into a target environment.",
    difficulty: "Advanced",
    tags: ["EPM", "Migration", "Snapshot", "Import"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      snapshotName: "Artifact Snapshot",
      importMode: "replace"
    },
    sampleResponse: {
      jobId: 44591,
      status: -1,
      details: "Import snapshot job submitted."
    },
    tips: [
      "Treat imports as controlled release events because they can overwrite artifacts.",
      "Validate target environment version and artifact compatibility first."
    ]
  },
  {
    id: "api-epm-data-integration-get-job-status",
    suite: "EPM",
    module: "Data Integration",
    operation: "Get Data Integration Job Status",
    method: "GET",
    endpoint: "/aif/rest/{api_version}/jobs/{jobId}",
    docLink: epmQuickReferenceLink,
    description: "Check the status of a Data Integration or Data Management job.",
    difficulty: "Beginner",
    tags: ["EPM", "Data Integration", "Job Status"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { api_version: "v1", jobId: "78122" }
    },
    sampleResponse: {
      jobId: 78122,
      status: 0,
      details: "Success"
    },
    tips: [
      "Poll at sensible intervals instead of tight loops.",
      "Capture failed job details for support and retry logic."
    ]
  },
  {
    id: "api-epm-data-integration-run-pipeline",
    suite: "EPM",
    module: "Data Integration",
    operation: "Run Data Integration Pipeline",
    method: "POST",
    endpoint: "/aif/rest/{api_version}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Run a Data Integration pipeline that orchestrates multiple load and export steps.",
    difficulty: "Intermediate",
    tags: ["EPM", "Data Integration", "Pipeline"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobType: "PIPELINE",
      jobName: "MonthEnd_GL_To_Plan",
      parameters: { periodName: "Jan-26", categoryName: "Actual" }
    },
    sampleResponse: {
      jobId: 78144,
      status: -1,
      details: "Pipeline started."
    },
    tips: [
      "Use pipelines when a single data rule is not enough.",
      "Keep period/category naming consistent with Data Integration setup."
    ]
  },
  {
    id: "api-epm-data-integration-export-mapping",
    suite: "EPM",
    module: "Data Integration",
    operation: "Export Data Mapping",
    method: "POST",
    endpoint: "/aif/rest/{api_version}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Export Data Integration mappings for backup, review, or promotion.",
    difficulty: "Intermediate",
    tags: ["EPM", "Data Integration", "Mappings"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobType: "EXPORT_MAPPING",
      jobName: "Export_GL_Account_Map",
      fileName: "gl_account_map.csv"
    },
    sampleResponse: {
      jobId: 78145,
      status: -1,
      details: "Mapping export started."
    },
    tips: [
      "Export mappings before large transformation changes.",
      "Pair exports with source-control or review workflows."
    ]
  },
  {
    id: "api-epm-arcs-get-periods",
    suite: "EPM",
    module: "Account Reconciliation",
    operation: "Get Reconciliation Periods",
    method: "GET",
    endpoint: "/armARCS/rest/{api_version}/periods",
    docLink: epmQuickReferenceLink,
    description: "Retrieve Account Reconciliation periods for status, close, and load automation.",
    difficulty: "Beginner",
    tags: ["EPM", "Account Reconciliation", "Periods", "ARCS"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { api_version: "v1" }
    },
    sampleResponse: {
      items: [{ name: "Jan-26", status: "Open", startDate: "2026-01-01" }]
    },
    tips: [
      "Use period status before importing balances or transactions.",
      "Align period names with the files produced by ERP or banking systems."
    ]
  },
  {
    id: "api-epm-arcs-run-auto-match",
    suite: "EPM",
    module: "Account Reconciliation",
    operation: "Run Auto Match",
    method: "POST",
    endpoint: "/arm/rest/{api_version}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Run Transaction Matching auto-match jobs for a selected match type.",
    difficulty: "Intermediate",
    tags: ["EPM", "Account Reconciliation", "Transaction Matching", "Auto Match"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobName: "automatch",
      parameters: {
        matchTypeId: "BANK_TO_GL",
        period: "Jan-26"
      }
    },
    sampleResponse: {
      type: "ARCS",
      status: -1,
      details: "Auto match started."
    },
    tips: [
      "Run this after importing both source transaction sets.",
      "Review unmatched transactions before closing reconciliations."
    ]
  },
  {
    id: "api-epm-arcs-import-profiles",
    suite: "EPM",
    module: "Account Reconciliation",
    operation: "Import Reconciliation Profiles",
    method: "POST",
    endpoint: "/armARCS/rest/{api_version}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Import reconciliation profiles for Account Reconciliation setup automation.",
    difficulty: "Advanced",
    tags: ["EPM", "Account Reconciliation", "Profiles", "Import"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobName: "IMPORT_PROFILES",
      parameters: {
        file: "reconciliation_profiles.csv",
        period: "Jan-26"
      }
    },
    sampleResponse: {
      type: "ARCS",
      status: -1,
      details: "Profile import started."
    },
    tips: [
      "Validate profile segment values before import.",
      "Keep owner/reviewer assignments aligned with security groups."
    ]
  },
  {
    id: "api-epm-fcc-run-consolidation",
    suite: "EPM",
    module: "Financial Consolidation and Close",
    operation: "Run Consolidation Job",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Run an FCC consolidation or close-related rule job.",
    difficulty: "Advanced",
    tags: ["EPM", "FCC", "Consolidation", "Jobs"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      pathParams: { api_version: "v3", application: "FCCVision" },
      jobType: "Rules",
      jobName: "Consolidate Actuals",
      parameters: { Entity: "Total Entity", Period: "Jan", Year: "FY26", Scenario: "Actual" }
    },
    sampleResponse: {
      jobId: 50201,
      status: -1,
      details: "Consolidation started."
    },
    tips: [
      "Confirm data load and currency translation prerequisites first.",
      "Run validation reports after successful consolidation."
    ]
  },
  {
    id: "api-epm-fcc-deploy-form-templates",
    suite: "EPM",
    module: "Supplemental Data Manager",
    operation: "Deploy Form Templates",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/fcmjobs",
    docLink: epmQuickReferenceLink,
    description: "Deploy Supplemental Data Manager form templates for FCC or Tax close processes.",
    difficulty: "Intermediate",
    tags: ["EPM", "Supplemental Data Manager", "Form Templates"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobName: "Deploy Form Templates",
      parameters: { templateNames: ["Lease Disclosure", "Tax Package"] }
    },
    sampleResponse: {
      jobId: 61001,
      status: -1,
      details: "Template deployment started."
    },
    tips: [
      "Deploy templates after metadata and security changes.",
      "Use consistent template names across environments."
    ]
  },
  {
    id: "api-epm-sdm-import-collection-data",
    suite: "EPM",
    module: "Supplemental Data Manager",
    operation: "Import Supplemental Collection Data",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/fcmjobs",
    docLink: epmQuickReferenceLink,
    description: "Import supplemental collection data used in close and disclosure processes.",
    difficulty: "Intermediate",
    tags: ["EPM", "Supplemental Data Manager", "Import"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobName: "Import Supplemental Collection Data",
      parameters: {
        fileName: "supplemental_data_jan26.csv",
        collectionPeriod: "Jan-26"
      }
    },
    sampleResponse: {
      jobId: 61002,
      status: -1,
      details: "Supplemental data import started."
    },
    tips: [
      "Upload the data file before starting the import job.",
      "Validate template deployment before importing collection data."
    ]
  },
  {
    id: "api-epm-task-manager-update-status",
    suite: "EPM",
    module: "Task Manager",
    operation: "Update Task Status for Event Monitoring",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/cmapi/{api_version}/updateTasksForEventMonitoring",
    docLink:
      "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/prest/fccs_update_task_status_event_monitoring.html",
    description: "Mark Task Manager tasks complete based on an external event monitoring integration.",
    difficulty: "Intermediate",
    tags: ["EPM", "Task Manager", "Event Monitoring"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      eventName: "ERP_LOAD_COMPLETE",
      integrationName: "ERP Actuals Load",
      integrationConnectionName: "OIC_EPM_CONNECTION",
      status: "COMPLETED"
    },
    sampleResponse: {
      status: 0,
      details: "Task status updated."
    },
    tips: [
      "Match integration and event names exactly as configured in Task Manager.",
      "Use this to connect OIC or ERP batch completion with close tasks."
    ]
  },
  {
    id: "api-epm-task-manager-deploy-templates",
    suite: "EPM",
    module: "Task Manager",
    operation: "Deploy Task Manager Templates",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/cmapi/{api_version}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Deploy Task Manager templates to create close schedules and tasks.",
    difficulty: "Intermediate",
    tags: ["EPM", "Task Manager", "Templates"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobType: "DeployTemplates",
      templateNames: ["Monthly Close Checklist"],
      scheduleName: "Jan-26 Close"
    },
    sampleResponse: {
      jobId: 62031,
      status: -1,
      details: "Template deployment job submitted."
    },
    tips: [
      "Deploy templates after all owner and reviewer security is ready.",
      "Use schedule naming that includes period and year."
    ]
  },
  {
    id: "api-epm-task-manager-view-connections",
    suite: "EPM",
    module: "Task Manager",
    operation: "View OIC Connections",
    method: "GET",
    endpoint: "/HyperionPlanning/rest/fcmapi/{api_version}/{module}/connections",
    docLink: epmQuickReferenceLink,
    description: "View Oracle Integration Cloud connections configured for Task Manager integrations.",
    difficulty: "Beginner",
    tags: ["EPM", "Task Manager", "OIC", "Connections"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { api_version: "v1", module: "closemanager" }
    },
    sampleResponse: {
      items: [{ id: "CONN1001", name: "OIC_EPM_CONNECTION", type: "OIC" }]
    },
    tips: [
      "Use this before event monitoring tests.",
      "Keep connection names stable across non-prod and prod where possible."
    ]
  },
  {
    id: "api-epm-reporting-generate-report",
    suite: "EPM",
    module: "Reporting",
    operation: "Generate Report",
    method: "POST",
    endpoint: "/interop/rest/{api_version}/reports",
    docLink: epmQuickReferenceLink,
    description: "Generate an EPM report artifact such as access, activity, or governance output.",
    difficulty: "Intermediate",
    tags: ["EPM", "Reporting", "Reports"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      type: "provisionreport",
      fileName: "provision_report.csv",
      format: "simplified"
    },
    sampleResponse: {
      jobId: 72001,
      status: -1,
      details: "Report generation submitted."
    },
    tips: [
      "Use report type values supported by your EPM business process.",
      "Download the file from inbox/outbox after completion."
    ]
  },
  {
    id: "api-epm-reporting-download-report",
    suite: "EPM",
    module: "Reporting",
    operation: "Download Generated Report",
    method: "GET",
    endpoint: "/interop/rest/{api_version}/files/download/{fileName}",
    docLink: epmQuickReferenceLink,
    description: "Download generated EPM report files for audit, integration, or archive.",
    difficulty: "Beginner",
    tags: ["EPM", "Reporting", "Download"],
    requiredHeaders: headerPresets.authOnly,
    sampleRequest: {
      pathParams: { api_version: "v1", fileName: "provision_report.csv" }
    },
    sampleResponse: {
      contentType: "text/csv",
      fileName: "provision_report.csv"
    },
    tips: [
      "Poll report job status before downloading.",
      "Secure reports because they often include user and role details."
    ]
  },
  {
    id: "api-epm-narrative-reporting-run-report",
    suite: "EPM",
    module: "Narrative Reporting",
    operation: "Run Narrative Report",
    method: "POST",
    endpoint: "/epm/rest/v1/reports/{reportId}/run",
    docLink: epmQuickReferenceLink,
    description: "Run a Narrative Reporting report and request an output file.",
    difficulty: "Intermediate",
    tags: ["EPM", "Narrative Reporting", "Run Report"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      pathParams: { reportId: "RPT1007" },
      outputFormat: "PDF",
      prompts: { Scenario: "Actual", Period: "Jan-26" }
    },
    sampleResponse: {
      jobId: "NR-JOB-9001",
      status: "RUNNING"
    },
    tips: [
      "Use report IDs returned by the reports list operation.",
      "Prompt names and values must match the report definition."
    ]
  },
  {
    id: "api-epm-edm-import-dimensions",
    suite: "EPM",
    module: "Enterprise Data Management",
    operation: "Import EDM Dimension Data",
    method: "POST",
    endpoint: "/epm/rest/v1/applications/{applicationId}/dimensions/{dimensionId}/import",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-data-management-cloud/edmra/rest-endpoints.html",
    description: "Import governed dimension metadata into an EDM application dimension.",
    difficulty: "Advanced",
    tags: ["EPM", "EDM", "Import", "Metadata"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      pathParams: { applicationId: "edm-app-1001", dimensionId: "Account" },
      fileName: "account_dimension.csv",
      importMode: "MERGE"
    },
    sampleResponse: {
      jobId: "EDM-JOB-9921",
      status: "RUNNING"
    },
    tips: [
      "Validate metadata in EDM before exporting to Planning, FCC, or ERP.",
      "Use controlled import files and preserve source audit details."
    ]
  },
  {
    id: "api-epm-edm-run-request-file-load",
    suite: "EPM",
    module: "Enterprise Data Management",
    operation: "Run EDM Request File Load",
    method: "POST",
    endpoint: "/epm/rest/v1/requests/loadFile",
    docLink: "https://docs.oracle.com/en/cloud/saas/enterprise-data-management-cloud/edmra/rest-endpoints.html",
    description: "Create EDM requests from a file load for governed metadata changes.",
    difficulty: "Advanced",
    tags: ["EPM", "EDM", "Requests", "Metadata"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      viewpointId: "vp-Account-Corp",
      fileName: "account_updates.csv",
      submitRequest: true
    },
    sampleResponse: {
      requestId: "REQ-2026-00091",
      status: "SUBMITTED"
    },
    tips: [
      "Use EDM requests when metadata changes need approval workflows.",
      "Keep request descriptions clear for audit and stewardship."
    ]
  },
  {
    id: "api-epm-enterprise-profitability-run-calculation",
    suite: "EPM",
    module: "Enterprise Profitability and Cost Management",
    operation: "Run Enterprise Profitability Calculation",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Run Enterprise Profitability and Cost Management calculation jobs.",
    difficulty: "Intermediate",
    tags: ["EPM", "EPCM", "Profitability", "Calculation"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      pathParams: { api_version: "v3", application: "EPCMVision" },
      jobType: "Rules",
      jobName: "Run Allocation Model",
      parameters: { POV: "FY26_Jan_Actual", Model: "Shared Services Allocation" }
    },
    sampleResponse: {
      jobId: 83021,
      status: -1,
      details: "Calculation started."
    },
    tips: [
      "Confirm POV and model names before running allocations.",
      "Export diagnostics after failed or long-running calculations."
    ]
  },
  {
    id: "api-epm-profitability-run-ml-calculations",
    suite: "EPM",
    module: "Profitability and Cost Management",
    operation: "Run ML Calculations",
    method: "POST",
    endpoint: "/epm/rest/{api_version}/applications/{application}/povs/{povGroupMember}/jobs/runLedgerCalculationJob",
    docLink: epmQuickReferenceLink,
    description: "Run Management Ledger calculations for a Profitability POV.",
    difficulty: "Advanced",
    tags: ["EPM", "PCM", "Profitability", "Management Ledger"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      pathParams: { api_version: "v1", application: "PCMVision", povGroupMember: "FY26_Jan_Actual" },
      ruleSetName: "All Allocations",
      clearCalculatedData: true
    },
    sampleResponse: {
      jobId: 84012,
      status: -1,
      details: "Management Ledger calculation started."
    },
    tips: [
      "Run clear POV only when the business approves recalculation.",
      "Use POV naming standards so automation targets the correct slice."
    ]
  },
  {
    id: "api-epm-profitability-clear-pov",
    suite: "EPM",
    module: "Profitability and Cost Management",
    operation: "Clear POV",
    method: "POST",
    endpoint: "/epm/rest/{api_version}/applications/{application}/povs/{povGroupMember}/jobs/clearPOVJob",
    docLink: epmQuickReferenceLink,
    description: "Clear Profitability POV data before recalculation or reload.",
    difficulty: "Advanced",
    tags: ["EPM", "PCM", "Profitability", "POV"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      pathParams: { api_version: "v1", application: "PCMVision", povGroupMember: "FY26_Jan_Actual" },
      clearInputData: false,
      clearCalculatedData: true
    },
    sampleResponse: {
      jobId: 84013,
      status: -1,
      details: "Clear POV job started."
    },
    tips: [
      "Protect input data unless the reload plan is confirmed.",
      "Always export results or take a backup before destructive clears."
    ]
  },
  {
    id: "api-epm-profitability-update-dimensions",
    suite: "EPM",
    module: "Profitability and Cost Management",
    operation: "Update Dimensions as Job",
    method: "POST",
    endpoint: "/epm/rest/{api_version}/fileApplications/{application}/jobs/updateDimension",
    docLink: epmQuickReferenceLink,
    description: "Update Profitability dimensions as a background job from a file application.",
    difficulty: "Advanced",
    tags: ["EPM", "PCM", "Dimensions", "Metadata"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      dimensionName: "Account",
      fileName: "pcm_account_dimension.csv",
      loadType: "Merge"
    },
    sampleResponse: {
      jobId: 84014,
      status: -1,
      details: "Dimension update submitted."
    },
    tips: [
      "Validate dimension files before running calculation jobs.",
      "Coordinate metadata changes with allocation rule owners."
    ]
  },
  {
    id: "api-epm-tax-reporting-copy-data",
    suite: "EPM",
    module: "Tax Reporting",
    operation: "Copy Tax Reporting Data",
    method: "POST",
    endpoint: "/HyperionPlanning/rest/{api_version}/applications/{application}/jobs",
    docLink: epmQuickReferenceLink,
    description: "Run a Tax Reporting copy-data style job for period or scenario preparation.",
    difficulty: "Intermediate",
    tags: ["EPM", "Tax Reporting", "Copy Data"],
    requiredHeaders: headerPresets.authJson,
    sampleRequest: {
      jobType: "Rules",
      jobName: "Copy Prior Period Tax Data",
      parameters: {
        SourcePeriod: "Dec",
        TargetPeriod: "Jan",
        Year: "FY26",
        Scenario: "Actual"
      }
    },
    sampleResponse: {
      jobId: 88191,
      status: -1,
      details: "Tax data copy started."
    },
    tips: [
      "Confirm source and target POV before submitting copy jobs.",
      "Use job status polling and validation reports before close sign-off."
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
