/*
// @input Component.AudioComponent soundPinch
// @input Component.AudioComponent soundGrab
// @input SceneObject visualPinch
// @input SceneObject visualGrab

// 1. Load the Gesture Module
print("Hand gesture recognizer loaded.");
const gestureModule = require("LensStudio:GestureModule");

// Script for showing visual temporarily
var hideEvents = {};

function showPopupTemporarily(obj, seconds) {

    if (!obj) {
        print("Object missing");
        return;
    }

    // Show object
    obj.enabled = true;

    // Cancel previous timer for this object
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

// 2. Define the callback for Gesture 1 (e.g., Pinch)
gestureModule.getPinchDownEvent(GestureModule.HandType.Right).add(() => {
    print("Right Hand Pinch Detected!");
    if (script.soundPinch) {
        script.soundPinch.play(1); // Play once
    }

    showPopupTemporarily(script.visualPinch, 5);
});

// 3. Define the callback for Gesture 2 (e.g., Grab)
gestureModule.getGrabBeginEvent(GestureModule.HandType.Right).add(() => {
    print("Right Hand Grab Detected!");
    if (script.soundGrab) {
        script.soundGrab.play(1);
    }

    // showSoundTemp()
    showPopupTemporarily(script.visualGrab, 5);
    // addToCount

    // Level/recipe script (each script handles a different recipe)
    // that script handles the order of gestures/steps
    // and checks number of times gesture has been completed
    // that script, between each step, just calls UI element
});

// Mouse test -- copy above sections here to test that code
script.createEvent("TapEvent").bind(() => {
    print("Right Hand Grab Detected!");
    if (script.soundGrab) {
        script.soundGrab.play(1);
    }

    showPopupTemporarily(script.visualGrab, .2);

});
*/