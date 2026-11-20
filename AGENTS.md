# MangoLoads website instructions

This is the existing GitHub Pages website of `Batmancpu`, published from the **root of `main`** at https://batmancpu.github.io/mangoloads/. Keep that website, repository and URL; do not replace it with another hosting service or create a competing site.

## Before editing

1. Read `README.md`, `SITE_CONTEXT.md`, `products.json` and `downloads.json`.
2. Inspect current public source repositories and GitHub Releases before stating that features, versions, signing, privacy properties or release files are current.
3. For brrBoard, prefer the current `Batmancpu/brrrBoard` README, `PROJECT_CONTEXT.md`, `PRIVACY_POLICY.md`, active source tree and project `AGENTS.md`. Respect its private testing boundaries and human-confirmed device status.
4. Check repository status and changes before editing. Preserve unrelated work; do not force-push or switch to a feature branch without authorization.

## Content and visual standards

- Preserve the **MangoLoads Midnight Sapphire × Moonlit Pearl** identity and the approved blue keyboard plus glass mango brrBoard mark. Keep original/approved artwork sourced and identified.
- Premium, clear, thoughtful design is the target. Do not copy Apple's logos, protected website images, screenshots, or marketing copy. Generated visuals must be original and appropriate to this project's identity.
- Label abstract CSS or generated UI artwork as an *illustration*, not a real device screenshot. Do not invent unverified phone screenshots, downloadable APKs, features, performance claims or testing outcomes.
- Distinguish original work, forks and experiments; preserve source and upstream attribution.
- Support desktop and mobile, accessible text and contrast, semantic links and reduced-motion preferences.
- brrBoard signed public `v1.0.N` releases with a `brrBoard.apk` asset must not be mixed with debug `v2.5.8-debug.*` or other CI experiments in stable download links/history.
- State the voice-model bootstrap, legacy package-ID migration and separately imported gesture-library caveats where relevant. A GitHub release does not prove that a device-side defect was fixed.
- Keep legacy application routes working even when their public display names change.

## Release, testing and handoff

- Keep client-side GitHub release lookups operational and `downloads.json` fallbacks accurate. Handle API limits gracefully.
- Check JS syntax, JSON parsing, links, browser layout and downloads on representative pages. Verify publishing to the original GitHub Pages URL when possible.
- Do not commit temporary preview builds, credentials or machine-specific configuration.
- Record each substantive change, current release, verification step and unresolved caveat in `SITE_CONTEXT.md` and update README as appropriate. Maintain continuity for future contributors.
- Commit and push only authorized, reviewed website changes to **`main`**, respecting remote changes and never force-pushing.
