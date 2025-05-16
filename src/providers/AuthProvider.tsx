import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth";
import { Toaster } from "@/components/ui/toaster";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isStoreReady, setIsStoreReady] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    // Check for active session on initial load
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const { session } = data;

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
        setIsStoreReady(true);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsStoreReady(true); // Still set ready even on error to prevent blocking UI
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show nothing until the store is ready to prevent errors
  if (!isStoreReady) {
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
