// @input Component.ScriptComponent gestureLib // The script with the count variables
// @input SceneObject recipeCanvas 

// UI
// @input SceneObject uiStep1
// @input SceneObject uiStep2
// @input SceneObject uiStep3
// @input SceneObject uiStep4
// @input SceneObject uiStep5
// @input SceneObject uiStep6
// @input SceneObject uiFinish

// Step short sounds
// @input Component.AudioComponent shortSoundStep1
// @input Component.AudioComponent shortSoundStep2
// @input Component.AudioComponent shortSoundStep3
// @input Component.AudioComponent shortSoundStep4
// @input Component.AudioComponent shortSoundStep5
// @input Component.AudioComponent shortSoundStep6

// Step loop sounds
// @input Component.AudioComponent loopSoundStep1
// @input Component.AudioComponent loopSoundStep2
// @input Component.AudioComponent loopSoundStep3
// @input Component.AudioComponent loopSoundStep4
// @input Component.AudioComponent loopSoundStep5
// @input Component.AudioComponent loopSoundStep6

// Completion sound
// @input Component.AudioComponent successSound

var currentStepIndex = 0;
var baselineValue = 0;
var lastStepCount = 0;
var isRecipeActive = false;

// -------------------- ENABLE --------------------
script.createEvent("OnEnableEvent").bind(function() {
    startStepOne();
    script.recipeCanvas.enabled = true;
});

// -------------------- AUDIO HELPERS --------------------
function getShortSoundForStep(stepIndex) {
    if (stepIndex === 1) return script.shortSoundStep1;
    if (stepIndex === 2) return script.shortSoundStep2;
    if (stepIndex === 3) return script.shortSoundStep3;
    if (stepIndex === 4) return script.shortSoundStep4;
    if (stepIndex === 5) return script.shortSoundStep5;
    if (stepIndex === 6) return script.shortSoundStep6;
    return null;
}

function getLoopSoundForStep(stepIndex) {
    if (stepIndex === 1) return script.loopSoundStep1;
    if (stepIndex === 2) return script.loopSoundStep2;
    if (stepIndex === 3) return script.loopSoundStep3;
    if (stepIndex === 4) return script.loopSoundStep4;
    if (stepIndex === 5) return script.loopSoundStep5;
    if (stepIndex === 6) return script.loopSoundStep6;
    return null;
}

function playShortSoundForStep(stepIndex) {
    var shortSound = getShortSoundForStep(stepIndex);
    if (shortSound) {
        shortSound.play(1);
    }
}

function stopAllLoopSounds() {
    var loopSounds = [
        script.loopSoundStep1,
        script.loopSoundStep2,
        script.loopSoundStep3,
        script.loopSoundStep4,
        script.loopSoundStep5,
        script.loopSoundStep6
    ];

    for (var i = 0; i < loopSounds.length; i++) {
        if (loopSounds[i]) {
            loopSounds[i].stop(false);
        }
    }
}

function startLoopSoundForStep(stepIndex) {
    //stopAllLoopSounds();

    var loopSound = getLoopSoundForStep(stepIndex);
    if (loopSound && !loopSound.isPlaying()) {
        loopSound.play(-1); // loop
    }
}

// -------------------- UI HELPERS --------------------
function hideAllStepUI() {
    if (script.uiStep1) script.uiStep1.enabled = false;
    if (script.uiStep2) script.uiStep2.enabled = false;
    if (script.uiStep3) script.uiStep3.enabled = false;
    if (script.uiStep4) script.uiStep4.enabled = false;
    if (script.uiStep5) script.uiStep5.enabled = false;
    if (script.uiStep6) script.uiStep6.enabled = false;
    if (script.uiFinish) script.uiFinish.enabled = false;
}

function showUIForStep(stepIndex) {
    hideAllStepUI();

    if (stepIndex === 1 && script.uiStep1) script.uiStep1.enabled = true;
    if (stepIndex === 2 && script.uiStep2) script.uiStep2.enabled = true;
    if (stepIndex === 3 && script.uiStep3) script.uiStep3.enabled = true;
    if (stepIndex === 4 && script.uiStep4) script.uiStep4.enabled = true;
    if (stepIndex === 5 && script.uiStep5) script.uiStep5.enabled = true;
    if (stepIndex === 6 && script.uiStep6) script.uiStep6.enabled = true;
}

// -------------------- COUNT HELPERS --------------------
function getCurrentGestureCountForStep(stepIndex) {
    if (!script.gestureLib) return 0;

    if (stepIndex === 1) return script.gestureLib.chopCount || 0;
    if (stepIndex === 2) return script.gestureLib.stirCount || 0;

    // Replace these with your real variable names
    if (stepIndex === 3) return script.gestureLib.chopCount || 0;
    if (stepIndex === 4) return script.gestureLib.stirCount || 0;
    if (stepIndex === 5) return script.gestureLib.chopCount || 0;
    if (stepIndex === 6) return script.gestureLib.stirCount || 0;

    return 0;
}

function getGoalForStep(stepIndex) {
    // Change these to your actual goals
    if (stepIndex === 1) return 3;
    if (stepIndex === 2) return 3;
    if (stepIndex === 3) return 3;
    if (stepIndex === 4) return 3;
    if (stepIndex === 5) return 3;
    if (stepIndex === 6) return 3;

    return 0;
}

// -------------------- STEP FLOW --------------------
function startStep(stepIndex) {
    currentStepIndex = stepIndex;
    isRecipeActive = true;

    showUIForStep(stepIndex);

    baselineValue = getCurrentGestureCountForStep(stepIndex);
    lastStepCount = baselineValue;

    if (stepIndex > 1 && script.successSound) {
        script.successSound.play(1);
    }

    print("Step " + stepIndex + " Started");
}

function startStepOne() {
    startStep(1);
}

function goToNextStep() {
    if (currentStepIndex < 6) {
        startLoopSoundForStep(currentStepIndex);
        print("Finished step.");
        startStep(currentStepIndex + 1);
    } else {
        finishRecipe();
    }
}

// -------------------- UPDATE --------------------
script.createEvent("UpdateEvent").bind(function() {
    if (!isRecipeActive || !script.gestureLib) return;
    if (currentStepIndex < 1 || currentStepIndex > 6) return;

    var currentCount = getCurrentGestureCountForStep(currentStepIndex);

    // Play unique short sound each time count goes up
    if (currentCount > lastStepCount) {
        var increase = currentCount - lastStepCount;

        for (var i = 0; i < increase; i++) {
            playShortSoundForStep(currentStepIndex);
        }

        lastStepCount = currentCount;
    }

    var delta = currentCount - baselineValue;
    var goal = getGoalForStep(currentStepIndex);

    if (delta >= goal) {
        goToNextStep();
    }
});

// -------------------- FINISH --------------------
function finishRecipe() {
    isRecipeActive = false;
    stopAllLoopSounds();
    hideAllStepUI();

    if (script.successSound) {
        script.successSound.play(1);
    }

    if (script.uiFinish) {
        script.uiFinish.enabled = true;
    }

    print("Recipe Complete!");
}