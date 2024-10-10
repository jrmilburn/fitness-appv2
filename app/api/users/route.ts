import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';  // Assuming you have set up Prisma

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      
        const users = await prisma.user.findMany();

        res.json(users);

    } catch (error) {
      res.status(500).json({ error: 'Failed to create program' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}