import { Schema, model, models } from 'mongoose';

const SavedRecipeSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
});

const SavedRecipe = models?.SavedRecipe || model('SavedRecipe', SavedRecipeSchema);
export default SavedRecipe;
