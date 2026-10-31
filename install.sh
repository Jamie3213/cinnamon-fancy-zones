#!/usr/bin/env bash
set -eu

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTENSION_UUID="cinnamon-fancy-zones@jamie3213"
EXTENSION_DIR="$HOME/.local/share/cinnamon/extensions/$EXTENSION_UUID"
SCHEMA_DIR="$HOME/.local/share/glib-2.0/schemas"

mkdir -p "$EXTENSION_DIR" "$SCHEMA_DIR"

# Copy the extension files into Cinnamon's per-user extensions directory.
cp -a "$SCRIPT_DIR"/. "$EXTENSION_DIR/"
# Remove the obsolete size-preferences file when upgrading older installs.
rm -f "$EXTENSION_DIR/settings-schema.json"

# Install the GSettings schema for the extension.
for schema in "$EXTENSION_DIR/schemas"/*.gschema.xml; do
    if [ -f "$schema" ]; then
        cp -f "$schema" "$SCHEMA_DIR/"
    fi
done

glib-compile-schemas "$SCHEMA_DIR" >/dev/null 2>&1 || {
    echo "Warning: glib-compile-schemas failed. Your Cinnamon settings may not register until schemas are compiled." >&2
}

echo "Installed Cinnamon Fancy Zones to $EXTENSION_DIR"
echo "Next steps:"
echo "  1. Log out and back in, or restart Cinnamon."
echo "  2. Open Cinnamon Settings → Extensions."
echo "  3. Enable 'Cinnamon Fancy Zones'."
echo "  4. Use Ctrl + Alt + Super + 1/2/3 to snap the active window."
