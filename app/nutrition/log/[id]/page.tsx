import DailyLog from "@/app/components/Nutrition/Log/DailyLog";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

export default async function DailyLogPage({ params }) {
  const { id } = params;

  const userSession = await getServerSession(authOptions);

  const userEmail = userSession?.user.email;

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    }
  })

  try {
    // Check if the DailyLog exists
    let dailyLog = await prisma.dailyLog.findUnique({
      where: {
        dateId_userId: {
          dateId: id, // The specific dateId you're searching for
          userId: user.id, // The userId for the current user
        },
      },
      include: {
        foods: true, // Include related foods
      },
    });

    // If the DailyLog does not exist, create it
    if (!dailyLog) {
      dailyLog = await prisma.dailyLog.create({
        data: {
          dateId: id, // Use the same ID format
          userId: user.id,
        },
        include: {
            foods: true
        }
      });
    }

    return (
      <DailyLog 
        foods={dailyLog.foods} 
        dateId={id}
        dailyLogId={dailyLog.id}
      />
    );
  } catch (error) {
    console.error("Error fetching or creating DailyLog:", error);
    return <p>Error loading DailyLog.</p>;
  }
}