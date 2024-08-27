import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import SearchUsers from "./_components/SearchUsers";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import PendingRequests from "./_components/PendingRequests";
import { MyConnections } from "./_components/MyConnections";
const connections = async () => {

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userexists = await searchUserByExternalId(user?.id!);
  const currentUserID = userexists?.id;

  return (
    <div>
      <div className="mfc flex-col">
        <SearchUsers currentUserID={currentUserID!}/>
        Display all the connections a user already has.
        <br />
        <MyConnections userId={currentUserID!}/>
        <PendingRequests/>
      </div>
    </div>
  );
};

export default connections;
