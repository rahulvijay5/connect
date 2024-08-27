import React from "react";
import Image from "next/image";
import {
  LogoutLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import {TopRightIcon} from "@/components/icons/page";
import { ModeToggle } from "@/components/ModeToggle";

const myprofile = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userexists = await searchUserByExternalId(user?.id!);
  return (
    <div className="min-h-screen w-full">
      <Image
        src="https://source.unsplash.com/random/?abstract"
        height={800}
        width={2500}
        className="h-40 w-full -mt-10 object-cover rounded-b-full"
        alt="banner Image"
      />
      <div className="px-8 md:px-20 sm:px-12">
        <div className="w-full px-4 flex justify-between">
          {userexists?.profilePicture && (
            <Image
              src={`${userexists?.profilePicture}`}
              height={150}
              width={150}
              className="rounded-full -mt-16"
              alt="profilePic"
            />
          )}
          <Link href="/myprofile/myaccount" className="mt-4">
            <Button variant="outline" className="flex-center gap-1">
              Edit Profile <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {userexists?.given_name && userexists?.family_name && (
          <p className="mt-4">
            {userexists?.given_name} {userexists?.family_name}
          </p>
        )}
        {userexists?.email && <p className="mt-2">{userexists?.email}</p>}
        {userexists?.username && <p className="mt-2">{userexists?.username}</p>}
        <div className="flex gap-2 mt-4">
          <ModeToggle/>
          <Link href={`/connections`}>
            <Button variant="outline" className="hover:text-sky-500">
              My Connections
            </Button>
          </Link>
          <Button className="" variant="outline">
            <LogoutLink>Logout</LogoutLink>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default myprofile;
