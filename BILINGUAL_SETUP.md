# LUWA bilingual frontend (EN / ES)

This version adds a persistent English/Spanish selector to the main public LUWA pages.

## Added

- `assets/language.js`
- Language selector: `🌐 EN ES`
- Browser-language detection on first visit.
- User selection stored in `localStorage` under `luwa-language`.
- The selected language remains active while navigating between the supported pages.

## Pages enabled

- `index.html`
- `about.html`
- `consultancy-services.html`
- `data-methods.html`
- `contact.html`
- `sensing.html`
- `carbono.html`
- `auth.html`

## Carbon calculator

The calculator keeps the same emission factors and calculation logic. Labels and generated result text switch between English and Spanish. Number formatting follows `en-US` or `es-MX` according to the selected language.

## Deployment

From the `LUWA` repository directory:

```bash
git status
git add assets/language.js index.html about.html consultancy-services.html data-methods.html contact.html sensing.html carbono.html auth.html BILINGUAL_SETUP.md
git commit -m "Add English-Spanish language selector"
git push origin main
```

Then verify the public site and use a hard refresh if needed (`Command + Shift + R` on macOS Chrome).

## Technical note

The long LOTOS-EUROS reference section in `data-methods.html` includes translated navigation, section headings, workflow labels, and major interface text. Highly detailed scientific reference prose remains in its original English in this first bilingual release so technical wording is not altered automatically without scientific review.
