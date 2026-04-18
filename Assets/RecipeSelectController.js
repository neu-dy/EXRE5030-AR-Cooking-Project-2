// @input SceneObject ingredientsScreen       // 配料表 UI SceneObject
// @input SceneObject mojitoLogicObject       // MojitoRecipe 所在物体
// @input Component.InteractionComponent startRecipeButton  // 配料表页面上的 Start 按钮

print("RecipeSelectController loaded");

// -------------------- ENABLE --------------------
script.createEvent("OnEnableEvent").bind(function() {
    if (script.ingredientsScreen) script.ingredientsScreen.enabled = true;
    if (script.mojitoLogicObject) script.mojitoLogicObject.enabled = false;
    print("Ingredients Screen shown");
});

// -------------------- DISABLE --------------------
script.createEvent("OnDisableEvent").bind(function() {
    if (script.ingredientsScreen) script.ingredientsScreen.enabled = false;
    print("Ingredients Screen hidden");
});

// -------------------- BUTTON --------------------
script.startRecipeButton.onTap.add(function() {
    if (script.ingredientsScreen) script.ingredientsScreen.enabled = false;
    if (script.mojitoLogicObject) script.mojitoLogicObject.enabled = true;
    print("Starting Mojito Recipe...");
});