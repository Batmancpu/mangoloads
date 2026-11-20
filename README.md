# MangoLoads

The public home for the Android projects of [Batmancpu](https://github.com/Batmancpu): careful interfaces, personal software and experiments in motion. Project direction and testing are human-led; AI assists substantially with implementation.

**Live site:** https://batmancpu.github.io/mangoloads/

**Source:** https://github.com/Batmancpu/mangoloads

## What is on the site

- A responsive, editorial homepage introducing the studio and flagship keyboard.
- A searchable catalogue of eight public Android projects, with download actions only where a public APK exists.
- An individual product page for each application, with functionality and limitations attributed to its own repository.
- A brrBoard product story featuring its actual MangoLoads identity art, feature *illustrations* clearly distinguished from device screenshots, a setup guide, and a history of signed `v1.0.N` releases.

| Website name | Source repository | Notes |
|---|---|---|
| **brrBoard** | [brrrBoard](https://github.com/Batmancpu/brrrBoard) | Android keyboard built on FrostKeys, HeliBoard and AOSP foundations |
| **brrMusic** | [brrMusic](https://github.com/Batmancpu/brrMusic) | Music application continuing Zenith / BitChord foundations |
| **brrrNews** | [CurrentLens](https://github.com/Batmancpu/CurrentLens) | Local-first reading and news project |
| **brrSpeak** | [Dictator-](https://github.com/Batmancpu/Dictator-) | Separate, experimental speech-integration companion |
| **expBoard** | [expmango](https://github.com/Batmancpu/expmango) | Keyboard exploration / test build |
| **Liquid Lab** | [liquid](https://github.com/Batmancpu/liquid) | Visual experiment |
| **Metrolist Fluid** | [Metrolist](https://github.com/Batmancpu/Metrolist) | Fork / UI exploration |
| **AfuseKt** | [InfuseKt-release](https://github.com/Batmancpu/InfuseKt-release) | Release-archive experiment; an APK may not be published |

The canonical brrMusic and brrSpeak pages are `/apps/brrmusic/` and `/apps/brrspeak/`. Older `/apps/bitchord/` and `/apps/dictate/` links still render the same current catalogue entries, to avoid breaking existing links. The internal catalogue IDs remain unchanged for compatibility.

## Design and assets

The visual language is **Midnight Sapphire × Moonlit Pearl**: spacious typography, crisp white surfaces, restrained blue accents, translucent cards and responsive layout. It takes broad inspiration from premium editorial hardware/product websites; it does **not** reuse Apple branding, copy, photos or UI assets.

- `assets/visuals/sapphire-optics.webp` is an original generated optical-glass background created for this redesign.
- `assets/visuals/brrboard-brand.webp` and `brrboard-identity.webp` are adapted for web display from the public brrBoard repository's own MangoLoads brand artwork.
- Keyboard, clipboard, emoji and microphone compositions on the brrBoard product page are CSS/SVG **concept illustrations**, not verified screenshots of a running APK.

Responsive layouts, keyboard-readable controls and reduced-motion preferences are supported. The site is static: no backend, login, advertising script, analytics tracker, paid hosting or API key is required. Public GitHub API requests are made client-side.

## Current build data

`downloads.json` stores manually verified fallback metadata. Browser-side JavaScript checks each corresponding public GitHub Releases endpoint and refreshes available APKs based on publication date, then caches results briefly (up to roughly 20 minutes). If GitHub is rate-limited, the last verified fallback remains available. A project without a public APK is never given a fabricated download link.

**brrBoard is treated separately from debug builds.** Only published, non-prerelease `v1.0.N` releases containing the `brrBoard.apk` asset are eligible for its primary download and build-history timeline. The fallback was verified at **v1.0.186 on 20 November 2026**; newer signed releases will appear when the public API finds them. The published APK is not a guarantee of device acceptance or an entirely finished UI.

### Important installation notes for brrBoard

- Current Android package ID: `com.mangoloads.board`. An installation of the older `com.orion.frostkeys.brrrboard` package cannot be updated in place; back up and restore settings where supported.
- The regular signed update APK does not embed the large offline speech model. A fresh installation that needs offline voice input requires the original-signed, model-inclusive bootstrap APK described in the [project's installation guide](https://github.com/Batmancpu/brrrBoard/blob/main/README.md).
- Optional offline swipe/gesture input requires a separately imported compatible library.
- The keyboard is designed to be local-first and does not declare Android's INTERNET permission. Consult the project's [privacy policy](https://github.com/Batmancpu/brrrBoard/blob/main/PRIVACY_POLICY.md) for details.
- brrSpeak is a *separate experimental application*; its device-specific OEM cold-start handoff should not be presented as universally proven.

## File layout

| File | Purpose |
|---|---|
| `index.html`, `premium.css`, `premium.js` | Homepage, premium visual layer, and live flagship release badge |
| `downloads.html`, `downloads.js` | Filterable catalogue, live APK lookup and cache |
| `apps/*/index.html`, `product-page.js` | Dedicated application pages and brrBoard release timeline |
| `products.json` | Project copy, feature sets, links and honest caveats |
| `downloads.json` | Verified fallback releases |
| `assets/visuals/` | Original optical art and sourced MangoLoads brand images |
| `styles.css`, `apple.css`, `site.js` | Existing shared components and interactions, still in use |
| `SITE_CONTEXT.md`, `AGENTS.md` | Project continuity and maintenance instructions |

## Publishing and maintenance

GitHub Pages serves this repository root from the **`main` branch**. Make changes only on `main` unless the owner explicitly asks otherwise. The current site and its canonical URL must be preserved. Use real repository/release evidence for app claims and update `products.json`, `downloads.json`, and the documentation together. See [`SITE_CONTEXT.md`](SITE_CONTEXT.md) for the 2026-11-20 refresh and verification record.

MangoLoads and referenced project names belong to their respective owners; source code, upstream projects, original images and trademarks remain credited to their creators. No closed-source content from another company's website is used here.
