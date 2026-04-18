// @input Component.ScriptComponent gestureLib
// @input SceneObject recipeCanvas

// Step Description UI (左上角)
// @input SceneObject uiStep1
// @input SceneObject uiStep2
// @input SceneObject uiStep3
// @input SceneObject uiStep4
// @input SceneObject uiStep5
// @input SceneObject uiStep6
// @input SceneObject uiFinish

// Step Animations (左下角)
// @input SceneObject stepAnime1
// @input SceneObject stepAnime2
// @input SceneObject stepAnime3
// @input SceneObject stepAnime4
// @input SceneObject stepAnime5
// @input SceneObject stepAnimeFinal

// Gesture Count Images (每个 gestureUI 里的3个子物体，对应 1/3, 2/3, 3/3)
// @input SceneObject gestureImg1_1
// @input SceneObject gestureImg1_2
// @input SceneObject gestureImg1_3

// @input SceneObject gestureImg2_1
// @input SceneObject gestureImg2_2
// @input SceneObject gestureImg2_3

// @input SceneObject gestureImg3_1
// @input SceneObject gestureImg3_2
// @input SceneObject gestureImg3_3

// @input SceneObject gestureImg4_1
// @input SceneObject gestureImg4_2
// @input SceneObject gestureImg4_3

// @input SceneObject gestureImg5_1
// @input SceneObject gestureImg5_2
// @input SceneObject gestureImg5_3

// @input SceneObject gestureImg6_1
// @input SceneObject gestureImg6_2
// @input SceneObject gestureImg6_3

// Always-visible
// @input SceneObject mascot

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

print("MojitoRecipe loaded");

var currentStepIndex = 0;
var baselineValue = 0;
var lastStepCount = 0;
var isRecipeActive = false;

