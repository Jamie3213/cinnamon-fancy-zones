imports.searchPath.unshift('.');
const ZoneUtils = imports.zoneUtils;

let assertions = 0;

function assertEqual(actual, expected, message) {
    assertions++;
    if (actual !== expected) {
        throw new Error(message + ': expected ' + expected + ', got ' + actual);
    }
}

function assertThrows(callback, expectedError, message) {
    assertions++;
    try {
        callback();
    } catch (error) {
        if (error instanceof expectedError) {
            return;
        }
        throw new Error(message + ': unexpected error ' + error);
    }
    throw new Error(message + ': expected an exception');
}

function testFixedZoneDimensions() {
    const expected = [
        [1, 1920, 1080],
        [2, 1280, 720],
        [3, 800, 600]
    ];

    for (const [slotNumber, width, height] of expected) {
        const dimensions = ZoneUtils.getZoneDimensions(slotNumber);
        assertEqual(dimensions.width, width, 'zone ' + slotNumber + ' width');
        assertEqual(dimensions.height, height, 'zone ' + slotNumber + ' height');
    }
}

function testCenteredPlacementOnMonitorWithOffset() {
    const zone = ZoneUtils.getCenteredZone(
        { x: 1920, y: 0, width: 2560, height: 1440 },
        2
    );
    assertEqual(zone.x, 2560, 'centered x coordinate');
    assertEqual(zone.y, 360, 'centered y coordinate');
    assertEqual(zone.width, 1280, 'centered zone width');
    assertEqual(zone.height, 720, 'centered zone height');
}

function testOversizedZoneIsClampedAndCentered() {
    const zone = ZoneUtils.getCenteredZone(
        { x: -1600, y: 120, width: 1366, height: 768 },
        1
    );
    assertEqual(zone.x, -1600, 'clamped zone x coordinate');
    assertEqual(zone.y, 120, 'clamped zone y coordinate');
    assertEqual(zone.width, 1366, 'clamped zone width');
    assertEqual(zone.height, 768, 'clamped zone height');
}

function testZoneFitsWhenOnlyOneDimensionIsOversized() {
    const zone = ZoneUtils.getCenteredZone(
        { x: 100, y: 50, width: 1000, height: 900 },
        2
    );
    assertEqual(zone.x, 100, 'partially clamped x coordinate');
    assertEqual(zone.y, 140, 'partially clamped y coordinate');
    assertEqual(zone.width, 1000, 'partially clamped width');
    assertEqual(zone.height, 720, 'partially clamped height');
}

function testInvalidInputsAreRejected() {
    assertThrows(function () {
        ZoneUtils.getZoneDimensions(4);
    }, RangeError, 'unsupported slot');
    assertThrows(function () {
        ZoneUtils.getCenteredZone({ x: 0, y: 0, width: 0, height: 800 }, 3);
    }, RangeError, 'invalid monitor size');
}

testFixedZoneDimensions();
testCenteredPlacementOnMonitorWithOffset();
testOversizedZoneIsClampedAndCentered();
testZoneFitsWhenOnlyOneDimensionIsOversized();
testInvalidInputsAreRejected();
print('Passed ' + assertions + ' zone utility assertions.');
