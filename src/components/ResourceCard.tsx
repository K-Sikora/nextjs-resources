import { Card, Grid, Text } from "@nextui-org/react";
import Link from "next/link";
import { type RouterOutputs, api } from "~/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { badgeVariants } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { EditMenu } from "./EditMenu";
type ResourcesOutput = RouterOutputs["resource"]["getAll"][number];

type Props = {
  data: ResourcesOutput;
  shadowEnabled: boolean;
};

const ResourceCard = (props: Props) => {
  const { toast } = useToast();

  const user = useUser();
  const [favorite, setFavorite] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const context = api.useContext();

  const { data: cardData } = props;
  const {
    data: userLiked,
    isLoading: isLoadingLike,
    isFetching,
  } = api.like.check.useQuery({
    resourceId: cardData.resource.id,
  });
  const { mutate, isLoading } = api.like.create.useMutation({
    onSuccess: async () => {
      await context.invalidate();
    },
  });

  useEffect(() => {
    if (userLiked !== undefined) {
      setFavorite(userLiked);
    }
  }, [userLiked]);
  useEffect(() => {
    if (cardData.resource.likesCount) {
      setLikeNumber(cardData.resource.likesCount);
    }
  }, [cardData.resource.likesCount]);

  return (
    <div className="rounded-xl shadow-lg shadow-slate-950/5 dark:shadow-slate-500/5">
      <Card
        css={{
          backgroundColor: "inherit",
          p: "$4",
          color: "inherit",
          shadow: "none",
          dropShadow: "none",
        }}
      >
        <Card.Header>
          <img
            alt="resource"
            className="flex-shrink-0 rounded-full"
            src={cardData.resource.githubAvatar || "/resource.svg"}
            width={40}
            height={40}
          />
          <Grid.Container css={{ pl: "$6" }}>
            <Grid xs={12}>
              <div className="flex w-full items-center justify-between gap-2">
                <Link
                  href={`/resource/${cardData.resource.id}`}
                  className="break-all"
                >
                  {cardData.resource.title}
                </Link>
                <div className="flex items-center gap-2">
                  <p className="text-lg">{likeNumber}</p>

                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md border-2 p-1"
                    disabled={isLoading || isFetching || isLoadingLike}
                    onClick={() => {
                      if (user.isSignedIn) {
                        setFavorite(!favorite);
                        setLikeNumber((prev) => prev + (favorite ? -1 : 1));
                        mutate({
                          resourceId: cardData.resource.id,
                          userId: user.user.id,
                        });
                      } else {
                        toast({
                          description:
                            "You need to be signed in to like a resource.",
                        });
                      }
                    }}
                  >
                    <AnimatePresence>
                      {favorite ? (
                        <motion.div
                          key={1}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          exit={{ opacity: 0 }}
                          className="relative"
                        >
                          <AiFillHeart className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key={2}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          exit={{ opacity: 0 }}
                          className="relative"
                        >
                          <AiOutlineHeart className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </Grid>
            <Grid xs={12}>
              <p className="w-48 truncate break-all text-slate-400 lg:w-60">
                <Link
                  href={
                    cardData.resource.link.startsWith("https://")
                      ? cardData.resource.link
                      : `https://${cardData.resource.link}`
                  }
                >
                  {cardData.resource.link.replace(
                    /^(https?:\/\/)?(www\.)?/,
                    ""
                  )}
                </Link>
              </p>
            </Grid>
          </Grid.Container>
        </Card.Header>
        <Card.Body css={{ py: "$2", justifyContent: "space-between" }}>
          <p className="my-2 line-clamp-3">{cardData.resource.description}</p>
          <div className="my-2 flex flex-wrap gap-1 md:line-clamp-1 md:h-7">
            {cardData.resource.tags?.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.name}`}
                className={`${badgeVariants({ variant: "outline" })} mx-1`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </Card.Body>
        <Card.Footer className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {cardData.resource.githubLink && (
              <Link
                href={`/resource/${cardData.resource.id}`}
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Details
              </Link>
            )}
            {user.isSignedIn && user.user.id === cardData.author?.id && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <EditMenu cardId={cardData.resource.id} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit resource</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {cardData.author && (
            <h4 className="flex items-center justify-center gap-1">
              <Link
                className="flex items-center gap-1"
                href={`/user/${cardData.author.username || ""}`}
              >
                <span className="w-24 truncate text-right">
                  {cardData.author.username}
                </span>
                <img
                  alt={`${cardData.author.username || ""} profile picture`}
                  className="h-7 w-7 rounded-full"
                  src={cardData.author.profileImageUrl}
                />
              </Link>
            </h4>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ResourceCard;
