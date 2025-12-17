export type NotificationType = "info" | "warning" | "action" | "success" | "error";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
  caseId?: string;
};
