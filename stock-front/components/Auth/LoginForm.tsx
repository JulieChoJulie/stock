"use client"

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const passwordValidation = new RegExp("^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

const FormSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address."}).optional(),
  password: z.string().refine((val) => {
    return (passwordValidation.test(val))
  }, {
    message: "Your password should be at least 8 characters long that include at least one letter, one special character and one number."
}),
  confirm: z.string(),
});

const LoginForm = () => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
      })
    
    
      function onSubmit(data: z.infer<typeof FormSchema>) {
        signIn("credentials", {
            email: data.email,
            password: data.password,
          })
      }
        return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
            <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="mx-4">
            <FormLabel className="text-xs">Email</FormLabel>
            <FormControl>
                <div className="text-center">
              <Input className="w-full" placeholder="Enter Email" {...field} />
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
          <FormItem className="mx-4">
            <FormLabel className="text-xs">Password</FormLabel>
            <FormControl>
            <div className="text-center">
              <Input className="w-full" type="password" placeholder="Enter Password" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="text-center w-full">
      <Button className="mt-2 h-8" type="submit">Sign in</Button>
      </div>
    </form>
  </Form>
  )
}

export default LoginForm;