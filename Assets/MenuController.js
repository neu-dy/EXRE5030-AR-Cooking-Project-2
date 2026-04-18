// @input SceneObject startScreen
// @input SceneObject ingredientsScreen
// @input SceneObject mojitoLogicObject
// @input Component.InteractionComponent startButton
// @input Component.InteractionComponent startRecipeButton  // Ingredients 里的新按钮

var step = 0;

script.createEvent("OnStartEvent").bind(function() {
    if (script.startScreen) script.startScreen.enabled = true;
    if (script.ingredientsScreen) script.ingredientsScreen.enabled = false;
    if (script.mojitoLogicObject) script.mojitoLogicObject.enabled = false;
    step = 0;
    print("Start Screen shown");
});

script.startButton.onTap.add(function() {
    if (script.startScreen) script.startScreen.enabled = false;
    if (script.ingredientsScreen) script.ingredientsScreen.enabled = true;
    step = 1;
    print("Ingredients Screen shown");
});

script.startRecipeButton.onTap.add(function() {
    if (script.ingredientsScreen) script.ingredientsScreen.enabled = false;
    if (script.mojitoLogicObject) script.mojitoLogicObject.enabled = true;
    step = 2;
    print("Starting Mojito Recipe...");
});