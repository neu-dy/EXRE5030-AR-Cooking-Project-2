// @input Component.ScriptComponent[] stepControllers
// @input int[] stepGoals
// @input SceneObject[] uiElements
// @input Component.Image progressBarImage
// @input Component.AudioComponent successSound

var currentStepIndex = 0;
var updateEvent = null;
var hasStarted = false;

function init() {
    currentStepIndex = 0;
    hasStarted = true;

    // disable old update event if this recipe was started before
    if (updateEvent) {
        updateEvent.enabled = false;
        updateEvent = null;
    }

    // Initialize UI: Show only the first step's instruction
    for (var i = 0; i < script.uiElements.length; i++) {
        if (script.uiElements[i]) {
            script.uiElements[i].enabled = (i === 0);
        }
    }

    // Reset progress bar
    if (script.progressBarImage) {
        script.progressBarImage.mainPass.fill = 0;
    }

    // Validate arrays
    if (!script.stepControllers || script.stepControllers.length === 0) {
        print("RecipeManager: No stepControllers assigned.");
        return;
    }

    if (!script.stepGoals || script.stepGoals.length < script.stepControllers.length) {
        print("RecipeManager: stepGoals is missing values.");
        return;
    }

    // Start the first step
    setupCurrentStep();

    // Create frame update loop
    updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(onUpdate);
}

function setupCurrentStep() {
    if (currentStepIndex >= script.stepControllers.length) {
        print("RecipeManager: currentStepIndex out of range.");
        return;
    }

    var controller = script.stepControllers[currentStepIndex];
    var goal = script.stepGoals[currentStepIndex];

    if (!controller) {
        print("RecipeManager: Missing StepController at index " + currentStepIndex);
        return;
    }

    print("RecipeManager: step " + currentStepIndex + ", setupStep type = " + typeof controller.setupStep);

    if (typeof controller.setupStep !== "function") {
        print("RecipeManager: setupStep is NOT a function at index " + currentStepIndex);
        return;
    }

    controller.setupStep(goal);
}

function onUpdate() {
    if (!hasStarted) return;
    if (currentStepIndex >= script.stepControllers.length) return;

    var currentController = script.stepControllers[currentStepIndex];

    if (!currentController) {
        print("RecipeManager: Missing StepController during update at index " + currentStepIndex);
        return;
    }

    if (typeof currentController.getProgressRatio !== "function") {
        print("RecipeManager: getProgressRatio is NOT a function at index " + currentStepIndex);
        return;
    }

    if (typeof currentController.checkProgress !== "function") {
        print("RecipeManager: checkProgress is NOT a function at index " + currentStepIndex);
        return;
    }

    if (script.progressBarImage) {
        var progress = currentController.getProgressRatio();
        script.progressBarImage.mainPass.fill = progress;
    }

    if (currentController.checkProgress()) {
        if (script.successSound) {
            script.successSound.play(1);
        }
        goToNextStep();
    }
}

function goToNextStep() {
    if (currentStepIndex < script.uiElements.length && script.uiElements[currentStepIndex]) {
        script.uiElements[currentStepIndex].enabled = false;
    }

    currentStepIndex++;

    if (currentStepIndex < script.stepControllers.length) {
        if (currentStepIndex < script.uiElements.length && script.uiElements[currentStepIndex]) {
            script.uiElements[currentStepIndex].enabled = true;
        }

        if (script.progressBarImage) {
            script.progressBarImage.mainPass.fill = 0;
        }

        setupCurrentStep();
    } else {
        print("Recipe Complete!");
        if (updateEvent) {
            updateEvent.enabled = false;
        }
    }
}

function startRecipe() {
    init();
}

script.startRecipe = startRecipe;