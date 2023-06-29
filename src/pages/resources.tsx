import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import CategoriesNav from "~/components/CategoriesNav";
import ResourceCard from "~/components/ResourceCard";
import ResourcesLoading from "~/components/ResourcesLoading";
import { RouterOutputs, api } from "~/utils/api";

const Resources = () => {
  const user = useUser();
  const { data, isLoading } = api.resource.getAll.useQuery();
  type ResourcesOutput = RouterOutputs["resource"]["getAll"][number];

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
      <Head>
        <title>Next.js Resources - All</title>
        <meta name="description" content="Next.js Resources" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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

export default Resources;
