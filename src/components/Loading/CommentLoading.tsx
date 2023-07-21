import React from "react";
import { Skeleton } from "../ui/skeleton";

const CommentLoading = () => {
  return (
    <div className="rounded-xl border px-4 py-6">
      <div className="flex justify-start">
        <div className="h-12 w-12">
          <Skeleton className="h-full w-full rounded-full bg-slate-900/30" />
        </div>

        <div className="ml-2 flex flex-col items-start">
          <span className="text-lg font-medium">
            <Skeleton className="h-[15px] w-24 bg-slate-900/30" />
          </span>
          <span className="text-sm">
            <Skeleton className="mt-2 h-[15px] w-20 bg-slate-900/30" />
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-6">
        <Skeleton className="h-[20px] w-48 bg-slate-900/30" />
      </div>
    </div>
  );
};

export default CommentLoading;
