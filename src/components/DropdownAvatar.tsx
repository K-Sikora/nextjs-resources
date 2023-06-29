import { useUser } from "@clerk/nextjs";
import { Dropdown, Avatar, Text, Grid, User } from "@nextui-org/react";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DropdownAvatar() {
  const user = useUser();
  return (
    <Grid.Container css={{ p: "$0" }} justify="flex-start" gap={2}>
      <Grid>
        <Dropdown placement="bottom-right">
          <Dropdown.Trigger>
            <Avatar
              bordered
              size="md"
              as="button"
              color="default"
              src={user.user?.profileImageUrl}
            />
          </Dropdown.Trigger>
          <Dropdown.Menu color="default" aria-label="Avatar Actions">
            <Dropdown.Item key="profile" css={{ height: "$18", p: "$0" }}>
              <Text className="px-2" b color="inherit" css={{ d: "flex" }}>
                Signed in as
              </Text>
              <Text className="px-2" b color="inherit" css={{ d: "flex" }}>
                {user.user?.username}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item css={{ p: "$0" }} key="my_profile" withDivider>
              <Link
                className="block w-full px-2 py-1"
                href={`/user/${user.user?.username || ""}`}
              >
                My Profile
              </Link>
            </Dropdown.Item>
            <Dropdown.Item css={{ p: "$0" }} withDivider key="add_resource">
              <Link className="block w-full px-2 py-1" href="/resources/add">
                Add Resource
              </Link>
            </Dropdown.Item>
            <Dropdown.Item css={{ p: "$0" }} key="view_resources">
              <Link className="block w-full px-2 py-1" href="/resources">
                View Resources
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="help_and_feedback"
              withDivider
            >
              <Link className="block w-full px-2 py-1" href="/">
                Help & Feedback
              </Link>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ p: "$0" }}
              key="logout"
              color="error"
              withDivider
            >
              <SignOutButton>
                <button className="flex w-full px-2">Log out</button>
              </SignOutButton>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
    </Grid.Container>
  );
}
