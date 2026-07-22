import { defineStore } from "pinia";

import { getMe, login, logout, updateProfile as apiUpdateProfile, changePassword as apiChangePassword, uploadAvatar as apiUploadAvatar, removeAvatar as apiRemoveAvatar } from "@/api/auth";
import type { User } from "@/types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    loading: false,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    async initialize() {
      if (this.initialized) return;
      this.initialized = true;
      try {
        const response = await getMe();
        this.user = response.data.user;
      } catch {
        this.user = null;
      }
    },
    async signIn(email: string, password: string) {
      this.loading = true;
      try {
        // Login already returns the user — skip a second /api/auth/me round-trip.
        const response = await login(email, password);
        this.user = response.data.user;
      } finally {
        this.loading = false;
      }
    },
    async signOut() {
      // Clear local auth first so UI can leave immediately.
      this.user = null;
      try {
        await logout();
      } catch {
        // Ignore network errors — local session is already cleared.
      }
    },
    async updateProfile(data: { name?: string; email?: string }) {
      const response = await apiUpdateProfile(data);
      this.user = response.data.user;
    },
    async changePassword(data: { currentPassword: string; newPassword: string }) {
      await apiChangePassword(data);
    },
    async uploadAvatar(file: File) {
      const response = await apiUploadAvatar(file);
      this.user = response.data.user;
    },
    async removeAvatar() {
      const response = await apiRemoveAvatar();
      this.user = response.data.user;
    },
  },
});
