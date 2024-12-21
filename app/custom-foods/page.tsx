import { prisma } from '../lib/prisma'
import CustomFoods from '../components/Nutrition/CustomFoods/CustomFoods';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/authOptions';

export default async function CustomFoodsPage() {


    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user.email;
    const user = await prisma.user.findUnique({
        where: {
            email: userEmail
        },
    })

    const customfoods = await prisma.food.findMany({
        where: {
            custom: true,
            createdById: user.id
        },
    })


    return (
        <div className='h-100% pb-20'>
        <CustomFoods
            onAdd={() => {}}
            foods={customfoods}
        />
        </div>

    )

}