// components/UpdatesDisplay.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Update {
  id: string;
  content: string;
  level: string;
  createdAt: Date;
  user: {
    username: string;
    given_name: string;
    family_name: string;
  };
  linkPreviews?: string[];
}

interface UpdatesDisplayProps {
  updates: Update[];
}

const UpdatesDisplay: React.FC<UpdatesDisplayProps> = ({ updates }) => {
  const renderLinkPreviews = (linkPreviews?: string[]) => {
    if (!linkPreviews || linkPreviews.length === 0) return null;
    return (
      <div className="mt-2 space-y-2">
        {linkPreviews.map((link, index) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline block"
          >
            {link}
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Updates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {updates.map((update) => (
            <Card
              key={update.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-0 shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
                  <Link href={`/${update.user.username}`}>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {update.user.given_name} {update.user.family_name}
                    </span>
                  </Link>
                  <Badge variant="outline">{update.level}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{update.content}</p>
                {renderLinkPreviews(update.linkPreviews)}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  {formatDistanceToNow(new Date(update.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdatesDisplay;
