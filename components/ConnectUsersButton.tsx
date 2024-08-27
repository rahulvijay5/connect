"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { ButtonVariant } from "@/lib/types";
import { toast } from "sonner";
import { ToastAction } from "./ui/toast";
import Link from "next/link";

interface ConnectUsersButtonProps {
  id1: string;
  id2: string;
  buttonVariant?: ButtonVariant;
}

const ConnectUsersButton: React.FC<ConnectUsersButtonProps> = ({
  id1,
  id2,
  buttonVariant = "link",
}) => {
  const handleConnectUsers = async () => {
    try {
      const response = await fetch("/api/user/connectusers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id1: id1, id2: id2 }),
      });
      const data = await response.json();
      toast(data.message);
    } catch (error) {
      console.error("Error connecting users:", error);
      toast("Error while connecting users!", {
        description:
          "Seems like there is an error while connectting users, please try again after some time.",
        action: (
          <ToastAction altText="Try again">
            <Link href={"/connections"}>My Connections</Link>
          </ToastAction>
        ),
      });
    }
  };

  return (
    <div className="flex-center flex-col gap-2">
      <Button
        variant={buttonVariant}
        className="hover:text-sky-500"
        onClick={handleConnectUsers}
      >
        Connect
      </Button>
    </div>
  );
};

export default ConnectUsersButton;
