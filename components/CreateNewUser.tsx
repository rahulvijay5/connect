"use client";

import createUser from "@/actions/users/createUser";
import React from "react";
import { Button } from "./ui/button";

const CreateNewUser = () => {
  return (
    <>
      <button
        onClick={async () => {
          await fetch("/api/createnewuser/user", {
            body: JSON.stringify({
              email: "ishan@gmail.com",
              name:"ishan",
              birthdate:new Date("1990-05-15"),
              username:"gujju",
              currentLocation:"gujarati",
              hometown:"gujarati",
              profession:"gujarati",
              bio:"gujarati",
              contactDetails:{
                phone:"gujarati",
                address:"gujarati",
              },
              socialLinks:{
                facebook:"gujarati",
                Instagram:"gujarati",
              },
              interests:["india","china","boss",],
              hobbies:["india","china","boss",],
              images:["india","china","boss",],
            }),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create new User
      </button>
    </>
  );
};

export default CreateNewUser;
