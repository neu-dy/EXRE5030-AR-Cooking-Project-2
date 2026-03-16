/**
 * GestureController — Bridge script for the GestureRecognition module
 *
 * Attach this to a Scene Object. Wire the Object Tracking component (from Hand Tracking)
 * in the Inspector. This script:
 * - Initializes the GestureRecognition module
 * - Exposes it globally so RecipeController (or other scripts) can call startListening
 */

//@input Component.ObjectTracking objectTracking
//@input bool useTapForTesting = false
//@input bool debugPrints = true

var GestureRecognition = require("Modules/GestureRecognition");
var GestureTypes = GestureRecognition.GestureTypes;

// Expose globally for RecipeController and other scripts
global.gestureRecognition = GestureRecognition;

// Test callback for when a gesture succeeds
global.onGestureSuccess = function(gestureType) {
    print("[GestureController] SUCCESS: " + gestureType);

    // restart test listening
    global.gestureRecognition.startListening(gestureType, 4);
};

// Initialize on scene start
script.createEvent("OnStartEvent").bind(function () {
    if (!script.objectTracking) {
        print("[GestureController] Object Tracking input is empty. Add Hand Tracking to your scene and assign it.");
        return;
    }

    GestureRecognition.init(script.objectTracking);
    
    if (script.debugPrints) {
        print("[GestureController] Ready. Starting test gesture detection...");
    }

    GestureRecognition.startListening(GestureTypes.STIR, 4);
});

// Update every frame
script.createEvent("UpdateEvent").bind(function () {
    GestureRecognition.update();
});