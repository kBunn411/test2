export async function searchRecipes(ingredientInput = "", mealType = ""): Promise<any> {
    const edamamID = "e1a01707";
    const appKey = "11c9ef351bc78989bf4b9080c390c2e7";

    const mealTypes = ["breakfast", "brunch", "lunch/dinner", "snack", "teatime"];
    const randomMealType = mealType || mealTypes[Math.floor(Math.random() * mealTypes.length)];

    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(ingredientInput)}&app_id=${edamamID}&app_key=${appKey}&mealType=${encodeURIComponent(randomMealType)}`;

    console.log("API URL:", apiUrl); // Log the final URL to inspect any issues

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.hits.slice(0, 15);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
    }
}