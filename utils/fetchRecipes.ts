import { RecipeResult } from "@/types/RecipeResponseType";

export async function searchRecipes(ingredientInput:string):Promise<any> {
    const edamamID= "e1a01707";
    const appKey ="11c9ef351bc78989bf4b9080c390c2e7"

    const apiKey = 'c10ca9a605364987997f3cf1cb186c63' //my key
    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=any&q=${ingredientInput}&app_id=e1a01707&app_key=11c9ef351bc78989bf4b9080c390c2e7`;
  console.log(ingredientInput)
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data.hits.slice(0,15))
      return data.hits.slice(0,15);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }