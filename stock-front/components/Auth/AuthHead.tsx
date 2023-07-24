import React from "react"

type AuthHeadType = {
  heading: string
}

const AuthHead = ({ heading }: AuthHeadType) => {
  return (
    <div className="mb-4">
      <div className="flex justify-center">
        {/* <div className="w-40 h-5 relative logo">
          <Image src={logo} alt="logo" layout="fill" objectFit="cover" />
        </div> */}
      </div>
      <h2 className="mt-4 text-center font-extrabold text-gray-900">
        {heading}
      </h2>
    </div>
  )
}

export default AuthHead
