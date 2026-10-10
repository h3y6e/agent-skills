---
description: Provides instructions for implementing, integrating, or configuring Google Mobile Ads (GMA) SDK interstitial ads in Android, iOS, or Unity mobile applications. Use when the task involves setting up interstitial ads. Don't use for "rewarded interstitial" ads.
metadata:
    category: GoogleAds
    github-path: skills/ads/google-mobile-ads-interstitial
    github-ref: refs/heads/main
    github-repo: https://github.com/google/skills
    github-tree-sha: 0667f435c543d5e312e7ef8fa483aa37cb698414
    version: 1.1.0
name: google-mobile-ads-interstitial
---
# Google Mobile Ads SDK - Interstitial Ads

Interstitial ads show full-page ads for users on mobile apps. Interstitial ads
are designed to be placed between content and are best placed at natural app
transition points.

## Workflow

1.  **Determine the user's platform**: Identify if the project is Android,
    iOS, or Unity. If unclear, ask before proceeding.

2.  **Read the platform guide** for implementation details:
    -   Android: `references/android-interstitial.md`
    -   iOS: `references/ios-interstitial.md`
    -   Unity: `references/unity-interstitial.md`

3.  **Follow these steps in order**:
    -   [ ] Load the ad
    -   [ ] Register for ad event callbacks
    -   [ ] Show the ad
    -   [ ] Verify the implementation
