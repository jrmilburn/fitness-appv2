import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import Image from 'next/image';
import Link from 'next/link';
import ProgramTab from '../../components/Program/ProgramTab';
import backIcon from '../../assets/back.svg';
import ProfileActions from '../../components/Profile/Profileactions'; // Import ProfileActions Component

export default async function Profile({ params }) {
  const session = await getServerSession(authOptions);

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  });

  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  let program = null;

  if (user?.currentProgramId) {
    program = await prisma.program.findUnique({
      where: {
        id: user.currentProgramId,
      },
    });
  }

  // Check for an existing coaching relationship
  const coachingRequest = await prisma.coachingRequest.findFirst({
    where: {
      OR: [
        { clientId: currentUser?.id, coachId: user?.id },
        { clientId: user?.id, coachId: currentUser?.id },
      ],
    },
  });

  const following = await prisma.userFollow.findUnique({
    where: {
      fromUserId_toUserId: {
        fromUserId: currentUser.id, // ID of the user who is checking
        toUserId: user.id,   // ID of the user being checked
      },
    },
  });

  const isFollowing = !!following;

  // Determine the type of relationship and its status
  let relationshipType = null;
  if (coachingRequest) {
    if (coachingRequest.clientId === currentUser.id) {
      relationshipType = coachingRequest.status === 'PENDING' ? 'Pending Coach Request Sent' : 'Coach';
    } else if (coachingRequest.coachId === currentUser.id) {
      relationshipType = coachingRequest.status === 'PENDING' ? 'Pending Request (Check Notifications)' : 'Coaching';
    }
  }

  const formattedDate = new Date(program?.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div className="max-w-2xl mx-auto w-full h-[80%] relative">
        <h1 className="text-3xl m-4">User Profile</h1>
        <div key={user.id} className="flex flex-col w-full bg-gray-100 rounded p-4">
          <div className="flex flex-col items-center p-4">
            <Image
              src={user?.image || '/avatar.svg'}
              width={64}
              height={64}
              className="rounded-full"
              alt="profile"
            />
            <h2 className="text-2xl mt-2">{user.username || user.name}</h2>

            {user.id !== currentUser?.id && (
              <>
                <ProfileActions
                  userId={user.id}
                  userName={user.username || user.name}
                  relationshipType={relationshipType}
                  following={isFollowing}
                />
                {relationshipType && (
                  <p className="mt-2 text-gray-600 absolute bg-gray-300 left-5 p-2">{relationshipType}</p>
                )}
              </>
            )}
          </div>

          <h2 className="my-4 text-3xl">Current Program</h2>
          <ProgramTab
            name={user?.name}
            length={program?.length}
            days={program?.days}
            id={program?.id}
            userProgramId={user?.currentProgramId}
            created={formattedDate}
            canDelete={false}
            onDelete={null}
          />
        </div>

        <button className="absolute top-[10%] left-[-20%]">
          <Link href="/search">
            <Image src={backIcon} alt="back" />
          </Link>
        </button>
      </div>
    </>
  );
}