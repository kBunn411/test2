"use client";

import React, { useState } from 'react';
import { SignedIn, SignedOut, useUser, UserButton, SignInButton } from '@clerk/nextjs';
import styles from '@/app/styles.module.css';
import Link from 'next/link';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { user } = useUser();

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleSettings = () => setSettingsOpen(!settingsOpen);

    return (
        <header className={styles.navbar}>
            {/* Left: Toggle button and logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className={styles.hamburger} onClick={toggleMenu}>
                    Menu
                </button>

                <Link href="/" className={styles.logo}>
                    <img src="/images/Logo.png" alt="Super Chef Logo" style={{ height: '30px' }} />
                    Super-Chef
                </Link>
            </div>

            {/* Center: Welcome message */}
            <div className={styles.welcomeMessage}>
                <SignedIn>
                    Welcome to Super-Chef, {user?.firstName}!
                </SignedIn>
                <SignedOut>
                    Welcome to Super-Chef!
                </SignedOut>
            </div>

            {/* Right: Settings and Sign In/Sign Out Buttons */}
            <div className={styles.rightSection}>
                <button className={styles.settingsButton} onClick={toggleSettings}>
                    Settings
                </button>
                <SignedOut>
                    <SignInButton>
                        <button className={styles.authButton}>Sign In</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

            {/* Dropdown Menu for Hamburger */}
            {menuOpen && (
                <div className={styles.dropdownMenu}>
                    <Link href="/savedRecipes" legacyBehavior>
                        <a>Saved Recipes</a>
                    </Link>
                    <Link href="/chefTools" legacyBehavior>
                        <a>Chef Tools</a>
                    </Link>
                    <Link href="/profile" legacyBehavior>
                        <a>About Me</a>
                    </Link>
                </div>
            )}

            {/* Settings Dropdown for User Account */}
            {settingsOpen && (
                <div className={styles.settingsDropdown}>
                    <Link href="/account" legacyBehavior>
                        <a>Account Settings</a>
                    </Link>
                    <Link href="/preferences" legacyBehavior>
                        <a>Preferences</a>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
