import { APPName } from "@/lib/constants";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "./ui/button";
import { Logo } from "./icons/page";

const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();

  const isUserAuthenticated = await isAuthenticated();
  return (
    <div className="h-16 px-4 md:px-40 pt-2  items-center flex justify-between w-full">
      <Logo />

      <div className="flex gap-2 justify-between items-center">
        <ModeToggle />
        <div className="">
          {isUserAuthenticated && (
            <Button variant="outline">
              <LogoutLink>Log out</LogoutLink>
            </Button>
          )}
          {!isUserAuthenticated && (
            <div className="flex gap-2 ">
              <Button className="font-semibold">
                <LoginLink>Log in</LoginLink>
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold ">
                <RegisterLink>Register</RegisterLink>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
