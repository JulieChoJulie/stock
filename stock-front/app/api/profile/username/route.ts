import { z } from "zod"
import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { UsernameValidator } from "@/lib/validators/profile"

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Login is required.", { status: 401 })
    }

    const body = await req.json()
    const { username } = UsernameValidator.parse(body)

    const userExist = await db.user.findFirst({
      where: { username },
    })

    if (userExist) {
      return new Response("Username is already taken.", { status: 409 })
    }

    // update username
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
      },
    })

    return new Response("OK")
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message as string, { status: 422 })
    }

    return new Response(
      "Could not post a comment at this moment. Please try again later.",
      {
        status: 500,
      },
    )
  }
}
