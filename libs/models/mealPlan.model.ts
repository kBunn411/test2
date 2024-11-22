
import mongoose from "mongoose";

const MealPlanSchema = new mongoose.Schema({
        recipeId: { type: String, required: true },
        recipeName: { type: String, required: true },
        date: { type: Date, required: true },
        userId: { type: String, required: true },
        image: { type: String, required: false },
        source: { type: String, required: false },
        url: { type: String, required: false },
        dietLabels: { type: [String], required: false },
        healthLabels: { type: [String], required: false },
        ingredientLines: { type: [String], required: false },
        ingredients: { type: Array, required: false },
        isPrivate: { type: Boolean, required: false },
});

export default mongoose.models.MealPlan || mongoose.model("MealPlan", MealPlanSchema);

