"use client"

import { useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/store/store"
import {
  subscribeCommunity,
  unsubscribeCommunity,
} from "@/redux/slices/communitySlice"
import { Button } from "../ui/button"

const SubscribeToggle = () => {
  const dispatch: AppDispatch = useDispatch()
  const { communityId, communityName, isSubscribed, isLoading, error, status } =
    useSelector((state: RootState) => state.community)

  useEffect(() => {
    if (error) {
      toast({
        title: "Unsuccessful",
        description: error,
        variant: "destructive",
      })
    }
    if (status === 200) {
      if (isSubscribed) {
        toast({
          title: "Successful",
          description: `You are subscribed to ${communityName}`,
        })
      } else {
        toast({
          title: "Successful",
          description: `You are unsubscribed to ${communityName}`,
        })
      }
    }
  }, [error, status, isSubscribed, communityName])

  return isSubscribed ? (
    <Button
      isLoading={isLoading}
      className="w-full mt-1 mb-4"
      onClick={() => dispatch(unsubscribeCommunity(communityId))}
    >
      Unsubscribe
    </Button>
  ) : (
    <Button
      isLoading={isLoading}
      className="w-full mt-1 mb-4"
      onClick={() => dispatch(subscribeCommunity(communityId))}
    >
      Subscribe
    </Button>
  )
}

export default SubscribeToggle
