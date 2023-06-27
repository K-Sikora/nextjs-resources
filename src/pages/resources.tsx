import ResourceCard from "~/components/ResourceCard";
import ResourcesLoading from "~/components/ResourcesLoading";
import { RouterOutputs, api } from "~/utils/api";

const Resources = () => {
  const { data, isLoading } = api.resource.getAll.useQuery();
  type ResourcesOutput = RouterOutputs["resource"]["getAll"][number];

  return (
    <main className="min-h-screen">
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 py-12 md:grid-cols-2 md:py-24 xl:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <ResourcesLoading key={index} />
          ))
        ) : (
          <>
            {data?.map((i: ResourcesOutput) => (
              <ResourceCard key={i.resource.id} data={i} />
            ))}
          </>
        )}
      </div>
    </main>
  );
};

export default Resources;
