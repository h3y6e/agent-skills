---
description: Provides instructions for implementing, integrating, or configuring Google Mobile Ads (GMA) SDK rewarded ads in Android, iOS, or Unity mobile applications. Use when the task involves setting up rewarded ads. Don't use for "rewarded interstitial" ads.
metadata:
    category: GoogleAds
    github-path: skills/ads/google-mobile-ads-rewarded
    github-ref: refs/heads/main
    github-repo: https://github.com/google/skills
    github-tree-sha: 6541248e6ae415629c43bc7ed1544e92b29e43fb
    version: 1.1.0
name: google-mobile-ads-rewarded
---
# Google Mobile Ads SDK - Rewarded Ads

Rewarded ads reward users with in-app items for interacting with full-screen
ads. Rewarded ads are served after a user explicitly opts in to view a rewarded
ad.

## Workflow

1.  **Determine the user's platform**: Identify if the project is Android,
    iOS, or Unity. If unclear, ask before proceeding.

2.  **Read the platform guide** for implementation details:
    -   Android: `references/android-rewarded.md`
    -   iOS: `references/ios-rewarded.md`
    -   Unity: `references/unity-rewarded.md`

3.  **Follow these steps in order**:
    -   [ ] Load the ad
    -   [ ] Register for ad event callbacks
    -   [ ] Add a UI element to view the ad for a reward
    -   [ ] Show the ad
    -   [ ] Verify the implementation
