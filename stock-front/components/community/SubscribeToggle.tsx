"use client"

import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { CommunitySubscriptionPayload } from "@/lib/validators/community"
import { useCustomToast } from "@/hooks/use-custom-toast"
import axios, { AxiosError } from "axios"
import { FC, startTransition } from "react"
import { useRouter } from "next/navigation"
import { CommunityPropType } from "@/types/propTypes"
import { Button } from "../ui/button"

interface SubscribeToggleProps {
  communityData: CommunityPropType
}
const SubscribeToggle: FC<SubscribeToggleProps> = ({ communityData }) => {
  const { loginToast } = useCustomToast()

  const router = useRouter()
  const { communityName, isSubscribed, communityId } = communityData

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: CommunitySubscriptionPayload = {
        communityId,
      }

      const { data } = await axios.post("/api/community/subscribe", payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
        toast({
          title: "Error",
          description: err.response?.data as string,
          variant: "destructive",
        })
      } else {
        return toast({
          title: "Something went wrong.",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    },
    onSuccess: () => {
      startTransition(() => {
        // re-fetch data request for the current route.
        // re-rendering server component without affecting client side react
        // and browser state
        router.refresh()
      })
      toast({
        title: "Subscribed!",
        description: `You are now subscribed to c/${communityName}`,
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: CommunitySubscriptionPayload = {
        communityId,
      }

      const { data } = await axios.post("/api/community/unsubscribe", payload)
      return data as string
    },
    onError: (err: AxiosError) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
        toast({
          title: "Error",
          description: err.response?.data as string,
          variant: "destructive",
        })
      } else {
        return toast({
          title: "Something went wrong.",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    },
    onSuccess: () => {
      startTransition(() => {
        // re-fetch data request for the current route.
        // re-rendering server component without affecting client side react
        // and browser state
        router.refresh()
      })
      toast({
        title: "Unsubscribed!",
        description: `You are now unsubscribed from c/${communityName}`,
      })
    },
  })

  return isSubscribed ? (
    <Button
      isLoading={isUnsubLoading}
      className="w-full mt-1 mb-4"
      onClick={() => unsubscribe()}
    >
      Unsubscribe
    </Button>
  ) : (
    <Button
      isLoading={isSubLoading}
      className="w-full mt-1 mb-4"
      onClick={() => subscribe()}
    >
      Subscribe
    </Button>
  )
}

export default SubscribeToggle
