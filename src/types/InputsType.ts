export type Inputs = {
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
