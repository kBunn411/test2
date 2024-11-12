// app/api/profile/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/libs/db';  // MongoDB connection helper
import UserProfile from '@/libs/models/userProfile.model';  // Mongoose model for UserProfile
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { userId } = getAuth(req); // Get the authenticated user's ID
        if (!userId || userId !== params.userId) {
            return NextResponse.json({ error: 'Not authenticated or unauthorized' }, { status: 401 });
        }

        await connect(); // Ensure MongoDB is connected
        const userProfile = await UserProfile.findOne({ userId }).lean(); // Find user profile in the database

        if (!userProfile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        return NextResponse.json(userProfile); // Send the user profile data as response
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
