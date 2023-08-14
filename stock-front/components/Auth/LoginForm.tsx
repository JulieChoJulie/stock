"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginFormSchema, LoginFormType } from "@/lib/validators/auth"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  })

  const onSubmit = async (data: LoginFormType) => {
    setIsLoading(true)

    try {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
      })
    } catch (error) {
      // toast notification
      toast({
        title: "Login Error",
        description: "There was a error logging in",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2 p-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="text-xs">Email</FormLabel> */}
              <FormControl>
                <div className="text-center">
                  <Input className="w-full" placeholder="Email" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="text-xs">Password</FormLabel> */}
              <FormControl>
                <div className="text-center">
                  <Input
                    className="w-full"
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          isLoading={isLoading}
          className="mt-2 h-9 w-full hover:scale-102"
          type="submit"
        >
          Sign in
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
