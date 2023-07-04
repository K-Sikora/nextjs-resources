import Link from "next/link";
import React from "react";
import { type RouterOutputs } from "~/utils/api";
import { EditComment } from "./EditComment";
import { useUser } from "@clerk/nextjs";
type CommentOutput = RouterOutputs["comments"]["getAll"][number];
type Props = {
  comment: CommentOutput;
};
const Comment = (props: Props) => {
  const user = useUser();
  const { comment } = props;
  return (
    <div className="rounded-xl border px-4 py-6">
      <div className="flex justify-start">
        <Link
          href={`/user/${comment?.author?.username || ""}`}
          className="h-12 w-12"
        >
          <img
            alt={`${comment.author?.username || ""} profile picture`}
            src={comment.author?.profileImageUrl}
            className="h-full w-full rounded-full"
          />
        </Link>

        <div className="ml-2 flex flex-col items-start">
          <Link
            className="text-lg font-medium"
            href={`/user/${comment?.author?.username || ""}`}
          >
            {comment.author?.username}
          </Link>
          <span className="text-sm">
            {new Date(comment.comment.createdAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-6">
        <p className="text-sm md:text-base">{comment.comment.text}</p>
        {user.user?.id === comment.comment.authorId && (
          <EditComment comment={comment} />
        )}
      </div>
    </div>
  );
};

export default Comment;
