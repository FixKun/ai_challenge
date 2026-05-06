\# Task-2 Development Report



\## Toolchain



\*\*Lovable\*\* — primary tool (scaffolding, UI, schema, migrations). \*\*GitHub Copilot\*\* — secondary (bug fixing, logic refinement). \*\*Vercel\*\* — hosting via GitHub auto-deploy. \*\*Supabase\*\* — backend (Postgres, RLS, Auth, Storage, Realtime).



\## What Worked



Lovable handled broad strokes well: full DB schema with RLS policies and triggers, shadcn/ui component setup, and CRUD pages (EventEditor, HostDashboard, Explore) were produced quickly from prompts.



\## What Needed Copilot



\- \*\*Broken PostgREST joins\*\* — Lovable repeatedly used `!fkey` syntax on FKs pointing to `auth.users` instead of `profiles`, causing silent `null` returns. Affected check-in ticket lookup, members list display names, and CSV export. All required a two-step query pattern.

\- \*\*Various fixes\*\* 



\## What Did Not Work



Lovable's self-repair loop couldn't catch silent `null` returns from bad PostgREST joins — it regenerated the same broken pattern across multiple features. Trigger reliability on the live DB also required manual verification.

