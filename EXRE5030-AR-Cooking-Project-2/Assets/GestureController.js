/**
 * GestureController — Bridge script for the GestureRecognition module
 *
 * Attach this to a Scene Object. Wire the Object Tracking component (from Hand Tracking)
 * in the Inspector. This script:
 * - Initializes the GestureRecognition module
 * - Exposes it globally so RecipeController (or other scripts) can call startListening
 * - Optionally supports tap-to-test when hand tracking is unavailable
 *
 * SETUP:
 * 1. Add Hand Tracking to your scene (use Hand Gestures template or Object Tracker 2D).
 * 2. Create a Scene Object named "GestureController".
 * 3. Add this script to it.
 * 4. Drag the Object Tracking component (from Hand Center) into the "Object Tracking" input.
 */

//@input Component.ObjectTracking objectTracking
//@input bool useTapForTesting = false
//@input bool debugPrints = true

var GestureRecognition = require("Modules/GestureRecognition");
var GestureTypes = GestureRecognition.GestureTypes;

// Expose globally for RecipeController and other scripts
global.gestureRecognition = GestureRecognition;

// Initialize on scene start
script.createEvent("OnStartEvent").bind(function () {
    if (!script.objectTracking) {
        print("[GestureController] Object Tracking input is empty. Add Hand Tracking to your scene and assign it.");
        if (script.useTapForTesting) {
            print("[GestureController] Tap-for-testing enabled. Tap screen to simulate gestures.");
        }
        return;
    }
    GestureRecognition.init(script.objectTracking);
    if (script.debugPrints) print("[GestureController] Ready. Use global.gestureRecognition.startListening(...)");
});

// Optional: tap to simulate a gesture (for testing without hand tracking)
if (script.useTapForTesting) {
    script.createEvent("TapEvent").bind(function () {
        var ok = GestureRecognition.simulateGesture();
        if (script.debugPrints && ok) {
            print("[GestureController] Tap (test): " + GestureRecognition.getCurrentCount() + "/" + (GestureRecognition.getCurrentCount() + 1));
        }
    });
}
