import { apiRequest } from "./apiClient";
import type { DraftCase, UploadedFile, CaseRole } from "@/types";

type UploadKind = "contract" | "evidence";

type SaveDraftPayload = {
  id?: string;
  role: CaseRole | null;
  narrative: string;
  narrativeHtml?: string;
  contracts: UploadedFile[];
  evidence: UploadedFile[];
  accepted: boolean;
};

export interface CasesService {
  getDraft(): Promise<DraftCase | null>;
  saveDraft(payload: SaveDraftPayload): Promise<DraftCase>;
  uploadFile(file: File, kind: UploadKind): Promise<UploadedFile>;
  submitDraft(draftId: string): Promise<void>;
}

const DRAFT_STORAGE_KEY = "solvilo_case_draft_v1";

const mockCasesService: CasesService = {
  async getDraft() {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as DraftCase;
    } catch {
      return null;
    }
  },

  async saveDraft(payload) {
    const draft: DraftCase = {
      id: payload.id || "local-draft",
      role: payload.role,
      narrative: payload.narrative,
      narrativeHtml: payload.narrativeHtml,
      contracts: payload.contracts,
      evidence: payload.evidence,
      accepted: payload.accepted,
      updatedAt: new Date().toISOString(),
    };
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
    return draft;
  },

  async uploadFile(file, kind) {
    // Simulated upload delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800));
    return {
      id: `${kind}_${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      kind,
      status: "uploaded" as const,
    };
  },

  async submitDraft() {
    // Simulate backend confirmation
    await new Promise((resolve) => setTimeout(resolve, 800));
  },
};

const realCasesService: CasesService = {
  async getDraft() {
    return apiRequest<DraftCase | null>("/cases/draft");
  },

  async saveDraft(payload) {
    return apiRequest<DraftCase>("/cases/draft", {
      method: "PUT",
      body: payload,
    });
  },

  async uploadFile(file, kind) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);

    const resp = await fetch((import.meta.env.VITE_API_URL || "") + "/cases/documents", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error(`Upload failed (${resp.status})`);
    }

    const data = (await resp.json()) as UploadedFile;
    return { ...data, status: "uploaded" };
  },

  async submitDraft(draftId: string) {
    await apiRequest<void>(`/cases/draft/${draftId}/submit`, { method: "POST" });
  },
};

const useMock = (import.meta.env.VITE_USE_API_MOCK ?? "true") !== "false";

export const casesService: CasesService = useMock ? mockCasesService : realCasesService;
