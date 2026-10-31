# Cinnamon Fancy Zones Specification

## Purpose

Provide a simple, keyboard-driven way to define zones and snap windows into them on Cinnamon desktops.

## Core Features

- **F001 — Single configuration:** WHEN a user configures zones, THEN the extension SHALL provide one zone configuration that can contain multiple zones, without requiring users to manage or switch between profiles.
- **F002 — Overlapping zones:** WHEN a user defines zones, THEN the extension SHALL allow zones to overlap.
- **F003 — Edit zones by shortcut:** WHEN a user invokes the zone-editing keyboard shortcut, THEN the extension SHALL allow the user to define or edit zones.
- **F004 — Snap window by shortcut:** WHEN a user invokes the snapping keyboard shortcut, THEN the extension SHALL snap the active window to a selected zone.
- **F005 — Centered zone:** WHEN a user configures a zone as centered, THEN the extension SHALL center that zone on its monitor.
- **F006 — Pixel dimensions:** WHEN a user configures a zone's size, THEN the extension SHALL allow its width and height to be specified explicitly in pixels, for example, 1920 × 1080.

## Design Constraints

- Keep the implementation focused on these window-zoning features; avoid adding unrelated window-management functionality.
- A centered zone SHALL use its configured pixel dimensions.
