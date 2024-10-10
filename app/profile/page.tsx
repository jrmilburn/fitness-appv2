import { prisma } from '../lib/prisma';  // Assuming you're using Prisma
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ProfilePage() {

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user.email,
        }
    })

    console.log(session);

  return (
    <div>
      <h1>User Profile</h1>
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.id}</p>
          <p>{user.email}</p>
        </div>
    </div>
  );
}