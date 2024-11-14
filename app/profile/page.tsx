'use client';  // Ensure this is a client-side component

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';  // Clerk's React hook to access the authenticated user
import styles from '@/app/profile/profile.module.css';

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
                    setFormData(data);  
                }
            };
            fetchProfile();
        }
    }, [user]);

    // Handle input changes in the form, including nested fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => {
            // Handle social media fields specifically
            if (name.startsWith("socialMedia.")) {
                const platform = name.split(".")[1];
                return {
                    ...prev,
                    socialMedia: {
                        ...prev.socialMedia,
                        [platform]: value,
                    },
                };
            }
            return { ...prev, [name]: value };
        });
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
        <div className={styles.container}>
            <h1 className={styles.name}>About me</h1>

            {!isEditing ? (
                <div className={styles.additionalInfoBox}>
                    <p className={styles.bio}><strong>Bio:</strong> {profile.bio}</p>
                    <p><strong>Country:</strong> {profile.country}</p>
                    <p><strong>City:</strong> {profile.city}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    <p><strong>Favorite Cuisine:</strong> {profile.favoriteCuisine}</p>
                    <p><strong>Age:</strong> {profile.age}</p>
                    <div className={styles.socialMedia}>
                        <p><strong>Social Media:</strong></p>
                        <p>Facebook: {profile.socialMedia?.facebook}</p>
                        <p>Instagram: {profile.socialMedia?.instagram}</p>
                        <p>Yelp: {profile.socialMedia?.yelp}</p>
                    </div>
                    <div className={styles.editLogoutSaveCancelSection}>
                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.additionalInfoBox}>
                    <p><strong>Bio:</strong>
                        <textarea
                            name="bio"
                            className={styles.bioEdit}
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p><strong>Country:</strong>
                        <input
                            type="text"
                            name="country"
                            className={styles.inputField}
                            value={formData.country || ''}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p><strong>City:</strong>
                        <input
                            type="text"
                            name="city"
                            className={styles.inputField}
                            value={formData.city || ''}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p><strong>Phone:</strong>
                        <input
                            type="text"
                            name="phone"
                            className={styles.inputField}
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p><strong>Favorite Cuisine:</strong>
                        <input
                            type="text"
                            name="favoriteCuisine"
                            className={styles.inputField}
                            value={formData.favoriteCuisine || ''}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p><strong>Age:</strong>
                        <input
                            type="number"
                            name="age"
                            className={styles.inputField}
                            value={formData.age || ''}
                            onChange={handleInputChange}
                        />
                    </p>
                    <div className={styles.socialMedia}>
                        <p><strong>Social Media:</strong></p>
                        <p>Facebook:
                            <input
                                type="text"
                                name="socialMedia.facebook"
                                className={styles.inputField}
                                value={formData.socialMedia?.facebook || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>Instagram:
                            <input
                                type="text"
                                name="socialMedia.instagram"
                                className={styles.inputField}
                                value={formData.socialMedia?.instagram || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>Yelp:
                            <input
                                type="text"
                                name="socialMedia.yelp"
                                className={styles.inputField}
                                value={formData.socialMedia?.yelp || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                    </div>
                    <div className={styles.editLogoutSaveCancelSection}>
                        <button type="submit" className={styles.saveButton}>Save Changes</button>
                        <button type="button" className={styles.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
