import { useRouter } from "next/router";
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
  const router = useRouter();

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
        <title>{username} - Profile page</title>
      </Head>
      <main className="mx-auto grid min-h-screen w-full max-w-screen-xl grid-cols-5 gap-8 px-4 py-12 text-slate-800 md:py-24">
        <div className="sticky left-0 top-4 col-span-1 flex h-96 flex-col items-center justify-center gap-4 rounded-lg border text-center">
          <img
            src={data.profileImageUrl}
            className="w-36 rounded-full border-2 border-slate-300"
          />
          <h2 className="text-xl font-semibold">{data.username}</h2>
          <div className="flex flex-col items-center gap-2">
            <h4 className="flex items-center justify-center gap-1 text-lg font-medium">
              <AiFillHeart /> Liked: {userStats?.likeCount}
            </h4>
            <h4 className="flex items-center justify-center gap-1 text-lg font-medium">
              <IoMdCreate /> Created: {userStats?.createdCount}
            </h4>
            <Link href={`https://github.com/${data.username}`}>
              <AiFillGithub size={32} />
            </Link>
          </div>
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-4 rounded-lg border p-4">
          <div>
            <h3 className="text-xl font-medium">Favourite resources</h3>
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
                <div className="text-center text-xl">
                  Looks like it&apos;s empty 😞
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium">Created resources</h3>
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
                <div className="text-center text-xl">
                  Looks like it&apos;s empty 😞
                </div>
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
import { GetStaticProps, NextPage } from "next";
import NotFoundPage from "../404";
import ResourceCard from "~/components/ResourceCard";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
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
