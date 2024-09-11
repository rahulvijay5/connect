"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UserType } from "@/lib/types";
import { updateInterestsSkills } from "@/actions/users/updateUserProfile";

const commonOptions = {
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "HTML",
    "CSS",
    "SQL",
    "Git",
  ],
  hobbies: [
    "Reading",
    "Gaming",
    "Cooking",
    "Traveling",
    "Photography",
    "Music",
    "Sports",
    "Painting",
    "Gardening",
    "Yoga",
  ],
  interests: [
    "Technology",
    "Science",
    "Art",
    "History",
    "Politics",
    "Environment",
    "Health",
    "Business",
    "Literature",
    "Fashion",
  ],
};

const categoryDescriptions = {
  skills: "Your professional abilities and expertise.",
  hobbies: "Activities you enjoy in your free time.",
  interests: "Topics and areas that fascinate you.",
};

export default function InterestsSkillsTab({ user }: { user: UserType }) {
  const { toast } = useToast();
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newItems, setNewItems] = useState({
    skills: "",
    hobbies: "",
    interests: "",
  });
  const [allItems, setAllItems] = useState({
    skills: [] as string[],
    hobbies: [] as string[],
    interests: [] as string[],
  });

  useEffect(() => {
    setInterests(user.interests || []);
    setSkills(user.skills || []);
    setHobbies(user.hobbies || []);

    setAllItems({
      skills: Array.from(
        new Set([...commonOptions.skills, ...(user.skills || [])])
      ),
      hobbies: Array.from(
        new Set([...commonOptions.hobbies, ...(user.hobbies || [])])
      ),
      interests: Array.from(
        new Set([...commonOptions.interests, ...(user.interests || [])])
      ),
    });
  }, [user]);

  const handleItemToggle = (
    category: "skills" | "hobbies" | "interests",
    item: string
  ) => {
    const setter =
      category === "skills"
        ? setSkills
        : category === "hobbies"
        ? setHobbies
        : setInterests;
    setter((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleCustomItemAdd = (
    category: "skills" | "hobbies" | "interests"
  ) => {
    const newItemsArray = newItems[category]
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const setter =
      category === "skills"
        ? setSkills
        : category === "hobbies"
        ? setHobbies
        : setInterests;
    setter((prev) => Array.from(new Set([...prev, ...newItemsArray])));
    setAllItems((prev) => ({
      ...prev,
      [category]: Array.from(new Set([...prev[category], ...newItemsArray])),
    }));
    setNewItems((prev) => ({ ...prev, [category]: "" }));
  };

  const handleInputChange = (
    category: "skills" | "hobbies" | "interests",
    value: string
  ) => {
    setNewItems((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateInterestsSkills(user.id, { interests, skills, hobbies });
      toast({
        title: "Success",
        description: "Your interests, skills, and hobbies have been updated.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to update interests, skills, and hobbies. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCategory = (category: "skills" | "hobbies" | "interests") => {
    const items =
      category === "skills"
        ? skills
        : category === "hobbies"
        ? hobbies
        : interests;

    return (
      <div key={category} className="space-y-4">
        <Label htmlFor={category} className="text-xl font-semibold capitalize">
          {category}
        </Label>
        <p className="text-sm text-muted-foreground">
          {categoryDescriptions[category]}
        </p>
        <div className="flex space-x-2">
          <Input
            id={category}
            placeholder={`Add custom ${category} (comma-separated)`}
            value={newItems[category]}
            onChange={(e) => handleInputChange(category, e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCustomItemAdd(category);
              }
            }}
          />
          <Button type="button" onClick={() => handleCustomItemAdd(category)}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {allItems[category].map((item) => {
            const isSelected = items.includes(item);
            const bgColor = isSelected
              ? category === "skills"
                ? "bg-yellow-800"
                : category === "hobbies"
                ? "bg-sky-800"
                : "bg-emerald-800"
              : category === "skills"
              ? "bg-yellow-100"
              : category === "hobbies"
              ? "bg-sky-100"
              : "bg-emerald-100";
            const textColor = isSelected
              ? category === "skills"
                ? "text-yellow-100"
                : category === "hobbies"
                ? "text-sky-100"
                : "text-emerald-100"
              : category === "skills"
              ? "text-yellow-800"
              : category === "hobbies"
              ? "text-sky-800"
              : "text-emerald-800";

            return (
              <Badge
                key={item}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer ${bgColor} ${textColor} rounded-md px-4 py-2 font-mono text-sm`}
                onClick={() => handleItemToggle(category, item)}
              >
                {item}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card
      className="w-full mx-auto 
bg-gray-50 dark:bg-slate-900/90 pb-6"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <div>Interests, Skills, and Hobbies</div>
          <Button
            type="submit"
            className="hidden md:block my-6"
            variant="outline"
          >
            Update Interests, Skills, and Hobbies
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 md:grid md:grid-cols-2 md:gap-16 md:space-y-0"
        >
          {renderCategory("skills")}
          {renderCategory("hobbies")}
          {renderCategory("interests")}
          <div className="w-full h-full flex items-center justify-center">
            <Button
              type="submit"
              // variant="outline"
              className="w-full md:w-2/3 my-6"
            >
              Update Interests, Skills, and Hobbies
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
