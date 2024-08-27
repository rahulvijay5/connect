"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import ConnectUsersButton from "@/components/ConnectUsersButton";

interface User {
  id: string;
  email: string;
  given_name: string;
  username: string;
  profilePicture: string;
  // Add other properties as needed
}

interface Props {
  currentUserID: string;
}

const SearchUsers: React.FC<Props> = ({ currentUserID }) => {
  const [query, setQuery] = useState("");
  const [searched, setsearched] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.post("/api/user/searchusers", { query });
      setSearchResults(response.data);
      setsearched(true);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
      setQuery("");
    }
  };

  return (
    <div className="">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search users by email, name, or username"
          className="p-4 rounded-md"
          value={query}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
        />
        <Button className="p-4 rounded-md" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <div className="p-2 ">
        {searched && searchResults.length == 0 && (
          <div className="my-4 font-light text-yellow-200/90 text-center max-w-sm">
            <span className="font-semibold">Uhh ohh!</span> Seems like you are
            an introvert, don't worry make some new friends first. It's easy.
          </div>
        )}
        {searchResults.map((user) => (
          <div key={user.id} className="border-b-2 pb-2 mb-1 flex-btw gap-2 ">
            <Image
              src={`${user.profilePicture}`}
              alt="profile"
              height={40}
              width={40}
              className="rounded-full"
            />
            <div>
              <p>Email: {user.email}</p>
              <p>Name: {user.given_name}</p>
              <p>Id: {user.id}</p>
            </div>

            <Link href={`/${user.username}`}>
              <Button variant="link" className="hover:text-sky-500">
                View
              </Button>
            </Link>
            <ConnectUsersButton id1={currentUserID} id2={user.id}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;
