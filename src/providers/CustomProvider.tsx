"use client";

import { SupabaseAuthProvider } from "./AuthProvider";
import type { AuthUser, Session } from "@supabase/supabase-js";
import UrqlProvider from "./UrqlProvider";

type CustomProviderProps = React.PropsWithChildren<{
  initialUser?: AuthUser | null;
  initialSession?: Session | null;
}>;

export default function CustomProvider({
  children,
  initialUser,
  initialSession,
}: CustomProviderProps) {
  return (
    <SupabaseAuthProvider
      initialUser={initialUser}
      initialSession={initialSession}
    >
      <UrqlProvider>{children}</UrqlProvider>
    </SupabaseAuthProvider>
  );
}
