// app/myprofile/edit/BasicInfoTab.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserType } from "@/lib/types";
import { updateBasicInfo } from "@/actions/users/updateUserProfile";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function BasicInfoTab({ user }: { user: UserType }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    given_name: user.given_name || "",
    family_name: user.family_name || "",
    birthdate: user.birthdate
      ? new Date(user.birthdate).toISOString().split("T")[0]
      : "",
    currentLocation: user.currentLocation || "",
    hometown: user.hometown || "",
    profession: user.profession || "",
    bio: user.bio || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBasicInfo(user.id, formData);
      toast({
        title: "Success",
        description: "Your basic info has been updated.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update basic info. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 md:space-y-0 md:flex md:gap-4 w-full"
    >
      <Card className="w-full bg-slate-900/90 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label className="text-lg" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a unique username"
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              This is your public display name.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-lg" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              type="email"
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              We'll never share your email with anyone else.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-lg" htmlFor="given_name">
                First Name
              </Label>
              <Input
                id="given_name"
                name="given_name"
                value={formData.given_name}
                onChange={handleInputChange}
                placeholder="John"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="family_name">Last Name</Label>
              <Input
                id="family_name"
                name="family_name"
                value={formData.family_name}
                onChange={handleInputChange}
                placeholder="Doe"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-lg" htmlFor="birthdate">
              Birthdate
            </Label>
            <Input
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
              placeholder="YYYY-MM-DD"
              type="date"
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Your birthday helps us personalize your experience.
            </p>
          </div>
          <div className="space-y-2 mb-4">
            <Label className="text-lg" htmlFor="profession">
              Profession
            </Label>
            <Input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              placeholder="Your current job or field"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
      <div>
        <Card className="w-full bg-slate-900/90 max-w-2xl h-full">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Location</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:gap-6">
            <div className="space-y-2">
              <Label className="text-lg" htmlFor="currentLocation">
                Current City
              </Label>
              <Input
                id="currentLocation"
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleInputChange}
                placeholder="City, Country"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Current City where you are residing right now!
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-lg" htmlFor="hometown">
                Hometown
              </Label>
              <Input
                id="hometown"
                name="hometown"
                value={formData.hometown}
                onChange={handleInputChange}
                placeholder="Where you're originally from"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Your hometown city where you belongs to...
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-lg" htmlFor="bio">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us a bit about yourself"
                className="w-full min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                A brief description of yourself to share with others.
              </p>
            </div>
            <Button type="submit" className="w-full my-8">
              Update Basic Info
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
