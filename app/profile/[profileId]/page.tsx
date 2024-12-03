"use client"; // Ensure this is a client-side component

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk's React hook to access the authenticated user
import styles from "@/app/profile/profile.module.css";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { RecipeResult } from "@/types/RecipeResponseType";
import RecipeCard from "@/components/RecipeCard/RecipeCard";

const Profile = () => {
    const router = useRouter();
    const profileId = useParams().profileId;
    const { isLoaded, isSignedIn, user } = useUser(); // Retrieve authenticated user data from Clerk
    const [profile, setProfile] = useState<any>(null); // State to store user profile data
    const [formData, setFormData] = useState<any>({}); // State to handle form input changes
    const [isEditing, setIsEditing] = useState(false); // Track whether we're in editing mode
    const [savedRecipes, setSavedRecipes] = useState<RecipeResult[]>([]);
    const [privateView, setPrivateView] = useState(false);
    const [bioEditMode, setBioEditMode] = useState(false);
    const [bio, setBio] = useState<string>("");

    // Fetch the user profile data from the API
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                if (user.id === profileId) {
                    console.log("NOW");
                    const response = await fetch("/api/userProfile");
                    const data = await response.json();
                    setProfile(data.user);
                    setSavedRecipes(data.recipes);
                    setBio(data.user?.bio || "");
                } else {
                    const response = await fetch(
                        `/api/publicProfile?profileId=${profileId}`
                    );
                    const { user, recipes } = await response.json();
                    console.log(recipes, user);
                    setProfile(user);
                    setSavedRecipes(recipes);
                    setBio(user?.bio || "");
                }
            };
            fetchProfile();
        }
    }, [user]);

    // Handle input changes in the form, including nested fields
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
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

    const replaceImage = () => {
        alert("Image replace coming soon");
        //user?.setProfileImage({file:{upload file}})
    };

    // Handle form submission to update the user profile
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/userProfile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const updatedUser = await response.json();
            setProfile(updatedUser); // Update profile with the latest data
            setIsEditing(false); // Exit edit mode
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile.");
        }
    };

    // Function to fetch saved recipes
    // useEffect(() => {
    //     const effect = async () => {
    //         if (user?.id !== profileId) {
    //             return;
    //         }
    //         try {
    //             const response = await fetch("/api/getSavedRecipes");
    //             if (response.ok) {
    //                 const recipes = await response.json();

    //                 setSavedRecipes(recipes);
    //             } else {
    //                 console.error("Failed to fetch saved recipes");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching saved recipes:", error);
    //         }
    //     };
    //     effect();
    // }, []);

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value);
    };

    const saveBio = async () => {
        try {
            const response = await fetch("/api/userProfile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bio }),
            });

            if (response.ok) {
                setProfile((prev: any) => ({ ...prev, bio }));
                setBioEditMode(false);
                alert("Bio updated");
            } else {
                alert("Bio update failed");
            }
        } catch (error) {
            console.error("Error updating bio:", error);
        }
    };

    const cancelBioEdit = () => {
        setBioEditMode(false);
        setBio(profile.bio || "");
    };

    console.log(user);

    // Show loading state while fetching user data
    if (isLoaded && !user) {
        return null;
    }
    if (!profile) {
        return <div>Loading...</div>;
    }

    return isLoaded ? (
        user && (
            <div className={styles.container}>
                <div
                    onClick={() => replaceImage()}
                    style={{height: "18rem", width: "18rem"}}
                >
                    <img
                        alt={"profileImage"}
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                        }}
                        src={user.imageUrl}
                    />
                </div>
                <h1 className={styles.name}>{user.username}</h1>
                <p className={styles.bio}>{profile.bio}</p>
                <div
                    style={{
                        height: "1.8rem",
                        width: "9rem",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <img
                        className={styles.socialMediaIcon}
                        src="/images/facebook.png"
                        width={28}
                        alt="FB"
                        onClick={() => window.open("https://www.facebook.com", "_blank")}
                    />{" "}
                    <img
                        className={styles.socialMediaIcon}
                        src="/images/yelp.png"
                        alt="FB"
                        width={30}
                        onClick={() => window.open("https://www.yelp.com", "_blank")}

                    />
                    <img
                        className={styles.socialMediaIcon}
                        src="/images/instagram.png"
                        alt="FB"
                        width={30}
                        onClick={() => window.open("https://www.instagram.com", "_blank")}
                    />
                </div>


                <div className={styles.bioEditBox}>
                    {bioEditMode ? (
                        <div>
            <textarea
                value={bio}
                onChange={handleBioChange}
                className={styles.bioEdit}
            />
                            <div>
                                <button onClick={saveBio} className={styles.saveButton}>
                                    Save
                                </button>
                                <button onClick={cancelBioEdit} className={styles.cancelButton}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {user.id === profileId && (
                                <button
                                    onClick={() => setBioEditMode(true)}
                                    className={styles.editButton}
                                >
                                    Edit Bio
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {user.id === profileId && (
                    <div>
                        <button
                            style={{
                                backgroundColor: 'purple',
                                color: 'white',
                                padding: '10px 10px',
                                border: 'none',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                fontSize: '13px'
                            }}
                            onClick={() => setPrivateView(!privateView)}>
                            View Private Recipes
                        </button>
                    </div>
                )}
                <div className={styles.recipes}>
                    {savedRecipes
                        .filter(recipe =>
                            privateView ? recipe.isPrivate : !recipe.isPrivate
                        )
                        .map((recipe, key) => {
                            return (
                                <RecipeCard
                                    key={key}
                                    recipe={recipe}
                                    planable
                                />
                            );
                        })}
                </div>
            </div>
        )
    ) : (
        <>STILL LOADING THE PROFILE</>
    );
};

export default Profile;
