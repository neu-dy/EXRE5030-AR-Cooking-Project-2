// @input Component.ScriptComponent gestureCheck {"label": "Gesture Check Script"}
// @input string gestureVariableName {"label": "Count Variable Name (e.g., chopCount)"}

var targetDelta = 0;      // The goal number of gestures for THIS specific step
var startingValue = 0;    // The count value when the step began
var isStepActive = false; // Flag to ensure we only check when the recipe is on this step
var isStepComplete = false;

/**
 * setupStep is called by the RecipeManager to "prime" this step.
 * It captures the 'baseline' so we only count NEW gestures.
 */
// TELL RECIPEMANAGER START COUNTING FROM NOW
script.api.setupStep = function(goal) {
    targetDelta = goal;
    // Capture the current count from the Gesture Check script as our starting point
    startingValue = script.gestureCheck[script.gestureVariableName] || 0;
    isStepActive = true;
    isStepComplete = false;
};

/**
 * Returns a value between 0 and 1 representing progress.
 * Used by the RecipeManager to update the UI Bar.
 */
// PROGRESS BAR UI FOR RECIPEMANAGER, IGNORE FOR NOW
script.api.getProgressRatio = function() {
    if (targetDelta <= 0) return 0;
    var currentTotal = script.gestureCheck[script.gestureVariableName] || 0;
    var currentDelta = currentTotal - startingValue;
    
    // Clamp the value between 0 and 1
    return Math.max(0, Math.min(currentDelta / targetDelta, 1));

    // NEED WAY TO MAKE SOUND WITH EACH ACTIVATION/COUNT
};

/**
 * The main check called every frame by the RecipeManager.
 */
// VOID UPDATE IN UNITY EQUIVALENT
script.api.checkProgress = function() {
    if (!isStepActive || isStepComplete) return isStepComplete;

    // If our current progress ratio is 1 (100%), the step is done
    if (script.getProgressRatio() >= 1) {
        isStepComplete = true;
        isStepActive = false;
        return true;
    }
    return false;
};