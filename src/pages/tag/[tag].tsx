import { useRouter } from "next/router";
import React from "react";
import ResourcesLoading from "~/components/ResourcesLoading";
import { useUser } from "@clerk/nextjs";
import CategoriesNav from "~/components/CategoriesNav";
import ResourceCard from "~/components/ResourceCard";
import { RouterOutputs, api } from "~/utils/api";

const TagPage = () => {
  const user = useUser();
  type ResourcesOutput = RouterOutputs["resource"]["getByTag"][number];

  const router = useRouter();
  const { tag } = router.query;
  if (!tag || Array.isArray(tag)) return null;
  const { data, isLoading } = api.resource.getByTag.useQuery({ tag: tag });

  if (isLoading && user.isLoaded) {
    return (
      <>
        <CategoriesNav />
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 py-6 md:grid-cols-2 md:py-12 xl:grid-cols-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <ResourcesLoading key={index} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <CategoriesNav />

      <main className="min-h-screen">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 py-6 md:grid-cols-2 md:py-12 xl:grid-cols-3">
          {data?.map((i: ResourcesOutput) => (
            <ResourceCard key={i.resource.id} data={i} shadowEnabled={true} />
          ))}
        </div>
      </main>
    </>
  );
};

export default TagPage;
