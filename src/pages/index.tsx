import Head from "next/head";
import { api } from "~/utils/api";
import { SignOutButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { FaPlus } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { buttonVariants } from "~/components/ui/button";
import Link from "next/link";
export default function Home() {
  const user = useUser();

  const { data } = api.resource.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Next.js Resources</title>
        <meta name="description" content="Next.js Resources" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-start gap-8 py-36 text-center text-black">
        <h1 className="text-5xl font-extrabold">Next.js Resources</h1>
        <p className="px-12 text-gray-600">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
          aliquid facere doloribus ipsa perspiciatis porro nostrum, repudiandae
          facilis impedit praesentium officia eveniet corporis libero sequi,
          magni quo ex! Quam voluptatibus dolorum saepe rerum doloremque
          similique sequi, eveniet facere ut? Accusantium fugiat eaque magni nam
          ducimus quis iure autem cumque aspernatur.
        </p>
        <div className="flex gap-6">
          <Link href="" className={buttonVariants({ variant: "outline" })}>
            Explore resources
          </Link>
          <Link href="" className={buttonVariants()}>
            <FaPlus />
            Add new resource
          </Link>
        </div>
      </div>
    </>
  );
}
