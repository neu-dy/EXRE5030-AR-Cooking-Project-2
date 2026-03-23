//@input Component.ObjectTracking objectTracking

// Public counters that RecipeController reads
script.chopCount = 0;
script.stirCount = 0;

// --------------------
// GENERAL
// --------------------
var lastPosition = null;

// --------------------
// CHOP
// --------------------
var chopDownDetected = false;
var chopDownThreshold = -0.05;
var chopUpThreshold = 0.02;
var chopCooldown = 0.5;
var lastChopTime = 0;

// --------------------
// STIR
// --------------------
var stirCenter = new vec2(0, 0);
var stirStartTime = 0;
var stirWarmupTime = 0.4;
var stirRadiusThreshold = 0.08;
var stirDirectionSequence = [];
var stirLastDirection = null;
var lastStirTime = 0;
var stirCooldown = 0.35;

// --------------------
// HELPERS
// --------------------
function getScreenPos() {
    if (!script.objectTracking) {
        return null;
    }

    var sceneObject = script.objectTracking.getSceneObject();
    if (!sceneObject) {
        return null;
    }

    var screenTransform = sceneObject.getComponent("Component.ScreenTransform");
    if (!screenTransform) {
        print("[GestureLibrary] No ScreenTransform found");
        return null;
    }

    var center = screenTransform.anchors.getCenter();
    return new vec2(center.x, center.y);
}

function getStirDirection(offset) {
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
        if (offset.x > stirRadiusThreshold) {
            return "right";
        }
        if (offset.x < -stirRadiusThreshold) {
            return "left";
        }
    } else {
        if (offset.y > stirRadiusThreshold) {
            return "up";
        }
        if (offset.y < -stirRadiusThreshold) {
            return "down";
        }
    }
    return null;
}

function isValidStirSequence(seq) {
    var validSeqs = [
        "right,down,left,up",
        "down,left,up,right",
        "left,up,right,down",
        "up,right,down,left",

        "right,up,left,down",
        "up,left,down,right",
        "left,down,right,up",
        "down,right,up,left"
    ];

    return validSeqs.indexOf(seq) !== -1;
}

function resetStirState() {
    stirCenter = new vec2(0, 0);
    stirStartTime = getTime();
    stirDirectionSequence = [];
    stirLastDirection = null;
}

// --------------------
// STARTUP
// --------------------
script.createEvent("OnStartEvent").bind(function () {
    resetStirState();
    print("[GestureLibrary] Ready");
});

// --------------------
// UPDATE
// --------------------
script.createEvent("UpdateEvent").bind(function () {
    var pos = getScreenPos();
    if (!pos) {
        return;
    }

    var now = getTime();

    // --------------------
    // STIR
    // --------------------
    if (now - stirStartTime >= stirWarmupTime) {
        var offset = pos.sub(stirCenter);

        if (offset.length <= 0.25) {
            var dir = getStirDirection(offset);

            if (dir !== null && dir !== stirLastDirection) {
                stirLastDirection = dir;
                stirDirectionSequence.push(dir);
                print("[GestureLibrary] Stir dir: " + dir);
            }

            if (stirDirectionSequence.length > 4) {
                stirDirectionSequence.shift();
            }

            var seq = stirDirectionSequence.join(",");

            if (isValidStirSequence(seq) && (now - lastStirTime) > stirCooldown) {
                script.stirCount += 1;
                lastStirTime = now;
                print("[GestureLibrary] stirCount = " + script.stirCount);
                resetStirState();
            }
        }
    }

    if (lastPosition !== null) {
        var delta = pos.sub(lastPosition);

        // --------------------
        // CHOP
        // --------------------
        if (!chopDownDetected && delta.y < chopDownThreshold) {
            chopDownDetected = true;
            print("[GestureLibrary] Chop down detected");
        }

        if (chopDownDetected && delta.y > chopUpThreshold && (now - lastChopTime) > chopCooldown) {
            script.chopCount += 1;
            lastChopTime = now;
            chopDownDetected = false;
            print("[GestureLibrary] chopCount = " + script.chopCount);
        }
    }

    lastPosition = pos;
});