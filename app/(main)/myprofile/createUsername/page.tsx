import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import UsernameInputForm from "../_components/UsernameInput";
import { redirect } from "next/navigation";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user?.id);
  if (user && user.id) {
    const userexists = await searchUserByExternalId(user.id);
    console.log(userexists);
    if (userexists) {
      redirect("/connections");
    }
  } else {
    redirect("/api/auth/signin");
  }

  return (
    <div className="mfc">
      <UsernameInputForm />
    </div>
  );
};

export default page;
