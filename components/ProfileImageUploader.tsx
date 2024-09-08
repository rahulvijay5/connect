"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";

interface ProfileImageUploaderProps {
  initialImageUrl: string | null;
  userName: string;
  userId: string;
}

export default function ProfileImageUploader({
  initialImageUrl,
  userName,
  userId,
}: ProfileImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Compress image if larger than 2MB
      let compressedFile = file;
      if (file.size > 2 * 1024 * 1024) {
        compressedFile = await compressImage(file);
      }

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("userId", userId);

      const response = await fetch("/api/user/upload-profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { imageUrl: newImageUrl } = await response.json();
      setImageUrl(newImageUrl);
      toast({
        title: "Profile picture updated",
        description: "Your new profile picture has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description:
          "There was an error uploading your profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.alt = "profile image";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const scaleFactor = Math.min(1, (2 * 1024 * 1024) / file.size);
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(
                  new File([blob], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                );
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            "image/jpeg",
            0.9
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="relative group">
      <Avatar className="w-48 h-48 -mt-20 border-white shadow-lg">
        <AvatarImage
          src={imageUrl || ""}
          className="object-contain"
          alt={userName}
        />
        <AvatarFallback>{userName[0] || "?"}</AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          disabled={isUploading}
          onClick={handleButtonClick}
        >
          {isUploading ? (
            <X className="h-8 w-8 animate-spin" />
          ) : (
            <Upload className="h-8 w-8" />
          )}
        </Button>
      </div>
    </div>
  );
}
