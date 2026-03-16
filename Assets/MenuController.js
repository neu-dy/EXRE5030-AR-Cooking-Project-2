//@input SceneObject startGameButton
//@input SceneObject recipeButton
//@input SceneObject recipePanel
//@input SceneObject backButton
//@input SceneObject mainMenuRoot


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

//add recipe to disable here
function disableAllRecipeManagers() {
    if (script.recipeManagerOmelette) script.recipeManagerOmelette.enabled = false;
}

//select the recipe
function selectRecipe(recipeManagerObject, recipeName) {
    disableAllRecipeManagers();

    if (recipeManagerObject) {
        recipeManagerObject.enabled = true;
        print("Selected recipe: " + recipeName);
    } else {
        print("Recipe manager missing for: " + recipeName);
    }

    //Hide the recipe panel
    script.recipePanel.enabled = false;

    //Keep Main Menu BUTTON Hidden
    script.startGameButton.enabled = false;
    script.recipeButton.enabled = false;

    //Hide the whole MENU CANVAS
    // HIDE THE WHOLE MENU SCREEN
    if (script.mainMenuRoot) {
        script.mainMenuRoot.enabled = false;
    }
}

if (recipeInteraction) {
    recipeInteraction.onTap.add(function () {
        script.recipePanel.enabled = true;
        script.startGameButton.enabled = false;
        script.recipeButton.enabled = false;
    });
}

if (backInteraction) {
    backInteraction.onTap.add(function () {
        script.recipePanel.enabled = false;
        script.startGameButton.enabled = true;
        script.recipeButton.enabled = true;
    });
}

if (omeletteInteraction) {
    omeletteInteraction.onTap.add(function () {
        selectRecipe(script.recipeManagerOmelette, "omelette");
    });
}


if (startInteraction) {
    startInteraction.onTap.add(function () {
        print("Game Started!");
        script.startGameButton.enabled = false;
        script.recipeButton.enabled = false;
        script.recipePanel.enabled = false;
    });
}
// Start with all recipe managers disabled
disableAllRecipeManagers();