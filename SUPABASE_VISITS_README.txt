LUWA Global Visits - Supabase

1. Create a Supabase project.
2. Open SQL Editor and run SUPABASE_VISITS_SETUP.sql.
3. In Project Settings / API, copy:
   - Project URL
   - Publishable key (or legacy anon key)
4. Edit assets/supabase-config.js and replace the two placeholders.
5. Do NOT use or expose the service_role key.
6. Test locally with: python3 -m http.server 8000
7. Open http://localhost:8000/visits.html

Behavior:
- Each browser session records at most one visit in the frontend.
- IP geolocation is obtained from ipwho.is.
- Supabase stores only city, country, coarse (1 decimal) coordinates and timestamp.
- The world map always shows all-time global locations.
- Period filters affect summary statistics and rankings.
- localStorage remains as a fallback if Supabase is unavailable.
