export interface Menutitle {
  title: string;
}

export interface Menu {
  title: string;
  icon: JSX.Element;
  submenu: boolean;
  submenuItems?: Menutitle[];
  submenuLogin?: boolean;
  login?: boolean;
}

export type SubMenuItemProps = {
  submenu: Menutitle;
  href: string;
  isActive: boolean;
};

export type SubMenuProps = {
  key: string;
  menu: Menu;
  isOpen: boolean;
};
