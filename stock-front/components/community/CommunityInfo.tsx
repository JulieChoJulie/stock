"use client"

import { useSession } from "next-auth/react"
import { FC } from "react"
import { useRouter } from "next/navigation"
import { CommunityPropType } from "@/types/propTypes"
import { Button } from "../ui/button"
import SubscribeToggle from "./SubscribeToggle"

interface CommunityInfoProps {
  communityData: CommunityPropType
}

const CommunityInfo: FC<CommunityInfoProps> = ({ communityData }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { memberCount, creatorId, isSubscribed, communityName } = communityData
  return (
    <>
      {session?.user && creatorId !== session?.user.id ? (
        <SubscribeToggle communityData={communityData} />
      ) : null}
      {session?.user && (
        <Button
          isLoading={false}
          className="w-full mb-6"
          disabled={!isSubscribed}
          onClick={() => {
            router.push(`/c/${communityName}/submit`)
          }}
        >
          Create Post
        </Button>
      )}
    </>
  )
}

export default CommunityInfo
