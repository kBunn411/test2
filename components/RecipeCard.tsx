import { RecipeResult } from "@/types/RecipeResponseType";
import styles from "@/app/styles.module.css";

const RecipeCard = ({ recipe,onSave }: { recipe: RecipeResult, onSave: (recipe:RecipeResult) => void }) => {
	return (
		<div className={styles.recipeCard}>
			<img
				src={recipe.image}
				alt={recipe.title}
			/>
			<h3>{recipe.title}</h3>
			<a
				href={recipe.link}
				target="_blank"
				rel="noopener noreferrer"
			>
				View Recipe
			</a>
			<button className={styles.saveButton} onClick={() => onSave(recipe)}>
				Save Recipe
			</button>
		</div>
	);
};

export default RecipeCard;
