"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { Connection } from "@/lib/types";
import { Level } from "@prisma/client";

const placeholders = [
  "Who's been to Delhi recently?",
  "Who knows about garba and dandiya?",
  "Any connections working in AI?",
  "Who's interested in photography?",
];

export default function AISearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [userConnections, setUserConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(
        placeholders[Math.floor(Math.random() * placeholders.length)]
      );
    }, 5000);

    fetchUserConnections();

    return () => clearInterval(interval);
  }, []);

  const fetchUserConnections = async () => {
    try {
      const response = await fetch("/api/user/user-connections");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserConnections(data);
    } catch (error) {
      console.error("Error fetching user connections:", error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          connectionLevels: userConnections.map((conn) => conn.level),
          connectionUserIds: userConnections.map(
            (conn) => conn.connectedUserId
          ),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "ok") {
        setResults(data.results);
      } else {
        console.error("Search failed:", data.message);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </form>
      <div className="space-y-4">
        {results.map(
          (result: { id: string; level: Level; content: string }) => (
            <Card key={result.id}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-2">
                  Connection level: {result.level}
                </p>
                <p>{result.content}</p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
