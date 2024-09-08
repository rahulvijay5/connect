"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackButton({
  showtext
}: {
  showtext: Boolean;
}) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="flex-center gap-1 px-2"
    >
      <ChevronLeft className="h-4 w-4" />
      <div>{showtext && "Back"}</div>
    </Button>
  );
}
