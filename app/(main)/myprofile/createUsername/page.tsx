import React from "react";
import UsernameInput from "../_components/UsernameInput";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {TopRightIcon} from "@/components/icons/page";
import { ModeToggle } from "@/components/ModeToggle";
import UsernameInputForm from "../_components/UsernameInput";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userexists = await searchUserByExternalId(user?.id!);

  if (userexists) {
    return (
      <div className="min-h-screen flex justify-center items-center gap-6 ">
        
        <p className="-mt-16 text-2xl">
          Welcome Back <span className="text-sky-500 font-semibold"> {user?.given_name},</span>
        </p>
        <div className="flex gap-2 flex-col mt-20">
          <Link href={`/connections`}>
            <Button variant="link" className="hover:text-sky-500 gap-1 text-xl">
              My Connections
              <TopRightIcon />
            </Button>
          </Link>
          <Link href={`/myprofile`}>
            <Button variant="link" className="hover:text-sky-500 gap-1 text-xl">
              My Profile
              <TopRightIcon />
            </Button>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mfc">
        <UsernameInputForm />
      </div>
    );
  }
};

export default page;
