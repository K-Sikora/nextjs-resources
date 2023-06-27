import { Card, Grid, Text } from "@nextui-org/react";
import { buttonVariants } from "~/components/ui/button";
import Link from "next/link";
type Props = {
  title: string;
  description: string;
  link: string;
  imgUrl: string;
};
export default function SingleCard(props: Props) {
  const { title, description, link, imgUrl } = props;
  return (
    <Card css={{ p: "$6", mw: "400px" }}>
      <Card.Header>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 shadow-md shadow-slate-900/20">
          <img alt={title} src={imgUrl} className="h-5 w-5" />
        </div>
        <Grid.Container css={{ pl: "$6" }}>
          <Grid xs={12}>
            <Text size="$lg" h3 css={{ lineHeight: "$xs" }}>
              {title}
            </Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2" }}>
        <Text>{description}</Text>
      </Card.Body>
      <Card.Footer>
        <Link
          href={link}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          See {title}
        </Link>
      </Card.Footer>
    </Card>
  );
}
