var GestureTypes = {
    CHOP: "chop",
    STIR: "stir",
    SCOOP: "scoop"
};

var objectTracking = null;
var isListening = false;
var targetGesture = null;
var requiredCount = 0;
var currentCount = 0;

var lastPosition = null;
var lastTriggerTime = 0;

var chopDownDetected = false;
var chopDownThreshold = -0.05;
var chopUpThreshold = 0.02;
var chopCooldown = 0.5;

var scoopUpDetected = false;
var scoopUpThreshold = 0.05;
var scoopCooldown = 0.5;

var stirCenter = new vec2(0, 0);
var stirStartTime = 0;
var stirWarmupTime = 0.4;

var stirRadiusThreshold = 0.08;
var stirDirectionSequence = [];
var stirLastDirection = null;

function init(trackingComponent) {
    objectTracking = trackingComponent;
}

function startListening(gestureType, countNeeded) {
    targetGesture = gestureType;
    requiredCount = countNeeded || 1;
    currentCount = 0;
    isListening = true;
    lastPosition = null;
    lastTriggerTime = 0;

    stirCenter = new vec2(0, 0);
    stirStartTime = getTime();
    stirDirectionSequence = [];
    stirLastDirection = null;

    print("[GestureRecognition] Listening for " + gestureType + ", need " + requiredCount);
}

function stopListening() {
    isListening = false;
}

function getCount() {
    return currentCount;
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

function update() {
    if (!isListening || !objectTracking) {
        return;
    }

    var sceneObject = objectTracking.getSceneObject();
    var screenTransform = sceneObject.getComponent("Component.ScreenTransform");

    if (!screenTransform) {
        print("[GestureRecognition] No ScreenTransform found on tracked object");
        return;
    }

    // Screen-space center
    var center = screenTransform.anchors.getCenter();
    var pos = new vec2(center.x, center.y);

    if (targetGesture === GestureTypes.STIR) {
        // let tracking settle before counting
        if (getTime() - stirStartTime < stirWarmupTime) {
            return;
        }

        var offset = pos.sub(stirCenter);
        var dir = getStirDirection(offset);

        if (dir !== null && dir !== stirLastDirection) {
            stirLastDirection = dir;
            stirDirectionSequence.push(dir);
            print("[GestureRecognition] Stir dir: " + dir);
        }

        // keep only the most recent 4 distinct directions
        if (stirDirectionSequence.length > 4) {
            stirDirectionSequence.shift();
        }

        var seq = stirDirectionSequence.join(",");

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

        if (validSeqs.indexOf(seq) !== -1) {
            currentCount += 1;
            print("[GestureRecognition] Stir count: " + currentCount);

            stirDirectionSequence = [];
            stirLastDirection = null;
            stirStartTime = getTime();

            if (currentCount >= requiredCount) {
                isListening = false;
                print("[GestureRecognition] Gesture success: " + targetGesture);

                if (global.onGestureSuccess) {
                    global.onGestureSuccess(targetGesture);
                }
            }
        }
    }

    if (lastPosition !== null) {
        var delta = pos.sub(lastPosition);
        var now = getTime();

        if (targetGesture === GestureTypes.CHOP) {
            if (!chopDownDetected && delta.y < chopDownThreshold) {
                chopDownDetected = true;
                print("[GestureRecognition] Chop down detected");
            }

            // after moving down, require upward recovery before counting 1 chop
            if (chopDownDetected && delta.y > chopUpThreshold && (now - lastTriggerTime) > chopCooldown) {
                currentCount += 1;
                lastTriggerTime = now;
                chopDownDetected = false;

                print("[GestureRecognition] Chop count: " + currentCount);

                if (currentCount >= requiredCount) {
                    isListening = false;
                    print("[GestureRecognition] Gesture success: " + targetGesture);

                    if (global.onGestureSuccess) {
                        global.onGestureSuccess(targetGesture);
                    }
                }
            }
        }
        if (targetGesture === GestureTypes.SCOOP) {
            if (!scoopUpDetected && delta.y < scoopUpThreshold) {
                scoopUpDetected = true;
                print("[GestureRecognition] Scoop up detected");
            }

            // after moving down, require upward recovery before counting 1 scoop
            if (scoopUpDetected && delta.y > scoopUpThreshold && (now - lastTriggerTime) > scoopCooldown) {
                currentCount += 1;
                lastTriggerTime = now;
                scoopUpDetected = false;

                print("[GestureRecognition] Scoop count: " + currentCount);

                if (currentCount >= requiredCount) {
                    isListening = false;
                    print("[GestureRecognition] Gesture success: " + targetGesture);

                    if (global.onGestureSuccess) {
                        global.onGestureSuccess(targetGesture);
                    }
                }
            }
        }

    }
    lastPosition = pos;
}

module.exports = {
    GestureTypes: GestureTypes,
    init: init,
    startListening: startListening,
    stopListening: stopListening,
    getCount: getCount,
    update: update
};