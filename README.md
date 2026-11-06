# MangoLoads

A home for Batmancpu's apps, experiments and builds. One person brings the ideas, direction and testing; AI helps build much of the code.

**Website:** https://batmancpu.github.io/mangoloads/

## Pages

- **Home** — a focused introduction and swipeable carousel of all eight projects.
- **Applications** — a searchable catalogue with current build information and one-click APK links when an APK asset exists.
- **Application pages** — a dedicated page for each project, with its own introduction, feature stories, screenshots, caveats and download action.

## Visual approach

A restrained, editorial product experience: warm paper tones, carefully spaced typography, product-specific colour, real repository screenshots, subtle scroll reveals and a horizontal product carousel. The site takes cues from high-end product storytelling without copying another company's branding.

Responsive layouts support phones, tablets and desktop. Reduced-motion preferences are respected. No framework, build step, backend, database, paid hosting, tracking script or paid API is required.

## Latest builds

The download catalogue starts with `downloads.json` as a fallback, then checks each public GitHub Releases endpoint in the visitor's browser. It selects the newest non-draft release containing an APK by actual publication date, including pre-releases. This avoids relying on GitHub's `/releases/latest` marker where it may be stale.

Builds are cached locally in the visitor's browser for a short period. If the GitHub API is unavailable or rate-limited, the last verified fallback metadata remains available. A repository with no APK release asset is not given an invented download link.

## Public repositories represented

| Project | Repository | Relationship |
|---|---|---|
| brrrNews | [CurrentLens](https://github.com/Batmancpu/CurrentLens) | Original project |
| brrrBoard / FrostKeys | [brrrBoard](https://github.com/Batmancpu/brrrBoard) | Fork and customisation |
| expBoard | [expmango](https://github.com/Batmancpu/expmango) | Original prototype |
| Liquid Lab | [liquid](https://github.com/Batmancpu/liquid) | Original experiment |
| Metrolist Fluid | [Metrolist](https://github.com/Batmancpu/Metrolist) | Upstream fork |
| BitChord FC | [Bitchordfc](https://github.com/Batmancpu/Bitchordfc) | Upstream fork |
| Dictate Keyboard | [Dictator-](https://github.com/Batmancpu/Dictator-) | Compiled upstream project |
| AfuseKt | [InfuseKt-release](https://github.com/Batmancpu/InfuseKt-release) | Release archive fork |

Private repositories are excluded. Original work is clearly distinguished from forks, compiled upstream applications and release archives. Upstream names, trademarks, source code and images remain with their respective owners.

## Files

- `index.html` — home page
- `downloads.html` — applications catalogue
- `apps/*/index.html` — individual application page shells
- `products.json` — product copy, features, tags, screenshots and attribution notes
- `downloads.json` — verified fallback release data
- `styles.css` — shared responsive design system
- `site.js` — theme, reveal and carousel interactions
- `downloads.js` — live GitHub release lookup, search and filtering
- `product-page.js` — product storytelling, screenshots and latest APK action
- `favicon.svg` — MangoLoads mark

## Publishing

GitHub Pages serves the repository root from the `main` branch.

https://batmancpu.github.io/mangoloads/
