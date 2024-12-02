"use client";

import { useRouter } from "next/navigation";
import { RecipeResult } from "@/types/RecipeResponseType";
import styles from "@/app/styles.module.css";
import { useUser } from "@clerk/nextjs";
import { useCallback, useState } from "react";
import Button from "../Button/Button";

const RecipeCard = ({
    recipe,
    saveable,
    planable,
    deletable,
    onDelete,
    onView,
}: {
    recipe: RecipeResult | Partial<RecipeResult>;
    saveable?: boolean;
    planable?: boolean;
    deletable?: boolean;
    onDelete?: (id: string) => void;
    onView?: () => void; // Add the onView prop
}) => {
    const [loadingVideo, setLoadingVideo] = useState<boolean>(false);
    const { user } = useUser();
    const router = useRouter();
    const recipeId = recipe.uri?.split("recipe_")[1]; // Extract recipeId from uri

    // Navigate to recipe details
    const viewRecipeDetails = () => {
        if (onView) {
            onView(); // Use the provided onView callback if available
        } else if (recipeId) {
            router.push(`/recipeDetails/${recipeId}`); // Default navigation
        } else {
            console.error("Invalid recipeId or uri is missing");
            alert("This recipe cannot be viewed because its ID is missing.");
        }
    };

    // Save recipe logic
    const saveRecipe = useCallback(
        async (recipe: RecipeResult | Partial<RecipeResult>) => {
            try {
                let isPrivate = false; // Default to public

                while (true) {
                    const message = prompt(
                        "Would you like the recipe to be private or public? \nType in private or public"
                    );

                    if (message === null) {
                        alert("Recipe saving canceled");
                        return;
                    } else if (message.toLowerCase() === "public") {
                        isPrivate = false;
                        break;
                    } else if (message.toLowerCase() === "private") {
                        isPrivate = true;
                        break;
                    } else {
                        alert('Please enter either "private" or "public"');
                    }
                }

                const response = await fetch("/api/saveRecipe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ recipe, isPrivate }),
                });

                if (response.ok) {
                    alert("Recipe saved successfully!");
                } else {
                    const result = await response.json();
                    alert("Failed to save recipe");
                    console.error(result);
                }
            } catch (error) {
                console.error("Error saving recipe:", error);
            }
        },
        []
    );

    // Add to meal planner logic
    const addToMealPlan = useCallback(
        async (recipe: RecipeResult | Partial<RecipeResult>) => {
            if (!user?.id) {
                alert("You must be logged in to add to the meal planner!");
                return;
            }

            const date = prompt("Enter the date for this recipe (YYYY-MM-DD):");
            if (!date) {
                alert("Adding to meal plan canceled");
                return;
            }

            try {
                const response = await fetch("/api/mealPlans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        recipeId,
                        recipeName: recipe.label,
                        date: new Date(date).toISOString(),
                        userId: user.id,
                        image: recipe.image,
                        source: recipe?.source || "Unknown Source",
                    }),
                });

                if (!response.ok) throw new Error("Failed to add recipe");

                alert("Recipe added to meal plan!");
            } catch (error) {
                console.error("Error adding recipe to meal plan:", error);
                alert("Error adding recipe to meal plan.");
            }
        },
        [recipeId, user?.id]
    );

    // Delete recipe logic
    const handleDelete = () => {
        if (recipe.uri && onDelete) {
            onDelete(recipe.uri); // Use `uri` to identify the recipe for deletion
        } else {
            console.error("Recipe uri is undefined or onDelete not provided");
        }
    };

    return (
        <div className={styles.recipeCard}>
            <img src={recipe.image} alt={recipe.label || "Recipe Image"} />
            <h3>{recipe.label || recipe.title}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* View Recipe Button */}
                <Button text="View Recipe" onClick={viewRecipeDetails} />

                {/* Save Recipe Button */}
                {saveable && (
                    <Button
                        onClick={() => saveRecipe(recipe)}
                        text="Save Recipe"
                    />
                )}

                {/* Add to Meal Plan Button */}
                {planable && (
                    <Button
                        text="Add to Meal Planner"
                        onClick={() => addToMealPlan(recipe)}
                    />
                )}

                {/* Delete Recipe Button */}
                {deletable && (
                    <Button
                        text="❌ Remove"
                        onClick={handleDelete}
                        style={{ backgroundColor: "red", color: "white" }}
                    />
                )}
            </div>
        </div>
    );
};

export default RecipeCard;
