"use client";

import React from "react";
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
  FaDribbble,
} from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

type SocialLinksData = {
  facebook?: string | null;
  instagram?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  twitter?: string | null;
  website?: string | null;
  snapchat?: string | null;
  behance?: string | null;
  tiktok?: string | null;
  whatsapp?: string | null;
  dribbble?: string | null;
  customLinks?: { platform: string; url: string }[];
};

type SocialLinksProps = {
  links: SocialLinksData;
};

const iconMap: { [key: string]: React.ElementType } = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  github: FaGithub,
  twitter: FaTwitter,
  website: FaGlobe,
  snapchat: FaSnapchat,
  behance: FaBehance,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
  dribbble: FaDribbble,
};

export default function SocialLinks({ links }: SocialLinksProps) {
  // Function to ensure URLs have a proper protocol (http or https)
  const getValidUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  // Function to render a social link with tooltip
  const renderLink = (platform: string, url: string | null | undefined) => {
    if (!url) return null;

    // If platform is 'id' or 'userId', skip rendering
    if (platform === "id" || platform === "userId") return null;

    const Icon = iconMap[platform.toLowerCase()] || FaGlobe;
    return (
      <Tooltip key={platform}>
        <TooltipTrigger asChild>
          <Link
            href={getValidUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Icon className="w-5 h-5 text-gray-600" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{platform}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      <TooltipProvider>
        {Object.entries(links).map(([platform, url]) => {
          if (platform !== "customLinks") {
            return renderLink(platform, url as string | null | undefined);
          }
          return null;
        })}
        {links.customLinks?.map((link, index) =>
          renderLink(link.platform, link.url)
        )}
      </TooltipProvider>
    </div>
  );
}
