/**
 * GestureTypes.js — Cooking gesture definitions and native descriptor mapping
 *
 * Maps high-level cooking gestures to Lens Studio Object Tracking descriptors
 * (open, close, index_finger, thumb, victory, horns).
 */

/**
 * @readonly
 * @enum {string}
 */
var GestureTypes = {
    // Core gestures (requested)
    Pinch: "pinch",
    PickPlace: "pick_place",
    Pour: "pour",
    Stir: "stir",
    Sprinkle: "sprinkle",
    Press: "press",

    // Additional cooking gestures
    Chop: "chop",
    Knead: "knead",
    Whisk: "whisk",
    Tear: "tear",
    Squeeze: "squeeze",
    Flip: "flip",
    Spread: "spread",
    Roll: "roll",
    Toss: "toss",
    Tap: "tap",
    Crush: "crush",  // Alias for Press
    Mix: "mix",     // Alias for Stir
};

/**
 * Maps each cooking gesture to the native Object Tracking descriptor(s) used for detection.
 * - Simple: single descriptor (e.g. "close")
 * - Sequence: array of descriptors in order (e.g. ["close", "open"] for PickPlace)
 *
 * @type {Object<string, string|string[]>}
 */
var NATIVE_DESCRIPTOR_MAP = {
    pinch: "index_finger",      // Proxy: index pointing approximates pinch
    pick_place: ["close", "open"],
    pour: "open",
    stir: "index_finger",
    sprinkle: "index_finger",
    press: "close",
    crush: "close",
    chop: "open",
    knead: "close",
    whisk: "index_finger",
    tear: ["close", "open"],
    squeeze: "close",
    flip: "open",
    spread: "open",
    roll: "close",
    toss: "open",
    tap: "index_finger",
    mix: "index_finger",
};

/**
 * Resolve aliases (e.g. mix -> stir, crush -> press)
 */
function resolveGestureType(type) {
    if (type === GestureTypes.Crush) return GestureTypes.Press;
    if (type === GestureTypes.Mix) return GestureTypes.Stir;
    return type;
}

module.exports = {
    GestureTypes: GestureTypes,
    NATIVE_DESCRIPTOR_MAP: NATIVE_DESCRIPTOR_MAP,
    resolveGestureType: resolveGestureType,
};
