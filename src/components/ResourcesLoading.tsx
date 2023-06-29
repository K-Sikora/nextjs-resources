import { Card, Grid, Text } from "@nextui-org/react";
import { RouterOutputs } from "~/utils/api";
import { Skeleton } from "./ui/skeleton";

import { buttonVariants } from "./ui/button";

const ResourceCard = () => {
  return (
    <Card css={{ p: "$4", shadow: "none", dropShadow: "none" }}>
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
            <Skeleton className="h-[15px] w-24 bg-slate-900/30" />
          </Grid>
          <Grid xs={12}>
            <Skeleton className="mt-1 h-[15px] w-20 bg-slate-900/30" />
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2", justifyContent: "space-between", gap: "$4" }}>
        <Skeleton className="h-[20px] w-48 bg-slate-900/30" />
        <div className="my-2 flex flex-wrap gap-2">
          <Skeleton className="h-[15px] w-12 bg-slate-900/30" />
          <Skeleton className="h-[15px] w-12 bg-slate-900/30" />
          <Skeleton className="h-[15px] w-12 bg-slate-900/30" />
          <Skeleton className="h-[15px] w-12 bg-slate-900/30" />
          <Skeleton className="h-[15px] w-12 bg-slate-900/30" />
        </div>
      </Card.Body>
      <Card.Footer className="flex items-center justify-between">
        <div className={buttonVariants({ variant: "default", size: "sm" })}>
          See details
        </div>
        <h4 className="flex items-center justify-center gap-1">
          <div className="flex items-center gap-1">
            <Skeleton className="h-[20px] w-20 bg-slate-900/30" />
            <Skeleton className="h-7 w-7 rounded-full bg-slate-900/30" />
          </div>
        </h4>
      </Card.Footer>
    </Card>
  );
};

export default ResourceCard;
