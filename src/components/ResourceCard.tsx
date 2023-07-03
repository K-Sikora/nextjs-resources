import { Card, Grid, Loading, Text } from "@nextui-org/react";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { badgeVariants } from "./ui/badge";
import { Button, buttonVariants } from "./ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
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
import { GetServerSidePropsContext } from "next";
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
    onSuccess: (data) => {
      console.log("likeData", data);

      void context.invalidate();
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
    <Card
      css={{
        p: "$4",
        shadow: props.shadowEnabled ? "" : "none",
        dropShadow: props.shadowEnabled ? "$sm" : "none",
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
              <p className="break-all">{cardData.resource.title}</p>
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
                          "You need to be signed in to like a resource",
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
            <Text
              className="w-48 truncate break-all lg:w-60"
              css={{ color: "$accents8" }}
            >
              <Link
                href={
                  cardData.resource.link.startsWith("https://")
                    ? cardData.resource.link
                    : `https://${cardData.resource.link}`
                }
              >
                {cardData.resource.link.replace(/^(https?:\/\/)?(www\.)?/, "")}
              </Link>
            </Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2", justifyContent: "space-between" }}>
        <Text className="my-2 line-clamp-3">
          {cardData.resource.description}
        </Text>
        <div className="my-2 flex flex-wrap gap-2">
          {cardData.resource.tags?.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.name}`}
              className={badgeVariants({ variant: "outline" })}
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
              href={`/user/${cardData.author.username!}`}
            >
              <span className="w-24 truncate text-right">
                {cardData.author.username}
              </span>
              <img
                className="h-7 w-7 rounded-full"
                src={cardData.author.profileImageUrl}
              />
            </Link>
          </h4>
        )}
      </Card.Footer>
    </Card>
  );
};

export default ResourceCard;
