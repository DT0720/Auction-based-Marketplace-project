// src/app/api/testConnection/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma'; // Adjust import according to your structure

export async function GET() {
    try {
        // Attempt to fetch users or any other model
        const users = await prisma.user.findMany(); // Replace 'user' with any existing model
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ success: false, message: 'Database connection failed.' }, { status: 500 });
    }
}