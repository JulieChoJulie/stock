import { z } from "zod"

const passwordValidation = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional(),
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

export const SignupFormSchema = z
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

export type LoginFormType = z.infer<typeof LoginFormSchema>
export type SignupFormType = z.infer<typeof SignupFormSchema>
