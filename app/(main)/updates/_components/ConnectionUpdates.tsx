// "use client";

// import { useState, useEffect } from "react";
// import { getConnectionUpdates } from "@/actions/updates/route";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { formatDistanceToNow } from "date-fns";
// import { useInView } from "react-intersection-observer";
// import { Level, Update } from "@prisma/client";
// import LinkPreview from "@/components/LinkPreview";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import Link from "next/link";

// type LinkPreview = {
//   url: string;
//   title: string;
//   description: string;
//   image: string | null;
// };

// type EnrichedUpdate = Update & {
//   linkPreviews: LinkPreview[];
//   user: {
//     given_name: string | null;
//     family_name: string | null;
//   };
// };

// type Connection = {
//   id: string;
//   userId: string;
//   level: Level;
//   user: {
//     given_name: string | null;
//     family_name: string | null;
//     username: string | null;
//     profilePicture: string | null;
//   };
// };

// type ConnectionUpdatesProps = {
//   connections: Connection[];
// };

// export default function ConnectionUpdates({
//   connections,
// }: ConnectionUpdatesProps) {
//   const [updates, setUpdates] = useState<Record<string, EnrichedUpdate[]>>({});
//   const [page, setPage] = useState<Record<string, number>>({});
//   const [ref, inView] = useInView();

//   useEffect(() => {
//     if (inView) {
//       loadMoreUpdates();
//     }
//   }, [inView]);

//   const loadMoreUpdates = async () => {
//     for (const connection of connections) {
//       const newUpdates = await getConnectionUpdates(
//         connection.userId,
//         connection.level,
//         page[connection.userId] || 1
//       );
//       setUpdates((prev) => ({
//         ...prev,
//         [connection.userId]: [
//           ...(prev[connection.userId] || []),
//           ...newUpdates,
//         ],
//       }));
//       setPage((prev) => ({
//         ...prev,
//         [connection.userId]: (prev[connection.userId] || 1) + 1,
//       }));
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {connections.map((connection) => (
//         <div key={connection.id} className="mb-6">
//           <div className="space-y-4">
//             {updates[connection.userId]?.map((update) => (
//               <div>
//                 <Card key={update.id} className="">
//                   <CardHeader className="px-4 py-2">
//                     <CardTitle className="text-sm text-gray-500 flex items-center justify-between">
//                       <Link
//                         href={`/${connection.user.username!}`}
//                         className="flex items-center gap-2 hover:underline"
//                       >
//                         <Avatar className="w-8 h-8 border shadow-lg">
//                           <AvatarImage
//                             src={connection.user.profilePicture || ""}
//                             className="object-contain"
//                             alt={connection.user.username!}
//                           />
//                           <AvatarFallback>
//                             {connection.user.username![0] || "?"}
//                           </AvatarFallback>
//                         </Avatar>
//                         <h3 className="text-sm font-semibold text-muted-foreground text-black dark:text-white ">
//                           {connection.user.username}
//                         </h3>
//                       </Link>
//                       <span className="font-light">
//                         {formatDistanceToNow(new Date(update.createdAt), {
//                           addSuffix: true,
//                         })}
//                       </span>
//                       {/* <Badge>{update.level}</Badge> */}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent
//                     className="
//                     overflow-x-scroll
//                     md:overflow-x-hidden
//                    mt-4"
//                   >
//                     <p>{renderContentWithLinks(update.content)}</p>
//                     {update.linkPreviews.map((preview, index) => (
//                       <LinkPreview key={index} preview={preview} />
//                     ))}
//                   </CardContent>
//                 </Card>
//                 <div className="border h-0.5 bg-gray-300 my-4" />
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//       <div ref={ref}>{inView && <p>Loading more...</p>}</div>
//     </div>
//   );
// }

// function renderContentWithLinks(content: string) {
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   const parts = content.split(urlRegex);
//   return parts.map((part, index) =>
//     urlRegex.test(part) ? (
//       <Link
//         key={index}
//         href={part}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-500 hover:underline"
//       >
//         {part}
//       </Link>
//     ) : (
//       part
//     )
//   );
// }
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { getConnectionUpdates } from "@/actions/updates/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Level, Update } from "@prisma/client";
import LinkPreview from "@/components/LinkPreview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type LinkPreview = {
  url: string;
  title: string;
  description: string;
  image: string | null;
};

type EnrichedUpdate = Update & {
  linkPreviews: LinkPreview[];
  user: {
    given_name: string | null;
    family_name: string | null;
    username: string;
    profilePicture: string | null;
  };
};

type Connection = {
  id: string;
  userId: string;
  level: Level;
  user: {
    given_name: string | null;
    family_name: string | null;
    username: string;
    profilePicture: string | null;
  };
};

type ConnectionUpdatesProps = {
  connections: Connection[];
};

export default function ConnectionUpdates({
  connections,
}: ConnectionUpdatesProps) {
  const [updates, setUpdates] = useState<EnrichedUpdate[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
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
      const newUpdates = await Promise.all(
        connections.map((connection) =>
          getConnectionUpdates(connection.userId, connection.level, page)
        )
      );
      const flattenedUpdates = newUpdates.flat();
      setUpdates((prevUpdates) => {
        const combinedUpdates = [...prevUpdates, ...flattenedUpdates];
        return combinedUpdates.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setHasMore(flattenedUpdates.length > 0);
    } catch (error) {
      console.error("Error loading updates:", error);
    }
    setLoading(false);
  };

  function renderContentWithLinks(content: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, index) =>
      urlRegex.test(part) ? (
        <Link
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {part}
        </Link>
      ) : (
        part
      )
    );
  }

  return (
    <div className="space-y-8">
      {loading && updates.length === 0 && (
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Loading updates from your connections...
          </span>
        </div>
      )}
      {updates.map((update, index) => (
        <div
          key={update.id}
          ref={index === updates.length - 1 ? lastUpdateElementRef : null}
        >
          <Card className="transition-opacity duration-300 ease-in-out opacity-100">
            <CardHeader className="px-4 py-2">
              <CardTitle className="text-sm text-gray-500 flex items-center justify-between">
                <Link
                  href={`/${update.user.username}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Avatar className="w-8 h-8 border shadow-lg">
                    <AvatarImage
                      src={update.user.profilePicture || ""}
                      className="object-contain"
                      alt={update.user.username}
                    />
                    <AvatarFallback>
                      {update.user.username[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-sm font-semibold text-muted-foreground text-black dark:text-white">
                    {update.user.username}
                  </h3>
                </Link>
                <span className="font-light">
                  {formatDistanceToNow(new Date(update.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-scroll md:overflow-x-hidden mt-4">
              <p>{renderContentWithLinks(update.content)}</p>
              {update.linkPreviews.map((preview, index) => (
                <LinkPreview key={index} preview={preview} />
              ))}
            </CardContent>
          </Card>
          <div className="border h-0.5 bg-gray-300 dark:bg-gray-800 my-4" />
        </div>
      ))}
      {!loading && !hasMore && updates.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-muted-foreground">
            There are no more updates. Connect with more friends to have more
            real and meaningful connections with others.
          </p>
        </div>
      )}
      {loading && updates.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2">Loading more updates...</span>
        </div>
      )}
    </div>
  );
}
