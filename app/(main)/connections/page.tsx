import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import PendingRequests from "./_components/PendingRequests";
import SearchUsers from "./_components/SearchUsers";

const connections = () => {
  return (
    <div>
      <div className="mfc flex-col">
        <SearchUsers/>
        Display all the connections a user already has.
        <br />
        <PendingRequests/>
      </div>
    </div>
  );
};

export default connections;
