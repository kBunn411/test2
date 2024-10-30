'use client';
import styles from './styles.module.css';
import { useCallback, useEffect, useState } from 'react';
import { searchRecipes } from '@/utils/fetchRecipes';
import { RecipeResult } from '@/types/RecipeResponseType';
import RecipeCard from '@/components/RecipeCard';

export default function Home() {
	const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<RecipeResult[]>()

	const submitSearch = useCallback((ingredients:string) => {
		const effect = async () => {
			const recipeResult = await searchRecipes(ingredients);
      if(recipeResult){
        console.log(recipeResult)
        setRecipes(recipeResult.map((result:any) =>{return{title:result.recipe.label, image: result.recipe.image, link:result.recipe.shareAs}}))
      }
		};
		effect();
	}, []);


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
