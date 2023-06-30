import { Card, Grid, Loading, Text } from "@nextui-org/react";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { badgeVariants } from "./ui/badge";
import { Button, buttonVariants } from "./ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { BsThreeDotsVertical } from "react-icons/bs";
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
        dropShadow: props.shadowEnabled ? "$md" : "none",
      }}
    >
      <Card.Header>
        <img
          alt="logo"
          className="flex-shrink-0"
          src="/logo.svg"
          width="34px"
          height="34px"
        />
        <Grid.Container css={{ pl: "$6" }}>
          <Grid xs={12}>
            <div className="flex w-full items-center justify-between">
              <p>{cardData.resource.title}</p>
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        exit={{ opacity: 0 }}
                        key={1}
                        className="relative"
                      >
                        <AiFillHeart className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        exit={{ opacity: 0 }}
                        key={2}
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
            <Text css={{ color: "$accents8" }}>{cardData.resource.link}</Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2", justifyContent: "space-between" }}>
        <Text>{cardData.resource.description}</Text>
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
          <Link
            href={`/resource/${cardData.resource.link}`}
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            See details
          </Link>
          {user.isSignedIn && user.user.id === cardData.author?.id && (
            <EditMenu cardId={cardData.resource.id} />
          )}
        </div>
        {cardData.author && (
          <h4 className="flex items-center justify-center gap-1">
            <Link
              className="flex items-center gap-1"
              href={`/user/${cardData.author.username!}`}
            >
              {cardData.author.username}
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
