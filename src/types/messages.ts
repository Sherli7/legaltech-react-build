export type MessageAttachment = {
  id: string;
  name: string;
  url: string;
  size: number;
};

export type CaseMessage = {
  id: string;
  caseId: string;
  author: {
    id: string;
    name: string;
    role: "user" | "lawyer" | "admin" | "system";
  };
  content: string;
  createdAt: string;
  isRead: boolean;
  attachments?: MessageAttachment[];
};
