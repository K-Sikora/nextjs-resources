import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
export default function DropdownAvatar() {
  const user = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user.user?.profileImageUrl && user.user?.profileImageUrl}
            alt="User profile image"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`${inter.className}`}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Link
            className="block w-full px-2 py-1.5 dark:text-slate-100"
            href={`/user/${user.user?.username || ""}`}
          >
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link
            className="block w-full px-2 py-1.5 dark:text-slate-100"
            href="/resources/add"
          >
            Add Resource
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link
            className="block w-full px-2 py-1.5 dark:text-slate-100"
            href="/resources"
          >
            View Resources
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link
            className="block w-full px-2 py-1.5 dark:text-slate-100"
            href="/terms-and-conditions"
          >
            Terms &amp; Conditions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link
            className="block w-full px-2 py-1.5 dark:text-slate-100"
            href="/user-settings"
          >
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0">
          <SignOutButton>
            <button className="flex w-full px-2 py-1.5 font-semibold text-red-600">
              Log out
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
