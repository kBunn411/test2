'use client';  // Ensure this is a client-side component

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';  // Clerk's React hook to access the authenticated user

const Profile = () => {
    const { user } = useUser();  // Retrieve authenticated user data from Clerk
    const [profile, setProfile] = useState<any>(null);  // State to store user profile data
    const [formData, setFormData] = useState<any>({});  // State to handle form input changes
    const [isEditing, setIsEditing] = useState(false);  // Track whether we're in editing mode

    // Fetch the user profile data from the API
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const response = await fetch('/api/userProfile');
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setFormData(data);  // Set initial form data to the user's profile
                }
            };

            fetchProfile();
        }
    }, [user]);  // Re-fetch profile when the user object changes (i.e., when logged in)

    // Handle input changes in the form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission to update the user profile
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/userProfile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const updatedUser = await response.json();
            setProfile(updatedUser);  // Update profile with the latest data
            setIsEditing(false);  // Exit edit mode
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile.');
        }
    };

    // Show loading state while fetching user data
    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            
            {!isEditing ? (
                <div>
                    <p><strong>Bio:</strong> {profile.bio}</p>
                    <p><strong>Country:</strong> {profile.country}</p>
                    <p><strong>City:</strong> {profile.city}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    <p><strong>Favorite Cuisine:</strong> {profile.favoriteCuisine}</p>
                    <p><strong>Age:</strong> {profile.age}</p>
                    <p><strong>Social Media:</strong></p>
                    <p>Facebook: {profile.socialMedia?.facebook}</p>
                    <p>Instagram: {profile.socialMedia?.instagram}</p>
                    <p>Yelp: {profile.socialMedia?.yelp}</p>

                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Favorite Cuisine</label>
                        <input
                            type="text"
                            name="favoriteCuisine"
                            value={formData.favoriteCuisine || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Social Media</label>
                        <div>
                            <label>Facebook</label>
                            <input
                                type="text"
                                name="socialMedia.facebook"
                                value={formData.socialMedia?.facebook || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Instagram</label>
                            <input
                                type="text"
                                name="socialMedia.instagram"
                                value={formData.socialMedia?.instagram || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Yelp</label>
                            <input
                                type="text"
                                name="socialMedia.yelp"
                                value={formData.socialMedia?.yelp || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default Profile;
