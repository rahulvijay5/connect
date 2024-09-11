// import {
//   getKindeServerSession,
//   LoginLink,
//   LogoutLink,
//   RegisterLink,
// } from "@kinde-oss/kinde-auth-nextjs/server";
// import { notFound, redirect } from "next/navigation";
// import { db } from "@/lib/db";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import ConnectButton from "@/components/ConnectUsersButton";
// import {
//   MapPin,
//   Mail,
//   Phone,
//   Cake,
//   Heart,
//   Briefcase,
//   Link as LinkIcon,
//   ChevronLeft,
// } from "lucide-react";
// import {
//   searchUserByExternalId,
//   searchUserByUsername,
// } from "@/actions/users/searchUsers";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import SharePrompt from "@/components/SharePrompt";
// import BackButton from "@/components/BackButton";
// import { getConnectionLevel } from "@/actions/users/getUserConnections";

// export default async function UserProfilePage({
//   params,
//   searchParams,
// }: {
//   params: { username: string };
//   searchParams: { share?: string };
// }) {
//   const { getUser, isAuthenticated } = getKindeServerSession();
//   const user = await getUser();
//   const visitingUserIsAuthenticated = await isAuthenticated();
//   const profile = await searchUserByUsername(params.username);
//   const userexists = user ? await searchUserByExternalId(user.id) : null;

//   if (!profile) {
//     notFound();
//   }

//   const connectionLevel =
//     userexists && profile
//       ? await getConnectionLevel(userexists.id, profile.id)
//       : null;

//   const isOwnProfile = userexists?.id === profile.id;
//   const isShared = searchParams.share === "true";

//   if (isShared && !visitingUserIsAuthenticated) {
//     setTimeout(() => {
//       redirect("/api/auth/login");
//     }, 5000);
//   }

//   const renderProfileInfo = () => {
//     const knownInfo = (
//       <>
//         <div className="flex items-center space-x-2 mt-2">
//           <Briefcase className="w-4 h-4" />
//           <span>{profile.profession}</span>
//         </div>
//         {/* {profile.socialLinks && (
//           <div className="flex items-center space-x-2 mt-2">
//             <LinkIcon className="w-4 h-4" />
//             <Link
//               href={profile.socialLinks}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 hover:underline"
//             >
//               Social Profile
//             </Link>
//           </div>
//         )} */}
//         <div className="mt-4">
//           <Badge>{profile.connectionsFrom.length} Connections</Badge>
//           <Badge className="ml-2">
//             {profile.connectionsTo.length} Connected To
//           </Badge>
//         </div>
//         {profile.bio && (
//           <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
//             {profile.bio}
//           </p>
//         )}
//       </>
//     );

//     if (visitingUserIsAuthenticated) {
//       const closerInfo = connectionLevel === "closer" && (
//         <>
//           <div className="flex items-center space-x-2 mt-2">
//             <Mail className="w-4 h-4" />
//             <span>{profile.email}</span>
//           </div>
//           {profile.interests && (
//             <div className="mt-2">
//               <h4 className="font-semibold">Interests:</h4>
//               <p>{profile.interests}</p>
//             </div>
//           )}
//           {profile.hobbies && (
//             <div className="mt-2">
//               <h4 className="font-semibold">Hobbies:</h4>
//               <p>{profile.hobbies}</p>
//             </div>
//           )}
//           {profile.currentLocation && (
//             <div className="flex items-center space-x-2 mt-2">
//               <MapPin className="w-4 h-4" />
//               <span>{profile.currentLocation}</span>
//             </div>
//           )}
//         </>
//       );

