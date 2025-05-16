import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

export type Profile = {
  id?: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type AuthState = {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ data: any | null; error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    profile: Profile,
  ) => Promise<{ data: any | null; error: Error | null }>;
  signOut: () => Promise<void>;
  setUser: (user: any | null) => void;
  setProfile: (profile: Profile | null) => void;
  updateProfile: (
    profile: Partial<Profile>,
  ) => Promise<{ error: Error | null }>;
  fetchProfile: (userId: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user });

      // Fetch profile if user exists
      if (data.user) {
        await get().fetchProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { data: null, error: error as Error };
    }
  },

  signUp: async (email: string, password: string, profile: Profile) => {
    try {
      // Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone_number: profile.phone_number,
          },
        },
      });

      if (error) throw error;

      // If email confirmation is not required, the user will be signed in immediately
      if (data.user) {
        set({ user: data.user, profile });
      }

      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error: error as Error };
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    set({ user: null, profile: null });
  },

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),

  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        set({
          profile: {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            created_at: data.created_at,
            updated_at: data.updated_at,
          },
        });
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  },

  updateProfile: async (profile) => {
    try {
      const userId = get().user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      // Update local state
      set((state) => ({
        profile: { ...state.profile, ...profile } as Profile,
      }));

      return { error: null };
    } catch (error) {
      console.error("Update profile error:", error);
      return { error: error as Error };
    }
  },
}));
