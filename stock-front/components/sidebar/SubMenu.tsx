"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SubMenuProps } from "@/lib/types";
import { BsChevronDown } from "react-icons/bs";
import SubMenuItem from "./SubMenuItem";

const SubMenu: React.FC<SubMenuProps> = ({ menu, isOpen }) => {
  const pathname = usePathname();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  return (
    <div className="submenu">
      <li
        key={`${menu.title}`}
        className={`text-slate-700 text-lg flex items-center gap-x-4 
                  cursor-pointer p-2 hover:bg-slate-100 mb-1 ${
                    pathname.includes(menu.title) && "active"
                  }
                 
                  `}
      >
        <div
          className="w-full"
          role="presentation"
          onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
        >
          <span className="text-2xl block float-left mr-2">{menu.icon}</span>

          <span
            className={`text-base font-medium flex-1 capitalize
                  duration-400 ${!isOpen && "hidden"}
                `}
          >
            {menu.title}
          </span>
        </div>
        {menu.submenu && isOpen && (
          <BsChevronDown
            className={`${isSubmenuOpen && "rotate-180"} duration-200`}
            onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
          />
        )}
      </li>

      {isSubmenuOpen && menu.submenuItems && isOpen && (
        <ul>
          {menu?.submenuItems?.map((submenu) => {
            const href: string = `/${menu.title}/${submenu.title}`;
            const isActive: boolean = pathname.includes(href);
            return (
              <div key={`${menu.title}_${submenu.title}`}>
                <SubMenuItem
                  submenu={submenu}
                  href={href}
                  isActive={isActive}
                />
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SubMenu;
