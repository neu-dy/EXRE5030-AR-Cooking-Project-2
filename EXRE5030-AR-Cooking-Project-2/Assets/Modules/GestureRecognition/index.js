/**
 * GestureRecognition — Core gesture detection and counting module
 *
 * - Detects one gesture at a time
 * - Counts successful repetitions
 * - Fires callback when required count is reached
 *
 * Must be initialized with an Object Tracking component (from GestureController).
 */

var GestureTypes = require("./GestureTypes");
var NATIVE_DESCRIPTOR_MAP = GestureTypes.NATIVE_DESCRIPTOR_MAP;
var resolveGestureType = GestureTypes.resolveGestureType;

// Module state
var objectTracking = null;
var initialized = false;
var currentGestureType = null;
var requiredCount = 0;
var currentCount = 0;
var onCompleteCallback = null;
var currentDescriptors = [];  // Descriptor list for current gesture
var sequenceStep = 0;
var lastGestureTime = 0;
var COOLDOWN_MS = 0.4;  // Seconds
var ALL_DESCRIPTORS = ["open", "close", "index_finger", "thumb", "victory", "horns"];

/**
 * Initialize the module with the hand tracking component.
 * Call this from GestureController during OnStart.
 *
 * @param {Component.ObjectTracking} tracking - Object Tracking component from Hand Center
 */
function init(tracking) {
    if (!tracking) {
        print("[GestureRecognition] init: Object Tracking component is required");
        return;
    }
    if (initialized) return;
    objectTracking = tracking;

    // Register once for all descriptors; route in handler by current state
    for (var i = 0; i < ALL_DESCRIPTORS.length; i++) {
        var desc = ALL_DESCRIPTORS[i];
        objectTracking.registerDescriptorStart(desc, function (descriptor) {
            _onDescriptor(descriptor);
        });
    }
    initialized = true;
    print("[GestureRecognition] Initialized with Object Tracking");
}

function _onDescriptor(descriptor) {
    if (!currentGestureType) return;

    var now = getTime();
    if (now - lastGestureTime < COOLDOWN_MS) return;

    var expected = currentDescriptors[sequenceStep];
    if (descriptor !== expected) {
        sequenceStep = 0;
        return;
    }

    if (currentDescriptors.length > 1) {
        sequenceStep++;
        if (sequenceStep >= currentDescriptors.length) {
            sequenceStep = 0;
            lastGestureTime = now;
            _countOne();
        }
    } else {
        sequenceStep = 0;
        lastGestureTime = now;
        _countOne();
    }
}

/**
 * Start listening for a gesture. Only one gesture type is active at a time.
 *
 * @param {string} gestureType - One of GestureTypes (e.g. GestureTypes.Pinch)
 * @param {number} count - Number of successful repetitions required
 * @param {function} callback - Fired when count is reached (no arguments)
 */
function startListening(gestureType, count, callback) {
    // Can start without init for tap-to-test (simulateGesture only)
    if (!objectTracking && !initialized) {
        print("[GestureRecognition] No Object Tracking. Use tap-to-test with simulateGesture() only.");
    }

    currentGestureType = resolveGestureType(gestureType);
    requiredCount = Math.max(1, count || 1);
    onCompleteCallback = callback || function () {};
    currentCount = 0;
    sequenceStep = 0;

    var mapping = NATIVE_DESCRIPTOR_MAP[currentGestureType];
    if (!mapping) {
        print("[GestureRecognition] Unknown gesture type: " + gestureType);
        currentGestureType = null;
        return;
    }
    currentDescriptors = Array.isArray(mapping) ? mapping : [mapping];

    print("[GestureRecognition] Listening for " + currentGestureType + " x " + requiredCount);
}

/**
 * Stop listening and reset state.
 */
function reset() {
    currentGestureType = null;
    requiredCount = 0;
    currentCount = 0;
    onCompleteCallback = null;
    currentDescriptors = [];
    sequenceStep = 0;
}

/**
 * @returns {number} Current repetition count.
 */
function getCurrentCount() {
    return currentCount;
}

/**
 * @returns {boolean} True if a gesture is being listened for.
 */
function isListening() {
    return currentGestureType !== null;
}

/**
 * @returns {string|null} Current gesture type or null.
 */
function getCurrentGestureType() {
    return currentGestureType;
}

function _countOne() {
    if (!currentGestureType) return;
    currentCount++;
    if (currentCount >= requiredCount && onCompleteCallback) {
        onCompleteCallback();
        reset();
    }
}

/**
 * Simulate one gesture count. For tap-to-test when hand tracking is unavailable.
 * Only works when startListening has been called.
 */
function simulateGesture() {
    if (!currentGestureType) return false;
    _countOne();
    return true;
}

// Public API
module.exports = {
    init: init,
    startListening: startListening,
    reset: reset,
    getCurrentCount: getCurrentCount,
    isListening: isListening,
    getCurrentGestureType: getCurrentGestureType,
    simulateGesture: simulateGesture,
    GestureTypes: GestureTypes,
};
