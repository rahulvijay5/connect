// File: app/myprofile/page.tsx
import React from "react";
import Image from "next/image";
import {
  LogoutLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PencilIcon,
  PhoneIcon,
  MapPinIcon,
  Cake,
  Mail,
  LucideChevronsRight,
  LucideGitCompare,
  QrCode,
  EllipsisVertical,
  PanelsRightBottom,
} from "lucide-react";
import { TopRightIcon } from "@/components/icons/page";
import { ModeToggle } from "@/components/ModeToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import SocialLinks from "@/components/SocialLinks";
import UserActionDropdown from "@/app/(main)/myprofile/_components/UserActionDropdown";

const myprofile = async () => {
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

  const images = [
    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <div className="min-h-screen w-full pb-8">
      {/* <Image
        src="https://source.unsplash.com/random/?abstract"
        height={800}
        width={2500}
        className="h-40 w-full -mt-10 object-cover rounded-b-full"
        alt="banner Image"
      /> */}
      <div className="h-[30vh] relative w-full">
        <div className="absolute top-4 p-2 left-0 w-full flex items-center justify-between gap-4 z-20">
          <div className="flex gap-2 items-center">
            <BackButton showtext={false} />
            {userexists.username && (
              <p className="text-muted-foreground text-lg">
                @{userexists.username}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/${userexists.username}/share`}>
              <QrCode className="h-6 w-6" />{" "}
            </Link>
            <UserActionDropdown username={userexists.username} />
          </div>
        </div>
        <div className="">
          <BackgroundBeams />
        </div>
      </div>
      <div className="px-4 md:px-20 sm:px-12 z-10">
        <div className="w-full p-1 flex flex-col items-center  border-b-2 bg-gradient-to-b from-inherit  to-slate-900 border-slate-800 mt-2 mb-4 py-6">
          <div className="w-full flex-center">
            {userexists.profilePicture && (
              <ProfileImageUploader
                initialImageUrl={userexists.profilePicture}
                userName={userexists.given_name || userexists.username}
                userId={userexists.id}
              />
            )}
          </div>
          {userexists.given_name && userexists.family_name && (
            <p className="mt-4 text-2xl font-bold">
              {userexists.given_name} {userexists.family_name}
            </p>
          )}
          {userexists.bio && (
            <p className="mt-2 text-gray-600">{userexists.bio}</p>
          )}
          <div className="flex gap-2 items-center w-full px-8 my-4 ">
            <Link href="/updates" className="w-full">
              <Button variant="secondary" className="flex-center w-full gap-1">
                My Updates
                <LucideChevronsRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/connections" className="w-full">
              <Button variant="secondary" className="flex-center w-full gap-1">
                My Connections
                <LucideGitCompare className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <SocialLinks links={socialLinksData} />
        </div>
        <div className="w-full p-1 flex flex-col items-center rounded-lg border-2 bg-slate-900 border-slate-800 mt-2 mb-4 py-6">
          {userexists.contactDetails?.phone && (
            <p className="mt-2 flex items-center">
              <PhoneIcon className="mr-2 h-4 w-4" />
              {userexists.contactDetails.phone}
            </p>
          )}
          {userexists.email && (
            <p className="mt-2 flex items-center text-gray-600">
              <Mail className="mr-2 h-4 w-4" />
              {userexists.email}
            </p>
          )}
          {userexists.birthdate && (
            <div className="flex items-center space-x-2 mt-2">
              <Cake className="w-4 h-4" />
              <span>
                Birthdate: {new Date(userexists.birthdate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        <div className="w-full p-1 flex items-center rounded-lg border-2 bg-slate-900 border-slate-800 mt-2 mb-4">
          <div className="w-full p-2 flex flex-col items-center rounded-lg border-2 bg-slate-950 border-slate-900">
            <p className="text-center text-muted-foreground text-lg">
              Shared Connection
            </p>
            <p className="font-bold text-3xl mt-2 w-full text-center py-2">
              {userexists.connectionsTo.length}
            </p>
          </div>
          <div className="w-full p-2 flex flex-col items-center flex-grow-0 rounded-lg border-2 bg-slate-950 border-slate-900">
            <p className="text-center text-muted-foreground text-lg">
              Connected With
            </p>
            <p className="font-bold text-3xl mt-2 w-full text-center py-2">
              {userexists.connectionsFrom?.length}
            </p>
          </div>
          <div className="w-full p-2 flex flex-col items-center rounded-lg border-2 bg-slate-950 border-slate-900">
            <p className="text-center text-muted-foreground text-lg">
              Total Updates
            </p>
            <p className="font-bold text-3xl mt-2 w-full text-center py-2">
              {userexists.updates?.length}
            </p>
          </div>
        </div>
        <div className="w-full p-2 flex flex-col items-start rounded-lg border-2 bg-slate-900 border-slate-800 mt-2 mb-4">
          <div className="flex items-center text-xl font-semibold capitalize">
            <MapPinIcon className="mr-2 h-4 w-4" />
            Location
          </div>
          <div className="w-full p-2 mt-4 flex flex-col items-center rounded-lg border-2 bg-slate-950 border-slate-900">
            {userexists.currentLocation && (
              <div className="mt-2 flex w-full items-center justify-between">
                <div className="text-muted-foreground">Current City</div>
                {userexists.currentLocation}
              </div>
            )}
            {userexists.hometown && (
              <div className="mt-2 flex w-full items-center justify-between">
                <div className="text-muted-foreground">Hometown City</div>
                {userexists.hometown}
              </div>
            )}
            {userexists.contactDetails?.address && (
              <div className="mt-2 flex w-full items-center justify-between">
                <div className="text-muted-foreground">Complete Address</div>{" "}
                <div className="text-end">
                  {userexists.contactDetails.address}
                </div>
              </div>
            )}
          </div>
        </div>

        {userexists.images && userexists.images.length > 0 && (
          <div className="w-full p-2 flex flex-col items-start rounded-lg border-2 bg-slate-900 border-slate-800 mt-2 mb-4">
            <div className="flex items-center text-xl font-semibold capitalize">
              <PanelsRightBottom className="mr-2 h-4 w-4" />
              Gallery
            </div>
            <div className="flex gap-2 mt-2 w-full px-2 py-4 overflow-x-scroll items-center rounded-lg border-2 bg-slate-950 border-slate-900">
              {/* {images.map((image, index) => ( */}
              {userexists.images.map((image, index) => (
                <Image
                  src={image}
                  alt={`Gallery Image ${index + 1}`}
                  height={100}
                  width={100}
                  className="w-24 h-24 object-cover rounded-lg "
                />
              ))}
            </div>
          </div>
        )}
        {userexists.skills && userexists.skills.length > 0 && (
          <div className="w-full p-2 flex flex-col items-start rounded-lg border-2 bg-slate-900 border-slate-800 mt-2 mb-4">
            <p className="font-semibold">Skills:</p>
            <div className="flex flex-wrap gap-2 mt-2 w-full px-2 py-4 items-center rounded-lg border-2 bg-slate-950 border-slate-900">
              {userexists.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md font-mono text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {userexists.interests && userexists.interests.length > 0 && (
          <div className="w-full p-2 flex flex-col items-start rounded-lg border-2 bg-slate-900 border-slate-800 mt-2 mb-4">
            <p className="font-semibold">Interests:</p>
            <div className="flex flex-wrap gap-2 mt-2 w-full px-2 py-4 items-center rounded-lg border-2 bg-slate-950 border-slate-900">
              {userexists.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-mono text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
        {userexists.hobbies && userexists.hobbies.length > 0 && (
          <div className="w-full p-2 flex flex-col items-start rounded-lg border-2 bg-slate-900 border-slate-800 mt-2 mb-4">
            <p className="font-semibold">Hobbies:</p>
            <div className="flex flex-wrap gap-2 mt-2 w-full px-2 py-4 items-center rounded-lg border-2 bg-slate-950 border-slate-900">
              {userexists.hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md font-mono text-sm"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
        <Button asChild className="w-full p-2">
          <Link href={`/${userexists.username}/share`} className="flex gap-2">
            <QrCode className="h-6 w-6" />
            <span>Share your profile</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default myprofile;
