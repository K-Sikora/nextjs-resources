import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { Loading } from "@nextui-org/react";
import { categories } from "~/constants/categories";
import { useToast } from "~/components/ui/use-toast";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Inputs } from "~/types/InputsType";
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

export default function AddResource() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentlyChosen, setCurrentlyChosen] = useState("");
  const {
    mutate,
    isLoading: isLoadingAdd,
    error,
  } = api.resource.create.useMutation({
    onSuccess: async () => {
      await router.push("/resources");
    },
    onError: (error) => {
      toast({
        title: `An error occurred 🙁`,
        description: error.message,
      });
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
    <div className="mx-auto flex min-h-screen w-full max-w-screen-xl gap-12 px-4 py-16">
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Title"
              color="default"
              {...register("title", {
                required: true,
                minLength: 1,
                maxLength: 50,
              })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              placeholder="resource.com"
              color="default"
              {...register("link", {
                required: true,
                minLength: 1,
                maxLength: 50,
              })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              rows={6}
              {...register("description", {
                required: true,
                minLength: 5,
                maxLength: 400,
              })}
              placeholder="Enter short description of this resource."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags</Label>

            <Textarea
              id="tags"
              rows={6}
              {...register("tags", {
                required: true,
                minLength: 5,
                maxLength: 100,
              })}
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

          <Button
            className="flex w-full items-center justify-center gap-2 md:w-64"
            disabled={isLoadingAdd}
            variant="default"
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
