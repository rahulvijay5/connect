import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConnectButton from "@/components/ConnectUsersButton";
import {
  MapPin,
  Mail,
  Phone,
  Cake,
  Heart,
  Briefcase,
  Link as LinkIcon,
  ChevronLeft,
} from "lucide-react";
import {
  searchUserByExternalId,
  searchUserByUsername,
} from "@/actions/users/searchUsers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SharePrompt from "@/components/SharePrompt";
import BackButton from "@/components/BackButton";
import { getConnectionLevel } from "@/actions/users/getUserConnections";

export default async function UserProfilePage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: { share?: string };
}) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const visitingUserIsAuthenticated = await isAuthenticated();
  const profile = await searchUserByUsername(params.username);
  const userexists = user ? await searchUserByExternalId(user.id) : null;

  if (!profile) {
    notFound();
  }

  const connectionLevel =
    userexists && profile
      ? await getConnectionLevel(userexists.id, profile.id)
      : null;

  const isOwnProfile = userexists?.id === profile.id;
  const isShared = searchParams.share === "true";

  if (isShared && !visitingUserIsAuthenticated) {
    setTimeout(() => {
      redirect("/api/auth/login");
    }, 5000);
  }

  const renderProfileInfo = () => {
    const knownInfo = (
      <>
        <div className="flex items-center space-x-2 mt-2">
          <Briefcase className="w-4 h-4" />
          <span>{profile.profession}</span>
        </div>
        {/* {profile.socialLinks && (
          <div className="flex items-center space-x-2 mt-2">
            <LinkIcon className="w-4 h-4" />
            <Link
              href={profile.socialLinks}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Social Profile
            </Link>
          </div>
        )} */}
        <div className="mt-4">
          <Badge>{profile.connectionsFrom.length} Connections</Badge>
          <Badge className="ml-2">
            {profile.connectionsTo.length} Connected To
          </Badge>
        </div>
        {profile.bio && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {profile.bio}
          </p>
        )}
      </>
    );

    if (visitingUserIsAuthenticated) {
      const closerInfo = connectionLevel === "closer" && (
        <>
          <div className="flex items-center space-x-2 mt-2">
            <Mail className="w-4 h-4" />
            <span>{profile.email}</span>
          </div>
          {profile.interests && (
            <div className="mt-2">
              <h4 className="font-semibold">Interests:</h4>
              <p>{profile.interests}</p>
            </div>
          )}
          {profile.hobbies && (
            <div className="mt-2">
              <h4 className="font-semibold">Hobbies:</h4>
              <p>{profile.hobbies}</p>
            </div>
          )}
          {profile.currentLocation && (
            <div className="flex items-center space-x-2 mt-2">
              <MapPin className="w-4 h-4" />
              <span>{profile.currentLocation}</span>
            </div>
          )}
        </>
      );

      const closestInfo = connectionLevel === "closest" && (
        <>
          <div className="flex items-center space-x-2 mt-2">
            <Phone className="w-4 h-4" />
            <span>{profile.contactDetails?.phone}</span>
          </div>
          {profile.hometown && (
            <div className="flex items-center space-x-2 mt-2">
              <Heart className="w-4 h-4" />
              <span>Hometown: {profile.hometown}</span>
            </div>
          )}
          {profile.currentLocation && (
            <div className="flex items-center space-x-2 mt-2">
              <MapPin className="w-4 h-4" />
              <span>Current Location: {profile.currentLocation}</span>
            </div>
          )}
          {profile.birthdate && (
            <div className="flex items-center space-x-2 mt-2">
              <Cake className="w-4 h-4" />
              <span>
                Birthdate: {new Date(profile.birthdate).toLocaleDateString()}
              </span>
            </div>
          )}
        </>
      );

      return (
        <>
          {knownInfo}
          {closerInfo}
          {closestInfo}
        </>
      );
    }

    return knownInfo;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <BackButton showtext={true} />
        <Card className="mt-4">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={profile.profilePicture || ""}
                alt={profile.given_name || ""}
              />
              <AvatarFallback>
                {profile.given_name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4 text-2xl font-bold">{`${profile.given_name} ${profile.family_name}`}</CardTitle>
            <p className="text-gray-500 dark:text-gray-400">
              @{profile.username}
            </p>
            {connectionLevel && (
              <Badge className="mt-2" variant="outline">
                {connectionLevel}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {renderProfileInfo()}
            {isShared && <SharePrompt username={params.username} />}
            <div className="mt-6 flex flex-col space-y-4">
              {visitingUserIsAuthenticated ? (
                <>
                  {!isOwnProfile && (
                    <ConnectButton
                      initialConnectionStatus={!!connectionLevel}
                      toUserId={profile.id}
                    />
                  )}
                  {isOwnProfile && (
                    <Link href={`/${profile.username}/share`} passHref>
                      <Button className="w-full">Share Profile</Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full">
                    <LogoutLink>Log out</LogoutLink>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full">
                    <LoginLink>Log in</LoginLink>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <RegisterLink>Get Started</RegisterLink>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
