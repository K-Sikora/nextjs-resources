import { useRouter } from "next/router";
import React from "react";
import type { Category } from "@prisma/client";
import { RouterOutputs, api } from "~/utils/api";
import { categoriesSlug } from "~/constants/categories";
import { useUser } from "@clerk/nextjs";
import ResourcesLoading from "~/components/ResourcesLoading";
import ResourceCard from "~/components/ResourceCard";
import Head from "next/head";
import CategoriesNav from "~/components/CategoriesNav";

const CategoryPage = () => {
  const user = useUser();
  const router = useRouter();
  const { category } = router.query;
  const { data, isLoading, isError } =
    api.category.getResourceByCategory.useQuery(
      {
        category: category as
          | "other"
          | "packages"
          | "tools"
          | "tutorials"
          | "starters"
          | "ui-libraries",
      },
      { enabled: !!category }
    );
  type ResourcesOutput =
    RouterOutputs["category"]["getResourceByCategory"][number];

  if (category && !categoriesSlug.includes(category as string)) {
    void router.push("/404");
  }

  if (isLoading && user.isLoaded) {
    return (
      <>
        <CategoriesNav />
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 py-6 md:grid-cols-2 md:py-12">
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
        <title>
          Next.js Resources | {data ? data[0]?.resource.category : ""}
        </title>
        <meta name="description" content="Next.js Resources" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CategoriesNav />

      <main className="min-h-screen">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 py-6 md:grid-cols-2 md:py-12">
          {data?.map((i: ResourcesOutput) => (
            <ResourceCard key={i.resource.id} data={i} shadowEnabled={true} />
          ))}
        </div>
      </main>
    </>
  );
};

export default CategoryPage;
