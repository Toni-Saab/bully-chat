// packages/store/src/lib/userStore.ts

import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, signOut, getUserProfile, Profile } from '@event-bot/data-access';

type UserState = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isLoggedIn: boolean;

  setAuthState: (user: User | null, profile: Profile | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isLoggedIn: false,

  setAuthState: (user, profile) => {
    let loggedIn = false;
    if (user) {
      loggedIn = true;
    }
    set({
      user,
      profile,
      isLoggedIn: loggedIn,
      isLoading: false,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      let profileData: Profile | null = null;

      if (user) {
        profileData = await getUserProfile(user.id);
      }

      get().setAuthState(user, profileData);
    } catch {
      console.error('Auth check failed');
      get().setAuthState(null, null);
    }
  },

  logout: async () => {
    try {
      await signOut();
      get().setAuthState(null, null);
    } catch {
      console.error('Logout failed');
    }
  },
}));