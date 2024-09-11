import React from "react";
import Image from "next/image";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PhoneIcon,
  MapPinIcon,
  Cake,
  Mail,
  LucideChevronsRight,
  LucideGitCompare,
  QrCode,
  PanelsRightBottom,
} from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import UserActionDropdown from "./_components/UserActionDropdown";
import SocialLinks from "@/components/SocialLinks";
import CreateUpdate from "@/components/CreateUpdate";
const images = [
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];
const MyProfile = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userexists = await searchUserByExternalId(user?.id!);
  if (!userexists) {
    return notFound();
  }

  const socialLinksData = {
    ...userexists.socialLinks,
    customLinks: userexists.socialLinks?.customLinks as
      | { platform: string; url: string }[]
      | undefined,
  };

  return (
    <div className="w-full pb-8 md:px-4 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="h-[30vh] relative w-full">
        <div className="absolute top-4 p-2 left-0 w-full flex items-center justify-between gap-4 z-20">
          <div className="flex gap-2 items-center">
            <BackButton showtext={false} />
            {userexists.username && (
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                @{userexists.username}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/${userexists.username}/share`}>
              <QrCode className="h-6 w-6" />
            </Link>
            <UserActionDropdown username={userexists.username} />
          </div>
        </div>
        <BackgroundBeams />
      </div>

      <div className="px-4 md:px-8 lg:px-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className="w-full p-6 flex flex-col items-center border-b-2 bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 mb-6">
              <ProfileImageUploader
                initialImageUrl={userexists.profilePicture || ""}
                userName={userexists.given_name || userexists.username}
                userId={userexists.id}
              />
              {userexists.given_name && userexists.family_name && (
                <p className="mt-4 text-2xl font-bold text-center">
                  {userexists.given_name} {userexists.family_name}
                </p>
              )}
              {userexists.bio && (
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-center">
                  {userexists.bio}
                </p>
              )}
              <SocialLinks links={socialLinksData} />
            </div>

            <div className="w-full p-6 flex flex-col items-center rounded-lg border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mb-6">
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="p-4 flex flex-col items-center rounded-lg bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900">
                  <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                    Shared
                  </p>
                  <p className="font-bold text-xl mt-2">
                    {userexists.connectionsTo.length}
                  </p>
                </div>
                <div className="p-4 flex flex-col items-center rounded-lg bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900">
                  <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                    Connected
                  </p>
                  <p className="font-bold text-xl mt-2">
                    {userexists.connectionsFrom?.length}
                  </p>
                </div>
                <div className="p-4 flex flex-col items-center rounded-lg bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900">
                  <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                    Updates
                  </p>
                  <p className="font-bold text-xl mt-2">
                    {userexists.updates?.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <Link href="/updates" className="w-full">
                <Button variant="secondary" className="w-full justify-between">
                  My Updates
                  <LucideChevronsRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/connections" className="w-full">
                <Button variant="secondary" className="w-full justify-between">
                  My Connections
                  <LucideGitCompare className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-1">
            <div className="w-full p-6 flex flex-col items-start rounded-lg border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Contact Information
              </h3>
              {userexists.contactDetails?.phone && (
                <p className="mt-2 flex items-center select-all">
                  <PhoneIcon className="mr-2 h-4 w-4" />
                  {userexists.contactDetails.phone}
                </p>
              )}
              {userexists.email && (
                <p className="mt-2 flex items-center text-slate-600 dark:text-slate-400 select-all">
                  <Mail className="mr-2 h-4 w-4" />
                  {userexists.email}
                </p>
              )}
              {userexists.birthdate && (
                <div className="flex items-center space-x-2 mt-2">
                  <Cake className="w-4 h-4" />
                  <span>
                    Birthdate:{" "}
                    {new Date(userexists.birthdate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full p-6 flex flex-col items-start rounded-lg border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPinIcon className="mr-2 h-5 w-5" />
                Location
              </h3>
              <div className="w-full space-y-4">
                {userexists.currentLocation && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Current City
                    </span>
                    <span>{userexists.currentLocation}</span>
                  </div>
                )}
                {userexists.hometown && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Hometown
                    </span>
                    <span>{userexists.hometown}</span>
                  </div>
                )}
                {userexists.contactDetails?.address && (
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-600 dark:text-slate-400">
                      Address
                    </span>
                    <span className="text-right">
                      {userexists.contactDetails.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            {true && (
              <div className="w-full p-6 flex flex-col items-start rounded-lg border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <PanelsRightBottom className="mr-2 h-5 w-5" />
                  Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Gallery Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {userexists.skills && userexists.skills.length > 0 && (
              <div className="w-full p-6 flex flex-col items-start rounded-lg border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mb-6">
                <h3 className="text-xl font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userexists.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 px-2 py-1 rounded-md font-mono text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {userexists.interests && userexists.interests.length > 0 && (
              <div className="w-full p-6 flex flex-col items-start rounded-lg border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mb-6">
                <h3 className="text-xl font-semibold mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {userexists.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded-md font-mono text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {userexists.hobbies && userexists.hobbies.length > 0 && (
              <div className="w-full p-6 flex flex-col items-start rounded-lg border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mb-6">
                <h3 className="text-xl font-semibold mb-4">Hobbies</h3>
                <div className="flex flex-wrap gap-2">
                  {userexists.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 px-2 py-1 rounded-md font-mono text-sm"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Button asChild className="w-full p-2 mt-6">
          <Link
            href={`/${userexists.username}/share`}
            className="flex gap-2 justify-center"
          >
            <QrCode className="h-6 w-6" />
            <span>Share your profile</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MyProfile;
