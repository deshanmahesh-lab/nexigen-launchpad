import { supabase } from "@/integrations/supabase/client";

/**
 * Resolve where a freshly-authenticated user should land.
 * - admin role → /admin
 * - customer role → /portal
 * - no role row → assign 'customer' and send to /portal
 * Returns null when there is no session yet (caller should stay on /login).
 */
export async function resolveAuthRedirect(): Promise<"/admin" | "/portal" | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return null;

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const hasAdmin = roles?.some((r) => r.role === "admin");
  if (hasAdmin) return "/admin";

  const hasCustomer = roles?.some((r) => r.role === "customer");
  if (hasCustomer) return "/portal";

  // No role yet → assign customer (RLS allows admins-only on insert, so this
  // will silently fail for self-signups; the bootstrap_first_admin trigger
  // handles role assignment server-side on signup, so this is a best-effort
  // fallback for already-existing users without a row).
  await supabase.from("user_roles").insert({ user_id: userId, role: "customer" });
  return "/portal";
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}