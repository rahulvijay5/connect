import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  getKindeServerSession,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { ArrowRight, Users, UserPlus, Heart } from "lucide-react";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import { redirect } from "next/navigation";
import { Logo } from "@/components/icons/page";

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  if (user) {
    const userexists = await searchUserByExternalId(user.id!);
    if (userexists) {
      redirect("/connections");
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
            Connect on a Deeper Level
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Build meaningful relationships by sharing what matters most with the
            people who matter most.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {isUserAuthenticated ? (
              <Link href="/connections">
                <Button size="lg" className="w-full sm:w-auto">
                  View Connections <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/api/auth/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-sky-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Known</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start building your network with acquaintances.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <UserPlus className="h-12 w-12 text-sky-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Closer</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Strengthen bonds with friends and colleagues.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Heart className="h-12 w-12 text-sky-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Closest</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Share deeply with your inner circle.
            </p>
          </div>
        </div>
      </main>
      <div className="px-4 md:px-40 pt-4 mt-2 gap-6 pb-10 items-start flex justify-between w-full">
        <div className="text-xs flex flex-col gap-2">
          Join this app superfast to connect to world in its true sense.
          <Button variant="outline" className="font-semibold w-20">
            <RegisterLink>Join Now</RegisterLink>
          </Button>
        </div>
        <Logo />
      </div>
    </>
  );
}
