import { searchUserByUsername } from "@/actions/users/searchUsers";
import React from "react";

// Points to add:
// If user watching this profile is authenticated, then show him the details according to the connection level.
// If user is not authenticated then show him a very little sneek peak to the profile, and urge them to login and view complete page of the app.  

const page = async ({ params: { username } }: { params: { username: string } }) => {
  console.log(username);
  const user = await searchUserByUsername(username)
  return <div className="mfc">
    {user?.given_name}
  </div>;
};

export default page;
