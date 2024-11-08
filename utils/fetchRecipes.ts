export async function searchRecipes(ingredientInput = "", mealType = ""): Promise<any> {
    const edamamID = "e1a01707";
    const appKey = "11c9ef351bc78989bf4b9080c390c2e7";

    // List of possible meal types to select from randomly
    const mealTypes = ["breakfast", "brunch", "lunch/dinner", "snack", "teatime"];

    // If no mealType is provided, pick a random one from the array
    const randomMealType = mealType || mealTypes[Math.floor(Math.random() * mealTypes.length)];

    // Build the API URL with optional ingredientInput and randomly selected or specified mealType
    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${ingredientInput}&app_id=${edamamID}&app_key=${appKey}&mealType=${randomMealType}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Return the top 15 results
        return data.hits.slice(0, 15);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
    }
}


