"use client"

import { useSession } from "next-auth/react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import SubscribeToggle from "./SubscribeToggle"

const CommunityInfo = () => {
  const { data: session } = useSession()
  const { memberCount, creatorId } = useSelector(
    (state: RootState) => state.community,
  )
  return (
    <>
      <div className="flex justify-between gap-x-4 py-3">
        <dt className="text-gray-500">Members</dt>
        <dd className="text-gray-700">
          <div className="text-gray-900">{memberCount}</div>
        </dd>
      </div>

      {creatorId === session?.user.id && (
        <div className="flex justify-between gap-x-4 py-3">
          <p className="text-gray-500">You created this community</p>
        </div>
      )}
      {creatorId !== session?.user.id ? <SubscribeToggle /> : null}
    </>
  )
}

export default CommunityInfo
