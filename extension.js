const Gio = imports.gi.Gio;
const Cinnamon = imports.gi.Cinnamon;
const Meta = imports.gi.Meta;
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
            const actionMode = Cinnamon.ActionMode.NORMAL | Cinnamon.ActionMode.OVERVIEW;

            this._keybindings[bindingName] = () => {
                snapWindowToZone.call(this, slotNumber);
            };

            const registered = Main.keybindingManager.addHotKeyArray(
                bindingName,
                this._settings.get_strv(bindingName),
                this._keybindings[bindingName],
                Meta.KeyBindingFlags.NONE,
                actionMode
            );

            if (!registered) {
                global.logError('Cinnamon Fancy Zones could not register shortcut "' + bindingName + '".');
            }
        }
    }

    disable() {
        for (const bindingName of BINDING_NAMES) {
            if (Main.keybindingManager && typeof Main.keybindingManager.removeHotKey === 'function') {
                Main.keybindingManager.removeHotKey(bindingName);
            }
        }

        if (this._settings) {
            this._settings.run_dispose();
            this._settings = null;
        }

        this._keybindings = {};
    }
};
