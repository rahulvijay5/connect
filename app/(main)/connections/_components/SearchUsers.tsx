"use client"

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast, useToast } from '@/components/ui/use-toast';
import { Level } from '@prisma/client';
import ConnectButton from '@/components/ConnectUsersButton';

interface User {
  id: string;
  email: string;
  given_name: string;
  username: string;
  profilePicture: string;
}

interface Props {
  currentUserID: string;
}

const SearchUsers: React.FC<Props> = ({ currentUserID }) => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const toast = useToast()

  const handleSearch = async () => {
    try {
      const response = await axios.post("/api/user/searchusers", { query });
      setSearchResults(response.data);
      setSearched(true);
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

  const [connectionLevel, setConnectionLevel] = useState<'known' | 'closer' | 'closest'>('known');
  const handleConnect = async (userId: string) => {
    try {
      console.log("From User Id: ", currentUserID, "To user Id: ", userId, "with connection level: ", connectionLevel)
      const res = await axios.post("/api/user/connectusers", {
        fromUserId: currentUserID,
        toUserId: userId,
        level: connectionLevel
      });
      console.log(res)
      // You might want to update the UI to reflect the sent request
      alert("Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
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
            <ConnectButton toUserId={user.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;