import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import CategoriesNav from "~/components/CategoriesNav";
import ResourceCard from "~/components/Resource/ResourceCard";
import ResourcesLoading from "~/components/Loading/ResourcesLoading";
import { type RouterOutputs, api } from "~/utils/api";

const Resources = () => {
  const user = useUser();
  const { data, isLoading } = api.resource.getAll.useQuery();
  type ResourcesOutput = RouterOutputs["resource"]["getAll"][number];

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
        <title>Next.js Resources - All</title>
        <meta name="description" content="Next.js Resources" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CategoriesNav />
      <main className="min-h-screen">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 pb-24 pt-6 md:grid-cols-2 md:pt-12">
          {data?.map((i: ResourcesOutput) => (
            <ResourceCard key={i.resource.id} data={i} shadowEnabled={true} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Resources;
