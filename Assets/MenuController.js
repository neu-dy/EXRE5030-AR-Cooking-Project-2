// @input SceneObject startScreen
// @input SceneObject recipeListScreen
// @input SceneObject mojitoLogicObject
// @input Component.InteractionComponent startButton
// @input Component.InteractionComponent recipe01Button

// 1. When the Lens starts, show only the Start Screen
script.createEvent("OnStartEvent").bind(function() {
    if(script.startScreen) script.startScreen.enabled = true;
    if(script.recipeListScreen) script.recipeListScreen.enabled = false;
    if(script.mojitoLogicObject) script.mojitoLogicObject.enabled = false;
});

// 2. Pressing "Start Game" moves to the Recipe List
script.startButton.onTap.add(function() {
    script.startScreen.enabled = false;
    script.recipeListScreen.enabled = true;
});

// 3. Pressing "Recipe 1" starts the Mojito
script.recipe01Button.onTap.add(function() {
    script.recipeListScreen.enabled = false;
    script.mojitoLogicObject.enabled = true; // This triggers the Mojito script
});