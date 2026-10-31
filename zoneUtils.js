const ZONE_SIZES = {
    1: { width: 2240, height: 1260 },
    2: { width: 1920, height: 1080 },
    3: { width: 800, height: 600 }
};

function getZoneDimensions(slotNumber) {
    const dimensions = ZONE_SIZES[slotNumber];

    if (!dimensions) {
        throw new RangeError('Unsupported zone slot: ' + slotNumber);
    }

    return { width: dimensions.width, height: dimensions.height };
}

function getCenteredPosition(monitor, width, height) {
    if (!monitor || monitor.width <= 0 || monitor.height <= 0 || width <= 0 || height <= 0) {
        throw new RangeError('Monitor and window dimensions must be positive');
    }

    return {
        x: Math.round(monitor.x + (monitor.width - width) / 2),
        y: Math.round(monitor.y + (monitor.height - height) / 2)
    };
}

function getCenteredZone(monitor, slotNumber) {
    const dimensions = getZoneDimensions(slotNumber);

    if (!monitor || monitor.width <= 0 || monitor.height <= 0) {
        throw new RangeError('Monitor dimensions must be positive');
    }

    const width = Math.min(dimensions.width, monitor.width);
    const height = Math.min(dimensions.height, monitor.height);
    const position = getCenteredPosition(monitor, width, height);

    return {
        x: position.x,
        y: position.y,
        width: width,
        height: height
    };
}
