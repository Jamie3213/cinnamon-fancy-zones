# Project Context

This project aims to provide FancyZones-style window tiling for Cinnamon desktops, including Linux Mint. The repository is currently an initial scaffold; treat implementation details and supported Cinnamon versions as undecided unless the code or user specifies them.

## Feature Specification

See [SPEC.md](./SPEC.md) for the required user-facing behavior. Keep it as the source of truth for feature scope.

## Design Direction

- Prefer a native Cinnamon extension implemented in JavaScript with GJS.
- Use Cinnamon and Muffin/Meta window-management APIs for observing, moving, and resizing windows. Verify API availability and behavior against the Cinnamon versions being targeted.
- Use Cinnamon's settings mechanisms for persistent user configuration; keep window-management behavior in the extension.
- Avoid external helpers and low-level X11-specific dependencies unless native APIs cannot meet a demonstrated requirement.

## Design Principles

- Keep the extension simple and focused on its core purpose: defining zones and placing windows into them.
- Prefer the smallest implementation that reliably supports the intended workflow. Avoid speculative features, unnecessary abstractions, and general-purpose frameworks.
- Make feature decisions based on clear user value for this extension; do not build a broader window-management platform.
- Keep interactions and configuration straightforward, and expand scope only when a concrete need justifies the added complexity.

## Implementation Guidance

- Keep the extension compatible with the project's declared Cinnamon/GJS support range; do not assume APIs are identical across versions.
- Preserve desktop conventions for keyboard interaction, focus, and window placement.
- Keep user-configurable layout data separate from window-management logic. Use small, focused modules rather than monolithic scripts.
- Prefer pure functions for zone sizing, centering, bounds clamping, and other logic that can be kept independent of Cinnamon APIs.
- Make logic easy to test in isolation; keep interactions with Cinnamon and Muffin APIs at clear boundaries and cover them with focused tests where practical.
- Add or update tests and documentation when introducing behavior. Use the repository's existing tooling; do not invent build or test commands before tooling is established.
