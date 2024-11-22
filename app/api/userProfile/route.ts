import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/libs/db';  // Make sure your db connection file is correct
import User from '@/libs/models/user.model';  // Make sure the path to your user model is correct
import { getAuth } from '@clerk/nextjs/server';
import SavedRecipe from '@/libs/models/savedRecipe.model';

export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req); // Get the logged-in user's ID from Clerk

        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connect();  // Connect to the database

        // Fetch the user profile from MongoDB based on userId (chefID or userId)
        const user = await User.findOne({ chefID: userId }).exec();
        const savedRecipes = await SavedRecipe.find({ userId });
        console.log(user)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({user,savedRecipes}, {status:200});
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { userId } = getAuth(req); // Get the logged-in user's ID from Clerk

        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Destructure the fields you want to update from the request body
        const {bio, country, city, phone, favoriteCuisine, age, socialMedia } = await req.json();

        await connect();  // Connect to the database

        // Update the user profile in MongoDB based on userId (chefID or userId)
        const updatedUser = await User.findOneAndUpdate(
            { chefID: userId }, // Find the user by their chefID (which is the userId from Clerk)
            { bio, country, city, phone, favoriteCuisine, age, socialMedia },
            { new: true }  // Return the updated user document
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User update failed' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);  // Return the updated user data
    } catch (error) {
        console.error('Error updating user data:', error);
        return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
    }
}


