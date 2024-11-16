import { prisma } from '../../lib/prisma'
import ClientList from '@/app/components/Coaching/ClientList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

export default async function Clients() {

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user.email,
        }
    });

    const clients = await prisma.coachingRequest.findMany({
      where: {
        coachId: user.id,
        status: 'ACCEPTED', // Only include accepted coaching requests
      },
      include: {
        client: true, // Include client details
      },
    });

    const programs = await prisma.program.findMany({
        where: {
            userId: user.id
        },
        include: {
            weeks: {
                include: {
                    workouts: {
                        include: {
                            excercises: {
                                include: {
                                    muscleGroup: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    return (
            <ClientList 
            clients={clients}
            programs={programs}/>
    )

}