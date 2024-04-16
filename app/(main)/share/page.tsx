import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const sharePage = () => {
  return (
    <p className="mfc flex-col">
      Show sharing preferences to the user, what he wants to display to not
      logged in users.
      <br />
      Display three sharing preferences to user.
      <div className="w-1/2 flex gap-4 mt-4 justify-between">
        <Link href="/share/known">
          <Button variant="outline" className="px-12 py-8">
            Known
          </Button>
        </Link>
        <Link href="/share/closer">
          <Button variant="outline" className="px-12 py-8">
            Closer
          </Button>
        </Link>
        <Link href="/share/closest">
          <Button variant="outline" className="px-12 py-8">
            Closest
          </Button>
        </Link>
      </div>
      {/* Latter add the option to make a custom sharing preference also*/}
    </p>
  );
};

export default sharePage;
