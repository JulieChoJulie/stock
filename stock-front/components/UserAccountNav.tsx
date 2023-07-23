import { User } from "next-auth";
import { FC } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  console.log(user.image);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="w-8 h-8"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};

export default UserAccountNav;
