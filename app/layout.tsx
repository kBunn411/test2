import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';
import Link from 'next/link';
import './globals.css';
import styles from './styles.module.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en">
            <head>
                <title>SuperChef App</title>
                <meta name="description" content="Find and save your favorite recipes!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
            <header className={styles.header}>
                <Link href="/" passHref>
                    <a className={styles.homeButton}>Home</a>
                </Link>
                <Link href="/savedRecipes" passHref>
                    <a className={styles.homeButton}>Saved Recipes</a>
                </Link>
                <div className={styles.welcomeMessage}>Welcome to SuperChef!</div>
                <div className={styles.authButtonContainer}>
                    <SignedOut>
                        <SignInButton>
                            <button className={styles.authButton}>Sign In</button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>
            <main>{children}</main>
            </body>
            </html>
        </ClerkProvider>
    );
}
