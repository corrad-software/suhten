import { apiRequest, cancelLogoutInFlight, ensureCsrfCookie } from "./client";
import type { User } from "@/types";

export async function login(email: string, password: string) {
  // Do not queue behind a background /api/auth/logout on `php artisan serve`.
  cancelLogoutInFlight();
  // Reuse CSRF cookie when present — avoid an extra sanctum round-trip on re-login.
  await ensureCsrfCookie();
  return apiRequest<{ data: { user: User } }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(signal?: AbortSignal) {
  return apiRequest<{ data: { success: boolean } }>("/api/auth/logout", {
    method: "POST",
    signal,
  });
}

export async function getMe() {
  return apiRequest<{ data: { user: User } }>("/api/auth/me");
}

export async function updateProfile(data: { name?: string; email?: string }) {
  return apiRequest<{ data: { user: User } }>("/api/auth/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  return apiRequest<{ data: { message: string } }>("/api/auth/password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<{ data: { user: User } }>("/api/auth/avatar", {
    method: "POST",
    body: formData,
  });
}

export async function removeAvatar() {
  return apiRequest<{ data: { user: User } }>("/api/auth/avatar", {
    method: "DELETE",
  });
}
