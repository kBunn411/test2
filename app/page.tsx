'use client';
import styles from './styles.module.css';
import React, { useCallback, useState } from 'react';
import { searchRecipes } from '@/utils/fetchRecipes';
import { RecipeResult } from '@/types/RecipeResponseType';
import RecipeCard from '@/components/RecipeCard';

export default function Home() {
    const [ingredients, setIngredients] = useState('');
    const [allRecipes, setAllRecipes] = useState<RecipeResult[]>([]);
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [dietModalVisible, setDietModalVisible] = useState(false);
    const [healthModalVisible, setHealthModalVisible] = useState(false);
    const [activeDiet, setActiveDiet] = useState(new Set<string>());
    const [activeHealth, setActiveHealth] = useState(new Set<string>());

    const dietLabels = [
        "balanced",
        "high-fiber",
        "high-protein",
        "low-carb",
        "low-fat",
        "low-sodium"
    ];
    const healthLabels = [
        "Sugar-Conscious",
        "Low Potassium",
        "Kidney-Friendly",
        "Keto-Friendly",
        "Vegetarian",
        "Pescatarian",
        "Paleo",
        "Mediterranean",
        "Dairy-Free",
        "Gluten-Free",
        "Wheat-Free",
        "Peanut-Free",
        "Tree-Nut-Free",
        "Soy-Free",
        "Fish-Free",
        "Shellfish-Free",
        "Pork-Free",
        "Red-Meat-Free",
        "Crustacean-Free",
        "Celery-Free",
        "Mustard-Free",
        "Sesame-Free",
        "Lupine-Free",
        "Mollusk-Free",
        "Alcohol-Free",
        "No oil added",
        "Sulfite-Free",
        "FODMAP-Free",
        "Kosher"
      ];

    // Function to submit a search with ingredients
    const submitSearch = useCallback((ingredients: string, diet?: string[], health?: string[]) => {
        const effect = async () => {
            setHasSearched(true);
            const recipeResult = await searchRecipes(ingredients, "",diet);
            recipeResult.forEach((result: any, index: number) => {
                console.log(`Recipe ${index} Diet Labels:`, result.recipe.dietLabels || "No diet labels");
                console.log(`Recipe ${index} Health Labels:`, result.recipe.healthLabels || "No health labels");
            });
            
            if (recipeResult && recipeResult.length > 0) {
                const formattedRecipes = recipeResult.map((result: any) => ({
                    label: result.recipe.label,
                    image: result.recipe.image,
                    link: result.recipe.shareAs,
                    dietLabels: result.recipe.dietLabels || [],
                    healthLabels: result.recipe.healthLabels,
                    uri: result.recipe.uri || ""
                }));
                setAllRecipes(formattedRecipes);
                setRecipes(formattedRecipes);

            } else {
                setRecipes([]);
                setAllRecipes([]);
            }
        };
        effect();
    }, []);


    const toggleFilter = (filter: string, filterType: "diet" | "health") => {
        if (filterType === "diet") {
            setActiveDiet(prevFilters => {
                const newFilters = new Set(prevFilters);
                if(newFilters.has(filter)){
                    newFilters.delete(filter);
                    console.log("Removed %s", filter);
                }
                else{
                    newFilters.add(filter);
                    console.log("Added %s", filter);
                }
                
                return newFilters;
            });
        } else if (filterType === "health") {
            setActiveHealth(prevFilters => {
                const newFilters = new Set(prevFilters);
                if(newFilters.has(filter)){
                    newFilters.delete(filter);
                    console.log("Removed %s", filter);
                }
                else{
                    newFilters.add(filter);
                    console.log("Added %s", filter);
                }
                
                return newFilters;
            });
        }
        submitSearch(ingredients, Array.from(activeDiet), Array.from(activeHealth));
    };
    
    
    // Function to fetch random recipes
    const fetchRandomRecipes = useCallback(() => {
        const effect = async () => {
            setHasSearched(true);
            const recipeResult = await searchRecipes();
            recipeResult.forEach((result: any, index: number) => {
                console.log(`Recipe ${index} Diet Labels:`, result.recipe.dietLabels || "No diet labels");
            });
            if (recipeResult && recipeResult.length > 0) {
                const formattedRecipes = recipeResult.map((result: any) => ({
                    label: result.recipe.label,
                    image: result.recipe.image,
                    link: result.recipe.shareAs,
                    dietLabels: result.recipe.dietLabels || []
                }));
                setAllRecipes(formattedRecipes);
                setRecipes(formattedRecipes);

            } else {
                setRecipes([]);
                setAllRecipes([]);
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

                <div className={styles.search}>
                    <input
                        onChange={(e) => setIngredients(e.target.value)}
                        className={styles.input}
                        type="text"
                        id="ingredient"
                        placeholder="Enter ingredients (comma-separated)"
                    />
                    <button
                        className={styles.button}
                        onClick={() => submitSearch(ingredients, Array.from(activeDiet), Array.from(activeHealth))}>
                        Search
                    </button>
                    <button
                        className={styles.button}
                        onClick={fetchRandomRecipes}>
                        Random
                    </button>


                    {/* Button to open Diet Type Modal */}
                    <button onClick={() => setDietModalVisible(true)} className={styles.button}>
                        Diet Type
                    </button>

                    {/* Button to open Health Labels Modal */}
                    <button onClick={() => setHealthModalVisible(true)} className={styles.button}>
                        Health Labels
                    </button>
                </div>
            </div>


            {/* Diet Filter Modal */}
            {dietModalVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Filter Diet Type</h3>
                        {dietLabels.map((label, index) => (
                            <label key={index} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={activeDiet.has(label)}
                                    onChange={() => toggleFilter(label, "diet")}
                                />
                                {label}
                            </label>
                        ))}
                        <button onClick={() => setDietModalVisible(false)} className={styles.applyButton}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Health Filter Modal */}
            {healthModalVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Filter Health Labels</h3>
                        {healthLabels.map((label, index) => (
                            <label key={index} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={activeHealth.has(label)}
                                    onChange={() => toggleFilter(label, "health")}
                                />
                                {label}
                            </label>
                        ))}
                        <button onClick={() => setHealthModalVisible(false)} className={styles.applyButton}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

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
    );
}