//       const closestInfo = connectionLevel === "closest" && (
//         <>
//           <div className="flex items-center space-x-2 mt-2">
//             <Phone className="w-4 h-4" />
//             <span>{profile.contactDetails?.phone}</span>
//           </div>
//           {profile.hometown && (
//             <div className="flex items-center space-x-2 mt-2">
//               <Heart className="w-4 h-4" />
//               <span>Hometown: {profile.hometown}</span>
//             </div>
//           )}
//           {profile.currentLocation && (
//             <div className="flex items-center space-x-2 mt-2">
//               <MapPin className="w-4 h-4" />
//               <span>Current Location: {profile.currentLocation}</span>
//             </div>
//           )}
//           {profile.birthdate && (
//             <div className="flex items-center space-x-2 mt-2">
//               <Cake className="w-4 h-4" />
//               <span>
//                 Birthdate: {new Date(profile.birthdate).toLocaleDateString()}
//               </span>
//             </div>
//           )}
//         </>
//       );

//       return (
//         <>
//           {knownInfo}
//           {closerInfo}
//           {closestInfo}
//         </>
//       );
//     }

//     return knownInfo;
//   };

//   return (
//     <div className="h-full w-screen md:w-full bg-gray-100 dark:bg-gray-900">
//       <div className="container mx-auto px-4 py-8 max-w-2xl">
//         <BackButton showtext={true} />
//         <Card className="mt-4">
//           <CardHeader className="flex flex-col items-center">
//             <Avatar className="w-24 h-24">
//               <AvatarImage
//                 src={profile.profilePicture || ""}
//                 alt={profile.given_name || ""}
//               />
//               <AvatarFallback>
//                 {profile.given_name?.charAt(0) || "?"}
//               </AvatarFallback>
//             </Avatar>
//             <CardTitle className="mt-4 text-2xl font-bold">{`${profile.given_name} ${profile.family_name}`}</CardTitle>
//             <p className="text-gray-500 dark:text-gray-400">
//               @{profile.username}
//             </p>
//             {connectionLevel && (
//               <Badge className="mt-2" variant="outline">
//                 {connectionLevel}
//               </Badge>
//             )}
//           </CardHeader>
//           <CardContent>
//             {renderProfileInfo()}
//             {isShared && <SharePrompt username={params.username} />}
//             <div className="mt-6 flex flex-col space-y-4">
//               {visitingUserIsAuthenticated ? (
//                 <>
//                   {!isOwnProfile && (
//                     <ConnectButton
//                       initialConnectionStatus={!!connectionLevel}
//                       toUserId={profile.id}
//                     />
//                   )}
//                   {isOwnProfile && (
//                     <Link href={`/${profile.username}/share`} passHref>
//                       <Button className="w-full">Share Profile</Button>
//                     </Link>
//                   )}
//                   {/* <Button variant="outline" className="w-full">
//                     <LogoutLink>Log out</LogoutLink>
//                   </Button> */}
//                 </>
//               ) : (
//                 <>
//                   <Button variant="outline" className="w-full">
//                     <LoginLink>Log in</LoginLink>
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     <RegisterLink>Get Started</RegisterLink>
//                   </Button>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
// -------------------------------------------------------------------------------------------------------------------------------------------------
// app/[username]/page.tsx
// import {
//   getKindeServerSession,
//   LoginLink,
//   LogoutLink,
//   RegisterLink,
// } from "@kinde-oss/kinde-auth-nextjs/server";
// import { notFound, redirect } from "next/navigation";
// import { db } from "@/lib/db";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import ConnectButton from "@/components/ConnectUsersButton";
// import {
//   MapPin,
//   Mail,
//   Phone,
//   Cake,
//   Heart,
//   Briefcase,
//   Link as LinkIcon,
//   ChevronLeft,
//   Users,
//   UserPlus,
// } from "lucide-react";
// import {
//   searchUserByExternalId,
//   searchUserByUsername,
// } from "@/actions/users/searchUsers";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import SharePrompt from "@/components/SharePrompt";
// import BackButton from "@/components/BackButton";
// import { getConnectionLevel } from "@/actions/users/getUserConnections";
// import { getUserUpdatesByLevel } from "@/actions/updates/route";

