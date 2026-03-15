// @input Component.ScriptComponent[] stepControllers // Array of StepController scripts
// @input int[] stepGoals                             // Goals for each step (e.g., 5, 10, 3)
// @input SceneObject[] uiElements                    // The UI instructions for each step
// @input Component.Image progressBarImage             // The Image component for the progress bar
// @input Component.AudioComponent successSound        // Sound played on step completion

var currentStepIndex = 0;
var updateEvent;

function init() {
    // 1. Initialize UI: Show only the first step's instruction 
    for (var i = 0; i < script.uiElements.length; i++) {
        if (script.uiElements[i]) script.uiElements[i].enabled = (i === 0);
    }

    // 2. Start the very first step logic
    setupCurrentStep();

    // 3. Create a frame-by-frame loop to check for gesture completion
    // VOID UPDATE
    updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(onUpdate);
}

/**
 * Tells the current StepController to start watching for its specific goal.
 */
// COMMUNICATE WITH STEPCONTROLLER ON THIS STEP'S ASSET > SET IT UP
// BEGIN USING STEPCONTROLLER ATTACHED TO GAMECOMPONENT TO BEGIN PROGRESS
function setupCurrentStep() {
    if (currentStepIndex < script.stepControllers.length) {
        var goal = script.stepGoals[currentStepIndex];
        script.stepControllers[currentStepIndex].setupStep(goal);
    }
}

/**
 * Runs every frame to update the Progress Bar and check if the step is finished.
 */
// USE STEPCONTROLLER TO TRACK PROGRESS UNTIL COMPLETION
function onUpdate() {
    if (currentStepIndex >= script.stepControllers.length) return;

    var currentController = script.stepControllers[currentStepIndex];

    // Update the Progress Bar UI Fill
    if (script.progressBarImage) {
        var progress = currentController.getProgressRatio();
        // Sets the 'fill' amount of the Image (requires Fill Mode enabled in Inspector)
        script.progressBarImage.mainPass.fill = progress;
    }

    // Check if the StepController has reached the target delta
    if (currentController.checkProgress()) {
        if (script.successSound) script.successSound.play(1);
        goToNextStep();
    }
}

/**
 * Logic to transition to the next step or finish the recipe.
 */
// CALL NEXT ASSET WITH STEPCONTROLLER ACCORDING TO SPECIFIED INPUT ORDER
function goToNextStep() {
    // Hide the current step's instruction UI
    if (script.uiElements[currentStepIndex]) {
        script.uiElements[currentStepIndex].enabled = false;
    }

    currentStepIndex++;

    // If there are more steps, show the next UI and set up the next controller
    if (currentStepIndex < script.stepControllers.length) {
        if (script.uiElements[currentStepIndex]) {
            script.uiElements[currentStepIndex].enabled = true;
        }
        setupCurrentStep();
    } else {
        // All steps finished
        print("Recipe Complete!");
        updateEvent.enabled = false;
    }
}

init();