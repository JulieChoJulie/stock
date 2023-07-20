"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { logoOnly } from "@/lib";
import Link from "next/link";
import { BsArrowLeftShort } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";
import { menus } from "@/lib/dummyData";
import { MdMenu } from "react-icons/md";
import SubMenu from "./SubMenu";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const isTab: boolean = useMediaQuery({ query: "(max-width: 768px)" });
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const sidebarAnimation = isTab
    ? // mobile view
      {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: { damping: 40, delay: 0.15 },
        },
      }
    : // laptop view
      {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: { damping: 40 },
        },
      };

  useEffect(() => {
    if (isTab) {
      // mobile view
      setIsOpen(false);
    } else {
      // laptop view
      setIsOpen(true);
    }
  }, [isTab]);

  // close sidebr when the pathname is changed - mobile only
  useEffect(() => {
    if (isTab) {
      setIsOpen(false);
    }
  }, [pathname, isTab]);

  return (
    <>
      <div
        role="presentation"
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed insert-0 max-h-screen z-[998] bg-black/50
        w-full h-full
      ${isOpen ? "block" : "hidden"}
      `}
      />
      <motion.div
        variants={sidebarAnimation}
        initial={{ x: isTab ? -250 : 0 }}
        animate={isOpen ? "open" : "closed"}
        className="bg-white text-gray shadow-xl z-[999] w-[16rem] max-w-[16rem]
      p-3 h-screen md:relative fixed
    "
      >
        <BsArrowLeftShort
          onClick={() => setIsOpen(!isOpen)}
          className={`${
            isTab && "hidden"
          } bg-slate-500 text-white text-3xl rounded-full absolute -right-3 top-9 cursor-pointer ${
            !isOpen && "rotate-180"
          } `}
        />
        <div
          className={`${
            isTab && "hidden"
          } bg-slate-500 text-white text-3xl rounded-full absolute -right-3 top-9 cursor-pointer ${
            !isOpen && "rotate-180"
          } `}
        >
          <BsArrowLeftShort onClick={() => setIsOpen(!isOpen)} />
        </div>

        {/* Logo on sidebar */}

        <div className="inline-col">
          <div className="flex flex-row items-center gap-2.5 border-b py-3 border-slate-300">
            <Link className="flex h-fit" href="/">
              <div className="w-10 h-10 relative logo mr-4">
                <Image className="min-w-max" src={logoOnly} alt="logo" fill />
              </div>
              {isOpen && (
                <h1 className={`text-2xl ${!isOpen && "scale-0"}`}>
                  QuantQuant
                </h1>
              )}
            </Link>
          </div>

          {/* menus */}
          <div className="flex flex-col menu">
            <ul
              className="pt-1 flex flex-col max-h-screen gap-1 scrollbar-thin scrollbar-track-white
             scrollbar-thumb-slate-100 overflow-x-hidden md:h-[68%] h-[70%]"
            >
              {menus.map((menu) => {
                if (menu.submenu) {
                  return (
                    <SubMenu key={menu.title} menu={menu} isOpen={isOpen} />
                  );
                }
                return (
                  <Link href={`/${menu.title}`} key={menu.title}>
                    <SubMenu key={menu.title} menu={menu} isOpen={isOpen} />
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.div>
      <div
        role="presentation"
        className="m-3 h-fit md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <MdMenu size={25} />
      </div>
      <main>
        <div className="flex w-full h-screen">{children}</div>
      </main>
    </>
  );
};

export default Sidebar;
