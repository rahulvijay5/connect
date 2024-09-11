import React from "react";
import { APPName } from "@/lib/constants";
import Link from "next/link";

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <p className="font-bold hover:text-sky-500 delay-100">{APPName}</p>
      </Link>
    </div>
  );
};

const TopRightIcon = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
        />
      </svg>
    </div>
  );
};

export { Logo, TopRightIcon };
