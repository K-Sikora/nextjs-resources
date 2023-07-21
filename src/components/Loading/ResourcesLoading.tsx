import { Skeleton } from "../ui/skeleton";

const ResourceCard = () => {
  return (
    <div className="flex flex-col justify-between rounded-xl border p-4 shadow-lg shadow-slate-950/5 dark:shadow-slate-500/5">
      <div className="flex items-center gap-2">
        <img
          alt="resource"
          className="flex-shrink-0"
          src="/logo.svg"
          width={40}
          height={40}
        />
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-[15px] w-28 bg-slate-900/30 dark:bg-slate-500/30" />
            <div className="w-28 truncate text-slate-400 lg:w-60">
              <Skeleton className="h-[15px] w-24 bg-slate-900/30 dark:bg-slate-500/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start">
        <div className="my-4 flex flex-col gap-2">
          <Skeleton className="h-[15px] w-44 bg-slate-900/30 dark:bg-slate-500/30" />
          <Skeleton className="h-[15px] w-40 bg-slate-900/30 dark:bg-slate-500/30" />
          <Skeleton className="h-[15px] w-36 bg-slate-900/30 dark:bg-slate-500/30" />
        </div>
        <div className="mb-4 flex flex-wrap gap-1">
          {Array.from({
            length: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
          }).map((_, i: number) => (
            <Skeleton
              key={i}
              className="h-[15px] w-14 rounded-full bg-slate-900/30 dark:bg-slate-500/30"
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[15px] w-16 bg-slate-900/30 dark:bg-slate-500/30" />

          <Skeleton className="h-7 w-7 rounded-full bg-slate-900/30 dark:bg-slate-500/30" />
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
