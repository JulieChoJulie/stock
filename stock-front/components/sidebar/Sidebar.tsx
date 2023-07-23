"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { menus } from "@/lib/dummyData"
import { MdMenu } from "react-icons/md"
import { useMediaQuery } from "react-responsive"
import SubMenu from "./SubMenu"

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true)
  const isTab: boolean = useMediaQuery({ query: "(max-width: 768px)" })
  const pathname = usePathname()
  const isHome: boolean = pathname === "/"
  const sidebarAnimation = !isHome
    ? // when not in home page
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
      }

  useEffect(() => {
    if (isHome && !isTab) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [isHome, isTab])

  // close sidebr when the pathname is changed
  useEffect(() => {
    if (!isHome && isTab) {
      setIsOpen(false)
    }
  }, [pathname, isHome, isTab])

  return (
    <>
      <div
        role="presentation"
        onClick={() => setIsOpen(false)}
        className={`${
          isHome && !isTab && "hidden"
        } fixed insert-0 max-h-screen z-[998] bg-black/50
        w-full h-full
      ${isOpen ? "visible" : "hidden"}
      `}
      />
      <motion.div
        variants={sidebarAnimation}
        initial={{ x: !isHome ? -250 : 0 }}
        animate={isOpen ? "open" : "closed"}
        className={`fixed h-screen bg-white text-gray z-[998] w-[16rem] 
        max-w-[16rem] p-3 pt-12
        ${!isHome && "shadow-xl z-[999]"}
        ${isTab && isOpen && "shadow-xl  z-[999]"}
    `}
      >
        {/* <BsArrowLeftShort
          onClick={() => setIsOpen(!isOpen)}
          className={`${
            !isHome && "hidden"
          } bg-slate-500 text-white text-3xl rounded-full absolute -right-3 top-9 cursor-pointer ${
            !isOpen && "rotate-180"
          } `}
        /> */}
        {/* <div
          className={`${
            !isHome && "hidden"
          } bg-slate-500 text-white text-3xl rounded-full absolute -right-3 top-9 cursor-pointer ${
            !isOpen && "rotate-180"
          } `}
        >
          <BsArrowLeftShort onClick={() => setIsOpen(!isOpen)} />
        </div> */}

        {/* menus */}
        <div className="flex flex-col menu">
          <ul
            className="pt-1 flex flex-col max-h-screen gap-1 scrollbar-thin scrollbar-track-white
             scrollbar-thumb-slate-100 overflow-x-hidden md:h-[68%] h-[70%]"
          >
            {menus.map((menu) => {
              const href: string = menu.title === "home" ? "" : menu.title
              if (menu.submenu) {
                return <SubMenu key={menu.title} menu={menu} isOpen={isOpen} />
              }
              return (
                <Link href={`/${href}`} key={menu.title}>
                  <SubMenu key={menu.title} menu={menu} isOpen={isOpen} />
                </Link>
              )
            })}
          </ul>
        </div>
      </motion.div>
      <div
        role="presentation"
        className="fixed m-3 h-fit z-[1000] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdMenu size={30} />
      </div>
      <main
        className={`${
          isHome && !isTab && (isOpen ? "ml-[16.5rem]" : "ml-[4.5rem]")
        }
        ${!isOpen && isHome && isTab && "ml-[2.5rem]"}
        w-full
        `}
      >
        <div className="flex w-full h-screen">{children}</div>
      </main>
    </>
  )
}

export default Sidebar
