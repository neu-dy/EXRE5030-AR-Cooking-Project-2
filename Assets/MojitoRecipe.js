// @input Component.ScriptComponent gestureLib // The script with the count variables
// @input SceneObject uiStep1
// @input SceneObject uiStep2
// @input SceneObject uiFinish
// @input Component.AudioComponent successSound

var currentStepIndex = 0;
var baselineValue = 0;
var isRecipeActive = false;

// Triggers when the Menu turns this object ON
script.createEvent("OnEnableEvent").bind(function() {
    startStepOne();
});

// --- STEP 1 ---
function startStepOne() {
    currentStepIndex = 1;
    isRecipeActive = true;
    script.uiStep1.enabled = true;
    
    // Capture the starting count for Step 1
    baselineValue = script.gestureLib.victoryCount || 0; 
    print("Step 1 Started");
}

// --- STEP 2 ---
function startStepTwo() {
    currentStepIndex = 2;
    script.uiStep1.enabled = false;
    script.uiStep2.enabled = true;
    if(script.successSound) script.successSound.play(1);
    
    // Capture the starting count for Step 2
    baselineValue = script.gestureLib.hornsCount || 0;
    print("Step 2 Started");
}

/*
// --- STEP 3 ---
function startStepThree() {
    currentStepIndex = 3;
    script.uiStep2.enabled = false;
    script.uiStep3.enabled = true;
    if(script.successSound) script.successSound.play(1);
    
    // Capture the starting count for Step 3
    baselineValue = script.gestureLib.stepThreeVar || 0;
    print("Step 3 Started");
}
*/

// --- CONTINUOUS CHECKER ---
script.createEvent("UpdateEvent").bind(function() {
    if (!isRecipeActive) return;

    if (currentStepIndex === 1) {
        // Goal: 5 (Delta check)
        var delta = script.gestureLib.victoryCount - baselineValue;
        if (delta >= 3) {
            startStepTwo();
        }
    } 
    else if (currentStepIndex === 2) {
        // Goal: 3 (Delta check)
        var delta = script.gestureLib.hornsCount - baselineValue;
        if (delta >= 3) {
            //startStepThree();
            finishRecipe();
        }
    }
    /*
    else if (currentStepIndex === 3) {
        // Goal: 1 (Delta check)
        var delta = script.gestureLib.stepThreeVar - baselineValue;
        if (delta >= 2) {
            finishRecipe();
        }
    }
    */
});

function finishRecipe() {
    isRecipeActive = false;
    script.uiStep2.enabled = false;
    if(script.successSound) script.successSound.play(1);
    script.uiFinish.enabled = true;
    print("Recipe Complete!");
}