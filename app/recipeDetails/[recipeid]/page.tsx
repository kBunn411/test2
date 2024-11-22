"use client";
import { RecipeResult } from '@/types/RecipeResponseType';
import { fetchRecipeByID } from '@/utils/fetchRecipes';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecipeDetails() {
    const [recipe, setRecipe] = useState<RecipeResult>()
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const recipeId = useParams().recipeid as string
    console.log(recipeId)
    useEffect(() => {
        const effect = async () => {
            const recipeResult = await fetchRecipeByID(recipeId);
            setRecipe(recipeResult)
            setLoading(false)
            }
    
        effect();
    }, []);

    //not sure about best way to set this up
    console.log(recipe)
    if (loading) return <div>RECIPE IS LOADING!!</div>;
    if (!recipe) return <div>No recipe Found</div>;

    return (
        <div style={{ color: "black", fontSize: "20px", padding: "20px" }}>
            <img src={recipe.image} alt="Recipe" style={{ maxWidth: "100%", borderRadius: "8px" }} />
            <h1>{recipe.label}</h1>
            <h2>Ingredients</h2>
            <ul>
                {recipe.ingredientLines.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <h2>Source</h2>
            <a href={recipe.url} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
                View Full Recipe on {recipe.source}
            </a>
        </div>
    );
}
