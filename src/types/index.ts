// SOLVILO Frontend Types - API-first architecture

export type UserRole = "individual" | "company" | "lawyer";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
};

export type SubscriptionPlan = "free" | "standard" | "pro" | "lawyer";

export type SubscriptionStatus = "active" | "expired" | "canceled" | "quota_reached";

export type Subscription = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  limits: {
    cases: number;
    documents: number;
  };
  usage: {
    cases: number;
    documents: number;
  };
  renewDate?: string;
};

export type CaseStatus = 
  | "draft"
  | "submitted"
  | "clarification"
  | "analysis"
  | "settlement"
  | "signed"
  | "closed";

export type CaseRole = "DEM" | "DEF"; // Demandeur / Défendeur

export type CaseFile = {
  id: string;
  reference: string;
  status: CaseStatus;
  currentStep: string;
  role: CaseRole;
  createdAt: string;
  updatedAt: string;
  opposingParty?: string;
  subject?: string;
};

export type DocumentType = "CONTRACT" | "EVIDENCE" | "AFFIDAVIT";
export type DocumentVisibility = "private" | "shared";

export type Document = {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: string;
  visibility?: DocumentVisibility; // private: visible uniquement à la partie courante
  sharedWith?: string[]; // ids des parties autorisées
};

export type IAQuestion = {
  id: string;
  question: string;
  answer?: string;
  deadline: string;
  isAnswered: boolean;
};

export type AnalysisSection = {
  title: string;
  content: string;
};

export type Analysis = {
  id: string;
  caseId: string;
  summary: string;
  analysis: string;
  conclusion: string;
  disposition: string;
  createdAt: string;
};

export type SettlementVersion = {
  id: string;
  version: number;
  content: string;
  status: "pending" | "accepted" | "rejected" | "amended";
  createdAt: string;
  proposedBy: "system" | "demandeur" | "defendeur";
};

export type SettlementAction = "accept" | "reject" | "amend";

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  kind: "contract" | "evidence";
  status: "uploading" | "uploaded" | "error";
};

export type DraftCase = {
  id: string;
  role: CaseRole | null;
  narrative: string;
  narrativeHtml?: string;
  contracts: UploadedFile[];
  evidence: UploadedFile[];
  accepted: boolean;
  updatedAt: string;
};

// API Response types
export type APIResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type QuotaInfo = {
  allowed: boolean;
  remaining: number;
  limit: number;
  message?: string;
};
