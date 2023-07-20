import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  href?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  // active,
  href,
}) => {
  const classes: string = twMerge(
    `
      flex
      flex-row
      h-auto
      items-center
      w-full
      gap-x-4
      text-md
      font-medium
      hover:text-neutral-500
      transition
      text-neutral-400
      py-1
    `,
  );
  return href ? (
    <Link href={href} className={twMerge(classes, "cursor-pointer")}>
      <Icon size={26} />
      <p className="truncate w-full">{label}</p>
    </Link>
  ) : (
    <div className={classes}>
      <Icon size={26} />
      <p className="truncate w-full">{label}</p>
    </div>
  );
};

export default SidebarItem;
