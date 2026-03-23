// @input SceneObject startScreen
// @input SceneObject mojitoLogicObject
// @input Component.InteractionComponent startButton

// 1. When the Lens starts, show only the Start Screen
script.createEvent("OnStartEvent").bind(function() {
    if(script.startScreen) script.startScreen.enabled = true;
    if(script.recipeListScreen) script.recipeListScreen.enabled = false;
    if(script.mojitoLogicObject) script.mojitoLogicObject.enabled = false;
});

// 2. Pressing "Start Game" moves to the Recipe List
script.startButton.onTap.add(function() {
    script.startScreen.enabled = false;
    //script.recipeListScreen.enabled = true;
    script.mojitoLogicObject.enabled = true; // Start Mojito script
});
