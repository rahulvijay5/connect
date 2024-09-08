"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function SharePrompt({
  username,
}: // name,
{
  username: string;
  // name: string;
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    router.push("/api/auth/login");
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button className="w-full sm:w-fit">Know More about @{username}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want to know more about @{username}</DialogTitle>
          <DialogDescription>
            Login to view more details and stay connected with @{username}.
            Share your life's updates without any clutter or mess.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleLogin}>Login to Connect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
