"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const passwordValidation = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/

const FormSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(10, {
        message: "Username must be less than 10 characters.",
      }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().refine(
      (val) => {
        return passwordValidation.test(val)
      },
      {
        message:
          "Your password should be at least 8 characters long that include at least one letter, one special character and one number.",
      },
    ),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  })

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true)

    try {
      // await signUp("credentials", {
      // username: data.username,
      //   email: data.email,
      //   password: data.password,
      // })
    } catch (error) {
      // toast notification
      toast({
        title: "Sign up Error",
        description: "There was a error Signing up",
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
        className="space-y-2 md:space-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="text-center">
                  <Input className="w-full" placeholder="Username" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
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
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="text-center">
                  <Input
                    className="w-full"
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-center w-full">
          <Button
            isLoading={isLoading}
            className="mt-2 h-8 w-full group-default:"
            type="submit"
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SignupForm
