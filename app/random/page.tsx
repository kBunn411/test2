"use client";

import { RecipeResult } from "@/types/RecipeResponseType";
import { searchRecipes } from "@/utils/fetchRecipes";
import { useEffect, useState, useCallback } from "react";
import styles from "@/app/styles.module.css";
import RecipeCard from "@/components/RecipeCard";

const RandomPage = () => {
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);

    // Function to save recipes
    const saveRecipe = useCallback(async (recipe: RecipeResult) => {
        try {
            let isPrivate = false; // Default to public
            while (true) {
                const message = prompt(
                    "Would you like the recipe to be private or public? \nType in private or public"
                );
                if (message === null) {
                    alert("Recipe saving canceled");
                    return;
                } else if (message.toLowerCase() === "public") {
                    isPrivate = false;
                    break;
                } else if (message.toLowerCase() === "private") {
                    isPrivate = true;
                    break;
                } else {
                    alert('Please enter either "public" or "private"');
                }
            }
            const response = await fetch("/api/saveRecipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ recipe }),
            });
            const result = await response.json();
            if (response.ok) {
                alert("Recipe saved successfully!");
            } else {
                alert("Failed to save recipe");
                console.error(result);
            }
        } catch (error) {
            console.error("Error saving recipe:", error);
        }
    }, []);

    useEffect(() => {
        const effect = async () => {
            const recipeResult = await searchRecipes();
            if (recipeResult) {
                setRecipes(
                    recipeResult.map((result: any) => ({
                        label: result.recipe.label,
                        image: result.recipe.image,
                        uri: result.recipe.uri, 
                    }))
                );
            }
        };
        effect();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.recipes}>
                {recipes.length > 0 ? (
                    recipes.map((recipe, key) => (
                        <RecipeCard key={key} recipe={recipe} onSave={saveRecipe} />
                    ))
                ) : (
                    <h1>Loading Random Recipes</h1>
                )}
            </div>
        </div>
    );
};

export default RandomPage;
