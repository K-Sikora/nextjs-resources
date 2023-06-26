import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { FaPlus, FaHome } from "react-icons/fa";
import { SignOutButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import DropdownAvatar from "~/components/DropdownAvatar";
export default function Navbar() {
  const user = useUser();
  return (
    <nav className="relative border-gray-200">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link href="https://flowbite.com/" className="flex items-center">
          <img src="./nextjs.svg" className="mr-3 h-8" alt="Site logo" />
          <span className="self-center whitespace-nowrap text-lg font-medium dark:text-white md:text-2xl">
            Resources
          </span>
        </Link>

        <div className="w-auto" id="navbar-default">
          {user.isSignedIn ? (
            <DropdownAvatar />
          ) : (
            <SignInButton>
              <Button variant="secondary">Login</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
