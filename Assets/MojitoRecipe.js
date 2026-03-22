// @input Component.ScriptComponent gestureLib // The script with the count variables
// @input SceneObject uiStep1
// @input SceneObject uiStep2
// @input SceneObject uiFinish
// @input Component.AudioComponent shortSoundClip
// @input Component.AudioComponent longSoundClip
// @input Component.AudioComponent successSound

var currentStepIndex = 0;
var baselineValue = 0;
var isRecipeActive = false;

// Tracks last observed count so we can detect +1 increases
var lastStepCount = 0;

// Triggers when the Menu turns this object ON
script.createEvent("OnEnableEvent").bind(function() {
    startStepOne();
});

// ---------- AUDIO HELPERS ----------
function playShortSound() {
    if (script.shortSoundClip) {
        script.shortSoundClip.play(1);
    }
}

function startLongLoop() {
    if (script.longSoundClip) {
        script.longSoundClip.play(-1); // loop
    }
}

function stopLongLoop() {
    if (script.longSoundClip) {
        script.longSoundClip.stop(false);
    }
}

// ---------- STEP 1 ----------
function startStepOne() {
    stopLongLoop();

    currentStepIndex = 1;
    isRecipeActive = true;

    if (script.uiStep1) script.uiStep1.enabled = true;
    if (script.uiStep2) script.uiStep2.enabled = false;
    if (script.uiFinish) script.uiFinish.enabled = false;

    baselineValue = script.gestureLib ? (script.gestureLib.victoryCount || 0) : 0;
    lastStepCount = baselineValue;

    startLongLoop();
    print("Step 1 Started");
}

// ---------- STEP 2 ----------
function startStepTwo() {
    stopLongLoop();

    currentStepIndex = 2;

    if (script.uiStep1) script.uiStep1.enabled = false;
    if (script.uiStep2) script.uiStep2.enabled = true;

    if (script.successSound) script.successSound.play(1);

    baselineValue = script.gestureLib ? (script.gestureLib.hornsCount || 0) : 0;
    lastStepCount = baselineValue;

    startLongLoop();
    print("Step 2 Started");
}

/*
// ---------- STEP 3 ----------
function startStepThree() {
    stopLongLoop();

    currentStepIndex = 3;

    if (script.uiStep2) script.uiStep2.enabled = false;
    if (script.uiStep3) script.uiStep3.enabled = true;

    if (script.successSound) script.successSound.play(1);

    baselineValue = script.gestureLib ? (script.gestureLib.stepThreeVar || 0) : 0;
    lastStepCount = baselineValue;

    startLongLoop();
    print("Step 3 Started");
}
*/

// ---------- CONTINUOUS CHECKER ----------
script.createEvent("UpdateEvent").bind(function() {
    if (!isRecipeActive || !script.gestureLib) return;

    if (currentStepIndex === 1) {
        var currentCount1 = script.gestureLib.victoryCount || 0;

        // play short sound for each +1 increase
        if (currentCount1 > lastStepCount) {
            var increase1 = currentCount1 - lastStepCount;
            for (var i = 0; i < increase1; i++) {
                playShortSound();
            }
            lastStepCount = currentCount1;
        }

        var delta1 = currentCount1 - baselineValue;
        if (delta1 >= 3) {
            startStepTwo();
        }
    } 
    else if (currentStepIndex === 2) {
        var currentCount2 = script.gestureLib.hornsCount || 0;

        // play short sound for each +1 increase
        if (currentCount2 > lastStepCount) {
            var increase2 = currentCount2 - lastStepCount;
            for (var j = 0; j < increase2; j++) {
                playShortSound();
            }
            lastStepCount = currentCount2;
        }

        var delta2 = currentCount2 - baselineValue;
        if (delta2 >= 3) {
            // startStepThree();
            finishRecipe();
        }
    }
    /*
    else if (currentStepIndex === 3) {
        var currentCount3 = script.gestureLib.stepThreeVar || 0;

        if (currentCount3 > lastStepCount) {
            var increase3 = currentCount3 - lastStepCount;
            for (var k = 0; k < increase3; k++) {
                playShortSound();
            }
            lastStepCount = currentCount3;
        }

        var delta3 = currentCount3 - baselineValue;
        if (delta3 >= 2) {
            finishRecipe();
        }
    }
    */
});

function finishRecipe() {
    isRecipeActive = false;
    stopLongLoop();

    if (script.uiStep1) script.uiStep1.enabled = false;
    if (script.uiStep2) script.uiStep2.enabled = false;

    if (script.successSound) script.successSound.play(1);
    if (script.uiFinish) script.uiFinish.enabled = true;

    print("Recipe Complete!");
}