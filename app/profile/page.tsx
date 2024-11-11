"use client";
import React, { useState } from 'react';
import styles from './profile.module.css';

interface UserProfile {
    name: string;
    email: string;
    profilePicture: string;
    bio: string;
    country: string;
    city: string;
    phone: string;
    favoriteCuisine: string;
    age: number;
    socialMedia?: {
        yelp?: string;
        facebook?: string;
        instagram?: string;
    };
}

const userProfileData: UserProfile = {
    name: "Johnny Appleseed",
    email: "johnnyappleseed@gmail.com",
    profilePicture: "/images/johnny.jpg",
    bio: "Farmer ~ Horse Rider ~ Apple Lover.",
    country: "United States",
    city: "Philadelphia",
    phone: "+1 (267) 541-7000",
    favoriteCuisine: "Chinese",
    age: 22,
    socialMedia: {
        yelp: "https://www.yelp.com/user_details?userid=hJwV8bVkmkTRbyuE9X_Kcw",
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/"
    }
};

const UserProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserProfile>(userProfileData);
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState(user.bio);
    const [country, setCountry] = useState(user.country);
    const [city, setCity] = useState(user.city);
    const [phone, setPhone] = useState(user.phone);
    const [favoriteCuisine, setFavoriteCuisine] = useState(user.favoriteCuisine);
    const [age, setAge] = useState(user.age);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setUser(prevUser => ({
            ...prevUser,
            bio: bio,
            country: country,
            city: city,
            phone: phone,
            favoriteCuisine: favoriteCuisine,
            age: age,
        }));
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setBio(user.bio);
        setCountry(user.country);
        setCity(user.city);
        setPhone(user.phone);
        setFavoriteCuisine(user.favoriteCuisine);
        setAge(user.age);
        setIsEditing(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.picNameBioHeader}>
                <img src={user.profilePicture} className={styles.profilePicture} alt={`${user.name}'s profile`} />
                <h1 className={styles.name}>{user.name}</h1>
                {isEditing ? (
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className={styles.bioEdit}
                    />
                ) : (
                    <p className={styles.bio}>{user.bio}</p>
                )}
            </div>

            <div className={styles.profileDetails}>
                <h2>Contact Information</h2>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            <div className={styles.socialMedia}>
                {user.socialMedia?.yelp && (
                    <a href={user.socialMedia.yelp} target="_blank" rel="noopener noreferrer" >
                        <img src="/images/yelp.png" alt="Yelp" className={styles.socialIcon} />
                    </a>
                )}
                {user.socialMedia?.facebook && (
                    <a href={user.socialMedia.facebook} target="_blank" rel="noopener noreferrer" >
                        <img src="/images/facebook.png" alt="Facebook" className={styles.socialIcon} />
                    </a>
                )}
                {user.socialMedia?.instagram && (
                    <a href={user.socialMedia.instagram} target="_blank" rel="noopener noreferrer" >
                        <img src="/images/instagram.png" alt="Instagram" className={styles.socialIcon} />
                    </a>
                )}
            </div>

            <div className={styles.additionalInfoBox}>
                <h3>About Me</h3>
                {isEditing ? (
                    <>
                        <p><strong>Country:</strong> <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} /></p>
                        <p><strong>City:</strong> <input type="text" value={city} onChange={(e) => setCity(e.target.value)} /></p>
                        <p><strong>Phone Number:</strong> <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} /></p>
                        <p><strong>Favorite Cuisine:</strong> <input type="text" value={favoriteCuisine} onChange={(e) => setFavoriteCuisine(e.target.value)} /></p>
                        <p><strong>Age:</strong> <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} /></p>
                    </>
                ) : (
                    <>
                        <p><strong>Country:</strong> {user.country}</p>
                        <p><strong>City:</strong> {user.city}</p>
                        <p><strong>Phone Number:</strong> {user.phone}</p>
                        <p><strong>Favorite Cuisine:</strong> {user.favoriteCuisine}</p>
                        <p><strong>Age:</strong> {user.age}</p>
                    </>
                )}
            </div>

            <div className={styles.editLogoutSaveCancelSection}>
                {isEditing ? (
                    <>
                        <button onClick={handleSaveClick} className={styles.saveButton}>Save</button>
                        <button onClick={handleCancelClick} className={styles.cancelButton}>Cancel</button>
                    </>
                ) : (
                    <button onClick={handleEditClick} className={styles.editButton}>Edit Profile</button>
                )}
                <button className={styles.logoutButton}>Log Out</button>
            </div>

            <div className={styles.homeButtonSection}>
                <a href="https://test2-sigma-six.vercel.app/" target="_blank" rel="noopener noreferrer"
                   className={styles.homeButton}>
                    SuperChef
                    <img src="app/images/chefhat.png" className={styles.chefHat} alt="Chef Hat" />
                </a>
            </div>
        </div>
    );
};

export default UserProfilePage;