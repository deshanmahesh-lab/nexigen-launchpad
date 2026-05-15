## Fix admin auth race condition in `src/routes/admin.tsx`

Rewrite only the auth logic in `src/routes/admin.tsx`. UI, styling, JSX, and the Google OAuth flow remain untouched.

### 1. `LoginScreen.handleSubmit` — gate navigation on role check

After `signInWithPassword` succeeds (signup branch unchanged aside from same gating):

- Get `data.user.id` from the sign-in response.
- Query `user_roles` for `role = 'admin'` for that user id with `.maybeSingle()`.
- If admin row exists:
  - `toast.success("Welcome back")`
  - `onSuccess()`
  - `navigate({ to: "/admin" })`
- If no admin row (or query error):
  - `toast.error("Access Denied: Admin privileges required")`
  - `await supabase.auth.signOut()`
  - Do NOT navigate. Stay on the login screen.
- Wrap in try/finally so `setSubmitting(false)` always runs.

Signup branch: same post-auth role check (the first signup becomes admin via the `bootstrap_first_admin` trigger, so the check still passes for the very first user; subsequent signups are auto-assigned `customer` and will be signed out with the access-denied toast — correct behavior for the admin route).

### 2. `AdminLayout.useEffect` — passive session verification only

Replace the current aggressive redirect-to-`/portal` behavior with a passive check:

- On mount, call `supabase.auth.getSession()`.
  - No session → `setAuthed(false)`, `setHydrated(true)`. Render `LoginScreen`. Do NOT navigate anywhere.
  - Session exists → query `user_roles` for admin once.
    - Admin → `setAuthed(true)`.
    - Not admin → `await supabase.auth.signOut()`, `setAuthed(false)`, `toast.error("Access Denied: Admin privileges required")`. No navigation.
- Subscribe to `onAuthStateChange` only to react to `SIGNED_OUT` (set `setAuthed(false)`); do NOT re-run the role check or navigate inside the listener — that's what causes the race with `handleSubmit`.
- Drop `checkingRole` state churn from the listener path; keep a single `hydrated` flag.
- Remove the `navigate({ to: "/portal" })` call entirely from `AdminLayout` so the login form is never yanked out from under the user mid-submit.

### 3. What stays exactly the same

- All JSX, classNames, glass styling, gradient blobs, NAV array, sidebar, mobile drawer.
- `LoginScreen` form fields, signup/signin toggle, Google button (`handleGoogle` unchanged).
- `handleLogout`, `NavItem`, `Route` export and its `head`/`notFoundComponent`.

### 4. Technical notes

- Use `.maybeSingle()` (not `.single()`) so a missing row returns `data: null` without throwing.
- Cleanup: keep the existing `mounted` flag pattern and unsubscribe from `onAuthStateChange` on unmount.
- No DB migrations, no other files touched.
