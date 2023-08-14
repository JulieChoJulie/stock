import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "./use-toast"

export const useCustomToast = (url?: string) => {
  const href: string = url || "/"
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <Link
          onClick={() => dismiss()}
          href={`/sign-in?callbackUrl=${href}`}
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
      ),
    })
  }

  return { loginToast }
}