// export default async function UserProfilePage({
//   params,
//   searchParams,
// }: {
//   params: { username: string };
//   searchParams: { share?: string };
// }) {
//   const { getUser, isAuthenticated } = getKindeServerSession();
//   const user = await getUser();
//   const visitingUserIsAuthenticated = await isAuthenticated();
//   const profile = await searchUserByUsername(params.username);
//   const userexists = user ? await searchUserByExternalId(user.id) : null;

//   if (!profile) {
//     notFound();
//   }

//   const connectionLevel =
//     userexists && profile
//       ? await getConnectionLevel(userexists.id, profile.id)
//       : null;

//   const isOwnProfile = userexists?.id === profile.id;
//   const isShared = searchParams.share === "true";

//   if (isShared && !visitingUserIsAuthenticated) {
//     setTimeout(() => {
//       redirect("/api/auth/login");
//     }, 5000);
//   }

//   const updates =
//     visitingUserIsAuthenticated && connectionLevel
//       ? await getUserUpdatesByLevel(profile.id, connectionLevel)
//       : [];

//   const renderProfileInfo = () => {
//     const publicInfo = (
//       <>
//         {profile.currentLocation && (
//           <div className="flex items-center space-x-2 mt-2">
//             <MapPin className="w-4 h-4" />
//             <span>{profile.currentLocation}</span>
//           </div>
//         )}
//         {profile.bio && (
//           <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
//             {profile.bio}
//           </p>
//         )}
//         <div className="flex items-center space-x-2 mt-2">
//           <Briefcase className="w-4 h-4" />
//           <span>{profile.profession}</span>
//         </div>
//         <div className="mt-4 flex flex-wrap gap-2">
//           {profile.skills.map((skill, index) => (
//             <Badge key={index} variant="secondary">
//               {skill}
//             </Badge>
//           ))}
//         </div>
//         {profile.socialLinks && (
//           <div className="mt-4 space-y-2">
//             {Object.entries(profile.socialLinks).map(([platform, link]) => {
//               if (platform !== "whatsapp" && link) {
//                 return (
//                   <div key={platform} className="flex items-center space-x-2">
//                     <LinkIcon className="w-4 h-4" />
//                     <Link
//                       href={link as string}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 hover:underline"
//                     >
//                       {platform.charAt(0).toUpperCase() + platform.slice(1)}
//                     </Link>
//                   </div>
//                 );
//               }
//             })}
//           </div>
//         )}
//         <div className="mt-4 flex items-center space-x-4">
//           <div className="flex items-center space-x-2">
//             <Users className="w-4 h-4" />
//             <span>{profile.connectionsFrom.length} Connections</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <UserPlus className="w-4 h-4" />
//             <span>{profile.connectionsTo.length} Connected To</span>
//           </div>
//         </div>
//       </>
//     );

//     if (visitingUserIsAuthenticated && connectionLevel) {
//       const knownInfo = connectionLevel === "known" && (
//         <>
//           {publicInfo}
//           <div className="mt-4">
//             <h4 className="font-semibold">Known Updates:</h4>
//             {updates
//               .filter((update) => update.level === "known")
//               .map((update, index) => (
//                 <p key={index} className="mt-2 text-sm">
//                   {update.content}
//                 </p>
//               ))}
//           </div>
//           <div className="mt-4">
//             <h4 className="font-semibold">Images:</h4>
//             <div className="grid grid-cols-3 gap-2 mt-2">
//               {profile.images.map((image, index) => (
//                 <img
//                   key={index}
//                   src={image}
//                   alt={`User image ${index + 1}`}
//                   className="w-full h-24 object-cover rounded"
//                 />
//               ))}
//             </div>
//           </div>
//         </>
//       );

