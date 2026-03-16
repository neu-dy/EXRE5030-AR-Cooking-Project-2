/**
 * RecipeController — Example recipe script that uses the GestureRecognition module
 *
 * This script demonstrates how to:
 * - Subscribe to gesture completion
 * - Drive recipe steps in order
 * - Advance when the required gesture count is reached
 *
 * REQUIREMENTS:
 * - GestureController must be in the scene (initializes the gesture module)
 * - This script uses global.gestureRecognition (set by GestureController)
 *
 * USAGE:
 * 1. Attach this to a Scene Object.
 * 2. Optionally add @input Component.Text stepText for UI feedback.
 * 3. When "Start Game" (or your trigger) fires, call startRecipe().
 */

//@input Component.Text stepText {"hint": "Optional: shows current step"}
//@input bool autoStart = false

// Recipe steps: { gesture: "pinch"|"stir"|"pour"|..., count: N, label: "..." }
var RECIPE_STEPS = [
    { gesture: "pinch", count: 2, label: "Pinch the salt twice" },
    { gesture: "stir", count: 3, label: "Stir 3 times" },
    { gesture: "pour", count: 1, label: "Pour once" },
    { gesture: "press", count: 1, label: "Press to mix" },
];

var currentStepIndex = 0;

script.createEvent("OnStartEvent").bind(function () {
    if (typeof global.gestureRecognition === "undefined") {
        print("[RecipeController] Add GestureController to the scene first.");
        return;
    }

    if (script.autoStart) {
        startRecipe();
    }
});

/**
 * Call this when the user starts a recipe (e.g. from Start Game button).
 */
function startRecipe() {
    currentStepIndex = 0;
    _runStep();
}

function _runStep() {
    if (currentStepIndex >= RECIPE_STEPS.length) {
        _showStep("Recipe complete!");
        print("[RecipeController] Recipe complete!");
        return;
    }

    var step = RECIPE_STEPS[currentStepIndex];
    var gestureType = step.gesture;  // e.g. "pinch", "stir" — matches GestureTypes values

    _showStep(step.label + " (" + (currentStepIndex + 1) + "/" + RECIPE_STEPS.length + ")");

    global.gestureRecognition.startListening(gestureType, step.count, function () {
        // Success: advance to next step
        currentStepIndex++;
        _runStep();
    });
}

function _showStep(text) {
    if (script.stepText) {
        script.stepText.text = text;
    }
}

// Expose for external triggers (e.g. MenuController)
global.startRecipe = startRecipe;
