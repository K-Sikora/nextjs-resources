import { FiEdit } from "react-icons/fi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { categories } from "~/constants/categories";
import { useEffect, useState } from "react";
import { Inputs } from "~/types/InputsType";
import { Label } from "./ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { api } from "~/utils/api";
import { Textarea } from "./ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { Loading } from "@nextui-org/react";
import { useToast } from "./ui/use-toast";
import { DeleteAlert } from "./DeleteAlert";
import { useRouter } from "next/router";
type Props = {
  cardId: string;
};
export function EditMenu(props: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate, isLoading: isLoadingUpdate } =
    api.resource.update.useMutation({
      onSuccess: (data) => {
        toast({
          title: "Success 🎉",
          description: `Resource ${data.title} updated successfully`,
        });
      },
    });
  const { mutate: mutateDelete, isLoading: isLoadingDelete } =
    api.resource.delete.useMutation({
      onSuccess: () => {
        void router.reload();
      },
    });
  const { data } = api.resource.getSingle.useQuery({ id: props.cardId });
  const [currentlyChosen, setCurrentlyChosen] = useState(
    data?.resource.category as string
  );
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    const categorySlug = data.category.toLowerCase().replace("_", "-");
    console.log(categorySlug);
    mutate({ ...data, categorySlug, resourceId: props.cardId });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex w-5 items-center justify-center">
          <FiEdit className="h-full w-full" />
        </button>
      </SheetTrigger>
      <SheetContent className="z-50 p-3 md:p-6">
        <SheetHeader>
          <SheetTitle>Edit resource</SheetTitle>
          <SheetDescription>
            Save changes after you&apos;re done editing this resource.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={void handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              defaultValue={data?.resource.title}
              {...register("title")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              Link
            </Label>
            <Input
              id="name"
              defaultValue={data?.resource.link}
              {...register("link")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              defaultValue={data?.resource.description}
              {...register("description")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Tags
            </Label>
            <Textarea
              id="tags"
              defaultValue={data?.resource.tags
                .map((tag) => tag.name)
                .join(",")
                .replace(/\s/g, "")}
              {...register("tags")}
              className="col-span-3"
            />
          </div>
          <Select onValueChange={(e) => setCurrentlyChosen(e)}>
            <SelectTrigger
              value={currentlyChosen}
              className="w-full"
              {...register("category", { required: true })}
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button disabled={isLoadingUpdate} type="submit">
            {isLoadingUpdate ? (
              <Loading size="sm" color="currentColor" />
            ) : (
              "Update resource"
            )}
          </Button>
        </form>
        <div className="mt-5 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="flex h-8 w-8 shrink-0"
                variant="destructive"
                size="icon"
              >
                {isLoadingDelete ? (
                  <Loading size="xs" color="currentColor" />
                ) : (
                  <FaTrash />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this resource from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => mutateDelete({ resourceId: props.cardId })}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SheetContent>
    </Sheet>
  );
}
