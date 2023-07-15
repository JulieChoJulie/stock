"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const passwordValidation =
  /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

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
        return passwordValidation.test(val);
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
  });

const SignupForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Sign up
    console.log(data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="mx-4">
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
            <FormItem className="mx-4">
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
            <FormItem className="mx-4">
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
            <FormItem className="mx-4">
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
          <Button className="mt-2 h-8 w-full group-default:" type="submit">
            Sign up
          </Button>
        </div>{" "}
      </form>
    </Form>
  );
};

export default SignupForm;
