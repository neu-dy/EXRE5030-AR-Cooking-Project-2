//@input Component.ObjectTracking tracker
//@input Component.ScriptComponent recipeManager

//@input Component.AudioComponent soundOpen
//@input Component.AudioComponent soundClose
//@input Component.AudioComponent soundVictory
//@input Component.AudioComponent soundIndex
//@input Component.AudioComponent soundHorns
//@input Component.AudioComponent soundThumb

//@input SceneObject visualOpen
//@input SceneObject visualClose
//@input SceneObject visualVictory
//@input SceneObject visualIndex
//@input SceneObject visualHorns
//@input SceneObject visualThumb

print("Phone HandGesture loaded");

script.hornsCount = 0;
script.victoryCount = 0;

var hideEvents = {};


// ----------------------------
// SHOW VISUAL TEMPORARILY
// ----------------------------
function showPopupTemporarily(obj, seconds) {
    if (!obj) {
        return;
    }

    obj.enabled = true;

    if (hideEvents[obj.name]) {
        hideEvents[obj.name].enabled = false;
    }

    var event = script.createEvent("DelayedCallbackEvent");

    event.bind(function () {
        obj.enabled = false;
    });

    event.reset(seconds);

    hideEvents[obj.name] = event;
}


// ----------------------------
// SEND TO RECIPE MANAGER
// Keep this for later if needed
// ----------------------------
function notifyRecipeManager(gestureName) {
    if (!script.recipeManager) {
        return;
    }

    if (!script.recipeManager.onGestureRecognized) {
        return;
    }

    script.recipeManager.onGestureRecognized(gestureName);
}


// ----------------------------
// TRACKER SAFETY
// ----------------------------
if (!script.tracker) {
    print("Tracker not assigned");
} else {

    // ----------------------------
    // OPEN HAND
    // ----------------------------
    script.tracker.registerDescriptorStart("open", function () {
        print("Open hand detected");

        if (script.soundOpen) {
            script.soundOpen.play(1);
        }

        if (script.visualOpen) {
            showPopupTemporarily(script.visualOpen, 3);
        }

        // notifyRecipeManager("open");
    });


    // ----------------------------
    // CLOSE FIST
    // ----------------------------
    script.tracker.registerDescriptorStart("close", function () {
        print("Close hand detected");

        if (script.soundClose) {
            script.soundClose.play(1);
        }

        if (script.visualClose) {
            showPopupTemporarily(script.visualClose, 3);
        }

        // notifyRecipeManager("close");
    });


    // ----------------------------
    // VICTORY SIGN
    // ----------------------------
    script.tracker.registerDescriptorStart("victory", function () {
        print("Victory detected");
        script.victoryCount += 1;
        print("victoryCount = " + script.victoryCount);

        /*if (script.soundVictory) {
            script.soundVictory.play(1);
        }

        if (script.visualVictory) {
            showPopupTemporarily(script.visualVictory, 3);
        }

        // notifyRecipeManager("victory");*/
    });


    // ----------------------------
    // INDEX FINGER
    // ----------------------------
    script.tracker.registerDescriptorStart("index_finger", function () {
        print("Index finger detected");

        if (script.soundIndex) {
            script.soundIndex.play(1);
        }

        if (script.visualIndex) {
            showPopupTemporarily(script.visualIndex, 3);
        }

        // notifyRecipeManager("index_finger");
    });


    // ----------------------------
    // HORNS
    // ----------------------------
    script.tracker.registerDescriptorStart("horns", function () {
        print("Horns gesture detected");

        script.hornsCount += 1;
        print("hornsCount = " + script.hornsCount);

        /*if (script.soundHorns) {
            script.soundHorns.play(1);
        }

        if (script.visualHorns) {
            showPopupTemporarily(script.visualHorns, 3);
        }

        // notifyRecipeManager("horns");*/
    });


    // ----------------------------
    // THUMB UP
    // ----------------------------
    script.tracker.registerDescriptorStart("thumb", function () {
        print("Thumb gesture detected");

        if (script.soundThumb) {
            script.soundThumb.play(1);
        }

        if (script.visualThumb) {
            showPopupTemporarily(script.visualThumb, 3);
        }

        // notifyRecipeManager("thumb");
    });
}


// ----------------------------
// OPTIONAL DESKTOP TESTING
// ----------------------------
script.createEvent("TapEvent").bind(function () {
    print("Tap test -> open");

    if (script.soundOpen) {
        script.soundOpen.play(1);
    }

    if (script.visualOpen) {
        showPopupTemporarily(script.visualOpen, 1);
    }

    // notifyRecipeManager("open");
});