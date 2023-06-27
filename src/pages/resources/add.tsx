import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { Loading } from "@nextui-org/react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/router";
const categories = [
  "Tutorial",
  "UI_Library",
  "Package",
  "Tool",
  "Starter",
  "Other",
];
type Inputs = {
  authorId: string;
  category:
    | "Tutorial"
    | "UI_Library"
    | "Package"
    | "Tool"
    | "Starter"
    | "Other";
  description: string;
  link: string;
  tags: string;
  title: string;
};
export default function AddResource() {
  const router = useRouter();
  const [currentlyChosen, setCurrentlyChosen] = useState("");
  const { mutate, isLoading: isLoadingAdd } = api.resource.create.useMutation({
    onSuccess: async () => {
      await router.push("/resources");
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    mutate(data);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-16">
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col gap-8 md:w-1/2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Title"
              color="default"
              {...register("title", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              placeholder="resource.com"
              color="default"
              {...register("link", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              rows={6}
              {...register("description", { required: true })}
              placeholder="Enter short description of this resource."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags</Label>

            <Textarea
              id="tags"
              rows={6}
              {...register("tags", { required: true })}
              placeholder="Enter tags seperated with a comma."
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

          {/* <input {...register("category", { required: true })} /> */}
          {/* {errors && <span>This field is required</span>} */}

          <Button
            className="flex w-full items-center justify-center gap-2 md:w-64"
            disabled={isLoadingAdd}
            variant="outline"
            type="submit"
          >
            {isLoadingAdd ? (
              <Loading size="sm" color="currentColor" />
            ) : (
              "Add resource"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
