import { MdScreenSearchDesktop } from "react-icons/md"
import { BsFileEarmarkPost } from "react-icons/bs"
import { IoMdPricetags } from "react-icons/io"
import { AiFillHome } from "react-icons/ai"
import { Menu } from "../types/types"

export const menus: Menu[] = [
  {
    title: "home",
    submenu: false,
    icon: <AiFillHome />,
  },
  {
    title: "screener",
    submenu: false,
    icon: <MdScreenSearchDesktop />,
  },
  {
    title: "feed",
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
]
