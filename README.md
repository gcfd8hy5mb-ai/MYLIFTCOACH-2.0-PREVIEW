# MYLIFTCOACH 2.0 — Independent Preview Repository

Purpose: all experimental design and functionality work happens here, not in the Stable MYLIFTCOACH-2.0 repository.

## Permanent isolation rules
1. Stable 11-21N: gcfd8hy5mb-ai/MYLIFTCOACH-2.0. Keep its last restored deployment configuration unmodified.
2. Preview: new separate repository `gcfd8hy5mb-ai/MYLIFTCOACH-2.0-PREVIEW`, with its own GitHub Pages deployment and Actions.
3. Do NOT place preview workflows in Stable. Do NOT run changes to Stable's `.github/workflows/pages-beta-preview.yml` while iterating.
4. Initially only a visual/interactive sandbox with no Supabase, auth, network, cookies, or local/browser storage. Temporary data resets on refresh.
5. Before functional cloud integration, provision a dedicated test backend and test credentials. Never connect to Stable's database.
6. Promote to Stable only after user approval, independent checks and backup. No automatic preview-to-stable promotion.

## Populate new preview repo
- `index.html` <- Stable source repo `review/workouts-sandbox.html`
- `workouts-sandbox.js` <- `review/workouts-sandbox.js`
- `workouts-sandbox.css` <- `review/workouts-sandbox.css`
- `workouts-visual-preview.css` <- `review/workouts-visual-preview.css`
- `assets/approved-vertical-marble-sharp.webp` <- approved source media; preserve the same design asset
- `.github/workflows/pages.yml` <- `standalone-preview-template/pages.yml` from this handoff branch

Set GitHub Pages deployment source to GitHub Actions in the new repository Settings > Pages.

## Status
The current saved Stable app is 11-21N. The old preview at `MYLIFTCOACH-2.0/workouts-n-review/` must not be used for development, because the old deployment coupled Stable and Preview. Independent Preview has not been created until the new repository exists and GitHub Pages verifies its URL.

Created specifically to avoid repeating shared-deployment regressions.
