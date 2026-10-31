# cinnamon-fancy-zones
Ripoff of PowerToys Fancy Zones for Cinnamon-based desktops (e.g. Linux Mint)

This repository contains a minimal Cinnamon extension implementing the behavior in [SPEC.md](./SPEC.md). It provides three fixed zone sizes—1920x1080, 1920x1080, and 800x600—and snaps the focused window to the corresponding centered zone using Ctrl + Alt + Super + 1/2/3.

## Dependencies

The extension is intended to run natively in Cinnamon using GJS (GNOME JavaScript).

### To use the extension

- **System dependencies:** Cinnamon and GJS. Both are normally installed with Linux Mint's Cinnamon desktop.
- **Non-system dependencies:** None currently planned.

If either system dependency is missing, install it from Linux Mint's repositories:

```bash
sudo apt update
sudo apt install cinnamon gjs
```

### To install the extension

You can install it with the included script:

```bash
cd /home/jamie/Code/cinnamon-fancy-zones
./install.sh
```

This copies the extension into `~/.local/share/cinnamon/extensions/cinnamon-fancy-zones@jamie3213/`, installs the shortcut schema into your local GSettings directory, and prints the remaining steps.

If you prefer to do it manually:

1. Copy this repository directory to `~/.local/share/cinnamon/extensions/cinnamon-fancy-zones@jamie3213/` or the corresponding Cinnamon extension path for your system.
2. Install and compile the extension's GSettings schema:

   ```bash
   mkdir -p ~/.local/share/glib-2.0/schemas
   cp ~/.local/share/cinnamon/extensions/cinnamon-fancy-zones@jamie3213/schemas/org.cinnamon.extensions.cinnamon-fancy-zones.gschema.xml ~/.local/share/glib-2.0/schemas/
   glib-compile-schemas ~/.local/share/glib-2.0/schemas
   ```

   If you copied the extension to a different path, use that path as the source for `cp`.
3. Restart Cinnamon or log out and back in.
4. Open the Cinnamon extensions settings UI and enable "Cinnamon Fancy Zones".
5. Use Ctrl + Alt + Super + 1, 2, or 3 to snap the active window to its fixed zone.

Snapping restores a maximized or full-screen window before moving and resizing it.

### To develop the project

- **System dependency:** Git, to clone and manage the source repository. Install it with `sudo apt install git` if needed.
- **Non-system dependencies:** None currently planned. Python, Node.js, npm, and a separate build toolchain are not required for the planned extension.

Run the unit tests for the zone dimensions and placement logic with:

```bash
gjs tests/test_zone_utils.js
```

To install all listed system packages in one go:

```bash
sudo apt update
sudo apt install cinnamon gjs git
```
