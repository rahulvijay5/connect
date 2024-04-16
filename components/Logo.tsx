import { APPName } from "@/lib/constants";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <p className="font-bold text-xl hover:text-sky-500 delay-100">{APPName}</p>
      </Link>
    </div>
  );
};

export default Logo;
