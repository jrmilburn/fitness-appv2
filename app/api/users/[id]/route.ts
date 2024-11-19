import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import fs from 'fs';
import { join } from 'path';
import { Busboy } from 'busboy';

export const config = {
    api: {
        bodyParser: false, // Disable Next.js default body parser
    },
};

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const uploadsDir = join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const formData: { [key: string]: string } = {};
    let profilePicturePath: string | null = null;

    try {
        const busboy = new Busboy({ headers: { 'content-type': req.headers.get('content-type') || '' } });

        await new Promise((resolve, reject) => {
            req.body?.pipe(busboy);

            busboy.on('file', (fieldname, file, filename) => {
                if (fieldname === 'profilePicture' && filename) {
                    const saveTo = join(uploadsDir, filename);
                    profilePicturePath = `/uploads/${filename}`;
                    file.pipe(fs.createWriteStream(saveTo));
                } else {
                    file.resume(); // Ignore other files
                }
            });

            busboy.on('field', (fieldname, value) => {
                formData[fieldname] = value;
            });

            busboy.on('finish', resolve);
            busboy.on('error', reject);
        });

        const { bodyweight, username, bio } = formData;

        // Validate and parse bodyweight
        const parsedWeight = parseFloat(bodyweight || '');
        if (isNaN(parsedWeight)) {
            throw new Error('Invalid bodyweight');
        }

        // Update user in Prisma
        const user = await prisma.user.update({
            where: { id },
            data: { username, bio, image: profilePicturePath },
        });

        const newBodyWeight = await prisma.bodyWeight.create({
            data: { weight: parsedWeight, userId: id },
        });

        return NextResponse.json({ user, newBodyWeight });
    } catch (error) {
        console.error('Error updating user:', error);
        return new NextResponse('Failed to update user', { status: 500 });
    }
}
