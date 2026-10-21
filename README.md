# Hussein Portfolio

A bilingual (English/Arabic) neon-glass portfolio with a Supabase-powered admin dashboard.

## Setup
1. Open `config.js`.
2. Replace `YOUR_SUPABASE_PROJECT_URL` with your Supabase Project URL.
3. Replace `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY` with the **publishable key** (or legacy `anon` key) from Supabase Project Settings → API.
4. Never use the `service_role` or secret key in browser code.
5. Upload all files to your GitHub repository.
6. In Vercel, import that GitHub repository and deploy it as a static site.
7. Open `/admin.html`, sign in with the Supabase user you created, and manage your content.

## Security notes
- The browser key is intended to be public; database safety relies on correctly configured Row Level Security policies.
- Do not disable RLS and do not expose service-role credentials.
- For production, verify that owner policies require `auth.uid() = user_id` and that public SELECT policies only expose published/public rows.
- The admin UI can add/delete skills, projects and social links, and update the profile. Avatar and project images should be hosted at a public HTTPS URL for now.
