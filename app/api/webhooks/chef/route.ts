import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { CreateUser } from '@/libs/actions/user.actions'
export async function POST(req:Request) {

    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
    
}