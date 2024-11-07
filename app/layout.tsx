import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';
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
                <a href="/" className={styles.homeButton}>Home</a>
                <a href="/savedRecipes" className={styles.homeButton}>Saved Recipes</a>
                <div className={styles.welcomeMessage}>Welcome to SuperChef!</div>
                <div className={styles.authButtonContainer}>
                    <SignedOut>
                        <SignInButton>
                            <button className={styles.authButton}>Sign In</button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton/>
                    </SignedIn>
                </div>
            </header>
            <main>{children}</main>
            </body>
            </html>
        </ClerkProvider>
    );
}
