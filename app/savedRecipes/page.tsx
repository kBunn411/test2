// app/savedRecipes/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { RecipeResult } from "@/types/RecipeResponseType";
import RecipeCard from "@/components/RecipeCard";
import styles from "@/app/styles.module.css";

const SavedRecipesPage = () => {
    const [savedRecipes, setSavedRecipes] = useState<RecipeResult[]>([]);

    // Function to fetch saved recipes
    const fetchSavedRecipes = useCallback(async () => {
        try {
            const response = await fetch('/api/getSavedRecipes');
            if (response.ok) {
                const recipes = await response.json();
                
                setSavedRecipes(recipes);
                
            } else {
                console.error('Failed to fetch saved recipes');
            }
        } catch (error) {
            console.error('Error fetching saved recipes:', error);
        }
    }, []);

    // Function to add a recipe to the meal planner
    const handleAddToMealPlan = async (recipe: RecipeResult) => {
        const date = prompt("Enter the date for this recipe (YYYY-MM-DD):");
        if (!date) {
            alert("Adding to meal plan canceled.");
            return;
        }

        try {
            const response = await fetch('/api/mealPlans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipeId: recipe.uri,
                    recipeName: recipe.label,
                    date: new Date(date).toISOString(),
                    userId: "current-user-id", // Replace with actual user logic if available
                    image: recipe.image,
                    source: recipe.source,
                }),
            });

            if (response.ok) {
                alert("Recipe added to the meal planner successfully!");
            } else {
                console.error("Failed to add recipe to meal planner:", await response.json());
                alert("Failed to add recipe to meal planner.");
            }
        } catch (error) {
            console.error("Error adding recipe to meal planner:", error);
        }
    };

    // Fetch saved recipes on page load
    useEffect(() => {
        fetchSavedRecipes();
    }, [fetchSavedRecipes]);
    
    

    return (
        <div className={styles.container}>
            <h1>Your Saved Recipes</h1>
            <div className={styles.recipes}>
                {savedRecipes.length > 0 ? (
                    savedRecipes.map((recipe, key) => (
                        <RecipeCard key={key} recipe={recipe} onSave={() => {}} onAddToMealPlan={handleAddToMealPlan}/>
                    ))
                ) : (
                    <h2>No saved recipes found.</h2>
                )}
            </div>
        </div>
    );
};

export default SavedRecipesPage;
