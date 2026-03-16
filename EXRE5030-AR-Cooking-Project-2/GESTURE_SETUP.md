# Gesture Recognition Module — Setup Guide

This guide explains the project structure, where the gesture script lives, and how to set it up for your AR cooking prototype in Lens Studio 5.15.4.

---

## 1. Project Structure

```
EXRE5030-AR-Cooking-Project-2/
├── Assets/                          ← All scripts and assets go here
│   ├── MenuController.js            ← Recipe/menu UI (buttons, panels)
│   ├── GestureController.js         ← Bridge script: wires hand tracking → gesture module
│   ├── RecipeController.js          ← (Future) Recipe logic, subscribes to gestures
│   ├── Modules/
│   │   └── GestureRecognition/      ← Gesture module (separate from recipe logic)
│   │       ├── index.js             ← Main API: startListening, reset, etc.
│   │       └── GestureTypes.js       ← Gesture enum & native descriptor mapping
│   ├── Scene.scene
│   └── ...
├── Support/
│   └── StudioLib.d.ts               ← Lens Studio API types
├── jsconfig.json                   ← Paths: "Modules/*" resolves to Assets/Modules/
└── AR-Cooking.esproj
```

### Where the Gesture Script Goes

| File | Purpose |
|------|---------|
| `Assets/Modules/GestureRecognition/` | **Core gesture logic** — detects gestures, counts repetitions, exposes completion callback. No recipe-specific code. |
| `Assets/GestureController.js` | **Scene bridge** — attached to a Scene Object, receives `Component.ObjectTracking` (hand tracking) as input, initializes the module, forwards completion to recipe. |
| `Assets/RecipeController.js` | **Recipe logic** — subscribes to gesture completion, drives step order and UI. |

---

## 2. Lens Studio Hand Tracking Basics

### Native Gestures (Mobile Snapchat)

Lens Studio's **Object Tracking** component recognizes these descriptors when hand tracking is enabled:

| Descriptor | Meaning |
|------------|---------|
| `open` | Open palm |
| `close` | Closed fist (grab) |
| `index_finger` | Index finger pointing |
| `thumb` | Thumb up |
| `victory` | Peace sign (index + middle) |
| `horns` | Rock sign (index + pinky) |

### Spectacles (AR Glasses)

If you target **Spectacles**, the `GestureModule` provides:
- **Pinch** (thumb + index together): `getPinchDownEvent`, `getPinchUpEvent`
- **Grab** (fist): `getGrabBeginEvent`, `getGrabEndEvent`
- **Palm tap**: `getPalmTapDownEvent`, `getPalmTapUpEvent`

The current module is designed for **mobile** (Object Tracking). Spectacles support can be added later.

---

## 3. Cooking Gesture Mapping

We map cooking actions to native descriptors (or approximations):

| Cooking Gesture | Native Mapping | Notes |
|-----------------|----------------|-------|
| **Pinch** | `index_finger` or `close` (thumb+index) | Best: `index_finger` as proxy; `close` when only 2 fingers |
| **Pick + Place** | `close` → `open` (sequence) | Grab then release |
| **Pour** | `open` | Open hand tilted; simplified trigger |
| **Stir / Mix** | `index_finger` (repeated) | Circular motion; use repeated points |
| **Sprinkle** | `index_finger` or `close`→`open` | Pinch release approximation |
| **Press / Crush** | `close` | Fist |
| **Chop / Slice** | `open` (edge of hand) | Use `open` as proxy |
| **Knead** | `close` (repeated) | Repeated fist |
| **Whisk** | `index_finger` or `victory` | Whisking motion proxy |
| **Tear / Rip** | `close` → `open` | Same as Pick + Place |
| **Squeeze** | `close` | Fist/hold |
| **Flip** | `open` | Open palm flip |
| **Spread** | `open` | Open hand |
| **Roll** | `close` (repeated) | Rolling motion |
| **Toss** | `open` | Quick open |
| **Tap / Touch** | `index_finger` | Single tap |

---

## 4. Setup Steps in Lens Studio

### Step 1: Add Hand Tracking to Your Scene

1. In **Scene Hierarchy**, expand **Camera** (or create an Orthographic Camera).
2. Add **Hand Tracking Region** (from templates or create):
   - Right-click Camera → **Add New** → search for "Hand" or use the **Hand Gestures** template as reference.
3. Under Hand Tracking, ensure you have an **Object Tracking 2D** or **Object Tracking 3D** component on a child (e.g. "Hand Center").
4. In **Inspector**, confirm the Object Tracking component is configured for hand gestures.

If you don't have hand tracking yet:  
- Use **File → New From Template → Hand Gestures** to see the structure, then copy the Hand Tracking Region into your scene, or  
- Add **Object Tracker 2D** to your camera, set it to track hands, and create the hierarchy as in the Hand Gestures template.

### Step 2: Add the GestureController Script

1. In **Asset Browser**, locate `GestureController.js` (or create it under Assets).
2. Create a new **Scene Object** (e.g. name it `GestureController`).
3. Add a **Script Component** to that object.
4. Assign `GestureController.js` as the script.
5. In **Inspector**, set the script inputs:
   - **Object Tracking**: Drag the Object Tracking component (from Hand Center or wherever hand tracking lives).
   - **Hand** (optional): Left or Right.
   - **Debug Prints**: Enable for testing.

### Step 3: Connect Recipe Logic

1. Create `RecipeController.js` (or your recipe script).
2. In that script, require the GestureController's completion callback. For example:
   ```js
   // Recipe script subscribes to global or a shared object
   global.gestureRecognition.onStepComplete.add(function() {
       // Advance to next recipe step
   });
   ```
3. Or: Have GestureController expose an event that RecipeController listens to (see GestureController.js).

### Step 4: Configure Gesture Steps in Recipe

When starting a recipe step, call:
```js
global.gestureRecognition.startListening(GestureTypes.Pinch, 3, function() {
    print("User did 3 pinches!");
    advanceToNextStep();
});
```

---

## 5. Module API (for Recipe Script)

```js
// Require the module
var GestureRecognition = require("Modules/GestureRecognition");
var GestureTypes = require("Modules/GestureRecognition/GestureTypes");

// Start listening for a gesture. Only one gesture at a time.
// gestureType: GestureTypes.Pinch, GestureTypes.Pour, etc.
// requiredCount: number of successful repetitions
// onComplete: callback when count reached
GestureRecognition.startListening(gestureType, requiredCount, onComplete);

// Get current count (e.g. for UI)
var count = GestureRecognition.getCurrentCount();

// Reset (e.g. when changing steps)
GestureRecognition.reset();

// Check if currently listening
var active = GestureRecognition.isListening();
```

---

## 6. Extending Gestures

To add a new cooking gesture:
1. Add it to `GestureTypes` enum in `Modules/GestureRecognition/GestureTypes.js`.
2. Map it to a native descriptor in the `NATIVE_DESCRIPTOR_MAP`.
3. If no good mapping exists, add a custom handler in `index.js` (e.g. sequence of descriptors).

---

## 7. Testing Without Hand Tracking

For quick testing in the Preview window (mouse/tap):
- GestureController can have an optional **TapEvent** fallback that simulates a gesture when you tap the screen.
- Enable "Use Tap for Testing" in the script inputs.
