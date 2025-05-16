import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth";
import { Toaster } from "@/components/ui/toaster";

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
      } catch (error) {
        console.error("Error initializing auth:", error);
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

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
