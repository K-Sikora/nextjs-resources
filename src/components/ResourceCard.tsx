import { Card, Grid, Text } from "@nextui-org/react";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";

import { badgeVariants } from "./ui/badge";
import { buttonVariants } from "./ui/button";
type ResourcesOutput = RouterOutputs["resource"]["getAll"][number];

type Props = {
  data: ResourcesOutput;
};
const splitTagsToArray = (tags: string) => {
  return tags.split(",").map((tag) => {
    return (
      <Link
        key={tag}
        href={`/tags/${tag}`}
        className={badgeVariants({ variant: "outline" })}
      >
        {tag}
      </Link>
    );
  });
};
const ResourceCard = (props: Props) => {
  const { data } = props;

  return (
    <Card css={{ p: "$6", mw: "400px" }}>
      <Card.Header>
        <img alt="nextui logo" src="./nextjs.svg" width="34px" height="34px" />
        <Grid.Container css={{ pl: "$6" }}>
          <Grid xs={12}>
            <Text h4 css={{ lineHeight: "$xs" }}>
              {data.resource.title}
            </Text>
          </Grid>
          <Grid xs={12}>
            <Text css={{ color: "$accents8" }}>{data.resource.link}</Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2" }}>
        <Text>{data.resource.description}</Text>
        <div className="my-2 flex flex-wrap gap-2">
          {splitTagsToArray(data.resource.tags)}
        </div>
      </Card.Body>
      <Card.Footer className="flex items-center justify-between">
        <Link
          href={data.resource.link}
          className={buttonVariants({ variant: "default" })}
        >
          See details
        </Link>
        {data.author && (
          <span className="flex items-center justify-center gap-1">
            By: {data.author.username}
            <img
              className="h-7 w-7 rounded-full"
              src={data.author.profileImageUrl}
            />
          </span>
        )}
      </Card.Footer>
    </Card>
  );
};

export default ResourceCard;
