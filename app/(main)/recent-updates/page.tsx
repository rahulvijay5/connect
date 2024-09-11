// app/recent-updates/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getRecentUpdates } from "@/actions/updates/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Level } from "@prisma/client";
import Link from "next/link";

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

export default function RecentUpdatesPage() {
  const [updates, setUpdates] = useState<EnrichedUpdate[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastUpdateElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    loadUpdates();
  }, [page]);

  const loadUpdates = async () => {
    setLoading(true);
    try {
      const newUpdates = await getRecentUpdates(page);
      setUpdates((prevUpdates) => [...prevUpdates, ...newUpdates]);
      setHasMore(newUpdates.length > 0);
    } catch (error) {
      console.error("Error loading updates:", error);
    }
    setLoading(false);
  };

  const renderLinkPreviews = (linkPreviews: LinkPreview[]) => {
    return linkPreviews.map((preview, index) => (
      <Link
        key={index}
        href={preview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-2 p-2 border rounded"
      >
        {preview.image && (
          <img
            src={preview.image}
            alt={preview.title}
            className="w-full h-32 object-cover mb-2"
          />
        )}
        <h3 className="font-semibold">{preview.title}</h3>
        <p className="text-sm text-gray-600">{preview.description}</p>
      </Link>
    ));
  };

  return (
    <div className="container mx-auto md:mx-0 max-w-4xl p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Recent Updates</h1>
      <div className="space-y-4">
        {updates.map((update, index) => (
          <Card
            key={update.id}
            ref={index === updates.length - 1 ? lastUpdateElementRef : null}
          >
            <CardHeader>
              <CardTitle className="text-sm text-gray-500 flex justify-between items-center">
                <Link href={`/profile/${update.user.username}`}>
                  <span>
                    {update.user.given_name} {update.user.family_name}
                  </span>
                </Link>
                <Badge>{update.level}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{update.content}</p>
              {renderLinkPreviews(update.linkPreviews)}
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(update.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </CardContent>
          </Card>
        ))}
        <div className="text-center pt-16 text-gray-600 text-muted-foreground">
          {loading && <p>Loading more updates...</p>}
          {!hasMore && <p>No more updates to load.</p>}
        </div>
      </div>
    </div>
  );
}
