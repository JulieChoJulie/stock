import { SubMenuItemProps } from "@/lib/types";
import Link from "next/link";

const SubMenuItem: React.FC<SubMenuItemProps> = ({
  submenu,
  href,
  isActive,
}) => {
  return (
    <li
      className={`text-gray-700 text-sm flex items-center
  gap-x-4 cursor-pointer p-2 px-5 hover:bg-slate-100
  rounded-md ${isActive && "text-blue-400"}
  `}
    >
      <Link className="w-full" href={href}>
        {submenu.title}
      </Link>
    </li>
  );
};

export default SubMenuItem;
