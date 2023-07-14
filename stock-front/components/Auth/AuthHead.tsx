import Link from "next/link";
import Image from "next/image";
import React from "react";
import { logo } from "@/lib";

type AuthHeadType = {
  heading: string;
  paragraph: string;
  linkName: string;
  linkUrl: string;
};

const AuthHead = ({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}: AuthHeadType) => {
  return (
    <div className="mb-1">
      <div className="flex justify-center">
        <div className="w-40 h-5" style={{ position: "relative" }}>
          <Image src={logo} alt="logo" layout="fill" objectFit="contain" />
        </div>
      </div>
      <h2 className="mt-4 text-center text-xl font-extrabold text-gray-900">
        {heading}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {paragraph}{" "}
        <Link
          href={linkUrl}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
};

export default AuthHead;
