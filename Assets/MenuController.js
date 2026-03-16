//@input SceneObject mainMenu
//@input SceneObject startGameButton
//@input SceneObject recipeButton
//@input SceneObject recipePanel
//@input SceneObject backButton

//@input SceneObject omeletteButton
//@input SceneObject recipeManagerOmelette

function getInteraction(sceneObject, objectName) {
    if (!sceneObject) {
        print("Missing SceneObject input: " + objectName);
        return null;
    }

    var interaction = sceneObject.getComponent("Component.InteractionComponent");
    if (!interaction) {
        print(objectName + " is missing an Interaction component");
        return null;
    }

    return interaction;
}

var startInteraction = getInteraction(script.startGameButton, "StartGameButton");
var recipeInteraction = getInteraction(script.recipeButton, "RecipeButton");
var backInteraction = getInteraction(script.backButton, "BackButton");
var omeletteInteraction = getInteraction(script.omeletteButton, "OmeletteButton");

// Disable all recipe managers here
function disableAllRecipeManagers() {
    if (script.recipeManagerOmelette) {
        script.recipeManagerOmelette.enabled = false;
    }
}

// Select a recipe
function selectRecipe(recipeManagerObject, recipeName) {
    disableAllRecipeManagers();

    if (recipeManagerObject) {
        recipeManagerObject.enabled = true;
        print("Selected recipe: " + recipeName);
    } else {
        print("Recipe manager missing for: " + recipeName);
        return;
    }

    // Disable the entire main menu so it doesn't block gameplay
    if (script.mainMenu) {
        script.mainMenu.enabled = false;
    }
}

// Open recipe selection panel
if (recipeInteraction) {
    recipeInteraction.onTap.add(function () {
        if (script.recipePanel) script.recipePanel.enabled = true;
        if (script.startGameButton) script.startGameButton.enabled = false;
        if (script.recipeButton) script.recipeButton.enabled = false;
    });
}

// Back from recipe panel to main menu
if (backInteraction) {
    backInteraction.onTap.add(function () {
        if (script.recipePanel) script.recipePanel.enabled = false;
        if (script.startGameButton) script.startGameButton.enabled = true;
        if (script.recipeButton) script.recipeButton.enabled = true;
    });
}

// Select Omelette recipe
if (omeletteInteraction) {
    omeletteInteraction.onTap.add(function () {
        selectRecipe(script.recipeManagerOmelette, "omelette");
    });
}

// Start game button
if (startInteraction) {
    startInteraction.onTap.add(function () {
        print("Game Started!");

        if (script.mainMenu) {
            script.mainMenu.enabled = false;
        } else {
            if (script.startGameButton) script.startGameButton.enabled = false;
            if (script.recipeButton) script.recipeButton.enabled = false;
            if (script.recipePanel) script.recipePanel.enabled = false;
        }
    });
}

// Start with all recipe managers disabled
disableAllRecipeManagers();