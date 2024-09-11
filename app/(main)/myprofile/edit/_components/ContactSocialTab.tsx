// app/myprofile/edit/ContactSocialTab.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { UserType } from "@/lib/types";
import { updateContactSocial } from "@/actions/users/updateUserProfile";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGlobe,
  FaSnapchat,
  FaBehance,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

const socialPlatforms = [
  { name: "Facebook", icon: FaFacebook },
  { name: "Instagram", icon: FaInstagram },
  { name: "LinkedIn", icon: FaLinkedin },
  { name: "GitHub", icon: FaGithub },
  { name: "Twitter", icon: FaTwitter },
  { name: "Website", icon: FaGlobe },
  { name: "Snapchat", icon: FaSnapchat },
  { name: "Behance", icon: FaBehance },
  { name: "TikTok", icon: FaTiktok },
  { name: "WhatsApp", icon: FaWhatsapp },
];

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  // Add more country codes as needed
];

export default function ContactSocialTab({ user }: { user: UserType }) {
  const { toast } = useToast();
  const [contactDetails, setContactDetails] = useState({
    phone: user.contactDetails?.phone || "",
    address: user.contactDetails?.address || "",
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(
    user.socialLinks
      ? Object.fromEntries(
          Object.entries(user.socialLinks).filter(
            ([key, value]) => key !== "id" && key !== "userId" && value !== null
          )
        )
      : {}
  );
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialLink, setNewSocialLink] = useState("");

  const handleContactDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkAdd = () => {
    if (newSocialPlatform && newSocialLink) {
      setSocialLinks((prev) => ({
        ...prev,
        [newSocialPlatform.toLowerCase()]: newSocialLink,
      }));
      setNewSocialPlatform("");
      setNewSocialLink("");
    }
  };

  const handleSocialLinkRemove = (platform: string) => {
    setSocialLinks((prev) => {
      const updated = { ...prev };
      delete updated[platform];
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContactSocial(
        user.id,
        {
          ...contactDetails,
          phone: `${countryCode}${contactDetails.phone}`,
        },
        socialLinks
      );
      toast({
        title: "Success",
        description: "Your contact and social information has been updated.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to update contact and social information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full bg-gray-50 dark:bg-slate-900/90 mx-auto pb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Contact & Social Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg" htmlFor="phone">
              Phone Number
            </Label>
            <div className="flex space-x-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                name="phone"
                value={contactDetails.phone}
                onChange={handleContactDetailsChange}
                placeholder="Phone number"
                className="flex-grow max-w-[250px]"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Your primary contact number, people can contact you on.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-lg" htmlFor="address">
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              value={contactDetails.address}
              onChange={handleContactDetailsChange}
              placeholder="Your full address"
              className="min-h-[100px] max-w-1/2"
            />
            <p className="text-sm text-muted-foreground">
              Your current address in detail for closest connections.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Social Links</Label>
            <div className="flex space-x-2">
              <Select
                value={newSocialPlatform}
                onValueChange={setNewSocialPlatform}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform.name} value={platform.name}>
                      <div className="flex items-center">
                        <platform.icon className="mr-2" />
                        {platform.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={newSocialLink}
                onChange={(e) => setNewSocialLink(e.target.value)}
                placeholder="Profile URL"
                className="flex-grow"
              />
              <Button type="button" onClick={handleSocialLinkAdd}>
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2 md:space-y-0 md:grid md:grid-cols-2 items-center gap-4">
            {Object.entries(socialLinks).map(([platform, link]) => {
              const PlatformIcon =
                socialPlatforms.find(
                  (p) => p.name.toLowerCase() === platform.toLowerCase()
                )?.icon || FaGlobe;
              return (
                <div
                  key={platform}
                  className="flex items-center justify-between p-2 bg-secondary rounded-md"
                >
                  <div className="flex flex-wrap items-center space-x-2">
                    <PlatformIcon className="text-primary" />
                    <span className="font-medium">{platform}:</span>
                    <Link
                      href={link}
                      target="_blank"
                      className="text-sky-500 hover:underline truncate overflow-x-hidden max-w-[300px]"
                    >
                      {link}
                    </Link>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSocialLinkRemove(platform)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X size={16} />
                  </Button>
                </div>
              );
            })}
          </div>

          <Button type="submit" className="w-full">
            Update Contact & Social
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
