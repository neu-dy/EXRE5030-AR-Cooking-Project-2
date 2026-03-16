// @input Component.ScriptComponent gestureCheck {"label": "Gesture Check Script"}
// @input string gestureVariableName {"label": "Count Variable Name (e.g., openCount)"}

// Public state that RecipeManager can read/write directly
script.targetDelta = 0;
script.startingValue = 0;
script.isStepActive = false;
script.isStepComplete = false;

print("StepController loaded: " + script.gestureVariableName);