"use client"

import { FC, useCallback } from "react"
import {
  useSubscribeCommunityMutation,
  useUnsubscribeCommunityMutation,
} from "@/redux/services/community/communityApi"
import { toast } from "@/hooks/use-toast"
import { Button } from "./ui/button"

interface SubscribeToggleProps {
  communityId: string
  communityName: string
  isSubscribed: boolean
}

const SubscribeToggle: FC<SubscribeToggleProps> = ({
  communityId,
  communityName,
  isSubscribed,
}) => {
  const [subscribeCommunity, { isLoading: isSubscriptionLoading }] =
    useSubscribeCommunityMutation()

  const [unsubscribeCommunity, { isLoading: isUnsubscriptionLoading }] =
    useUnsubscribeCommunityMutation()

  const onSubscribe = useCallback(() => {
    subscribeCommunity(communityId)
      .unwrap()
      .then(() => {
        toast({
          title: "Successful",
          description: `You are now subscribed to ${communityName}`,
        })
      })
      .catch((err) => {
        console.log(err)
        toast({
          title: "Error",
          description: err?.data?.message ?? "Please try again.",
        })
      })
  }, [subscribeCommunity, communityId])

  const onUnsubscribe = useCallback(() => {
    unsubscribeCommunity(communityId)
      .unwrap()
      .then((payload) => {
        toast({
          title: "Success",
          description: `You are now unsubscribed to ${communityName}.`,
        })
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err?.data?.message ?? "Please try again.",
        })
      })
  }, [unsubscribeCommunity, communityId, communityName])

  return isSubscribed ? (
    <Button
      isLoading={isUnsubscriptionLoading}
      className="w-full mt-1 mb-4"
      onClick={() => onUnsubscribe()}
    >
      Leave
    </Button>
  ) : (
    <Button
      isLoading={isSubscriptionLoading}
      className="w-full mt-1 mb-4"
      onClick={() => onSubscribe()}
    >
      Subscribe
    </Button>
  )
}

export default SubscribeToggle
