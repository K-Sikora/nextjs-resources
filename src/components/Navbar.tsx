import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { FaPlus, FaHome } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { SignOutButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import DropdownAvatar from "~/components/DropdownAvatar";
export default function Navbar() {
  const user = useUser();
  return (
    <nav className="border-2 border-gray-200">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <img src="/nextjs.svg" className="mr-3 h-8" alt="Site logo" />
          <span className="self-center whitespace-nowrap text-lg font-medium dark:text-white md:text-2xl">
            Resources
          </span>
        </Link>

        <div className="w-auto" id="navbar-default">
          {user.isSignedIn ? (
            <DropdownAvatar />
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
