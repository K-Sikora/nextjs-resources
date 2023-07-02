import { useUser } from "@clerk/nextjs";
import { Dropdown, Avatar, Text, Grid, User } from "@nextui-org/react";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function DropdownAvatar() {
  const user = useUser();
  return (
    <Grid.Container css={{ p: "$0" }} justify="flex-end" gap={2}>
      <Grid>
        <Dropdown placement="bottom-right">
          <Dropdown.Trigger css={{ zIndex: 10 }}>
            <Avatar
              bordered
              size="lg"
              as="button"
              color="default"
              src={user.user?.profileImageUrl}
            />
          </Dropdown.Trigger>
          <Dropdown.Menu color="default" aria-label="Avatar Actions">
            <Dropdown.Item
              key="profile"
              css={{ height: "$18", p: "$0" }}
              className={`${inter.className} text-base font-medium`}
            >
              <Link
                className="block w-full px-2 py-1"
                href={`/user/${user.user?.username || ""}`}
              >
                <Text b color="inherit" css={{ d: "flex" }}>
                  Signed in as
                </Text>
                <Text b color="inherit" css={{ d: "flex" }}>
                  {user.user?.username}
                </Text>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="my_profile"
              className={`${inter.className} text-sm font-medium`}
            >
              <Link
                className="block w-full px-2 py-2"
                href={`/user/${user.user?.username || ""}`}
              >
                My Profile
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="add_resource"
              className={`${inter.className} text-sm font-medium`}
            >
              <Link className="block w-full px-2 py-2" href="/resources/add">
                Add Resource
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="view_resources"
              className={`${inter.className} text-sm font-medium`}
            >
              <Link className="block w-full px-2 py-2" href="/resources">
                View Resources
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="help_and_feedback"
              className={`${inter.className} text-sm font-medium`}
            >
              <Link
                className="block w-full px-2 py-2"
                href="/terms-and-conditions"
              >
                Terms &amp; Conditions
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="account_settings"
              className={`${inter.className} text-sm font-medium`}
            >
              <Link className="block w-full px-2 py-2" href="/user-settings">
                Account Settings
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="logout"
              color="error"
              className={`${inter.className} text-sm font-medium`}
            >
              <SignOutButton>
                <button className="flex w-full px-2 py-2 font-semibold">
                  Log out
                </button>
              </SignOutButton>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
    </Grid.Container>
  );
}
