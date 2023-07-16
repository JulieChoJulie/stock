import Image from "next/image";
import React from "react";
import { logo } from "@/lib";

type AuthHeadType = {
  heading: string;
};

const AuthHead = ({ heading }: AuthHeadType) => {
  return (
    <div className="mb-1">
      <div className="flex justify-center">
        <div
          className="w-40 h-5 relative"
          // style={{
          //   position: "relative",
          //   left: "50%",
          //   transform: "translateX(-50%)",
          // }}
        >
          <Image src={logo} alt="logo" layout="fill" objectFit="cover" />
        </div>
      </div>
      <h2 className="mt-4 text-center text-base font-extrabold text-gray-900">
        {heading}
      </h2>
    </div>
  );
};

export default AuthHead;
