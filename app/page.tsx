'use client';
import styles from './styles.module.css';
import React, { useCallback, useState } from 'react';
import { searchRecipes } from '@/utils/fetchRecipes';
import { RecipeResult } from '@/types/RecipeResponseType';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';
import { useUser } from "@clerk/nextjs";
import recipeCard from "@/components/RecipeCard";


export default function Home() {
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const { user } = useUser();
    const userId = user?.id;

    // Function to submit a search with ingredients
    const submitSearch = useCallback(async (ingredients: string, diet?: string[], health?: string[]) => {
        const effect = async () => {
            setHasSearched(true);
            const recipeResult = await searchRecipes(ingredients, "",diet, health);
            
            
            if (recipeResult && recipeResult.length > 0) {
                const formattedRecipes = recipeResult.map((result: any) => ({
                    label: result.recipe.label,
                    image: result.recipe.image,
                    link: result.recipe.shareAs,
                    dietLabels: result.recipe.dietLabels || [],
                    healthLabels: result.recipe.healthLabels,
                    uri: result.recipe.uri || ""
                }));
                setRecipes(formattedRecipes);

            } else {
                setRecipes([]);
            }
        };
        effect();
    }, []);


    // Function to fetch random recipes
    const fetchRandomRecipes = useCallback(() => {
        const effect = async () => {
            setHasSearched(true);
            const recipeResult = await searchRecipes();
            // recipeResult.forEach((result: any, index: number) => {
            //     console.log(`Recipe ${index} Diet Labels:`, result.recipe.dietLabels || "No diet labels");
            // });
            if (recipeResult && recipeResult.length > 0) {
                const formattedRecipes = recipeResult.map((result: any) => ({
                    label: result.recipe.label,
                    image: result.recipe.image,
                    link: result.recipe.shareAs,
                    dietLabels: result.recipe.dietLabels || []
                }));
                setRecipes(formattedRecipes);

            } else {
                setRecipes([]);
                
            }
        };
        effect();
    }, []);


    // Function to save recipes
    const saveRecipe = useCallback(async (recipe: RecipeResult) => {
        try {
            let isPrivate = false; // Default to public


            while (true) {
                const message = prompt("Would you like the recipe to be private or public? \nType in private or public");
                
                if (message === null) {
                    alert('Recipe saving canceled');
                    return; 
                }
                else if (message.toLowerCase() === "public") {
                    isPrivate = false;
                    break;
                }
                 else if (message.toLowerCase() === "private") {
                    isPrivate = true;
                    break; 
                } else {
                    alert('Please enter either "public" or "private"');
                }
            }
            
            const response = await fetch('/api/saveRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipe,isPrivate }),
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


    //Function to add to Meal PLanner
    const addToMealPlan = useCallback(async (recipe: { uri: any; label: any; image: any; link: any; }) => {
        if (!userId) {
            alert("You must be logged in to add to the meal planner!");
            return;
        }

        const date = prompt("Enter the date for this recipe (YYYY-MM-DD):");
        if (!date) {
            alert("Adding to meal plan canceled");
            return;
        }

        try {
            const response = await fetch("/api/mealPlans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId: recipe.uri,
                    recipeName: recipe.label,
                    date: new Date(date).toISOString(),
                    userId,
                    image: recipe.image,
                    source: recipe.link,
                }),
            });

            if (!response.ok) throw new Error("Failed to add recipe");

            alert("Recipe added to meal plan!");
        } catch (error) {
            console.error(error);
            alert("Error adding recipe to meal plan.");
        }
    }, [userId]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <svg viewBox="0 0 500 100" className={styles.superChefHeader}>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                        SuperChef
                    </text>
                </svg>
                <SearchBar
                    onSubmitSearch={submitSearch}
                    onFetchRandomRecipes={fetchRandomRecipes}
                    />
                
           

                {/* Recipes display section */}
                <div className={styles.recipes}>
                {hasSearched && recipes.length === 0 ? (
                    <h1>No Recipes Found</h1>
                ) : (
                    recipes.map((recipe, key) => (
                        <RecipeCard key={key} recipe={recipe} onSave={saveRecipe} onAddToMealPlan={addToMealPlan} />
                    ))
                )}
                </div>
            </div>
        </div>
    );
}