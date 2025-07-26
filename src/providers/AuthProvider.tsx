import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth";
import { Toaster } from "@/components/ui/toaster";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state after component mounts
  useEffect(() => {
    // Check for active session on initial load
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const { session } = data;

        if (session?.user) {
          // Access store functions only after component is mounted
          useAuthStore.getState().setUser(session.user);
          await useAuthStore.getState().fetchProfile(session.user.id);
        }
        setIsStoreReady(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsStoreReady(true); // Still set ready even on error to prevent blocking UI
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (session?.user) {
        // Access store functions directly from the store state
        useAuthStore.getState().setUser(session.user);
        await useAuthStore.getState().fetchProfile(session.user.id);
      } else {
        useAuthStore.getState().setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state until the store is ready
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
