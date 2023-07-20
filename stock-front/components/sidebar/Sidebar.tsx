"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { logoOnly } from "@/lib";
import Link from "next/link";
import { BsArrowLeftShort, BsFileEarmarkPost } from "react-icons/bs";
import { MdScreenSearchDesktop } from "react-icons/md";
import { IoMdPricetags } from "react-icons/io";
import { Menu } from "@/lib/types";
import SubMenu from "./SubMenu";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const sidebarAnimation = {
    // system view
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

  const menus: Menu[] = [
    {
      title: "screener",
      submenu: false,
      icon: <MdScreenSearchDesktop />,
    },
    {
      title: "feeds",
      submenu: true,
      icon: <BsFileEarmarkPost />,
      submenuLogin: true,
      submenuItems: [
        { title: "general" },
        { title: "trends" },
        { title: "value_investing" },
        { title: "1111111111111111111111111111111111111111" },
        { title: "12" },
        { title: "13" },
        { title: "14" },
        { title: "15" },
        { title: "16" },
        { title: "17" },
        { title: "18" },
        { title: "19" },
        { title: "111" },
        { title: "112" },
        { title: "113" },
        { title: "114" },
        { title: "115" },
        { title: "116" },
        { title: "117" },
        { title: "118" },
        { title: "119" },
        { title: "120" },
      ],
    },
    {
      title: "ticker",
      submenu: true,
      login: true,
      icon: <IoMdPricetags />,
      submenuItems: [{ title: "AAPL" }, { title: "TSLA" }],
    },
  ];

  return (
    <>
      <motion.div
        variants={sidebarAnimation}
        animate={isOpen ? "open" : "closed"}
        className="bg-white text-gray shadow-xl z-[100] w-[16rem] max-w-[16rem]
      p-3 h-screen md:relative fixed
    "
      >
        <BsArrowLeftShort
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-slate-500 text-white text-3xl rounded-full absolute -right-3 top-9 cursor-pointer ${
            !isOpen && "rotate-180"
          }`}
        />

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
      <main>
        <div className="flex w-full h-screen">{children}</div>
      </main>
    </>
  );
};

export default Sidebar;
