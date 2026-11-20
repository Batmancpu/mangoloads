# MangoLoads website — maintenance context

## 2026-11-20: project refresh and premium redesign

**Owner request:** Update the existing website with the newest state of the owner's GitHub projects, redesign it with refined, premium Apple-like *visual craft*, create original supporting imagery/icons, and deploy the improvements to the existing GitHub Pages repository.

**Website:** `Batmancpu/mangoloads`, branch `main`, https://batmancpu.github.io/mangoloads/. This is a static site; `index.html` is the front door, not a compiled app.

### Public source evidence checked

- `Batmancpu/brrrBoard`: current flagship is **brrBoard** with official blue-keyboard-and-glass-mango identity; public signed release **`v1.0.186`**, published **20 November 2026**, APK `brrBoard.apk` (69,551,949 bytes), [release](https://github.com/Batmancpu/brrrBoard/releases/tag/v1.0.186). The current package is `com.mangoloads.board`; the previous `com.orion.frostkeys.brrrboard` cannot update in place. The regular update APK does not embed the offline voice model; bootstrap setup matters for fresh installs. Swipe library is imported separately. The keyboard does not request Android INTERNET permission.
- `Batmancpu/brrMusic`: former website BitChord entry updated to **brrMusic**, active public release **`v15.9.0.5`**, 20 November 2026. Built on Zenith/BitChord foundations; audio effects and platform integrations remain experimental.
- `Batmancpu/Dictator-`: former Dictate entry updated to **brrSpeak**, release **`brrspeak-audio-source-test-9`** from 19 November 2026. It is a separate speech experiment, not proof of a universally working OEM microphone handoff.
- `Batmancpu/CurrentLens`: brrrNews build `android-18`, 19 November 2026.
- `Batmancpu/liquid`: Liquid Lab build `liquid-test-1.0.0`, 16 November 2026.
- `Batmancpu/Metrolist`: Metrolist Fluid build `coloros-fluid-cloud-12`.
- `Batmancpu/expmango`: expBoard build `expBoard-build-9` (debug/experiment).
- `Batmancpu/InfuseKt-release`: AfuseKt archive has no verified public APK to advertise.

These were snapshots, not guarantees of the current latest version for future dates. The website refreshes public releases client-side, and the JSON files are its last verified fallback.

### Visual direction and implementation

- New **Midnight Sapphire × Moonlit Pearl** editorial treatment with large typography, airy spacing, white controls and original prismatic optical-glass art.
- `assets/visuals/sapphire-optics.webp`: custom generated imagery, original to this redesign.
- `assets/visuals/brrboard-brand.webp`: adapted directly from `brrrBoard/app/src/main/res/drawable-nodpi/mangoloads_brand_full.png`, preserving the approved blue keyboard and glass mango.
- `assets/visuals/brrboard-identity.webp`: adapted from `brrrBoard/art/brand/mangoloads/readme-hero-dark.png`.
- `index.html`, `premium.css`, `premium.js`: new homepage hero, featured brrBoard story, fresh collection identities, public release badge, scroll/motion polish and mobile responsiveness.
- `product-page.js` and product shells: flagship sapphire product page, branded art, honest CSS/SVG feature illustrations (explicitly not actual screenshots), install caveats and a chronological signed build-history section with Asia/Kolkata timestamps. Existing other app pages continue to render.
- `products.json`, `downloads.json`, `downloads.js`: audited links and display names, refreshed fallback release data, GitHub live checks with cache, stable brrBoard release selection which excludes debug artifacts.
- Canonical new `/apps/brrmusic/` and `/apps/brrspeak/` paths added while older paths remain functional for saved links.

### Verification

- Local GitHub Pages-like static preview at `http://127.0.0.1:4173/`, using a disposable `dist/` copy (not to be committed).
- Visually reviewed the homepage, downloads catalogue, brrBoard, brrMusic and brrSpeak desktop pages in a real browser. Navigation and art loaded; no horizontal overflow at desktop width on the inspected routes.
- Confirmed live brrBoard primary download points to `https://github.com/Batmancpu/brrrBoard/releases/download/v1.0.186/brrBoard.apk`.
- Confirmed the live brrBoard history lists eight signed versions: `v1.0.186`, `v1.0.183`, `v1.0.182`, `v1.0.178`, `v1.0.177`, `v1.0.176`, `v1.0.173`, `v1.0.172`; debug CI artifacts do not appear.
- Confirmed brrMusic and brrSpeak public APK links and current display names.
- `node --check` passed for `site.js`, `premium.js`, `downloads.js` and `product-page.js`; both JSON files parsed successfully; `git diff --check` passed; an automated local-link audit resolved 145 internal references across 12 HTML pages.

### Publication / live verification

- Published to the existing `Batmancpu/mangoloads` **`main`** branch on 20 November 2026. The website-content commit is [`0b8b8fa`](https://github.com/Batmancpu/mangoloads/commit/0b8b8fabf2c63a1674fc70dc0c87496996b53594), applied through the authenticated GitHub integration after the shell's `git push` lacked HTTPS credentials. No new branch, replacement hosting project or force update was used. The remote tree SHA `4b0c1b690fcb8a174c572ca64c7fdac5768df2ae` matched the locally reviewed tree exactly.
- Verified the public homepage live at https://batmancpu.github.io/mangoloads/ with the new sapphire artwork, approved brrBoard mango badge, premium stylesheet, and `v1.0.186` build display.
- Verified the published `/apps/brrrboard/` page loaded its official artwork, pointed to the correct signed APK, displayed the install guide and eight non-debug release entries, with no desktop horizontal overflow.
- Verified both new published routes `/apps/brrmusic/` and `/apps/brrspeak/` loaded with the correct titles. The temporary preview `dist/` tree and `.openai/hosting.json` were not committed.

### Caveats / future work

- The product feature mockups are **artistic illustrations**, not device-accepted screenshots. Replace or supplement them only when genuine screenshots from verified current APKs are available.
- Some upstream/experimental projects may have caveats or incomplete Android/OEM integration. Do not over-promise working device features.
- Public GitHub APIs have anonymous rate limits. Keep truthful fallbacks and make sure failures never create fictional APK links.
- `brrBoard` (app name), `brrrBoard` (source repo) and `brrrNews` (another app) are intentionally different spellings. Preserve them.
- Avoid committing the disposable `.openai/hosting.json` preview config or `dist/` tree to the existing static GitHub Pages repository.
