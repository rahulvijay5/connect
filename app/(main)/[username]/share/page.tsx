"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QRCode, { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Copy, User } from "lucide-react";
import BackButton from "@/components/BackButton";
import Link from "next/link";

type User = {
  id: string;
  externalId: string;
  username: string;
  given_name: string | null;
  family_name: string | null;
};

export default function ShareProfilePage() {
  const { user } = useKindeBrowserClient();
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        try {
          const response = await fetch("/api/user/searchOneUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ KindeId: user.id }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          const userData = await response.json();
          setProfileUser(userData);
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Failed to load user profile");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, [user]);

  if (isLoading) {
    return (
      <div className="mfc  duration-1000">
        <div className="h-10 flex items-center justify-center animate-bounce">
          Loading...
        </div>
      </div>
    );
  }

  if (!profileUser || profileUser.username !== username) {
    return <div>You don&apos;t have permission to share this profile.</div>;
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${profileUser.username}?share=true`;

  return (
    <div className="w-screen sm:w-full px-4 py-8 overflow-hidden relative">
      <div className="w-full max-w-2xl flex justify-between mb-2">
        <div className="flex  w-full items-center my-2 justify-start">
          <BackButton showtext={false} />
          <h1 className="text-2xl font-bold">Search Users</h1>
        </div>
        {/* <Link href={"/myprofile"}>
          <Button variant={"outline"} size={"icon"}>
            <User className="h-6 w-6" />
          </Button>
        </Link> */}
      </div>
      <Card className="px-2 py-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Share Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="bg-white p-6 rounded-lg">
            <QRCodeSVG value={shareUrl} size={250} level="H" />
          </div>
          <p className="text-center text-sm text-muted-foreground select-all">
            {shareUrl}
          </p>
          <Button
            size={"lg"}
            variant={"default"}
            className="flex gap-2"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast.success("Link copied to clipboard");
            }}
          >
            <Copy className="w-6 h-6" />
            Copy Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
