const Gio = imports.gi.Gio;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const ZoneUtils = Me.imports.zoneUtils;

const SETTINGS_SCHEMA_ID = 'org.cinnamon.extensions.cinnamon-fancy-zones';
const BINDING_NAMES = ['snap-zone-1', 'snap-zone-2', 'snap-zone-3'];

function getMonitorGeometryForWindow(window) {
    const monitorIndex = typeof window.get_monitor === 'function' ? window.get_monitor() : global.screen.get_current_monitor();
    const screen = global.screen || global.display;

    if (screen && typeof screen.get_monitor_geometry === 'function') {
        return screen.get_monitor_geometry(monitorIndex);
    }

    if (global.display && typeof global.display.get_monitor_geometry === 'function') {
        return global.display.get_monitor_geometry(monitorIndex);
    }

    return {
        x: 0,
        y: 0,
        width: global.screen ? global.screen.width : 1920,
        height: global.screen ? global.screen.height : 1080
    };
}

function snapWindowToZone(slotNumber) {
    const window = global.display.get_focus_window ? global.display.get_focus_window() : global.screen.get_active_window();

    if (!window) {
        return;
    }

    const monitorRect = getMonitorGeometryForWindow(window);
    const zoneRect = ZoneUtils.getCenteredZone(monitorRect, slotNumber);

    window.move_resize_frame(true, zoneRect.x, zoneRect.y, zoneRect.width, zoneRect.height);
}

function init() {
    return new FancyZones();
}

const FancyZones = class {
    enable() {
        this._settings = new Gio.Settings({ schema_id: SETTINGS_SCHEMA_ID });
        this._keybindings = {};

        for (let slotNumber = 1; slotNumber <= 3; slotNumber++) {
            const bindingName = BINDING_NAMES[slotNumber - 1];
            const actionMode = Shell.ActionMode ?
                (Shell.ActionMode.NORMAL | (Shell.ActionMode.OVERVIEW || 0)) :
                0;

            this._keybindings[bindingName] = () => {
                snapWindowToZone.call(this, slotNumber);
            };

            Main.wm.addKeybinding(bindingName, this._settings, Meta.KeyBindingFlags.NONE, actionMode, this._keybindings[bindingName]);
        }
    }

    disable() {
        for (const bindingName of BINDING_NAMES) {
            if (Main.wm && typeof Main.wm.removeKeybinding === 'function') {
                Main.wm.removeKeybinding(bindingName);
            }
        }

        if (this._settings) {
            this._settings.run_dispose();
            this._settings = null;
        }

        this._keybindings = {};
    }
};
