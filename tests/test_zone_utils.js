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
        [1, 2240, 1260],
        [2, 1920, 1080],
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
    assertEqual(zone.x, 2240, 'centered x coordinate');
    assertEqual(zone.y, 180, 'centered y coordinate');
    assertEqual(zone.width, 1920, 'centered zone width');
    assertEqual(zone.height, 1080, 'centered zone height');
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
        { x: 100, y: 50, width: 2000, height: 900 },
        2
    );
    assertEqual(zone.x, 140, 'partially clamped x coordinate');
    assertEqual(zone.y, 50, 'partially clamped y coordinate');
    assertEqual(zone.width, 1920, 'partially clamped width');
    assertEqual(zone.height, 900, 'partially clamped height');
}

function testActualWindowSizeIsCentered() {
    const position = ZoneUtils.getCenteredPosition(
        { x: 1920, y: 0, width: 2560, height: 1440 },
        1900,
        1040
    );
    assertEqual(position.x, 2250, 'actual window centered x coordinate');
    assertEqual(position.y, 200, 'actual window centered y coordinate');
}

function testInvalidInputsAreRejected() {
    assertThrows(function () {
        ZoneUtils.getZoneDimensions(4);
    }, RangeError, 'unsupported slot');
    assertThrows(function () {
        ZoneUtils.getCenteredZone({ x: 0, y: 0, width: 0, height: 800 }, 3);
    }, RangeError, 'invalid monitor size');
    assertThrows(function () {
        ZoneUtils.getCenteredPosition({ x: 0, y: 0, width: 800, height: 600 }, 0, 600);
    }, RangeError, 'invalid window size');
}

testFixedZoneDimensions();
testCenteredPlacementOnMonitorWithOffset();
testOversizedZoneIsClampedAndCentered();
testZoneFitsWhenOnlyOneDimensionIsOversized();
testActualWindowSizeIsCentered();
testInvalidInputsAreRejected();
print('Passed ' + assertions + ' zone utility assertions.');
