# Nexigen CMS — Unified Auth, Admin Redesign, Portal Polish

This plan covers four work blocks. Existing Supabase schema, 

migrations, and RLS stay untouched — only UI, routes, and 

data-fetching code change.

## Part 1 — Unified Login at `/login`

- New route `src/routes/login.tsx` (public). Glassmorphism card, 

  Nexigen logo, gradient #7CC4E8 → #8B6EC4, fade-in animation.

- Tabs: Sign In / Sign Up. Email + password fields + 

  "Continue with Google" button using lovable.auth.signInWithOAuth.

- Post-auth resolver in `src/lib/auth-redirect.ts`:

  1. getSession() → if no session, stay on /login.

  2. Query user_roles for current user_id.

  3. If role = 'admin' → navigate to /admin.

  4. If role = 'customer' → navigate to /portal.

  5. If no row → insert { user_id, role: 'customer' }, 

     then navigate to /portal.

- Resolver runs on mount (handles OAuth return) and after 

  each successful sign-in/sign-up.

- /admin guard: if no session or not admin → redirect to /login.

- /portal guard: if no session → redirect to /login.

- Remove embedded LoginScreen from src/routes/admin.tsx and 

  src/routes/portal.tsx. Both become pure protected layouts.

## Part 2 — Admin Dashboard Redesign

### Shell (src/routes/admin.tsx)

- Replace current sidebar with a collapsible icon-mode sidebar

  using shadcn Sidebar component, gradient brand header, admin 

  email + logout in footer.

- Nav items with lucide icons: Dashboard, Site Settings, Services,

  Process, Stats, Projects, Tech Stack, Testimonials, Careers, 

  Blog, Messages, Chats.

- Messages nav item shows unread badge (contact_messages read=false 

  count).

- Testimonials nav item shows pending count (status='draft').

- Chats nav item shows badge for is_from_admin=false messages 

  in last 24h.

### Dashboard home (/admin/)

- Welcome header with admin email.

- 6 gradient stat cards with animated counters: Published Services,

  Published Projects, Published Testimonials, Pending Reviews, 

  Unread Messages, Active Chats (distinct customer_ids in 

  portal_messages last 7 days).

- Recent 5 contact messages list with unread dot, click opens 

  Messages page.

- Quick action grid links to each section.

- Open Preview button opening site with ?preview=1.

- Drafts banner if unpublished changes exist.

### Admin Sections

#### /admin/settings — Site Settings (tabbed)

Tabs: Hero | Services Section | About | Certifications | 

Careers Intro | Contact Info | Footer

TAB: Hero

- Badge text (text input)

- Title Line 1 (text input)

- Title Line 2 / highlighted text (text input)

- Description paragraph (textarea)

- Trust badges — editable tag list 

  (e.g., "ISO 27001 Certified", "GDPR Compliant", "50+ Projects")

  Stored in site_config key "hero" as JSON:

  { badge, title_line1, title_line2, description, trust_badges: [] }

TAB: Services Section

- Section heading (e.g., "What We Build")

- Section subtitle/description paragraph

  Stored in site_config key "services_section" as JSON:

  { heading, subtitle }

TAB: About

- Section title (text input, wrap word in **word** for gradient)

- Paragraphs (textarea, split by blank line)

- Values/tags list (e.g., "Radical Transparency", 

  "Engineering Excellence") — editable tag list

- Info cards: Founded, HQ, Team, Compliance — 4 editable pairs

  Stored in site_config key "about"

TAB: Certifications

- Section title (e.g., "Globally Certified. Enterprise Ready.")

- Certifications list — full CRUD for individual cert items:

  Each item: Icon name (dropdown from lucide), Title, Description

  Stored as JSON array in site_config key "certs":

  { title: string, items: [{ icon, title, description }] }

- Add / Edit / Delete individual certification cards

TAB: Careers Intro

- Description text shown under "Join the Team" heading

  Stored in site_config key "careers_intro"

TAB: Contact Info

- Company email, Phone, Location, Business hours

  Stored in site_config key "contact_info"

TAB: Footer / Company

- Tagline, Email, Location, Copyright text

- Social links: LinkedIn, GitHub, Twitter, Dribbble URLs

  Stored in site_config key "footer"

#### /admin/services — already exists, keep + restyle

Draft/Publish workflow, icon dropdown, order index.

#### /admin/process — already exists, keep + restyle

#### /admin/stats — already exists, keep + restyle

