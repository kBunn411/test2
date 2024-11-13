import { useRouter } from 'next/navigation';
import { RecipeResult } from "@/types/RecipeResponseType";
import styles from "@/app/styles.module.css";

const RecipeCard = ({ recipe, onSave }: { recipe: RecipeResult; onSave: (recipe: RecipeResult) => void }) => {
    const router = useRouter();
    const recipeId = recipe.uri?.split("recipe_")[1]

    const viewRecipeDetails = () => {
        router.push(`/recipeDetails/${recipeId}`);
    };

    console.log("RecipeCard received recipesss:", recipe);
   

    return (

        
        <div className={styles.recipeCard}>
            <img src={recipe.image} alt={recipe.label} />
            <h3>{recipe.label || recipe.title}</h3>
            <button className={styles.viewButton} onClick={viewRecipeDetails}>
                View Recipe
            </button>
            <button className={styles.saveButton} onClick={() => onSave(recipe)}>
                Save Recipe
            </button>
        </div>
    );
};


export default RecipeCard;