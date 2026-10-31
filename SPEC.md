# Cinnamon Fancy Zones Specification

## Purpose

Provide a simple, keyboard-driven way to place windows into a small set of centered zones on Cinnamon desktops.

## Functional Requirements

- **F001 — Fixed layout:** The extension SHALL use one fixed layout, without profiles or user-configurable zone sizes.
- **F002 — Three fixed zone slots:** The extension SHALL provide three slots with fixed dimensions: slot 1 is 1920x1080 pixels, slot 2 is 1280x720 pixels, and slot 3 is 800x600 pixels.
- **F003 — No zone editor:** The extension SHALL NOT require zone-size settings or a graphical zone-drawing editor.
- **F004 — Overlapping zones:** The extension SHALL allow the fixed zones to overlap.
- **F005 — Keyboard snapping:** WHEN the user presses Ctrl + Alt + Super + 1, 2, or 3, THEN the extension SHALL snap the active window to the corresponding fixed zone.
- **F006 — Active monitor:** WHEN a window is snapped, THEN the extension SHALL place its zone on the monitor containing the active window.
- **F007 — Centered placement:** WHEN a zone is placed on a monitor, THEN the extension SHALL center it on that monitor.
- **F008 — Resolution bounds:** WHEN a fixed zone is larger than its monitor, THEN the extension SHALL cap its width and height to that monitor's current display resolution and keep the resulting zone within the monitor.
- **F009 — Persistent shortcuts:** The extension SHALL register shortcuts through Cinnamon's persistent keybinding settings; zone dimensions SHALL remain fixed across restarts.
- **F010 — Cinnamon compatibility:** WHEN implementing window management and shortcuts, THEN the extension SHALL prefer stable, documented Cinnamon/GJS APIs and avoid unnecessary version-specific or low-level dependencies.

## Design Constraints

- Keep the implementation focused on defining and snapping windows to the three centered zones.
- Do not provide settings for changing the fixed zone dimensions.
