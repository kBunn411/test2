import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from "@clerk/clerk-sdk-node";
import { CreateUser } from '@/libs/actions/user.actions';

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = (await headerPayload).get('svix-id');
    const svix_timestamp = (await headerPayload).get('svix-timestamp');
    const svix_signature = (await headerPayload).get('svix-signature');

    // Log the header values for debugging
    console.log('SVIX ID:', svix_id);
    console.log('SVIX Timestamp:', svix_timestamp);
    console.log('SVIX Signature:', svix_signature);

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', { status: 400 });
    }

    // Get the body
    const payload = await req.json();
    console.log('Received payload:', payload);  // Log the received payload for debugging

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(JSON.stringify(payload), {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred during verification', { status: 400 });
    }

    // Handle the event
    const { id } = evt.data;
    const eventType = evt.type;

    // CREATE USER in MongoDB
    if (eventType === "user.created") {
        const { id,first_name, last_name, email_addresses, username } = evt.data;

        // Check if email_addresses is not empty
        if (email_addresses.length > 0) {
            const user = {
                ChefID: id,
                firstname: first_name,
                lastname: last_name,
                email: email_addresses[0].email_address,
                username: username,
            };

            console.log('Creating user:', user);  // Log the user data being created
            const newUser = await CreateUser(user);

            if (newUser) {
                await clerkClient.users.updateUserMetadata(id, {
                    publicMetadata: {
                        userId: newUser._id,
                    },
                });
                return NextResponse.json({ message: "New user created", user: newUser });
            } else {
                console.error('User creation failed.');
                return new Response('User creation failed', { status: 500 });
            }
        } else {
            console.error('No email address found for user:', evt.data);
            return new Response('No email address provided', { status: 400 });
        }
    }

    console.log(`Webhook with ID ${id} and type ${eventType}`);
    return new Response('', { status: 200 });
}
