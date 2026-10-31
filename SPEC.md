# Cinnamon Fancy Zones Specification

## Purpose

Provide a simple, keyboard-driven way to place windows into a small set of centered zones on Cinnamon desktops.

## Functional Requirements

- **F001 — Single configuration:** WHEN a user configures zones, THEN the extension SHALL store and use one persistent configuration, without profile switching.
- **F002 — Three zone slots:** WHEN the user configures the extension, THEN the extension SHALL provide three zone slots, numbered 1, 2, and 3.
- **F003 — Simple zone configuration:** WHEN a user configures a zone slot, THEN the extension SHALL let the user choose a centered zone size from a predefined set of pixel dimensions, without requiring a graphical zone-drawing editor.
- **F004 — Overlapping zones:** WHEN configured zones overlap, THEN the extension SHALL allow the overlap.
- **F005 — Keyboard snapping:** WHEN the user presses Ctrl + Alt + Super + 1, 2, or 3, THEN the extension SHALL snap the active window to the corresponding configured zone.
- **F006 — Active monitor:** WHEN a window is snapped, THEN the extension SHALL place its zone on the monitor containing the active window.
- **F007 — Centered placement:** WHEN a zone is placed on a monitor, THEN the extension SHALL center it on that monitor.
- **F008 — Resolution bounds:** WHEN a configured zone is larger than its monitor, THEN the extension SHALL cap its width and height to that monitor's current display resolution and keep the resulting zone within the monitor.
- **F009 — Persistent configuration:** WHEN a user changes zone settings, THEN the extension SHALL save the configuration and restore it after the extension or desktop restarts.
- **F010 — Cinnamon compatibility:** WHEN implementing window management and shortcuts, THEN the extension SHALL prefer stable, documented Cinnamon/GJS APIs and avoid unnecessary version-specific or low-level dependencies.

## Design Constraints

- Keep the implementation focused on defining and snapping windows to the three centered zones.
- Keep the configuration interface simple; a graphical zone editor is not required.
- The exact list of predefined pixel sizes remains to be decided.
