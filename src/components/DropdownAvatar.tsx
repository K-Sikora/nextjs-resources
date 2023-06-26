import { useUser } from "@clerk/nextjs";
import { Dropdown, Avatar, Text, Grid, User } from "@nextui-org/react";
import { SignOutButton } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
export default function DropdownAvatar() {
  const user = useUser();
  const { signOut } = useClerk();
  return (
    <Grid.Container justify="flex-start" gap={2}>
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
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Signed in as
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                {user.user?.username}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
              My Profile
            </Dropdown.Item>
            <Dropdown.Item key="team_settings">View Resources</Dropdown.Item>

            <Dropdown.Item key="help_and_feedback" withDivider>
              Help & Feedback
            </Dropdown.Item>
            <Dropdown.Item key="logout" color="error" withDivider>
              <button
                onClick={() => {
                  signOut();
                }}
                className="flex w-full"
              >
                Log out
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
    </Grid.Container>
  );
}
