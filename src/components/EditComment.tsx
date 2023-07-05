import { MdEditNote } from "react-icons/md";
import { Button } from "~/components/ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
type Inputs = {
  text: string;
};

import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "./ui/textarea";
import { type RouterOutputs, api } from "~/utils/api";
import { Loading } from "@nextui-org/react";
import { useToast } from "./ui/use-toast";
import { FaTrash } from "react-icons/fa";
type CommentOutput = RouterOutputs["comments"]["getAll"][number];

type Props = {
  comment: CommentOutput;
};

export function EditComment(props: Props) {
  const { comment } = props;

  const context = api.useContext();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,

    // formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    mutate({ content: data.text, commentId: comment.comment.id });
  const { mutate: deleteComment, isLoading: isLoadingDeleteComment } =
    api.comments.deleteComment.useMutation({
      onSuccess: async () => {
        await context.comments.getAll.invalidate();
        toast({
          description: "Comment deleted successfully.",
        });
      },
    });
  const { mutate, isLoading: isLoadingUpdateComment } =
    api.comments.updateComment.useMutation({
      onSuccess: async () => {
        await context.comments.getAll.invalidate();
        toast({
          description: "Updated the comment successfully 🎉",
        });
      },
    });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="flex h-8 w-8 shrink-0 items-center justify-center"
        >
          <MdEditNote className="h-full w-full p-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit</h4>
            <p className="text-sm text-muted-foreground">Edit your comment.</p>
          </div>
          <div className="grid gap-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-3 items-center gap-4"
            >
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="text"
                defaultValue={comment.comment.text}
                {...register("text", {
                  required: true,
                  minLength: 5,
                  maxLength: 400,
                })}
                className="col-span-2 h-8"
              />

              <Button
                className="flex w-24 items-center justify-center gap-2"
                disabled={isLoadingUpdateComment}
                type="submit"
                variant="default"
                size="sm"
              >
                {isLoadingUpdateComment ? (
                  <Loading color="currentColor" size="xs" />
                ) : (
                  "Save"
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    className="flex h-8 w-8 shrink-0"
                    variant="destructive"
                    size="icon"
                  >
                    {isLoadingDeleteComment ? (
                      <Loading size="xs" color="currentColor" />
                    ) : (
                      <FaTrash />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={inter.className}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this comment from the database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        deleteComment({ commentId: comment.comment.id })
                      }
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
