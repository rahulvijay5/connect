import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConnectButton from "@/components/ConnectUsersButton";
import { MapPin, Mail, Phone, Cake, Heart, Briefcase, Link as LinkIcon } from "lucide-react";
import { searchUserByExternalId, searchUserByUsername } from "@/actions/users/searchUsers";
import Link from "next/link";

// async function getUserProfile(username: string) {
//   return await db.user.findUnique({
//     where: { username },
//     include: {
//       connectionsFrom: true,
//       connectionsTo: true,
//     },
//   });
// }

async function getConnectionLevel(currentUserId: string, profileUserId: string) {
  const connection = await db.connection.findFirst({
    where: {
      OR: [
        { userId: currentUserId, connectedUserId: profileUserId },
        // { fromUserId: profileUserId, toUserId: currentUserId },
      ],
    },
  });

  return connection?.level || null;
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userexists = await searchUserByExternalId(user?.id!)

  const profile = await searchUserByUsername(params.username);

  if (!profile) {
    notFound();
  }

  const connectionLevel = userexists
    ? await getConnectionLevel(userexists?.id, profile.id)
    : null;

  const isAuthenticated = !!userexists;
  const isOwnProfile = userexists?.id === profile.id;

  const renderProfileInfo = () => {
    const knownInfo = (
      <>
        <div className="flex items-center space-x-2 mt-2">
          <Briefcase className="w-4 h-4" />
          <span>{profile.profession}</span>
        </div>
        {profile.socialLinks && (
          <div className="flex items-center space-x-2 mt-2">
            <LinkIcon className="w-4 h-4" />
            <Link href={"www.instagram.com"} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Social Profile
            </Link>
          </div>
        )}
        <div className="mt-4">
          <Badge>{profile.connectionsFrom.length} Connections</Badge>
          <Badge className="ml-2">{profile.connectionsTo.length} Connected To</Badge>
        </div>
        {profile.bio && (
          <p className="mt-4 text-sm text-gray-600">{profile.bio}</p>
        )}
      </>
    );

    const closerInfo = connectionLevel === 'closer' && (
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

    const closestInfo = connectionLevel === 'closest' && (
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
            <span>Birthdate: {new Date(profile.birthdate).toLocaleDateString()}</span>
          </div>
        )}
        {/* {profile.likes && (
          <div className="mt-2">
            <h4 className="font-semibold">Likes:</h4>
            <p>{profile.likes}</p>
          </div>
        )}
        {profile.dislikes && (
          <div className="mt-2">
            <h4 className="font-semibold">Dislikes:</h4>
            <p>{profile.dislikes}</p>
          </div>
        )} */}
      </>
    );

    return (
      <>
        {knownInfo}
        {closerInfo}
        {closestInfo}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.profilePicture || ''} alt={profile.given_name || ''} />
            <AvatarFallback>{profile.given_name?.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-2xl font-bold">{`${profile.given_name} ${profile.family_name}`}</CardTitle>
          <p className="text-gray-500">@{profile.username}</p>
          <p className=" text-sky-500 text-lg">{connectionLevel}</p>
        </CardHeader>
        <CardContent>
          {renderProfileInfo()}
          {isAuthenticated && !isOwnProfile && (
            <div className="mt-6">
              {connectionLevel ? < ConnectButton initialConnectionStatus={true} toUserId={profile.id} /> : < ConnectButton toUserId={profile.id} />}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}