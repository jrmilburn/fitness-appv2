
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, firstName, lastName, phone, password } = await req.json();

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const name = `${firstName} ${lastName}`;

        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                phone,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: 'User registered successfully', user: newUser }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}