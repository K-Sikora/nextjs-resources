export type Inputs = {
  authorId: string;
  category:
    | "Tutorials"
    | "UI_Libraries"
    | "Packages"
    | "Tools"
    | "Starters"
    | "Other";
  description: string;
  link: string;
  githubLink: string;
  tags: string;
  title: string;
  categorySlug: string;
};
