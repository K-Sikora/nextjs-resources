import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { FaPlus, FaHome } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { SignOutButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import DropdownAvatar from "~/components/DropdownAvatar";
import SearchBar from "./SearchBar";
import MobileSearchBar from "./MobileSearchBar";
export default function Navbar() {
  const user = useUser();
  return (
    <nav className="relative border-2 border-gray-200">
      <div className="mx-auto flex h-20 max-w-screen-xl flex-wrap items-center justify-between px-4 md:grid md:grid-cols-5">
        <Link href="/" className="flex max-w-fit items-center">
          <img src="/logo.svg" className="w-10" alt="Site logo" />
        </Link>
        <SearchBar />
        <div
          className="flex items-center justify-end gap-3"
          id="navbar-default"
        >
          <MobileSearchBar />
          {user.isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/resources/add"
                className={`${buttonVariants({
                  variant: "default",
                  size: "icon",
                })} flex h-8 w-8 shrink-0 items-center justify-center`}
              >
                <FaPlus className="w-full" />
              </Link>
              <DropdownAvatar />
            </div>
          ) : (
            <SignInButton>
              <Button variant="default">
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
