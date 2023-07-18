"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { AiFillHome } from "react-icons/ai";
import Box from "./Box";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  children: React.ReactNode;
}
const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();
  const routes = useMemo(
    () => [
      {
        icon: AiFillHome,
        label: "Home",
        active: pathname === "/",
        href: "/",
      },
      {
        icon: AiFillHome,
        label: "My clubs",
        active: pathname === "/clubs",
        href: "/clubs",
      },
    ],
    [pathname],
  );
  return (
    <div className="flex h-full">
      <div
        className="
        hidden
        md:flex
        flex-col
        gap-y-2
        bg-slate-50
        h-full
        w-[300px]
        p-2
    "
      >
        <Box>
          <div>
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">Feeds</Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Sidebar;
