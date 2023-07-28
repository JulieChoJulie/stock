import { User } from "next-auth"
import { FC } from "react"
import Image from "next/image"
import { AvatarProps } from "@radix-ui/react-avatar"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Icons } from "./Icons"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            sizes={25}
            src={user.image}
            alt="profile image"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.USER className="w-4 h-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar
