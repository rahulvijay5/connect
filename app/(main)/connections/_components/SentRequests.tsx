"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, X } from "lucide-react";

interface Request {
  id: string;
  toUser: {
    given_name: string;
    email: string;
    username: string;
    profilePicture: string;
  };
  level: "known" | "closer" | "closest";
  status: "Pending" | "Accepted" | "Rejected";
}

interface Props {
  userId: string;
}

const SentRequests: React.FC<Props> = ({ userId }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [searching, setSearching] = useState<Boolean>(false);

  useEffect(() => {
    const fetchSentRequests = async () => {
      setSearching(true); // Start searching
      try {
        const response = await axios.get(`/api/user/${userId}/sentrequests`);
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching sent requests:", error);
      } finally {
        setSearching(false); // Stop searching
      }
    };

    fetchSentRequests();
  }, [userId]);

  const cancelRequest = async (requestId: string) => {
    try {
      await axios.delete(`/api/user/cancelrequest/${requestId}`);
      setRequests(requests.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-semibold my-4">Sent Requests</h2>
      {searching ? (
        <p className="flex gap-4 items-center">
          <span>
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
          Searching if any request exists...
        </p>
      ) : requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((request) => (
              <>
                <li
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded w-full h-full"
                >
                  <Link
                    href={`/${request.toUser.username}`}
                    className="flex gap-2 w-full"
                  >
                    <div className="h-full flex items-center justify-center">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src={request.toUser.profilePicture || ""}
                          alt={request.toUser.given_name || ""}
                          className="w-full h-full"
                        />
                        <AvatarFallback>
                          {request.toUser.given_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex md:flex-col gap-2 w-full h-full flex-between">
                      {/* <p className="text-sm text-gray-500">
                Username: {request.toUser.username}
              </p> */}

                      <div className="w-full h-full">
                        <p className="font-semibold">
                          @{request.toUser.username}
                        </p>
                        <p>{request.toUser.given_name}</p>
                        <div className="md:flex md:gap-4">
                          <p className="text-sm text-gray-500">
                            Level: {request.level}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {request.status}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => cancelRequest(request.id)}
                        variant="secondary"
                        className="text-red-500 hidden w-fit md:block"
                      >
                        Cancel Request
                      </Button>
                      <Button
                        onClick={() => cancelRequest(request.id)}
                        variant="secondary"
                        size={"icon"}
                        className="text-red-500 md:hidden"
                      >
                        <X />
                      </Button>
                    </div>
                  </Link>
                </li>
              </>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SentRequests;
