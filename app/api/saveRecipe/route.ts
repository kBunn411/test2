import { NextResponse } from 'next/server';
import { connect } from '@/libs/db';
import SavedRecipe from '@/libs/models/savedRecipe.model';
import { getAuth } from '@clerk/nextjs/server';


export async function POST(req: Request) {
    try {
        const { userId } = getAuth(req); // Retrieve the logged-in user's ID
        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { recipe } = await req.json(); // Parse the JSON body from the request
        await connect();

        const newSavedRecipe = new SavedRecipe({
            userId,
            title: recipe.title,
            image: recipe.image,
            link: recipe.link,
        });

        await newSavedRecipe.save();
        return NextResponse.json({ message: 'Recipe saved successfully!' });
    } catch (error) {
        console.error('Error saving recipe:', error);
        return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 });
    }
}
