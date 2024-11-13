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
    if (loading){return <div>RECIPE IS LOADING!!</div>}
    if (!recipe){return <div>No recipe Found</div>}
    return (
        <div style={{color:"white", fontSize:"40", height:"20rem"}}>
            <img src={recipe.image} alt="RECIPE IMAGE"></img>
            {recipe.label}

        </div>
    )
}
