import { apiRequest } from "./apiClient";

const useMock = (import.meta.env.VITE_USE_API_MOCK ?? "true") !== "false";

type SharePayload = {
  caseId: string;
  shareDocuments?: string[]; // ids de documents à partager
  shareNarrative?: boolean;
};

type AuditEntry = {
  id: string;
  caseId: string;
  actor: string;
  action: string;
  createdAt: string;
};

const mockAudit: AuditEntry[] = [];

export const sharingService = {
  async publishCase(payload: SharePayload) {
    if (useMock) {
      mockAudit.push({
        id: `audit_${mockAudit.length + 1}`,
        caseId: payload.caseId,
        actor: "mock-user",
        action: `publish:${payload.shareNarrative ? "narrative" : ""}:${payload.shareDocuments?.join(",") || "none"}`,
        createdAt: new Date().toISOString(),
      });
      return;
    }
    await apiRequest<void>(`/cases/${payload.caseId}/share`, { method: "POST", body: payload });
  },

  async setDocumentVisibility(caseId: string, documentId: string, visibility: "private" | "shared") {
    if (useMock) {
      mockAudit.push({
        id: `audit_${mockAudit.length + 1}`,
        caseId,
        actor: "mock-user",
        action: `visibility:${documentId}:${visibility}`,
        createdAt: new Date().toISOString(),
      });
      return;
    }
    await apiRequest<void>(`/cases/${caseId}/documents/${documentId}/visibility`, {
      method: "POST",
      body: { visibility },
    });
  },

  async listAudit(caseId: string): Promise<AuditEntry[]> {
    if (useMock) return mockAudit.filter((a) => a.caseId === caseId);
    return apiRequest<AuditEntry[]>(`/cases/${caseId}/audit`);
  },
};
