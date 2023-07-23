import { SubMenuItemProps } from "@/types/types"
import Link from "next/link"

const SubMenuItem: React.FC<SubMenuItemProps> = ({
  submenu,
  href,
  isActive,
}) => {
  return (
    <li
      className={`text-gray-700 text-base flex items-center
  gap-x-4 cursor-pointer p-2 px-5 hover:bg-slate-100
   ${isActive && "active"}
  `}
    >
      <Link className="w-full" href={href}>
        {submenu.title}
      </Link>
    </li>
  )
}

export default SubMenuItem