//       const closerInfo = connectionLevel === "closer" && (
//         <>
//           {knownInfo}
//           <div className="flex items-center space-x-2 mt-4">
//             <Mail className="w-4 h-4" />
//             <span>{profile.email}</span>
//           </div>
//           {profile.hometown && (
//             <div className="flex items-center space-x-2 mt-2">
//               <Heart className="w-4 h-4" />
//               <span>Hometown: {profile.hometown}</span>
//             </div>
//           )}
//           {profile.interests && (
//             <div className="mt-4">
//               <h4 className="font-semibold">Interests:</h4>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {profile.interests.map((interest, index) => (
//                   <Badge key={index} variant="outline">
//                     {interest}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div className="mt-4">
//             <h4 className="font-semibold">Closer Updates:</h4>
//             {updates
//               .filter((update) => update.level === "closer")
//               .map((update, index) => (
//                 <p key={index} className="mt-2 text-sm">
//                   {update.content}
//                 </p>
//               ))}
//           </div>
//         </>
//       );

//       const closestInfo = connectionLevel === "closest" && (
//         <>
//           {closerInfo}
//           {profile.contactDetails?.phone && (
//             <div className="flex items-center space-x-2 mt-4">
//               <Phone className="w-4 h-4" />
//               <span>{profile.contactDetails.phone}</span>
//             </div>
//           )}
//           {profile.contactDetails?.address && (
//             <div className="flex items-center space-x-2 mt-2">
//               <MapPin className="w-4 h-4" />
//               <span>Address: {profile.contactDetails.address}</span>
//             </div>
//           )}
//           {profile.birthdate && (
//             <div className="flex items-center space-x-2 mt-2">
//               <Cake className="w-4 h-4" />
//               <span>
//                 Birthdate: {new Date(profile.birthdate).toLocaleDateString()}
//               </span>
//             </div>
//           )}
//           {profile.hobbies && (
//             <div className="mt-4">
//               <h4 className="font-semibold">Hobbies:</h4>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {profile.hobbies.map((hobby, index) => (
//                   <Badge key={index} variant="outline">
//                     {hobby}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div className="mt-4">
//             <h4 className="font-semibold">Closest Updates:</h4>
//             {updates
//               .filter((update) => update.level === "closest")
//               .map((update, index) => (
//                 <p key={index} className="mt-2 text-sm">
//                   {update.content}
//                 </p>
//               ))}
//           </div>
//         </>
//       );

//       return connectionLevel === "closest"
//         ? closestInfo
//         : connectionLevel === "closer"
//         ? closerInfo
//         : knownInfo;
//     }

//     return publicInfo;
//   };

