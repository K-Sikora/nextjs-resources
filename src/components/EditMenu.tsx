import { MdEditNote } from "react-icons/md";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { categories } from "~/constants/categories";
import { useState } from "react";
import { type Inputs } from "~/types/Inputs";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

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
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { api } from "~/utils/api";
import { Textarea } from "./ui/textarea";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { Loading } from "@nextui-org/react";
import { useToast } from "./ui/use-toast";
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
          description: `Resource ${data.title} updated successfully.`,
        });
        void router.push("/resources");
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

    // formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const categorySlug = data.category.toLowerCase().replace("_", "-");
    mutate({ ...data, categorySlug, resourceId: props.cardId });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="flex h-8 w-8 shrink-0 items-center justify-center"
        >
          <MdEditNote className="h-full w-full p-1 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className={`z-50 p-3 md:p-6 ${inter.className}`}>
        <SheetHeader>
          <SheetTitle>Edit resource</SheetTitle>
          <SheetDescription>
            Save changes after you&apos;re done editing this resource.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-xs md:text-sm">
              Title
            </Label>
            <Input
              id="title"
              defaultValue={data?.resource.title}
              {...register("title", {
                required: true,
                minLength: 1,
                maxLength: 50,
              })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right text-xs md:text-sm">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={data?.resource.link}
              {...register("link", {
                required: true,
                minLength: 1,
                maxLength: 250,
              })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="githubLink"
              className="text-right text-xs md:text-sm"
            >
              GitHub
            </Label>
            <Input
              id="githubLink"
              defaultValue={data?.resource.githubLink || ""}
              {...register("githubLink", {
                maxLength: 250,
              })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="description"
              className="text-right text-xs md:text-sm"
            >
              Description
            </Label>
            <Textarea
              id="description"
              defaultValue={data?.resource.description}
              {...register("description", {
                required: true,
                minLength: 5,
                maxLength: 400,
              })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right text-xs md:text-sm">
              Tags
            </Label>
            <Textarea
              id="tags"
              defaultValue={data?.resource.tags
                .map((tag) => tag.name)
                .join(",")
                .replace(/\s/g, "")}
              {...register("tags", {
                required: true,
                minLength: 5,
                maxLength: 100,
              })}
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
          <Button className="font-medium" disabled={isLoadingUpdate}>
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
                type="button"
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
            <AlertDialogContent className={inter.className}>
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
