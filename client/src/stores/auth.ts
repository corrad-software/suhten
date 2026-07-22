import { defineStore } from "pinia";

import { isLogoutInFlight, trackLogout } from "@/api/client";
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
      // Logout cleared local auth; do not probe /me while logout is in flight —
      // that request queues behind logout on `php artisan serve` and blocks navigation.
      if (isLogoutInFlight()) {
        this.user = null;
        this.initialized = true;
        return;
      }
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
        this.initialized = true;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Clear local auth immediately and kick off server logout in the background.
     * Keep `initialized = true` with `user = null` so router guards do not call /me
     * and block navigation to the login page.
     * CSRF cookie stays valid (server logout no longer invalidates the session).
     */
    signOut() {
      this.user = null;
      this.initialized = true;
      trackLogout((signal) => logout(signal));
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
