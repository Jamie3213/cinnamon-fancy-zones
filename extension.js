const Gio = imports.gi.Gio;
const Cinnamon = imports.gi.Cinnamon;
const Meta = imports.gi.Meta;
const Main = imports.ui.main;

const EXTENSION_UUID = 'cinnamon-fancy-zones@jamie3213';
const SETTINGS_SCHEMA_ID = 'org.cinnamon.extensions.cinnamon-fancy-zones';
const BINDING_NAMES = ['snap-zone-1', 'snap-zone-2', 'snap-zone-3'];
const ZoneUtils = imports.extensions[EXTENSION_UUID].zoneUtils;
const LOG_PREFIX = 'Cinnamon Fancy Zones: ';
let _extension = null;

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
        global.log(LOG_PREFIX + 'shortcut for zone ' + slotNumber + ' pressed, but there is no focused window.');
        return;
    }

    const monitorRect = getMonitorGeometryForWindow(window);
    const zoneRect = ZoneUtils.getCenteredZone(monitorRect, slotNumber);

    global.log(LOG_PREFIX + 'snapping window to zone ' + slotNumber + ' at ' +
        zoneRect.x + ',' + zoneRect.y + ' (' + zoneRect.width + 'x' + zoneRect.height + ').');
    window.move_resize_frame(true, zoneRect.x, zoneRect.y, zoneRect.width, zoneRect.height);
}

function init() {
    _extension = new FancyZones();
}

function enable() {
    if (!_extension) {
        _extension = new FancyZones();
    }

    _extension.enable();
}

function disable() {
    if (_extension) {
        _extension.disable();
        _extension = null;
    }
}

const FancyZones = class {
    enable() {
        global.log(LOG_PREFIX + 'enabling extension.');
        this._settings = new Gio.Settings({ schema_id: SETTINGS_SCHEMA_ID });
        this._keybindings = {};

        for (let slotNumber = 1; slotNumber <= 3; slotNumber++) {
            const bindingName = BINDING_NAMES[slotNumber - 1];
            const actionMode = Cinnamon.ActionMode.NORMAL | Cinnamon.ActionMode.OVERVIEW;

            this._keybindings[bindingName] = () => {
                try {
                    snapWindowToZone.call(this, slotNumber);
                } catch (error) {
                    global.logError(error, LOG_PREFIX + 'failed to snap window to zone ' + slotNumber + '.');
                }
            };

            const registered = Main.keybindingManager.addHotKeyArray(
                bindingName,
                this._settings.get_strv(bindingName),
                this._keybindings[bindingName],
                Meta.KeyBindingFlags.NONE,
                actionMode
            );

            if (!registered) {
                global.logError(LOG_PREFIX + 'could not register shortcut "' + bindingName + '".');
            } else {
                global.log(LOG_PREFIX + 'registered shortcut "' + bindingName + '".');
            }
        }
    }

    disable() {
        global.log(LOG_PREFIX + 'disabling extension.');
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
