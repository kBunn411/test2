'use client';
import styles from './styles.module.css';
import { useCallback, useState } from 'react';
import { searchRecipes } from '@/utils/fetchRecipes';
import { RecipeResult } from '@/types/RecipeResponseType';
import RecipeCard from '@/components/RecipeCard';

export default function Home() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const submitSearch = useCallback((ingredients: string) => {
        const effect = async () => {
            setHasSearched(true);
            const recipeResult = await searchRecipes(ingredients);
            if (recipeResult && recipeResult.length > 0) {
                setRecipes(recipeResult.map((result: any) => ({
                    title: result.recipe.label,
                    image: result.recipe.image,
                    link: result.recipe.shareAs
                })));
            } else {
                setRecipes([]);
            }
        };
        effect();
    }, []);

    const fetchRandomRecipes = useCallback(() => {
        const effect = async () => {
            setHasSearched(true);
            const recipeResult = await searchRecipes();
            if (recipeResult && recipeResult.length > 0) {
                setRecipes(recipeResult.map((result: any) => ({
                    title: result.recipe.label,
                    image: result.recipe.image,
                    link: result.recipe.shareAs
                })));
            } else {
                setRecipes([]);
            }
        };
        effect();
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
                        onClick={() => submitSearch(ingredients)}>
                        Search
                    </button>
                    <button
                        className={styles.button}
                        onClick={fetchRandomRecipes}>
                        Random
                    </button>
                </div>
            </div>

            <div className={styles.recipes}>
                {hasSearched && recipes.length === 0 ? (
                    <h1>No Recipes Found</h1>
                ) : (
                    recipes.map((recipe, key) => (
                        <RecipeCard key={key} recipe={recipe} />
                    ))
                )}
            </div>
        </div>
    );
}
