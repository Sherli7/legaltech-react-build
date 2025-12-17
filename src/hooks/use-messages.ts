import { useEffect, useState } from "react";
import { messagesService } from "@/services";
import type { CaseMessage } from "@/types/messages";

export function useMessages(caseId: string) {
  const [items, setItems] = useState<CaseMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await messagesService.list(caseId);
      setItems(data);
    } catch (err: any) {
      setError(err?.message || "Impossible de récupérer les messages");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    setIsSending(true);
    try {
      const msg = await messagesService.send(caseId, content);
      setItems((prev) => [...prev, msg]);
    } finally {
      setIsSending(false);
    }
  };

  const markAsRead = async (ids: string[]) => {
    setItems((prev) => prev.map((m) => (ids.includes(m.id) ? { ...m, isRead: true } : m)));
    try {
      await messagesService.markAsRead(caseId, ids);
    } catch {
      // ignore errors in mock
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [caseId]);

  return { items, isLoading, error, isSending, fetchMessages, sendMessage, markAsRead };
}
