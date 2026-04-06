//@input Component.ObjectTracking objectTracking
/*

*/
// Public counters that RecipeController reads

print("Gesture Library loaded");

script.chopCount = 0;
script.stirCount = 0;
script.squeezeCount = 0;
script.scoopCount = 0;

script.enableChop = false;
script.enableStir = false;
script.enableSqueeze = false;
script.enableScoop = false;

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
var stirRadiusThreshold = 0.06;
var stirLastAngle = null;
var stirAccumulatedAngle = 0;
var stirMinRadius = 0.06;
var lastStirTime = 0;
var stirCooldown = 0.35;

// --------------------
// SQUEEZE
// --------------------
var squeezeClosed = false;
var squeezeReady = false;
var squeezeCloseThreshold = 0.07;
var squeezeOpenThreshold = 0.10;
var squeezeCooldown = 0.25;
var lastSqueezeTime = 0;

// --------------------
// SCOOP
// --------------------
var scoopDipDetected = false;
var scoopStartPos = null;
var scoopCooldown = 0.3;
var lastScoopTime = 0;

var scoopNeutralCenter = new vec2(0, 0);
var scoopNeutralRadius = 0.12;

var scoopDipThreshold = -0.02;
var scoopRiseThreshold = 0.05;
var scoopHorizontalMin = 0.03;
var scoopMustReturnToNeutral = true;

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

function getJointScreenPos(sceneObject) {
    if (!sceneObject) return null;

    var st = sceneObject.getComponent("Component.ScreenTransform");
    if (!st) return null;

    var c = st.anchors.getCenter();
    return new vec2(c.x, c.y);
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

function normalizeAngleDelta(delta) {
    while (delta > Math.PI) {
        delta -= 2 * Math.PI;
    }
    while (delta < -Math.PI) {
        delta += 2 * Math.PI;
    }
    return delta;
}

function resetStirState() {
    stirCenter = new vec2(0, 0);
    stirStartTime = getTime();
    stirLastAngle = null;
    stirAccumulatedAngle = 0;
}

/*function avgFingerCurlDistance(thumbTip, indexTip, middleTip, ringTip, pinkyTip) {
    var d1 = thumbTip.distance(indexTip);
    var d2 = thumbTip.distance(middleTip);
    var d3 = thumbTip.distance(ringTip);
    var d4 = thumbTip.distance(pinkyTip);

    return (d1 + d2 + d3 + d4) / 4.0;
}*/

// --------------------
// STARTUP
// --------------------
script.createEvent("OnStartEvent").bind(function () {
    resetStirState();
    scoopDipDetected = false;
    scoopStartPos = null;
    scoopMustReturnToNeutral = true;
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
    if (script.enableStir && now - stirStartTime >= stirWarmupTime) {
        var offset = pos.sub(stirCenter);
        var radius = offset.length;

        if (radius >= stirMinRadius && radius <= 0.35) {
            var angle = Math.atan2(offset.y, offset.x);

            if (stirLastAngle !== null) {
                var deltaAngle = normalizeAngleDelta(angle - stirLastAngle);

                if (Math.abs(deltaAngle) > 0.05) {
                    stirAccumulatedAngle += deltaAngle;
                    print("[GestureLibrary] stirAccumulatedAngle = " + stirAccumulatedAngle);
                }
            }

            stirLastAngle = angle;

            if (Math.abs(stirAccumulatedAngle) >= 2 * Math.PI && (now - lastStirTime) > stirCooldown) {
                script.stirCount += 1;
                lastStirTime = now;
                print("[GestureLibrary] stirCount = " + script.stirCount);
                resetStirState();
            }
        }
    }

    // --------------------
    // SQUEEZE
    // --------------------
    /*
    if (script.enableSqueeze) {
        var thumbPos = getJointScreenPos(script.thumbTip);
        var indexPos = getJointScreenPos(script.indexTip);
        var middlePos = getJointScreenPos(script.middleTip);
        var ringPos = getJointScreenPos(script.ringTip);
        var pinkyPos = getJointScreenPos(script.pinkyTip);

        if (thumbPos && indexPos && middlePos && ringPos && pinkyPos) {
            var avgDist = avgFingerCurlDistance(thumbPos, indexPos, middlePos, ringPos, pinkyPos);

            // First require the hand to be open enough before squeeze can arm itself
            if (!squeezeReady && avgDist > squeezeOpenThreshold) {
                squeezeReady = true;
                squeezeClosed = false;
                print("[GestureLibrary] Squeeze ready");
            }

            // Once armed, detect close
            if (squeezeReady && !squeezeClosed && avgDist < squeezeCloseThreshold) {
                squeezeClosed = true;
                print("[GestureLibrary] Squeeze close detected");
            }

            // Then require reopen to count one full squeeze
            if (squeezeReady && squeezeClosed && avgDist > squeezeOpenThreshold && (now - lastSqueezeTime) > squeezeCooldown) {
                script.squeezeCount += 1;
                lastSqueezeTime = now;
                squeezeClosed = false;
                squeezeReady = false;
                print("[GestureLibrary] squeezeCount = " + script.squeezeCount);
            }
        }
    } else {
        squeezeClosed = false;
        squeezeReady = false;
    }*/

    if (lastPosition !== null) {
        var delta = pos.sub(lastPosition);
    
        // --------------------
        // CHOP
        // --------------------
        if (script.enableChop) {
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

        // --------------------
        // SCOOP
        // --------------------
        if (script.enableScoop) {
            var delta = pos.sub(lastPosition);
            var distToNeutral = pos.distance(scoopNeutralCenter);

            // hand must return near neutral zone before a new scoop can begin
            if (scoopMustReturnToNeutral) {
                if (distToNeutral <= scoopNeutralRadius) {
                    scoopMustReturnToNeutral = false;
                    print("[GestureLibrary] Scoop ready from neutral zone");
                }
            } else {
                // stage 1: detect a downward dip, but only if starting near neutral zone
                if (!scoopDipDetected && distToNeutral <= scoopNeutralRadius && delta.y < scoopDipThreshold) {
                    scoopDipDetected = true;
                    scoopStartPos = pos;
                    print("[GestureLibrary] Scoop dip detected");
                }

                // stage 2: detect upward lift + sideways movement
                if (scoopDipDetected && scoopStartPos !== null) {
                    var totalRise = pos.y - scoopStartPos.y;
                    var totalHorizontal = Math.abs(pos.x - scoopStartPos.x);

                    if (
                        totalRise > scoopRiseThreshold &&
                        totalHorizontal > scoopHorizontalMin &&
                        (now - lastScoopTime) > scoopCooldown
                    ) {
                        script.scoopCount += 1;
                        lastScoopTime = now;
                        scoopDipDetected = false;
                        scoopStartPos = null;
                        scoopMustReturnToNeutral = true;
                        print("[GestureLibrary] scoopCount = " + script.scoopCount);
                    }
                }
            }
        } else {
            scoopDipDetected = false;
            scoopStartPos = null;
            scoopMustReturnToNeutral = true;
        }
    }

    lastPosition = pos;
});