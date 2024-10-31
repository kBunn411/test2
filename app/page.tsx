'use client';
import styles from './styles.module.css';
import { useCallback, useState } from 'react';
import { searchRecipes } from '@/utils/fetchRecipes';
import { RecipeResult } from '@/types/RecipeResponseType';
import RecipeCard from '@/components/RecipeCard';

export default function Home() {
    const [ingredients, setIngredients] = useState<string>('');
    const [recipes, setRecipes] = useState<RecipeResult[]>([]); // Store the full RecipeResult type

    const submitSearch = useCallback((ingredients: string) => {
        const effect = async () => {
            const recipeResult: RecipeResult[] = await searchRecipes(ingredients);
            if (recipeResult) {
                console.log(recipeResult);
                // Pass the full recipe object to setRecipes
                setRecipes(recipeResult);
            }
        };
        effect();
    }, []);


    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Recipe Finder</h1>
            <div className={styles.top}>Keith was here</div>
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
                <div className={styles.recipes}>
                    {recipes.length > 0 ? recipes.map((recipe, key) =>
                        <RecipeCard key={key} recipe={recipe} /> // Now passing the full RecipeResult
                    ) : <h1>No Recipes Found</h1>}
                </div>
            </div>
        </div>
    );


	return (
		<div className={styles.container}>
			<h1 className={styles.header}>Recipe Finder</h1>
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
				<div className={styles.recipes}>
				{recipes ? recipes.map((recipe, key) =>
					<RecipeCard key={key} recipe={recipe}/>
				):<h1>No Recipes Found</h1>}
				</div>
			</div>
		</div>
	);

}
