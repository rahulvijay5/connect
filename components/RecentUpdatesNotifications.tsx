"use client";

import { useState, useEffect, useCallback } from "react";
import { toast, Toaster } from "sonner";
import { getRecentUpdates, markUpdateAsViewed } from "@/actions/updates/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ChevronRightIcon, X } from "lucide-react";
import { Level } from "@prisma/client";
import { SwipeableHandlers, useSwipeable } from "react-swipeable";
import { useRouter } from "next/navigation";

type LinkPreview = {
  url: string;
  title: string;
  description: string;
  image: string | null;
};

type EnrichedUpdate = {
  id: string;
  createdAt: Date;
  content: string;
  level: Level;
  userId: string;
  linkPreviews: LinkPreview[];
  user: {
    given_name: string | null;
    family_name: string | null;
    username: string;
  };
};

export default function RecentUpdatesNotification({
  userId,
}: {
  userId: string;
}) {
  const [updates, setUpdates] = useState<EnrichedUpdate[]>([]);
  const [page, setPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!isMinimized) {
      loadUpdates();
    }
  }, [isMinimized]);

  useEffect(() => {
    if (currentIndex >= updates.length - 1 && !loading) {
      loadMoreUpdates();
    }
  }, [currentIndex, updates, loading]);

  const loadUpdates = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newUpdates = await getRecentUpdates(page);
      if (newUpdates.length === 0) {
        setHasMore(false);
      } else {
        setUpdates((prevUpdates) => [...prevUpdates, ...newUpdates]);
        setPage((prevPage) => prevPage + 1);
        if (updates.length === 0 && newUpdates.length > 0) {
          showUpdateToast(newUpdates[0]);
        }
      }
    } catch (error) {
      console.error("Error loading updates:", error);
    }
    setLoading(false);
  };

  const loadMoreUpdates = async () => {
    setLoading(true);
    try {
      const newUpdates = await getRecentUpdates(page + 1);
      setUpdates([...updates, ...newUpdates]);
      setPage(page + 1);
    } catch (error) {
      console.error("Error loading more updates:", error);
    }
    setLoading(false);
  };

  const showUpdateToast = useCallback(
    async (update: EnrichedUpdate) => {
      if (isMinimized) return;

      const handleViewUpdate = async () => {
        await markUpdateAsViewed(userId, update.id);
        // router.push(`/updates/${update.user.username}`);
      };

      toast.custom(
        (t) => (
          <div>
            <Card onClick={handleViewUpdate}>
              <CardHeader>
                <CardTitle className="text-sm text-gray-500 flex justify-between items-center">
                  <span>
                    {update.user.given_name} {update.user.family_name}
                  </span>
                  {/* <Badge>{update.level}</Badge> */}
                  <div className="flex-center">
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(update.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMinimized(true);
                        toast.dismiss(t);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-5">{update.content}</p>
              </CardContent>
            </Card>
          </div>
        ),
        {
          id: update.id,
          duration: Infinity,
          onDismiss: () => handleNextUpdate(),
        }
      );
    },
    [isMinimized, router, userId]
  );

  const handleNextUpdate = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < updates.length) {
      setCurrentIndex(nextIndex);
      showUpdateToast(updates[nextIndex]);
    } else if (hasMore) {
      loadUpdates();
    }
  };

  return (
    <>
      <Toaster />
      <div className="fixed bottom-4 right-4 z-50">
        {isMinimized ? (
          <Button onClick={() => setIsMinimized(false)}>Show Updates</Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextUpdate}
            disabled={!hasMore && currentIndex >= updates.length - 1}
          >
            {!hasMore && currentIndex >= updates.length - 1
              ? "No more updates"
              : "Next Update"}
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
}
