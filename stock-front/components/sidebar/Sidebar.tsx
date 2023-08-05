"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { menus } from "@/lib/dummyData"
import { MdMenu } from "react-icons/md"
import { useMediaQuery } from "react-responsive"
import SubMenu from "./SubMenu"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const isTab: boolean = useMediaQuery({ query: "(max-width: 767px)" })
  const pathname = usePathname()
  const isHome: boolean = pathname === "/"
  const sidebarAnimation =
    isTab && !isHome
      ? {
          open: {
            width: "16rem",
            transition: {
              damping: 40,
            },
          },
          closed: {
            width: "0rem",
            transition: { damping: 40 },
          },
        }
      : {
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
    if (!isHome) {
      setIsOpen(false)
    }
  }, [pathname, isHome])

  useEffect(() => setMounted(true), [])

  const isMenuModalOpen: boolean = isOpen && !(!isTab && isHome)

  if (!mounted) {
    if (pathname === "/") {
      return null
    }
    return (
      <div
        role="presentation"
        className="fixed m-3 h-fit z-[1000] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdMenu size={30} />
      </div>
    )
  }

  return (
    <>
      {isMenuModalOpen ? (
        <div
          role="presentation"
          onClick={() => setIsOpen(false)}
          className={`
         fixed insert-0 max-h-screen z-[998] bg-black/50
        w-full h-full
      `}
        />
      ) : null}

      <motion.div
        variants={sidebarAnimation}
        // initial={{ x: !isTab ? -250 : 0 }}
        animate={isOpen ? "open" : "closed"}
        className={`fixed h-screen bg-white text-gray z-[998] w-[16rem] 
        max-w-[16rem] p-3 pt-14
        ${isMenuModalOpen && "shadow-xl  z-[999]"}
    `}
      >
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
      {isHome && !isTab ? null : (
        <div
          role="presentation"
          className="fixed m-3 h-fit z-[1000] cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MdMenu size={30} />
        </div>
      )}
    </>
  )
}

export default Sidebar
