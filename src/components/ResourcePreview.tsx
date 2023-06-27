import { Card, Grid, Text } from "@nextui-org/react";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";

import { badgeVariants } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { useUser } from "@clerk/nextjs";
type Props = {
  title: string;
  description: string;
  link: string;
  tags: string;
};
const splitTagsToArray = (tags: string) => {
  return tags
    .replace(/\s/g, "")
    .split(",")
    .map((tag) => {
      if (tag.trim() !== "") {
        return (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className={badgeVariants({ variant: "outline" })}
          >
            {tag}
          </Link>
        );
      } else {
        return null;
      }
    })
    .filter((tag) => tag !== null);
};

const ResourcePreview = (props: Props) => {
  const user = useUser();
  return (
    <Card css={{ p: "$6", shadow: "none" }}>
      <Card.Header>
        <img
          alt="logo"
          className="flex-shrink-0"
          src="/nextjs.svg"
          width="34px"
          height="34px"
        />
        <Grid.Container css={{ pl: "$6" }}>
          <Grid xs={12}>
            <Text h4 css={{ lineHeight: "$xs" }}>
              {props.title}
            </Text>
          </Grid>
          <Grid xs={12}>
            <Text css={{ color: "$accents8" }}>{props.link}</Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2" }}>
        <Text>{props.description}</Text>
        <div className="my-2 flex flex-wrap gap-2">
          {splitTagsToArray(props.tags)}
        </div>
      </Card.Body>
      <Card.Footer className="flex items-center justify-between">
        <Link
          href={props.link}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          See details
        </Link>
        <h4 className="flex items-center justify-center gap-1">
          <div className="flex items-center gap-1">
            {user.user?.username}
            <img
              className="h-7 w-7 rounded-full"
              src={user.user?.profileImageUrl}
            />
          </div>
        </h4>
      </Card.Footer>
    </Card>
  );
};

export default ResourcePreview;
