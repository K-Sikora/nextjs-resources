import Link from "next/link";
import { Button, buttonVariants } from "../../ui/button";
import { FaPlus } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import DropdownAvatar from "./DropdownAvatar";
import SearchBar from "./SearchBar";
import MobileSearchBar from "./MobileSearchBar";
import ThemeSwitch from "./ThemeSwitch";
export default function Navbar() {
  const user = useUser();

  return (
    <nav className="relative border-b-2 border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex h-20 max-w-screen-xl flex-wrap items-center justify-between px-4 md:grid md:grid-cols-5">
        <Link href="/" className="flex max-w-fit items-center">
          <img
            src="/logo.svg"
            className="w-12 rounded-full border"
            alt="Site logo"
          />
        </Link>

        <SearchBar />
        <div className="flex items-center justify-end gap-3">
          <ThemeSwitch />
          <MobileSearchBar />
          {user.isSignedIn ? (
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href="/resources/add"
                      className={`${buttonVariants({
                        variant: "default",
                        size: "icon",
                      })} flex h-8 w-8 shrink-0 items-center justify-center`}
                    >
                      <FaPlus className="w-full" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new resource</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownAvatar />
            </div>
          ) : (
            <SignInButton>
              <Button variant="default" size="sm">
                <h4 className="flex items-center justify-center gap-2 text-base">
                  <MdLogin className="h-4 w-4" />
                  <span>Sign in</span>
                </h4>
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
