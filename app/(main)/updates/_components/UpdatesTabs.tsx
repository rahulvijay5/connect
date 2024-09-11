"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyUpdates from "./MyUpdates";
import ConnectionUpdates from "./ConnectionUpdates";
import { Level } from "@prisma/client";

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

type UpdatesTabsProps = {
  connections: Connection[];
};

export default function UpdatesTabs({ connections }: UpdatesTabsProps) {
  const [activeTab, setActiveTab] = useState("myUpdates");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="myUpdates">My Updates</TabsTrigger>
        <TabsTrigger value="connectionUpdates">Connection Updates</TabsTrigger>
      </TabsList>
      <TabsContent value="myUpdates">
        <MyUpdates />
      </TabsContent>
      <TabsContent value="connectionUpdates">
        <ConnectionUpdates connections={connections} />
      </TabsContent>
    </Tabs>
  );
}
