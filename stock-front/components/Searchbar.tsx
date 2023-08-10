"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import debounce from "lodash.debounce"
import { Prisma, Community } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { Users } from "lucide-react"

import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"

const Searchbar = () => {
  const [input, setInput] = useState<string>("")
  const searchRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useOnClickOutside(searchRef, () => {
    setInput("")
  })

  // whenever pathname changes, close the search list
  useEffect(() => {
    setInput("")
  }, [pathname])

  const router = useRouter()
  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Community & {
        _count: Prisma.CommunityCountOutputType
      })[]
    },
    queryKey: ["search-query"],
    enabled: false,
  })

  const request = debounce(async () => {
    refetch()
  }, 300)
  const debounceRequest = useCallback(() => {
    request()
  }, [])

  return (
    <Command
      ref={searchRef}
      className="relative rounded-lg border max-w-md z-50 overflow-visible"
    >
      <CommandInput
        isLoading={isFetching}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        value={input}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search..."
      />
      {input.length > 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No Results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="community">
              {queryResults?.map((community) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/c/${e}`)
                    router.refresh()
                  }}
                  key={community.id}
                  value={community.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/c/${community.name}`}>c/{community.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  )
}

export default Searchbar
