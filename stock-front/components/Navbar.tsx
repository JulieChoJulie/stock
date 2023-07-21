import Link from "next/link";
import { logoFont } from "@/lib/utils";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2 md:ml-18">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between md:justify-end gap-2">
        {/* logo */}

        <Link href="/" className="flex gap-2 items-center ml-2 md:hidden">
          <Icons.LOGO className="h-8 w-8 sm:h-6 sm:w-6" />
          {/* <p className={`text-sm font-medium ${logoFont.className}`}>
            QuantQuant
          </p> */}
        </Link>

        {/* Search bar */}
        <div className="flex md:mr-20">Search bar</div>
        <Link href="/sing-in" className={buttonVariants()}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
