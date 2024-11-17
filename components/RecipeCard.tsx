import { useRouter } from 'next/navigation';
import { RecipeResult } from "@/types/RecipeResponseType";
import styles from "@/app/styles.module.css";
import {Promise} from "es6-promise";

const RecipeCard = ({recipe, onSave, onAddToMealPlan}: {
    recipe: RecipeResult,
    onSave: (recipe: RecipeResult) => void,
    onAddToMealPlan?: (recipe) => Promise<void>
}) => {
    const router = useRouter();
    const recipeId = recipe.uri?.split("recipe_")[1]
    const viewRecipeDetails = () => {
        router.push(`/recipeDetails/${recipeId}`);
    };

    return (
        <div className={styles.recipeCard}>
            <img src={recipe.image} alt={recipe.label}/>
            <h3>{recipe.label || recipe.title}</h3>
            <button className={styles.viewButton} onClick={viewRecipeDetails}>
                View Recipe
            </button>
            <button className={styles.saveButton} onClick={() => onSave(recipe)}>
                Save Recipe
            </button>
            <button className={styles.saveButton} onClick={() => onAddToMealPlan(recipe)}>
                Add to Meal Planner
            </button>
        </div>
    );
};


export default RecipeCard;