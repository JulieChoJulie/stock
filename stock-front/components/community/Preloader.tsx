"use client"

import { FC, useState, createContext } from "react"
import { setCommunityPayloadType } from "@/types/propTypes"

interface CommunityProviderProps {
  communityData: setCommunityPayloadType
  children: React.ReactNode
}

export type CommunityContextType = {
  communityInfo: setCommunityPayloadType
  subscribeContext: () => void
  unsubscribeContext: () => void
}

export const CommunityContext = createContext<CommunityContextType | null>(null)

const CommunityProvider: FC<CommunityProviderProps> = ({
  communityData,
  children,
}) => {
  const [communityInfo, setCommunityInfo] =
    useState<setCommunityPayloadType>(communityData)
  const subscribeContext = () => {
    const newCommunityInfo: setCommunityPayloadType = {
      ...communityInfo,
      isSubscribed: true,
    }
    setCommunityInfo(newCommunityInfo)
  }
  const unsubscribeContext = () => {
    const newCommunityInfo: setCommunityPayloadType = {
      ...communityInfo,
      isSubscribed: false,
    }
    setCommunityInfo(newCommunityInfo)
  }

  return (
    <CommunityContext.Provider
      value={{ communityInfo, subscribeContext, unsubscribeContext }}
    >
      {children}
    </CommunityContext.Provider>
  )
}

export default CommunityProvider
