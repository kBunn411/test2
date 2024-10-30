import { RecipeResult } from "@/types/RecipeResponseType";
import styles from "@/app/styles.module.css"

const RecipeCard = ({recipe}:{recipe : RecipeResult}) => {
	return (
		<div className={styles.recipeCard}>
			<img
				src={recipe.image}
				alt={recipe.title}
			/>
			<h3>{recipe.title}</h3>
			<a
				href={recipe.link}
				target="_blank">
				View Recipe
			</a>
		</div>
	);
};


export default RecipeCard;