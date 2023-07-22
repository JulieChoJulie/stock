import Link from "next/link";
import { logoFont } from "@/lib/utils";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  return (
    <div className="fixed top-0 inset-x-0 h-fit z-[998] py-2 md:ml-18">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}

        <Link href="/" className="flex gap-2 items-center ml-4 z-[1000]">
          <Icons.LOGO className="h-8 w-8 sm:h-6 sm:w-6" />

          <p
            className={`hidden md:block text-sm font-medium ${logoFont.className}
          `}
          >
            QuantQuant
          </p>
        </Link>

        {/* Search bar */}
        <div className="flex md:mr-20">Search bar</div>
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