//   return (
//     <div className="w-full bg-gray-100 dark:bg-gray-900">
//       <div className="container w-screen mx-auto px-4 py-8 max-w-2xl">
//         <BackButton showtext={true} />
//         <Card className="mt-4">
//           <CardHeader className="flex flex-col items-center">
//             <Avatar className="w-24 h-24">
//               <AvatarImage
//                 className="object-contain"
//                 src={profile.profilePicture || ""}
//                 alt={profile.given_name || ""}
//               />
//               <AvatarFallback>
//                 {profile.given_name?.charAt(0) || "?"}
//               </AvatarFallback>
//             </Avatar>
//             <CardTitle className="mt-4 text-2xl font-bold">{`${profile.given_name} ${profile.family_name}`}</CardTitle>
//             <p className="text-gray-500 dark:text-gray-400">
//               @{profile.username}
//             </p>
//             {connectionLevel && (
//               <Badge className="mt-2" variant="outline">
//                 {connectionLevel}
//               </Badge>
//             )}
//           </CardHeader>
//           <CardContent>
//             {renderProfileInfo()}
//             {isShared && <SharePrompt username={params.username} />}
//             <div className="mt-6 flex flex-col space-y-4">
//               {visitingUserIsAuthenticated ? (
//                 <>
//                   {!isOwnProfile && (
//                     <ConnectButton
//                       initialConnectionStatus={!!connectionLevel}
//                       toUserId={profile.id}
//                     />
//                   )}
//                   {isOwnProfile && (
//                     <Link href={`/${profile.username}/share`} passHref>
//                       <Button className="w-full">Share Profile</Button>
//                     </Link>
//                   )}
//                   <Button variant="outline" className="w-full">
//                     <LogoutLink>Log out</LogoutLink>
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button variant="outline" className="w-full">
//                     <LoginLink>Log in</LoginLink>
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     <RegisterLink>Get Started</RegisterLink>
//                   </Button>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
// -------------------------------------------------------------------------------------------------------------------------------------------------
// app/[username]/page.tsx
// app/[username]/page.tsx
import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Users,
  UserPlus,
  Image as ImageIcon,
  BookOpen,
  Smile,
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
// import { getUserUpdates } from "@/actions/users/getUserUpdates";
// import UpdatesDisplay from "@/components/UpdatesDisplay";
import { getUserUpdatesByLevel } from "@/actions/updates/route";
import SocialLinks from "@/components/SocialLinks";

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

  const socialLinksData = {
    ...profile.socialLinks,
    customLinks: profile.socialLinks?.customLinks as
      | { platform: string; url: string }[]
      | undefined,
  };

  const isOwnProfile = userexists?.id === profile.id;
  const isShared = searchParams.share === "true";

  if (isShared && !visitingUserIsAuthenticated) {
    redirect("/api/auth/login");
  }

  const updates =
    visitingUserIsAuthenticated && connectionLevel
      ? await getUserUpdatesByLevel(profile.id, connectionLevel)
      : [];

  const renderProfileInfo = () => {
    const publicInfo = (
      <>
        <div className="profile-widget col-span-2 row-span-2">
          <h3 className="text-2xl font-semibold mb-4 text-gradient">
            Basic Info
          </h3>
          {profile.currentLocation && (
            <div className="flex items-center space-x-3 mb-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="text-lg">{profile.currentLocation}</span>
            </div>
          )}
          <div className="flex items-center space-x-3 mb-3">
            <Briefcase className="w-5 h-5 text-green-500" />
            <span className="text-lg">{profile.profession}</span>
          </div>
          {profile.bio && (
            <p className="text-base text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {profile.socialLinks && (
          <div className="profile-widget col-span-1">
            <h3 className="text-2xl font-semibold mb-4 text-gradient">
              Social Links
            </h3>
            {/* <div className="grid grid-cols-2 gap-3">
              {Object.entries(profile.socialLinks).map(([platform, link]) => {
                if (platform !== "whatsapp" && link) {
                  return (
                    <Link
                      key={platform}
                      href={link as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <LinkIcon className="w-5 h-5" />
                      <span className="text-lg capitalize">{platform}</span>
                    </Link>
                  );
                }
              })}
            </div> */}
            <SocialLinks links={socialLinksData} />
          </div>
        )}
        <div className="profile-widget col-span-1">
          {/* <h3 className="text-2xl font-semibold mb-4 text-gradient">
            Connections
          </h3> */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="profile-widget bg-slate-100 w-full items-center flex flex-col">
              <p className="text-center text-sm">Shared</p>
              <p className="font-bold text-xl mt-2">
                {profile.connectionsTo.length}
              </p>
            </div>
            <div className=" profile-widget bg-slate-100 w-full items-center flex flex-col">
              <p className="text-center text-sm">Connected</p>
              <p className="font-bold text-xl mt-2">
                {profile.connectionsFrom?.length}
              </p>
            </div>
          </div>
        </div>
        <div className="profile-widget col-span-2">
          <h3 className="text-2xl font-semibold mb-4 text-gradient">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm py-1 outline rounded-lg px-3"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        {/* <div className="profile-widget col-span-2">
          <h3 className="text-2xl font-semibold mb-4 text-gradient">
            Connections
          </h3>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-500" />
              <span className="text-lg">
                {profile.connectionsFrom.length} Connections
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <UserPlus className="w-6 h-6 text-indigo-500" />
              <span className="text-lg">
                {profile.connectionsTo.length} Connected To
              </span>
            </div>
          </div>
        </div> */}
      </>
    );

    const knownInfo = (
      <>
        {publicInfo}
        {profile.images.length > 0 && (
          <div className="profile-widget col-span-3 row-span-2">
            <h3 className="text-2xl font-semibold mb-4 text-gradient">
              Gallery
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {profile.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`User image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                />
              ))}
            </div>
          </div>
        )}
      </>
    );

    const closerInfo = (
      <>
        {knownInfo}
        <div className="profile-widget col-span-2">
          <h3 className="text-2xl font-semibold mb-4 text-gradient">
            Contact Info
          </h3>
          <div className="flex items-center space-x-3 mb-3">
            <Mail className="w-5 h-5 text-red-500" />
            <span className="text-lg">{profile.email}</span>
          </div>
          {profile.hometown && (
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="text-lg">Hometown: {profile.hometown}</span>
            </div>
          )}
        </div>
        {profile.interests && (
          <div className="col-span-2">
            <h3 className="text-2xl font-semibold mb-4 text-gradient">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm py-1 outline px-3"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </>
    );

    const closestInfo = (
      <>
        {closerInfo}
        <div className="profile-widget col-span-2">
          <h3 className="text-2xl font-semibold mb-4 text-gradient">
            Personal Details
          </h3>
          {profile.contactDetails?.phone && (
            <div className="flex items-center space-x-3 mb-3">
              <Phone className="w-5 h-5 text-green-500" />
              <span className="text-lg">{profile.contactDetails.phone}</span>
            </div>
          )}
          {profile.contactDetails?.address && (
            <div className="flex items-center space-x-3 mb-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="text-lg">
                Address: {profile.contactDetails.address}
              </span>
            </div>
          )}
          {profile.birthdate && (
            <div className="flex items-center space-x-3">
              <Cake className="w-5 h-5 text-yellow-500" />
              <span className="text-lg">
                Birthdate: {new Date(profile.birthdate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        {profile.hobbies && (
          <div className="profile-widget col-span-2">
            <h3 className="text-2xl font-semibold mb-4 text-gradient">
              Hobbies
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm py-1 outline px-3"
                >
                  {hobby}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </>
    );

    if (visitingUserIsAuthenticated && connectionLevel) {
      switch (connectionLevel) {
        case "closest":
          return closestInfo;
        case "closer":
          return closerInfo;
        case "known":
          return knownInfo;
        default:
          return publicInfo;
      }
    }

    return publicInfo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* <BackButton showtext={true} /> */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
              <Avatar className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl">
                <AvatarImage
                  className="object-contain"
                  src={profile.profilePicture || ""}
                  alt={profile.given_name || ""}
                />
                <AvatarFallback>
                  {profile.given_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="text-center sm:text-left md:flex md:flex-row flex-col gap-4 w-full h-full">
                <div className="w-full">
                  <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-gradient">{`${profile.given_name} ${profile.family_name}`}</h1>
                  <p className="text-2xl text-gray-500 dark:text-gray-400 mb-4">
                    @{profile.username}
                  </p>
                  {connectionLevel && (
                    <Badge
                      className="text-lg py-1 rounded-lg"
                      variant="outline"
                    >
                      {connectionLevel}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:mt-0 mt-8">
                  {isShared && <SharePrompt username={params.username} />}
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
                          <Button className="w-full text-lg">
                            Share Profile
                          </Button>
                        </Link>
                      )}
                      {/* <Button variant="outline" className="w-full text-lg">
                        <LogoutLink>Log out</LogoutLink>
                      </Button> */}
                    </>
                  ) : (
                    <>
                      {/* <Button variant="default" className="w-full text-lg">
                        <LoginLink>Log in</LoginLink>
                      </Button> */}
                      <Button
                        variant="default"
                        asChild
                        className="w-full h-full flex flex-col py-2 gap-0"
                      >
                        <RegisterLink>
                          Connect With <div>@{profile.username}</div>
                        </RegisterLink>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {renderProfileInfo()}
            </div>
          </div>
        </div>
        {/* {visitingUserIsAuthenticated && connectionLevel && updates.length > 0 && (
          <UpdatesDisplay updates={updates} />
        )} */}
      </div>
    </div>
  );
}
