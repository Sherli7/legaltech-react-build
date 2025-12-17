import { apiRequest } from "./apiClient";
import type { CaseMessage } from "@/types/messages";

const useMock = (import.meta.env.VITE_USE_API_MOCK ?? "true") !== "false";

const mockMessages: CaseMessage[] = [
  {
    id: "msg_1",
    caseId: "case_001",
    author: { id: "usr_001", name: "Jean Dupont", role: "user" },
    content: "Bonjour, voici les pièces complémentaires.",
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
    isRead: true,
  },
  {
    id: "msg_2",
    caseId: "case_001",
    author: { id: "law_123", name: "Me Durand", role: "lawyer" },
    content: "Merci, j’ai bien reçu. Je reviens vers vous après analyse.",
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    isRead: false,
  },
];

export const messagesService = {
  async list(caseId: string): Promise<CaseMessage[]> {
    if (useMock) return mockMessages.filter((m) => m.caseId === caseId);
    return apiRequest<CaseMessage[]>(`/cases/${caseId}/messages`);
  },
  async send(caseId: string, content: string): Promise<CaseMessage> {
    if (useMock) {
      const msg: CaseMessage = {
        id: `msg_${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
        caseId,
        author: { id: "usr_mock", name: "Vous", role: "user" },
        content,
        createdAt: new Date().toISOString(),
        isRead: true,
      };
      mockMessages.push(msg);
      return msg;
    }
    return apiRequest<CaseMessage>(`/cases/${caseId}/messages`, {
      method: "POST",
      body: { content },
    });
  },
  async markAsRead(caseId: string, messageIds: string[]): Promise<void> {
    if (useMock) return;
    await apiRequest<void>(`/cases/${caseId}/messages/read`, {
      method: "POST",
      body: { ids: messageIds },
    });
  },
};
