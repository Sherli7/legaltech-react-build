import { apiRequest } from "./apiClient";
import type { AppNotification } from "@/types/notifications";

const useMock = (import.meta.env.VITE_USE_API_MOCK ?? "true") !== "false";

const mockNotifications: AppNotification[] = [
  {
    id: "notif_1",
    type: "warning",
    title: "Réponse requise",
    message: "L’IA attend vos réponses pour le dossier SOL-2025-0002.",
    createdAt: new Date().toISOString(),
    isRead: false,
    caseId: "case_002",
    link: "/dashboard/cases/case_002",
  },
  {
    id: "notif_2",
    type: "info",
    title: "Analyse prête",
    message: "L’analyse du dossier SOL-2025-0001 est disponible.",
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    isRead: true,
    caseId: "case_001",
    link: "/dashboard/cases/case_001",
  },
];

export const notificationsService = {
  async list(): Promise<AppNotification[]> {
    if (useMock) return mockNotifications;
    return apiRequest<AppNotification[]>("/notifications");
  },
  async markAsRead(id: string): Promise<void> {
    if (useMock) return;
    await apiRequest<void>(`/notifications/${id}/read`, { method: "POST" });
  },
  async markAllAsRead(): Promise<void> {
    if (useMock) return;
    await apiRequest<void>("/notifications/read-all", { method: "POST" });
  },
};
