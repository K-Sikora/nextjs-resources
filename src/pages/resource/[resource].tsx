import { GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";
import React from "react";
import { prisma } from "~/server/db";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { FaRegDotCircle, FaStar } from "react-icons/fa";
import Link from "next/link";
import { badgeVariants } from "~/components/ui/badge";
import { AiFillGithub, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { EditMenu } from "~/components/EditMenu";
import NotFoundPage from "../404";
import { buttonVariants } from "~/components/ui/button";
type Tag = {
  id: string;
  name: string;
};

type Data = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: Tag[];
  githubLink: string;
  likesCount: number;
};
type GithubData = {
  html_url: string;
  owner: {
    avatar_url: string;
  };
  homepage: string;
  name: string;
  full_name: string;
  stargazers_count: number;
  description: string;
  open_issues_count: number;
};
type Props = {
  status: number;
  resource: string;
  data: Data;
  githubData: GithubData;
};

const ResourcePage = (props: Props) => {
  const { toast } = useToast();
  const user = useUser();
  const [favorite, setFavorite] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const context = api.useContext();
  const { data: singleData } = api.resource.getSingle.useQuery({
    id: props.data.id,
  });
  const {
    data: userLiked,
    isLoading: isLoadingLike,
    isFetching,
  } = api.like.check.useQuery({
    resourceId: props.data.id,
  });
  const { mutate, isLoading } = api.like.create.useMutation({
    onSuccess: (data) => {
      void context.invalidate();
    },
  });
  useEffect(() => {
    if (userLiked !== undefined) {
      setFavorite(userLiked);
    }
  }, [userLiked]);
  useEffect(() => {
    if (singleData?.resource.likesCount) {
      setLikeNumber(singleData.resource.likesCount);
    }
  }, [singleData?.resource.likesCount]);

  if (props.status !== 200) {
    return <NotFoundPage />;
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-screen-xl px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 items-start justify-between gap-6 rounded-lg border px-4 py-8 md:grid-cols-5 md:gap-8 lg:px-12">
        <Link
          className="md:hidden"
          target="_blank"
          href={props.githubData.html_url}
        >
          <h3 className="font-medium md:hidden">
            {props.githubData.full_name}
          </h3>
        </Link>
        <div className="flex w-full justify-between md:col-span-1 md:w-auto">
          <div className="flex flex-col gap-2">
            <Link target="_blank" href={props.githubData.html_url}>
              <img
                src={props.githubData.owner.avatar_url}
                className="h-24 w-24 rounded-full"
              />
            </Link>
            <Link target="_blank" href={props.githubData.html_url}>
              <h3 className="hidden font-medium md:block">
                {props.githubData.full_name}
              </h3>
            </Link>
          </div>
          <div className="flex flex-col items-end justify-between gap-4 md:hidden">
            <div className="flex flex-col items-center gap-1">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-md border-2 p-1"
                disabled={isLoading || isFetching || isLoadingLike}
                onClick={() => {
                  if (user.isSignedIn) {
                    setFavorite(!favorite);
                    setLikeNumber((prev) => prev + (favorite ? -1 : 1));
                    mutate({
                      resourceId: props.data.id,
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
                      className="relative"
                    >
                      <AiFillHeart
                        size={24}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <AiOutlineHeart
                        size={24}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <span>{likeNumber}</span>
            </div>
            {singleData?.author && (
              <h4 className="flex items-center justify-center gap-1 text-lg">
                <Link
                  className="flex items-center gap-1"
                  href={`/user/${singleData.author.username!}`}
                >
                  {singleData.author.username}
                  <img
                    className="h-8 w-8 rounded-full"
                    src={singleData.author.profileImageUrl}
                  />
                </Link>
              </h4>
            )}
            {user.isSignedIn && user.user.id === singleData?.author?.id && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <EditMenu cardId={singleData?.resource.id} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit resource</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 md:col-span-3">
          <Link
            target="_blank"
            href={props.githubData.html_url}
            className="duration-150 hover:text-slate-700"
          >
            <AiFillGithub size={32} />
          </Link>
          <p>{props.githubData.description}</p>
          <Link
            href={`https://${
              props.githubData.homepage || (singleData?.resource.link as string)
            }`}
            className={buttonVariants({ variant: "link", size: "link" })}
          >
            {props.githubData.homepage || singleData?.resource.link}
          </Link>
          <span className="flex items-center gap-1 font-medium">
            <FaStar />
            {props.githubData.stargazers_count}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <FaRegDotCircle />
            {props.githubData.open_issues_count}
          </span>
        </div>
        <div className="hidden flex-col items-start gap-3 md:flex md:items-start">
          <div className="flex items-center gap-2 text-lg">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-md border-2 p-1"
              disabled={isLoading || isFetching || isLoadingLike}
              onClick={() => {
                if (user.isSignedIn) {
                  setFavorite(!favorite);
                  setLikeNumber((prev) => prev + (favorite ? -1 : 1));
                  mutate({
                    resourceId: props.data.id,
                    userId: user.user.id,
                  });
                } else {
                  toast({
                    description: "You need to be signed in to like a resource",
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
                    <AiFillHeart
                      size={24}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
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
                    <AiOutlineHeart
                      size={24}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <span>{likeNumber}</span>
          </div>
          {singleData?.author && (
            <h4 className="flex items-center justify-center gap-1">
              <Link
                className="flex items-center gap-1 text-lg"
                href={`/user/${singleData.author.username!}`}
              >
                <img
                  className="h-9 w-9 rounded-full"
                  src={singleData.author.profileImageUrl}
                />
                {singleData.author.username}
              </Link>
            </h4>
          )}
          {user.isSignedIn && user.user.id === singleData?.author?.id && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <EditMenu cardId={singleData?.resource.id} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit resource</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="mt-12 flex w-full justify-start md:col-span-5">
          <p className="leading-relaxed md:text-lg">{props.data.description}</p>
        </div>
        <div className="mt-8 flex w-full items-start justify-start gap-3 md:col-span-5">
          {props.data.tags.map((tag: Tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.name}`}
              className={badgeVariants({ variant: "default" })}
            >
              <span className="text-sm font-medium">{tag.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const resource = context.params?.resource?.toString().toLowerCase();
  const data = await prisma.nextResource.findFirst({
    where: {
      title: resource as string,
    },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      tags: true,
      githubLink: true,
      likesCount: true,
    },
  });

  const url = data?.githubLink as string;
  if (!url) return { props: { status: 404 } };
  const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, "");
  const path = urlWithoutProtocol.split("/").slice(1).join("/");
  const res = await fetch(`https://api.github.com/repos/${path}`);
  const resData: GithubData = (await res.json()) as GithubData;
  console.log(resData);
  return {
    props: {
      status: res.status,
      resource: resource,
      data: data,
      githubData: resData,
    },
  };
}

export default ResourcePage;
