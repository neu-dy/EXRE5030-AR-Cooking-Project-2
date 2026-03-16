// @input Component.ScriptComponent[] stepControllers
// @input int[] stepGoals
// @input SceneObject[] uiElements
// @input Component.Image progressBarImage
// @input Component.AudioComponent successSound

var currentStepIndex = 0;
var updateEvent;

function init() {
    // Show only first step UI
    for (var i = 0; i < script.uiElements.length; i++) {
        if (script.uiElements[i]) {
            script.uiElements[i].enabled = (i === 0);
        }
    }

    setupCurrentStep();

    updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(onUpdate);
}

function setupCurrentStep() {
    if (currentStepIndex >= script.stepControllers.length) {
        print("No step controller at index " + currentStepIndex);
        return;
    }

    var controller = script.stepControllers[currentStepIndex];
    var goal = script.stepGoals[currentStepIndex];

    if (!controller) {
        print("Missing step controller at index " + currentStepIndex);
        return;
    }

    // Read current gesture count as baseline
    var currentCount = controller.gestureCheck[controller.gestureVariableName] || 0;

    controller.targetDelta = goal;
    controller.startingValue = currentCount;
    controller.isStepActive = true;
    controller.isStepComplete = false;

    print("Started step " + currentStepIndex + " with goal " + goal + " using " + controller.gestureVariableName);
}

function getProgressRatio(controller) {
    if (!controller) {
        return 0;
    }

    if (controller.targetDelta <= 0) {
        return 0;
    }

    var currentTotal = controller.gestureCheck[controller.gestureVariableName] || 0;
    var currentDelta = currentTotal - controller.startingValue;

    return Math.max(0, Math.min(currentDelta / controller.targetDelta, 1));
}

function checkProgress(controller) {
    if (!controller) {
        return false;
    }

    if (!controller.isStepActive || controller.isStepComplete) {
        return controller.isStepComplete;
    }

    if (getProgressRatio(controller) >= 1) {
        controller.isStepComplete = true;
        controller.isStepActive = false;
        return true;
    }

    return false;
}

function onUpdate() {
    if (currentStepIndex >= script.stepControllers.length) {
        return;
    }

    var currentController = script.stepControllers[currentStepIndex];

    if (!currentController) {
        print("Current controller missing at index " + currentStepIndex);
        return;
    }

    var progress = getProgressRatio(currentController);

    if (script.progressBarImage && script.progressBarImage.mainPass) {
        script.progressBarImage.mainPass.fill = progress;
    }

    if (checkProgress(currentController)) {
        if (script.successSound) {
            script.successSound.play(1);
        }
        goToNextStep();
    }
}

function goToNextStep() {
    if (script.uiElements[currentStepIndex]) {
        script.uiElements[currentStepIndex].enabled = false;
    }

    currentStepIndex++;

    if (currentStepIndex < script.stepControllers.length) {
        if (script.uiElements[currentStepIndex]) {
            script.uiElements[currentStepIndex].enabled = true;
        }

        setupCurrentStep();
    } else {
        print("Recipe Complete!");

        if (updateEvent) {
            updateEvent.enabled = false;
        }
    }
}

init();