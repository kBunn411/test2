"use client";
import { RecipeResult } from "@/types/RecipeResponseType";
import { searchRecipes } from "@/utils/fetchRecipes";
import { useEffect, useState } from "react";
import styles from "@/app/styles.module.css";
import RecipeCard from "@/components/RecipeCard";

const RandomPage = () => {
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);

    useEffect(() => {
        const effect = async () => {
            const recipeResult = await searchRecipes(); // No arguments for random search
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
                    recipes.map((recipe, key) => <RecipeCard key={key} recipe={recipe} />)
                ) : (
                    <h1>Loading Random Recipes</h1>
                )}
            </div>
        </div>
    );
};

export default RandomPage;
