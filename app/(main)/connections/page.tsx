import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SearchUsers from "./_components/SearchUsers";
import { MyConnections } from "./_components/MyConnections";
import SentRequests from "./_components/SentRequests";
import PendingRequests from "./_components/PendingRequests";
import { searchUserByExternalId } from "@/actions/users/searchUsers";

const ConnectionsPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userexists = await searchUserByExternalId(user?.id!)

  if (!user) {
    return <div>Please log in to view this page.</div>
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Connections</h1>
      <h1 className="text-2xl font-bold mb-4">My user Id: {userexists?.id}</h1>
      <SearchUsers currentUserID={user.id} />
      <Tabs defaultValue="search" className="w-full">
        <TabsList>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
          <TabsTrigger value="sent">Sent Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="connections">
          <Suspense fallback={<div>Loading connections...</div>}>
            <MyConnections userId={userexists?.id!} />
          </Suspense>
        </TabsContent>
        <TabsContent value="sent">
          <Suspense fallback={<div>Loading sent requests...</div>}>
            <SentRequests userId={userexists?.id!} />
          </Suspense>
        </TabsContent>
        <TabsContent value="pending">
          <Suspense fallback={<div>Loading pending requests...</div>}>
            <PendingRequests userId={userexists?.id!} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ConnectionsPage