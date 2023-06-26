import { Card, Grid, Text } from "@nextui-org/react";
import { buttonVariants } from "~/components/ui/button";
import Link from "next/link";
export default function SingleCard() {
  return (
    <Card css={{ p: "$6", mw: "400px" }}>
      <Card.Header>
        <img
          alt="nextui logo"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width="34px"
          height="34px"
        />
        <Grid.Container css={{ pl: "$6" }}>
          <Grid xs={12}>
            <Text h4 css={{ lineHeight: "$xs" }}>
              UI libraries
            </Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2" }}>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat amet
          facilis aspernatur ad dolore nulla veritatis distinctio rerum qui!
          Nisi.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Link href="" className={buttonVariants({ variant: "secondary" })}>
          Explore resources
        </Link>
      </Card.Footer>
    </Card>
  );
}
