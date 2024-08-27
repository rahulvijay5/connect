"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import {Logo} from "./icons/page";

const Footer = () => {
  return (
    <div className="px-40 pt-4 mt-2 gap-6 pb-10 items-start flex justify-between w-full">
      <div className="text-xs flex flex-col gap-2">
        Join this app superfast to connect to world in its true sense.
        <Button variant="outline" className="font-semibold w-20">
          <RegisterLink>Join Now</RegisterLink>
        </Button>
      </div>
      <Logo/>
    </div>
  );
};

export default Footer;
