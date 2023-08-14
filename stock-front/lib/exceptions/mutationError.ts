import { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"

export function handleMuataionError(
  err: any,
  loginToast: () => void,
): void | { id: string; dismiss: () => void; update: (props: any) => void } {
  if (err instanceof AxiosError) {
    if (err.response?.status === 401) {
      return loginToast()
    }

    if (
      typeof err.response?.data === "string" &&
      err.response?.data.startsWith("<!DOCTYPE html>")
    ) {
      return toast({
        description: err.message,
        variant: "destructive",
      })
    }

    return toast({
      description: err.response?.data,
      variant: "destructive",
    })
  }

  return toast({
    title: "There was a problem.",
    description: "Something went wrong. Please try again.",
    variant: "destructive",
  })
}
