import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const sharePage = () => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <p className="mb-4">
        Show sharing preferences to the user, what they want to display to
        non-logged in users.
        <br />
        Display three sharing preferences to the user.
      </p>
      <div className="w-full max-w-md flex flex-col md:flex-row gap-4 mt-4 justify-between">
        <Link href="/share/known">
          <Button variant="outline" className="w-full md:w-1/3 px-6 py-4">
            Known
          </Button>
        </Link>
        <Link href="/share/closer">
          <Button variant="outline" className="w-full md:w-1/3 px-6 py-4">
            Closer
          </Button>
        </Link>
        <Link href="/share/closest">
          <Button variant="outline" className="w-full md:w-1/3 px-6 py-4">
            Closest
          </Button>
        </Link>
      </div>
      {/* Option to make a custom sharing preference can be added here */}
    </div>
  );
};

export default sharePage;
