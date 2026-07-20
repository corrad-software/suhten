import { apiRequest } from "@/api/client";
import type { ChatFavoriteItem, ChatMessage, ChatSession, ChatSuggestion } from "@/types";

export async function newUserChatSession(opt?: { moduleFilter?: string; title?: string }) {
  const body: Record<string, unknown> = {};
  if (opt?.moduleFilter) body.moduleFilter = opt.moduleFilter;
  if (opt?.title) body.title = opt.title;
  return apiRequest<{ data: { session: ChatSession; messages: ChatMessage[] } }>("/api/chat/user/sessions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getMyUserChatSessions() {
  return apiRequest<{ data: ChatSession[] }>("/api/chat/user/sessions");
}

export async function getUserChatSession(sessionId: number) {
  return apiRequest<{ data: ChatSession }>(`/api/chat/user/sessions/${sessionId}`);
}

export async function sendUserChatMessage(sessionId: number, message: string, files?: File[]) {
  if (files && files.length > 0) {
    const form = new FormData();
    form.append("message", message);
    files.forEach((f) => form.append("attachments[]", f));
    return apiRequest<{ data: ChatMessage }>(`/api/chat/user/sessions/${sessionId}/messages`, {
      method: "POST",
      body: form,
    });
  }
  return apiRequest<{ data: ChatMessage }>(`/api/chat/user/sessions/${sessionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function updateUserChatSession(sessionId: number, opts: { moduleFilter?: string }) {
  const body: Record<string, unknown> = {};
  if (opts.moduleFilter !== undefined) body.moduleFilter = opts.moduleFilter;
  return apiRequest<{ data: ChatSession }>(`/api/chat/user/sessions/${sessionId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteUserChatSession(sessionId: number) {
  return apiRequest<{ data: { success: boolean } }>(`/api/chat/user/sessions/${sessionId}`, {
    method: "DELETE",
  });
}

export async function toggleUserChatSessionFavorite(sessionId: number) {
  return apiRequest<{ data: { favorited: boolean } }>(`/api/chat/user/sessions/${sessionId}/favorite`, {
    method: "POST",
  });
}

export async function searchUserChatMessages(sessionId: number, q: string) {
  return apiRequest<{ data: ChatMessage[]; meta: { count: number } }>(
    `/api/chat/user/sessions/${sessionId}/messages/search?q=${encodeURIComponent(q)}`,
  );
}

export async function listUserChatFavorites(params = "") {
  return apiRequest<{ data: ChatFavoriteItem[]; meta: Record<string, unknown> }>(
    `/api/chat/user/favorites${params}`,
  );
}

export async function toggleUserChatMessageFavorite(messageId: number) {
  return apiRequest<{ data: { favorited: boolean } }>(`/api/chat/user/messages/${messageId}/favorite`, {
    method: "POST",
  });
}

export async function getUserChatSuggestions() {
  return apiRequest<{ data: ChatSuggestion[] }>("/api/chat/user/suggestions");
}
