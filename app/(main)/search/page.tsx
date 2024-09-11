import CreateUpdate from "@/components/CreateUpdate";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/db";
import { Level } from "@prisma/client";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import BackButton from "@/components/BackButton";
import UpdatesTabs from "../updates/_components/UpdatesTabs";
import ConnectionUpdates from "../updates/_components/ConnectionUpdates";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchUsers from "../connections/_components/SearchUsers";
import { MyConnections } from "../connections/_components/MyConnections";
import SentRequests from "../connections/_components/SentRequests";
import PendingRequests from "../connections/_components/PendingRequests";
import { redirect } from "next/navigation";

type Connection = {
  id: string;
  userId: string;
  level: Level;
  user: {
    given_name: string | null;
    family_name: string | null;
    username: string | null;
    profilePicture: string | null;
  };
};

export default async function SearchPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) {
    redirect("/api/auth/login");
  }

  const user = await searchUserByExternalId(kindeUser.id);

  return (
    <div className="w-screen sm:w-full px-4 py-8 overflow-hidden relative">
      <div className="flex  w-full items-center my-2 justify-start">
        <BackButton showtext={false} />
        <h1 className="text-2xl font-bold">Search Users</h1>
      </div>
      <div className="md:flex md:flex-row-reverse md:gap-2">
        <div className="mb-8 md:w-1/3 sticky top-8 md:top-0 ">
          <Suspense fallback={<div>Loading search...</div>}>
            <SearchUsers currentUserID={user?.id!} />
          </Suspense>
        </div>
        <div className="md:w-2/3 overflow-y-scroll">
          <Tabs defaultValue="connections" className="w-full">
            <TabsList className="flex flex-wrap p-2 gap-4 justify-center">
              <TabsTrigger value="connections" className="md:p-4">
                My Connections
              </TabsTrigger>
              <TabsTrigger value="sent" className="md:p-4">
                Sent Requests
              </TabsTrigger>
              <TabsTrigger value="pending" className="md:p-4">
                Pending Requests
              </TabsTrigger>
            </TabsList>
            <TabsContent value="connections">
              <Suspense fallback={<div>Loading connections...</div>}>
                <MyConnections userId={user?.id!} />
              </Suspense>
            </TabsContent>
            <TabsContent value="sent">
              <Suspense fallback={<div>Loading sent requests...</div>}>
                <SentRequests userId={user?.id!} />
              </Suspense>
            </TabsContent>
            <TabsContent value="pending">
              <Suspense fallback={<div>Loading pending requests...</div>}>
                <PendingRequests userId={user?.id!} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
