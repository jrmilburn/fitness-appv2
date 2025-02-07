import { prisma } from '../lib/prisma'; 
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import Image from 'next/image'
import SettingsForm from '../components/Settings/SettingsForm'

export default async function Settings() {

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user.email,
        },
        include: {
            BodyWeight: {
                orderBy: { createdAt: 'desc'},
                take: 1,
            }
        }
    })

    const latestBodyweight = user?.BodyWeight[0]?.weight || '';

    return (
        <>
            <div className='max-w-2xl mx-auto w-full h-[80%]'>
                <h1 className='text-3xl m-4'>Settings</h1>
                <div key={user.id} className='flex flex-col w-full bg-background-secondary border-2 border-border rounded p-4'>
                  <div className='flex justify-between items-center p-4'>
                    <h2 className='text-2xl'>{user.name}</h2>
                    <Image src={user?.image || '/avatar.svg'} width={64} height={64} className='rounded-full' alt="profile"/>
                  </div>
                
                <SettingsForm user={user} latestBodyWeight={latestBodyweight}/>                

                </div>
            </div>
        </>
    )

}