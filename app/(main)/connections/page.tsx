// app/connections/page.tsx
import { Suspense } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SearchUsers from "./_components/SearchUsers";
import { MyConnections } from "./_components/MyConnections";
import SentRequests from "./_components/SentRequests";
import PendingRequests from "./_components/PendingRequests";
import { db } from "@/lib/db";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

async function getUserData(userId: string) {
  const user = await db.user.findUnique({
    where: { externalId: userId },
    include: { contactDetails: true },
  });
  if (!user) throw new Error("User not found");
  return user;
}

export default async function ConnectionsPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) {
    redirect("/api/auth/login");
  }

  const user = await getUserData(kindeUser.id);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Connections</h1>
      {/* <h2 className="text-xl font-semibold mb-4">My user Id: {user.id}</h2> */}
      <div className="w-full flex justify-end">
        <Button className="mb-4" variant={"link"} asChild>
          <Link href="/recent-updates" className="flex-center">
            View Recent Updates <ArrowUpRight className="w-6 h-6" />
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchUsers currentUserID={user.id} />
      </Suspense>
      <Tabs defaultValue="connections" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
          <TabsTrigger value="sent">Sent Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="connections">
          <Suspense fallback={<div>Loading connections...</div>}>
            <MyConnections userId={user.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="sent">
          <Suspense fallback={<div>Loading sent requests...</div>}>
            <SentRequests userId={user.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="pending">
          <Suspense fallback={<div>Loading pending requests...</div>}>
            <PendingRequests userId={user.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
