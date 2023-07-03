import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { Loading } from "@nextui-org/react";
import { categories } from "~/constants/categories";
import { useToast } from "~/components/ui/use-toast";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Inputs } from "~/types/Inputs";
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
import ResourcePreview from "~/components/ResourcePreview";
import Head from "next/head";

export default function AddResource() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [link, setLink] = useState("");

  const { toast } = useToast();
  const router = useRouter();
  const [currentlyChosen, setCurrentlyChosen] = useState("");
  const {
    mutate,
    isLoading: isLoadingAdd,
    error,
  } = api.resource.create.useMutation({
    onSuccess: async () => {
      await router.push(
        `/resources/${currentlyChosen.toLowerCase().replace("_", "-")}`
      );
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
    const categorySlug = data.category.toLowerCase().replace("_", "-");
    console.log(categorySlug);
    mutate({ ...data, categorySlug });
  };

  return (
    <>
      <Head>
        <title>Add new resource</title>
      </Head>
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-12 px-4 py-16 md:flex-row">
        <form className="w-full md:w-1/2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...register("title", {
                  onChange(e: React.ChangeEvent<HTMLInputElement>) {
                    setTitle(e.target.value);
                  },
                  required: true,
                  minLength: 1,
                  maxLength: 50,
                })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="link">Resource link</Label>
              <Input
                id="link"
                placeholder="https://nextjs.org/"
                {...register("link", {
                  onChange(e: React.ChangeEvent<HTMLInputElement>) {
                    setLink(e.target.value);
                  },
                  required: true,
                  minLength: 1,
                  maxLength: 250,
                })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="githubLink">
                Resource GitHub link (Optional, used to fetch GitHub data)
              </Label>
              <Input
                id="githubLink"
                placeholder="https://github.com/vercel/next.js"
                {...register("githubLink", {
                  maxLength: 250,
                })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>

              <Textarea
                id="description"
                rows={6}
                {...register("description", {
                  onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
                    setDescription(e.target.value);
                  },
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
                  onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
                    setTags(e.target.value);
                  },
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
        <div className="w-full md:w-1/2">
          <h3 className="mb-4 text-2xl font-semibold">Preview</h3>
          <ResourcePreview
            description={description}
            link={link}
            tags={tags}
            title={title}
          />
        </div>
      </div>
    </>
  );
}
