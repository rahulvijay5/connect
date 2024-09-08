import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import UsernameInputForm from "../_components/UsernameInput";
import { redirect } from "next/navigation";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userexists = await searchUserByExternalId(user?.id!);

  if (userexists) {
    redirect("/connections");
  } else {
    return (
      <div className="mfc">
        <UsernameInputForm />
      </div>
    );
  }
};

export default page;
