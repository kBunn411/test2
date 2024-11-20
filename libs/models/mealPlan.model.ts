import mongoose, { Schema, model, models } from "mongoose";

const MealPlanSchema = new Schema(
    {
        recipeId: { type: String, required: true },
        recipeName: { type: String, required: true },
        date: { type: Date, required: true },
        userId: { type: String, required: true },
        image: { type: String, default: null },
        source: { type: String, default: null },
    },
    { timestamps: true }
);

const MealPlan = models.MealPlan || model("MealPlan", MealPlanSchema);

export default MealPlan;
