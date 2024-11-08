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
            const response = await fetch('/api/saveRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipe }),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Recipe saved successfully!');
            } else {
                alert('Failed to save recipe');
                console.error(result);
            }
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    }, []);

    useEffect(() => {
        const effect = async () => {
            const recipeResult = await searchRecipes();
            if (recipeResult) {
                setRecipes(recipeResult.map((result: any) => ({
                    title: result.recipe.label,
                    image: result.recipe.image,
                    link: result.recipe.shareAs
                })));
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
