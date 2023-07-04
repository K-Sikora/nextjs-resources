import React from "react";
import { api } from "~/utils/api";
import Head from "next/head";
import Link from "next/link";
import ResourcesLoading from "~/components/ResourcesLoading";
import { useUser } from "@clerk/nextjs";
import { AiFillGithub, AiFillHeart } from "react-icons/ai";
import { IoMdCreate } from "react-icons/io";

const UserPage: NextPage<{ username: string }> = ({ username }) => {
  const user = useUser();

  const { data } = api.profile.getUserInfo.useQuery({
    username,
  });

  if (!data || !data.username) {
    return <NotFoundPage />;
  }

  const { data: likedResourcesData, isLoading: isLoadingLikedResources } =
    api.like.getLikedByUser.useQuery({
      userId: data.id,
    });
  const { data: createdResourcesData, isLoading: isLoadingCreatedResources } =
    api.profile.getResourcesByUser.useQuery({
      userId: data.id,
    });
  const { data: userStats } = api.like.getUserStats.useQuery({
    userId: data.id,
  });
  return (
    <>
      <Head>
        {user.isLoaded && <title>Profile page - {username}</title>}
        <meta name="description" content="Next.js Resources" />
      </Head>
      <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-4 px-4 py-12 text-slate-800 md:grid md:grid-cols-5 md:py-24 lg:gap-8">
        <div className="col-span-1 flex flex-col items-center justify-center gap-4 rounded-lg border py-4 text-center md:sticky md:left-0 md:top-4 md:h-96 md:py-0">
          <img
            alt={`${data.username || ""} profile picture`}
            src={data.profileImageUrl}
            className="h-36 w-36 rounded-full border-2 border-slate-300 sm:h-24 sm:w-24 lg:h-36 lg:w-36"
          />
          <h2 className="truncate text-xl font-semibold sm:w-28 lg:w-40">
            {data.username}
          </h2>
          <div className="flex flex-col items-center gap-2">
            <h4 className="flex items-center justify-center gap-1 font-medium lg:text-lg">
              <AiFillHeart /> Liked: {userStats?.likeCount}
            </h4>
            <h4 className="flex items-center justify-center gap-1 font-medium lg:text-lg">
              <IoMdCreate /> Added: {userStats?.createdCount}
            </h4>
            <Link href={`https://github.com/${data.username}`}>
              <AiFillGithub size={32} />
            </Link>
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-12 rounded-lg md:grid md:grid-cols-2 md:gap-4 md:border md:p-4">
          <div className="">
            <h3 className="flex items-center justify-center gap-2 p-4 text-xl font-medium md:p-0">
              Favourite resources
              <AiFillHeart className="text-slate-600" size={20} />
            </h3>
            <div className="mt-8 flex flex-col gap-4">
              {isLoadingLikedResources && user.isLoaded
                ? Array.from({ length: 12 }).map((_, index) => (
                    <ResourcesLoading key={index} />
                  ))
                : likedResourcesData?.map((item) => (
                    <ResourceCard
                      key={item.resource.id}
                      data={item}
                      shadowEnabled={false}
                    />
                  ))}
              {likedResourcesData && likedResourcesData.length <= 0 && (
                <div className="mb-4 text-center text-lg">Nothing found 😞</div>
              )}
            </div>
          </div>
          <div className="">
            <h3 className="flex items-center justify-center gap-2 p-4 text-xl font-medium md:p-0">
              Added resources
              <IoMdCreate className="text-slate-600" size={20} />
            </h3>
            <div className="mt-8 flex flex-col gap-4">
              {isLoadingCreatedResources && user.isLoaded
                ? Array.from({ length: 12 }).map((_, index) => (
                    <ResourcesLoading key={index} />
                  ))
                : createdResourcesData?.map((item) => (
                    <ResourceCard
                      key={item.resource.id}
                      data={item}
                      shadowEnabled={false}
                    />
                  ))}
              {createdResourcesData && createdResourcesData.length <= 0 && (
                <div className="mb-4 text-center text-lg">Nothing found 😞</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { type GetStaticProps, type NextPage } from "next";
import NotFoundPage from "../404";
import ResourceCard from "~/components/ResourceCard";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });
  const slug = context.params?.username;

  if (typeof slug !== "string") throw new Error("no user");

  await ssg.profile.getUserInfo.prefetch({ username: slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username: slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default UserPage;
