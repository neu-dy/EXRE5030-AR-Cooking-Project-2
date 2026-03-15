//@input SceneObject startGameButton
//@input SceneObject recipeButton
//@input SceneObject recipePanel
//@input SceneObject backButton

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

if (startInteraction) {
    startInteraction.onTap.add(function () {
        print("Game Started!");
        script.startGameButton.enabled = false;
        script.recipeButton.enabled = false;
        script.recipePanel.enabled = false;
    });
}
