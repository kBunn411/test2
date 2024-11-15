'use client';
import styles from './styles.module.css';
import React, { useCallback, useState } from 'react';
import { searchRecipes } from '@/utils/fetchRecipes';
import { RecipeResult } from '@/types/RecipeResponseType';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';

export default function Home() {
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    

    // Function to submit a search with ingredients
    const submitSearch = useCallback((ingredients: string, diet?: string[], health?: string[]) => {
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
                        <RecipeCard key={key} recipe={recipe} onSave={saveRecipe} />
                    ))
                )}
                </div>
        </div>
        </div>
    );
}