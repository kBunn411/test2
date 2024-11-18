export const addRecipeToMealPlan = async (recipeId, recipeName, date, userId, image, source) => {
    const response = await fetch("/api/mealPlans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, recipeName, date, userId, image, source }),
    });

    if (!response.ok) {
        throw new Error("Failed to add recipe to meal plan");
    }
    return response.json();
};