// -------------------- ENABLE --------------------
script.createEvent("OnEnableEvent").bind(function() {
    if (script.recipeCanvas) script.recipeCanvas.enabled = true;
    if (script.mascot) script.mascot.enabled = true;
    startStepOne();
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
    if (shortSound) shortSound.play(1);
}

function stopAllLoopSounds() {
    var loopSounds = [
        script.loopSoundStep1, script.loopSoundStep2,
        script.loopSoundStep3, script.loopSoundStep4,
        script.loopSoundStep5, script.loopSoundStep6
    ];
    for (var i = 0; i < loopSounds.length; i++) {
        if (loopSounds[i]) loopSounds[i].stop(false);
    }
}

function startLoopSoundForStep(stepIndex) {
    var loopSound = getLoopSoundForStep(stepIndex);
    if (loopSound && !loopSound.isPlaying()) loopSound.play(-1);
}

// -------------------- GESTURE ENABLE PER STEP --------------------
function setGestureEnableForStep(stepIndex) {
    if (!script.gestureLib) return;

    script.gestureLib.enableChop = false;
    script.gestureLib.enableStir = false;
    script.gestureLib.enableSqueeze = false;
    script.gestureLib.enableScoop = false;

    if (stepIndex === 1) script.gestureLib.enableChop = true;
    else if (stepIndex === 2) script.gestureLib.enableScoop = true;
    else if (stepIndex === 3) script.gestureLib.enableChop = true;
    else if (stepIndex === 4) script.gestureLib.enableScoop = true;
    else if (stepIndex === 5) script.gestureLib.enableChop = true;
    else if (stepIndex === 6) script.gestureLib.enableScoop = true;

    print("Step " + stepIndex + " gesture enabled");
}

// -------------------- UI HELPERS --------------------
function hideAllStepUI() {
    // 步骤描述
    if (script.uiStep1) script.uiStep1.enabled = false;
    if (script.uiStep2) script.uiStep2.enabled = false;
    if (script.uiStep3) script.uiStep3.enabled = false;
    if (script.uiStep4) script.uiStep4.enabled = false;
    if (script.uiStep5) script.uiStep5.enabled = false;
    if (script.uiStep6) script.uiStep6.enabled = false;
    if (script.uiFinish) script.uiFinish.enabled = false;

    // 步骤动画
    if (script.stepAnime1) script.stepAnime1.enabled = false;
    if (script.stepAnime2) script.stepAnime2.enabled = false;
    if (script.stepAnime3) script.stepAnime3.enabled = false;
    if (script.stepAnime4) script.stepAnime4.enabled = false;
    if (script.stepAnime5) script.stepAnime5.enabled = false;
    if (script.stepAnimeFinal) script.stepAnimeFinal.enabled = false;
}

function showUIForStep(stepIndex) {
    hideAllStepUI();

    // 步骤描述（左上）
    if (stepIndex === 1 && script.uiStep1) script.uiStep1.enabled = true;
    if (stepIndex === 2 && script.uiStep2) script.uiStep2.enabled = true;
    if (stepIndex === 3 && script.uiStep3) script.uiStep3.enabled = true;
    if (stepIndex === 4 && script.uiStep4) script.uiStep4.enabled = true;
    if (stepIndex === 5 && script.uiStep5) script.uiStep5.enabled = true;
    if (stepIndex === 6 && script.uiStep6) script.uiStep6.enabled = true;

    // 步骤动画（左下）
    if (stepIndex === 1 && script.stepAnime1) script.stepAnime1.enabled = true;
    if (stepIndex === 2 && script.stepAnime2) script.stepAnime2.enabled = true;
    if (stepIndex === 3 && script.stepAnime3) script.stepAnime3.enabled = true;
    if (stepIndex === 4 && script.stepAnime4) script.stepAnime4.enabled = true;
    if (stepIndex === 5 && script.stepAnime5) script.stepAnime5.enabled = true;
    if (stepIndex === 6 && script.stepAnime6) script.stepAnime6.enabled = true;
}

// -------------------- COUNT IMAGE HELPERS --------------------
function hideAllCountImagesForStep(stepIndex) {
    if (stepIndex === 1) {
        if (script.gestureImg1_1) script.gestureImg1_1.enabled = false;
        if (script.gestureImg1_2) script.gestureImg1_2.enabled = false;
        if (script.gestureImg1_3) script.gestureImg1_3.enabled = false;
    } else if (stepIndex === 2) {
        if (script.gestureImg2_1) script.gestureImg2_1.enabled = false;
        if (script.gestureImg2_2) script.gestureImg2_2.enabled = false;
        if (script.gestureImg2_3) script.gestureImg2_3.enabled = false;
    } else if (stepIndex === 3) {
        if (script.gestureImg3_1) script.gestureImg3_1.enabled = false;
        if (script.gestureImg3_2) script.gestureImg3_2.enabled = false;
        if (script.gestureImg3_3) script.gestureImg3_3.enabled = false;
    } else if (stepIndex === 4) {
        if (script.gestureImg4_1) script.gestureImg4_1.enabled = false;
        if (script.gestureImg4_2) script.gestureImg4_2.enabled = false;
        if (script.gestureImg4_3) script.gestureImg4_3.enabled = false;
    } else if (stepIndex === 5) {
        if (script.gestureImg5_1) script.gestureImg5_1.enabled = false;
        if (script.gestureImg5_2) script.gestureImg5_2.enabled = false;
        if (script.gestureImg5_3) script.gestureImg5_3.enabled = false;
    } else if (stepIndex === 6) {
        if (script.gestureImg6_1) script.gestureImg6_1.enabled = false;
        if (script.gestureImg6_2) script.gestureImg6_2.enabled = false;
        if (script.gestureImg6_3) script.gestureImg6_3.enabled = false;
    }
}

function updateCountImage(stepIndex, delta) {
    hideAllCountImagesForStep(stepIndex);

    if (delta <= 0) return;

    if (stepIndex === 1) {
        if (delta === 1 && script.gestureImg1_1) script.gestureImg1_1.enabled = true;
        if (delta === 2 && script.gestureImg1_2) script.gestureImg1_2.enabled = true;
        if (delta >= 3 && script.gestureImg1_3) script.gestureImg1_3.enabled = true;
    } else if (stepIndex === 2) {
        if (delta === 1 && script.gestureImg2_1) script.gestureImg2_1.enabled = true;
        if (delta === 2 && script.gestureImg2_2) script.gestureImg2_2.enabled = true;
        if (delta >= 3 && script.gestureImg2_3) script.gestureImg2_3.enabled = true;
    } else if (stepIndex === 3) {
        if (delta === 1 && script.gestureImg3_1) script.gestureImg3_1.enabled = true;
        if (delta === 2 && script.gestureImg3_2) script.gestureImg3_2.enabled = true;
        if (delta >= 3 && script.gestureImg3_3) script.gestureImg3_3.enabled = true;
    } else if (stepIndex === 4) {
        if (delta === 1 && script.gestureImg4_1) script.gestureImg4_1.enabled = true;
        if (delta === 2 && script.gestureImg4_2) script.gestureImg4_2.enabled = true;
        if (delta >= 3 && script.gestureImg4_3) script.gestureImg4_3.enabled = true;
    } else if (stepIndex === 5) {
        if (delta === 1 && script.gestureImg5_1) script.gestureImg5_1.enabled = true;
        if (delta === 2 && script.gestureImg5_2) script.gestureImg5_2.enabled = true;
        if (delta >= 3 && script.gestureImg5_3) script.gestureImg5_3.enabled = true;
    } else if (stepIndex === 6) {
        if (delta === 1 && script.gestureImg6_1) script.gestureImg6_1.enabled = true;
        if (delta === 2 && script.gestureImg6_2) script.gestureImg6_2.enabled = true;
        if (delta >= 3 && script.gestureImg6_3) script.gestureImg6_3.enabled = true;
    }

    print("[STEP " + stepIndex + "] Count image: " + delta + "/3");
}

// -------------------- COUNT HELPERS --------------------
function getCurrentGestureCountForStep(stepIndex) {
    if (!script.gestureLib) return 0;
    if (stepIndex === 1) return script.gestureLib.chopCount || 0;
    if (stepIndex === 2) return script.gestureLib.scoopCount || 0;
    if (stepIndex === 3) return script.gestureLib.chopCount || 0;
    if (stepIndex === 4) return script.gestureLib.scoopCount || 0;
    if (stepIndex === 5) return script.gestureLib.chopCount || 0;
    if (stepIndex === 6) return script.gestureLib.scoopCount || 0;
    return 0;
}

function getGoalForStep(stepIndex) {
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

    setGestureEnableForStep(stepIndex);
    showUIForStep(stepIndex);

    baselineValue = getCurrentGestureCountForStep(stepIndex);
    lastStepCount = baselineValue;

    updateCountImage(stepIndex, 0);

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
    var goal = getGoalForStep(currentStepIndex);

    if (currentCount > lastStepCount) {
        var increase = currentCount - lastStepCount;
        for (var i = 0; i < increase; i++) {
            playShortSoundForStep(currentStepIndex);
        }

        var delta = currentCount - baselineValue;
        if (delta > goal) delta = goal;

        updateCountImage(currentStepIndex, delta);
        print("[STEP " + currentStepIndex + "] " + delta + "/" + goal);
        lastStepCount = currentCount;
    }

    var delta = currentCount - baselineValue;
    if (delta >= goal) {
        print("[STEP " + currentStepIndex + "] COMPLETE");
        goToNextStep();
    }
});

// -------------------- FINISH --------------------
function finishRecipe() {
    isRecipeActive = false;
    stopAllLoopSounds();
    hideAllStepUI();

    if (script.mascot) script.mascot.enabled = true;
    if (script.stepAnimeFinal) script.stepAnimeFinal.enabled = true;

    if (script.successSound) script.successSound.play(1);
    if (script.uiFinish) script.uiFinish.enabled = true;

    print("Recipe Complete!");
}