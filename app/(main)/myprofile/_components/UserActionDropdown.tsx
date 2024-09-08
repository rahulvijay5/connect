"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Edit, Share2, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

interface UserActionDropdownProps {
  username: string;
}

export default function UserActionDropdown({
  username,
}: UserActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <EllipsisVertical className="h-6 w-6" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="cursor-pointer my-2" asChild>
          <Link href="/myprofile/myaccount" className="flex items-center">
            <Edit className="mr-2 h-[1.2rem] w-[1.2rem]" />
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer my-2" asChild>
          <Link href={`/${username}/share`} className="flex items-center">
            <Share2 className="mr-2 h-[1.2rem] w-[1.2rem]" />
            <span>Share Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer px-0" asChild>
          <div className="flex items-center">
            <ModeToggle showText={true} />
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer my-2 ml-1" asChild>
          <LogoutLink className="flex w-full items-center text-red-600 hover:text-red-700">
            <LogOut className="mr-2 h-[1.2rem] w-[1.2rem]" />
            <span>Logout</span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
