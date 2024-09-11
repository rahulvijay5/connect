import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import LinkPreview from "@/components/LinkPreview";

type EnrichedUpdate = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    username: string;
    profilePicture: string | null;
  };
  linkPreviews: Array<{
    url: string;
    title: string;
    description: string;
    image: string | null;
  }>;
};

type MobileUpdateStackProps = {
  updates: EnrichedUpdate[];
};

const SWIPE_THRESHOLD = 50;
const AUTO_ROTATE_INTERVAL = 8000; // 8 seconds

export const MobileUpdateStack: React.FC<MobileUpdateStackProps> = ({
  updates,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetAutoRotateTimer();
    return () => {
      if (autoRotateTimerRef.current) {
        clearTimeout(autoRotateTimerRef.current);
      }
    };
  }, [currentIndex]);

  const resetAutoRotateTimer = () => {
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current);
    }
    autoRotateTimerRef.current = setTimeout(handleNext, AUTO_ROTATE_INTERVAL);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : updates.length - 1
    );
    resetAutoRotateTimer();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < updates.length - 1 ? prevIndex + 1 : 0
    );
    resetAutoRotateTimer();
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      handlePrevious();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      handleNext();
    } else {
      controls.start({ x: 0 });
    }
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
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-hidden relative" ref={containerRef}>
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            className="absolute inset-0 bg-white dark:bg-black rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div className="flex items-center mb-4">
              <Link href={`/${updates[currentIndex].user.username}`}>
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarImage
                    src={updates[currentIndex].user.profilePicture || ""}
                    alt={updates[currentIndex].user.username}
                  />
                  <AvatarFallback>
                    {updates[currentIndex].user.username[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link href={`/${updates[currentIndex].user.username}`}>
                  <p className="font-semibold">
                    {updates[currentIndex].user.username}
                  </p>
                </Link>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(
                    new Date(updates[currentIndex].createdAt),
                    { addSuffix: true }
                  )}
                </p>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              <p className="text-neutral-700 dark:text-neutral-200 mb-4">
                {renderContentWithLinks(updates[currentIndex].content)}
              </p>
              {updates[currentIndex].linkPreviews.map((preview, index) => (
                <LinkPreview key={index} preview={preview} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center items-center space-x-4 py-4">
        <button
          onClick={handlePrevious}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
