// components/Footer.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  PenSquare,
  Share2,
  User,
  PlusSquare,
  LucideQrCode,
} from "lucide-react";
import {
  useKindeAuth,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import { Logo } from "./icons/page";

type User = {
  id: string;
  externalId: string;
  username: string;
  given_name: string | null;
  family_name: string | null;
};

export function Footer() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  const { user } = useKindeBrowserClient();
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

  useEffect(() => {
    const index = navItems.findIndex((item) => item.href === pathname);
    setActiveIndex(index !== -1 ? index : 0);
  }, [pathname]);

  if (!isLoading && !profileUser) {
    return <div>You don&apos;t have permission to share this profile.</div>;
  }

  const navItems = [
    { name: "Home", href: "/", Icon: Home },
    { name: "Search", href: "/search", Icon: Search },
    { name: "Create Update", href: "/updates", Icon: PlusSquare },
    {
      name: "Share Profile",
      href: `/${profileUser?.username}/share`,
      Icon: LucideQrCode,
    },
    { name: "My Profile", href: "/myprofile", Icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full md:px-4 right-0 bg-white dark:bg-gray-950 border-t dark:border-gray-800 transition-all duration-300 ease-in-out md:left-0 md:top-0 md:bottom-0 md:w-64 md:border-r md:border-t-0">
      <div className="absolute text-2xl hidden md:block top-12 w-full px-4 ">
        <Logo />
      </div>
      <div className="flex justify-around items-center h-16 md:flex-col md:h-screen md:justify-center md:space-y-8">
        {navItems.map(({ name, href, Icon }, index) => (
          <Link
            key={name}
            href={href}
            className={`relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ease-in-out
              ${
                index === activeIndex
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }
              md:w-full md:flex-row md:justify-start md:space-x-4 md:px-6 md:py-3 md:rounded-lg
              ${
                index === activeIndex
                  ? "md:bg-primary/10"
                  : "md:hover:bg-primary/5"
              }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1 hidden md:block md:text-sm md:mt-0">
              {name}
            </span>
            {index === activeIndex && (
              <span className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2 md:left-0 md:top-1/2 md:w-1 md:h-8 md:-translate-y-1/2" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
