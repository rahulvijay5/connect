"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ConnectButton from "@/components/ConnectUsersButton";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Request {
  id: string;
  fromUser: {
    id: string;
    given_name: string;
    username: string;
    email: string;
  };
  level: "known" | "closer" | "closest";
}

interface Props {
  userId: string;
}

const PendingRequests: React.FC<Props> = ({ userId }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<string[]>([]);
  const [searching, setSearching] = useState<Boolean>(false);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setSearching(true);
      try {
        const response = await axios.get(`/api/user/${userId}/pendingrequests`);
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        toast.error("Failed to fetch pending requests");
      } finally {
        setSearching(false);
      }
    };

    fetchPendingRequests();
  }, [userId]);

  const handleRequest = async (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    try {
      await axios.post(`/api/user/handlerequest`, { requestId, action });
      if (action === "accept") {
        setAcceptedRequests((prev) => [...prev, requestId]);
      } else {
        setRequests(requests.filter((request) => request.id !== requestId));
      }
      toast.success(`Request ${action}ed successfully`);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Failed to ${action} request`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold my-4">Pending Requests</h2>
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
        <ul className="space-y-4">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded shadow-sm"
            >
              <Link href={`/${request.fromUser.username}`}>
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium">
                    {request.fromUser.given_name} ({request.fromUser.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    Level: {request.level}
                  </p>
                </div>
              </Link>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {acceptedRequests.includes(request.id) ? (
                  <ConnectButton
                    initialConnectionStatus={true}
                    toUserId={request.fromUser.id}
                  />
                ) : (
                  <>
                    <Button
                      onClick={() => handleRequest(request.id, "accept")}
                      variant="default"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRequest(request.id, "reject")}
                      variant="secondary"
                      className="hover:bg-red-500 hover:text-white"
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingRequests;
