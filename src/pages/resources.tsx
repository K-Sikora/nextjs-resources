import ResourceCard from "~/components/ResourceCard";
import { RouterOutputs, api } from "~/utils/api";

const Resources = () => {
  const { data } = api.resource.getAll.useQuery();
  type ResourcesOutput = RouterOutputs["resource"]["getAll"][number];
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 py-12 md:grid-cols-2 md:py-24 xl:grid-cols-3">
      {data?.map((i: ResourcesOutput) => (
        <ResourceCard key={i.resource.id} data={i} />
      ))}
    </div>
  );
};

export default Resources;
