import { badgeVariants } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { useUser } from "@clerk/nextjs";
type Props = {
  title: string;
  description: string;
  link: string;
  tags: string;
};
const splitTagsToArray = (tags: string) => {
  return tags
    .replace(/\s/g, "")
    .split(",")
    .map((tag) => {
      if (tag.trim() !== "") {
        return (
          <button key={tag} className={badgeVariants({ variant: "outline" })}>
            {tag}
          </button>
        );
      } else {
        return null;
      }
    })
    .filter((tag) => tag !== null);
};

const ResourcePreview = (props: Props) => {
  const user = useUser();
  return (
    <div className="flex flex-col justify-between rounded-xl border p-4 shadow-lg shadow-slate-950/5 dark:shadow-slate-500/5">
      <div className="flex items-center gap-2">
        <img
          alt="logo"
          className="flex-shrink-0"
          src="/logo.svg"
          width="34px"
          height="34px"
        />
        <div className="">
          <div>
            <p>{props.title}</p>
          </div>
          <div>
            <p className="w-48 truncate text-slate-400">
              {props.link.replace(/^(https?:\/\/)?(www\.)?/, "")}
            </p>
          </div>
        </div>
      </div>
      <div className="py-2">
        <p>{props.description}</p>
        <div className="my-2 flex flex-wrap gap-2">
          {splitTagsToArray(props.tags)}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button className={buttonVariants({ variant: "default", size: "sm" })}>
          See details
        </button>
        <h4 className="flex items-center justify-center gap-1">
          <div className="flex items-center gap-1">
            {user.user?.username}
            <img
              alt={`${user.user?.username || ""} profile picture`}
              className="h-7 w-7 rounded-full"
              src={user.user?.profileImageUrl}
            />
          </div>
        </h4>
      </div>
    </div>
  );
};

export default ResourcePreview;
