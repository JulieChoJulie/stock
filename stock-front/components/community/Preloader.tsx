"use client"

import { FC, useRef } from "react"
import { setCommunityPayloadType } from "@/types/payloadTypes"
import { store } from "@/store/store"
import { setCommunity } from "@/redux/slices/communitySlice"

interface PreloaderProps {
  communityData: setCommunityPayloadType
}

const Preloader: FC<PreloaderProps> = ({ communityData }) => {
  const loaded = useRef(false)
  if (!loaded.current) {
    loaded.current = true
    store.dispatch(setCommunity(communityData))
  }
  return null
}

export default Preloader
