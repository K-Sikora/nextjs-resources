import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import CategoriesNav from "~/components/CategoriesNav";
import ResourceCard from "~/components/Resource/ResourceCard";
import ResourcesLoading from "~/components/Loading/ResourcesLoading";
import { api } from "~/utils/api";

const SearchPage = () => {
  const router = useRouter();
  const user = useUser();
  const searchQuery = router.query.q;
  if (!searchQuery) return null;
  if (Array.isArray(searchQuery)) return null;
  const { data, isLoading } = api.resource.getByName.useQuery({
    name: searchQuery,
  });
  if (data && data.length <= 0) {
    return (
      <div className="mb-4 min-h-screen py-24 text-center text-3xl font-semibold">
        Nothing found 😞
      </div>
    );
  }
  if (isLoading && user.isLoaded) {
    return (
      <>
        <CategoriesNav />
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 pb-24 pt-6 md:grid-cols-2 md:pt-12">
          {Array.from({ length: 12 }).map((_, index) => (
            <ResourcesLoading key={index} />
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Search - {searchQuery}</title>
        <meta name="description" content="Next.js Resources" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CategoriesNav />
      <main className="min-h-screen">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 pb-24 pt-6 md:grid-cols-2 md:pt-12">
          {data?.map((item) => (
            <ResourceCard
              key={item.resource.id}
              data={item}
              shadowEnabled={true}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default SearchPage;
