import CreateUpdate from "@/components/CreateUpdate";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/db";
import { Level } from "@prisma/client";
import UpdatesTabs from "./_components/UpdatesTabs";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import BackButton from "@/components/BackButton";

type Connection = {
  id: string;
  userId: string;
  level: Level;
  user: {
    given_name: string | null;
    family_name: string | null;
  };
};

export default async function UpdatesPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return <div>Please log in to view updates.</div>;
  }
  const userexists = searchUserByExternalId(user?.id!);

  const dbUser = await db.user.findUnique({
    where: { externalId: user.id },
    include: {
      connectionsTo: {
        include: {
          user: {
            select: {
              given_name: true,
              family_name: true,
            },
          },
        },
      },
    },
  });

  if (!dbUser) {
    return <div>User not found.</div>;
  }

  const connections: Connection[] = dbUser.connectionsTo.map((connection) => ({
    id: connection.id,
    userId: connection.userId,
    level: connection.level,
    user: {
      given_name: connection.user.given_name,
      family_name: connection.user.family_name,
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton showtext={true} />
      <h1 className="text-2xl font-bold mt-2 mb-6">Updates</h1>
      <div className="mb-8">
        <CreateUpdate />
      </div>
      <UpdatesTabs connections={connections} />
    </div>
  );
}
