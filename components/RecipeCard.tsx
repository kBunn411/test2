import { useRouter } from 'next/router';
import { RecipeResult } from "@/types/RecipeResponseType";
import styles from "@/app/styles.module.css";

const RecipeCard = ({ recipe, onSave }: { recipe: RecipeResult; onSave: (recipe: RecipeResult) => void }) => {
    const router = useRouter();

    const viewRecipeDetails = () => {
        router.push({
            pathname: `/recipe-details`,
            query: { title: recipe.title, image: recipe.image, dietLabels: recipe.dietLabels.join(','), link: recipe.link },
        });
    };

    return (
        <div className={styles.recipeCard}>
            <img src={recipe.image} alt={recipe.title} />
            <h3>{recipe.title}</h3>
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