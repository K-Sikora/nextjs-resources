import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { Input, Textarea } from "@nextui-org/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useState } from "react";
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
  const [currentlyChosen, setCurrentlyChosen] = useState("");
  const { mutate } = api.resource.create.useMutation();
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
    <div className="mx-auto min-h-screen w-full max-w-6xl py-24">
      <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-1/3 flex-col gap-8">
          <Input
            bordered
            labelPlaceholder="Title"
            color="default"
            {...register("title", { required: true })}
          />

          <Input
            bordered
            labelLeft="https://"
            placeholder="resource.com"
            {...register("link", { required: true })}
          />
          <Textarea
            bordered
            rows={6}
            label="Description"
            {...register("description", { required: true })}
            placeholder="Enter short description of this resource."
          />
          <Textarea
            bordered
            rows={6}
            label="Tags"
            {...register("tags", { required: true })}
            placeholder="Enter tags seperated by commas."
          />
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

          <Button variant="outline" type="submit">
            Add resource
          </Button>
        </div>
        <div className="w-2/3"></div>
      </form>
    </div>
  );
}
