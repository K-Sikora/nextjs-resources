import ResourceCard from "~/components/ResourceCard";
import { RouterOutputs, api } from "~/utils/api";

const Resources = () => {
  const { data } = api.resource.getAll.useQuery();
  type ResourcesOutput = RouterOutputs["resource"]["getAll"][number];
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-wrap justify-center gap-4 px-4 py-12 md:py-24">
      {data?.map((i: ResourcesOutput) => (
        <ResourceCard key={i.resource.id} data={i} />
      ))}
    </div>
  );
};

export default Resources;
