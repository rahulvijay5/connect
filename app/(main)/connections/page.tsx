import CreateUpdate from "@/components/CreateUpdate";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/db";
import { Level } from "@prisma/client";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import BackButton from "@/components/BackButton";
import UpdatesTabs from "../updates/_components/UpdatesTabs";
import ConnectionUpdates from "../updates/_components/ConnectionUpdates";

type Connection = {
  id: string;
  userId: string;
  level: Level;
  user: {
    given_name: string | null;
    family_name: string | null;
    username: string;
    profilePicture: string | null;
  };
};

export default async function ConnectionPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return <div>Please log in to view updates.</div>;
  }
  // const userexists = searchUserByExternalId(user?.id!);

  const dbUser = await db.user.findUnique({
    where: { externalId: user.id },
    include: {
      connectionsTo: {
        include: {
          user: {
            select: {
              given_name: true,
              family_name: true,
              username: true,
              profilePicture: true,
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
      username: connection.user.username,
      profilePicture: connection.user.profilePicture,
    },
  }));

  return (
    <div className="w-screen sm:w-full px-4 py-8 overflow-hidden relative">
      {/* <BackButton showtext={true} /> */}
      <div className="flex gap w-full items-center my-4 justify-start">
        <h1 className="text-2xl font-bold mb-3 md:hidden">
          {process.env.APP_NAME}
        </h1>
        <h1 className="text-2xl font-bold mb-3 md:block hidden">Home</h1>
      </div>
      <div className="md:flex md:flex-row-reverse md:gap-4">
        <div className="mb-8 md:w-1/3 sticky top-8 md:top-0 max-h-40">
          <CreateUpdate buttonvariant={"ghost"} />
        </div>
        <div className="md:w-2/3 overflow-y-scroll">
          <ConnectionUpdates connections={connections} />
        </div>
      </div>
    </div>
  );
}