#### /admin/projects — already exists, keep + restyle

Category dropdown: Enterprise / FinTech / Healthcare / SaaS

#### /admin/tech — already exists, keep + restyle

#### /admin/testimonials — already exists, keep + restyle

Two sections: Pending (draft) → Approve or Reject; Published list.

#### NEW /admin/careers — tabbed: Perks | Open Roles

PERKS tab (CRUD over perks table):

- Emoji, Title, Description, Order index

OPEN ROLES tab (CRUD over open_roles table):

- Job Title, Department, Type, Apply Link (Google Form URL), 

  Order index

- The public site "Apply Now →" button opens this URL in new tab

#### NEW /admin/blog — CRUD over blog_posts table

Fields: Category, Title, Author, Read time, External article URL,

Order index

#### /admin/messages — already exists, polish UI

Table view, click to expand, mark read/unread, delete, unread badge.

#### /admin/chats — already exists, polish UI

Two-pane realtime chat, admin reply, customer list.

## Part 3 — Public Site Changes

### Contact Form (src/components/site/Sections.tsx)

REMOVE the "Budget Range" field completely.

Keep: Name, Company, Email, Project Type, Message.

On submit: save to contact_messages (no email sending — admin 

reads from dashboard).

### Careers Section — Open Roles Apply Button

For each open_role from database:

- If apply_link is a valid non-empty URL (not "#" or empty):

  Render "Apply Now →" as <a href={apply_link} target="_blank">

- Else: render disabled "Coming Soon" pill badge

### All Content From Database

Confirm every public section reads from Supabase:

- Hero: site_config "hero" → badge, title_line1, title_line2, 

  description, trust_badges array

- Services section heading/subtitle: site_config "services_section"

- Services cards: services table (published only)

- Process steps: process_steps table ordered by order_index

- Stats: stats table (published only)

- Projects: projects table (published only), filterable by category

- Tech Stack: tech_stack table ordered by order_index

- Testimonials: testimonials table (published only)

- About: site_config "about"

- Certifications: site_config "certs" → title + items array

- Careers intro: site_config "careers_intro"

- Perks: perks table ordered by order_index

- Open Roles: open_roles table ordered by order_index

- Blog posts: blog_posts table ordered by order_index

- Contact info: site_config "contact_info"

- Footer: site_config "footer"

## Part 4 — Customer Portal Redesign

### /portal layout

Glass header: "Client Portal" title, user email, Logout button.

Tabs: Project Chat | Leave a Review.

### Project Chat tab

Chat bubble UI: customer messages right-aligned (brand gradient 

#7CC4E8→#8B6EC4), admin messages left-aligned (muted glass card).

Timestamps on each message. Auto-scroll to bottom.

Subtitle: "We typically reply within a few business hours."

Realtime via portal_messages Supabase subscription.

### Leave a Review tab

Form fields: Quote/testimonial text (textarea), Your name, 

Role/Company, Country flag emoji.

On submit: insert into testimonials with status='draft', 

customer_id=auth.uid().

Success state: "Thank you! Your review is pending approval from 

our team." with checkmark icon.

Show user's own previous draft submissions as read-only cards 

below form.

## Part 5 — Auth Provider Config

Call configure_social_auth with providers: ["google"] to ensure 

Google OAuth is enabled in Supabase.

## Technical Notes

No DB schema changes. All tables and RLS policies remain unchanged.

New files:

- src/routes/login.tsx

- src/routes/admin/careers.tsx

- src/routes/admin/blog.tsx

- src/lib/auth-redirect.ts

- src/components/admin/AdminSidebar.tsx

- src/components/admin/StatCard.tsx

Edited files:

- src/routes/admin.tsx (remove LoginScreen, add sidebar)

- src/routes/admin/index.tsx (new dashboard home)

- src/routes/admin/settings.tsx (extended with all tabs)

- src/routes/admin/testimonials.tsx (polish)

- src/routes/admin/messages.tsx (polish)

- src/routes/admin/chats.tsx (polish)

- src/routes/portal.tsx (remove LoginScreen, protect with /login)

- src/routes/portal/index.tsx (redesign tabs)

- src/components/site/Sections.tsx (remove Budget Range, 

  Apply Now links, all content from DB)

- src/lib/queries.ts (add missing query functions)

NOTE: routeTree.gen.ts is auto-generated by TanStack Router plugin.

Do NOT manually edit it — it will update automatically when new 

route files are added.