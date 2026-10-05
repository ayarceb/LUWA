# LUWA Visits page — static preview

`visits.html` uses the public `https://ipwho.is/` endpoint to obtain an approximate IP-based city/country for the current visitor. No GPS permission is requested.

## Important limitation
Because `luwaapp.com` is hosted on GitHub Pages, this build cannot aggregate different visitors globally. It stores only coarse city/country visit history in the current browser (`localStorage`).

For true global analytics later, keep the same UI and replace the local data source with a shared analytics backend/API.

## Navigation
The `Visits` / `Visitas` link is inserted before `Contact` on the main pages and the fixed-width navigation in `assets/language.js` is updated to keep menu positions stable.
