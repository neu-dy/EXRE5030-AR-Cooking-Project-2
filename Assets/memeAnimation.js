// @input SceneObject yayObject
// @input float displayDuration = 1.2
// @input float scalePeak = 1.4

var isPlaying = false;
var elapsed = 0;
var screenTransform = null;

// ─── INIT ───────────────────────────────
script.createEvent("OnStartEvent").bind(function() {
    script.yayObject.enabled = false;
    screenTransform = script.yayObject.getComponent("Component.ScreenTransform");
});

// ─── TAP TO TRIGGER for art tesing ONLY─────────────────────
script.createEvent("TouchStartEvent").bind(function() {
    playYay();
});

// ─── ANIMATION LOOP ─────────────────────
script.createEvent("UpdateEvent").bind(function(e) {
    if (!isPlaying) return;

    elapsed += e.getDeltaTime();
    var t = elapsed / script.displayDuration;

    if (t >= 1.0) {
        script.yayObject.enabled = false;
        isPlaying = false;
        return;
    }

    var scale;
    if (t < 0.2) {
        scale = (t / 0.2) * script.scalePeak;
    } else if (t < 0.5) {
        scale = script.scalePeak - ((t - 0.2) / 0.3) * (script.scalePeak - 1.0);
    } else {
        scale = 1.0 - ((t - 0.5) / 0.5);
    }

    if (screenTransform) {
        screenTransform.scale = new vec3(scale, scale, 1);
    }

    var alpha = t < 0.6 ? 1.0 : 1.0 - ((t - 0.6) / 0.4);
    var memeText = script.yayObject.getComponent("MemeText");
    if (memeText) {
        memeText.color = new vec4(
            memeText.color.r,
            memeText.color.g,
            memeText.color.b,
            alpha
        );
    }
});

// ─── PLAY FUNCTION ──────────────────────
function playYay() {
    if (isPlaying) return;
    elapsed = 0;
    isPlaying = true;
    script.yayObject.enabled = true;
}

// Expose for other scripts
script.playYay = playYay;