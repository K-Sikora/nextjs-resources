import Head from "next/head";
import { api } from "~/utils/api";
import { SignOutButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { FaPlus } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { buttonVariants } from "~/components/ui/button";
import { homepageCards } from "~/constants/constants";
import Link from "next/link";
import SingleCard from "~/components/Card";
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
      <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-start gap-8 px-4 py-12 text-center text-black md:py-24">
        <h1 className="text-5xl font-extrabold">Next.js Resources</h1>
        <p className="text-gray-600 md:px-12">
          Whether you're a seasoned developer or just starting out with Next.js,
          Next.js Resources is your one-stop destination to find the perfect
          tools for your project's unique needs. This app is designed to be the
          ultimate hub for developers, offering an extensive collection of
          top-notch resources that are fully compatible with Next.js.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/resources" className={buttonVariants()}>
            Explore resources
          </Link>
          <Link
            href="/resources/add"
            className={buttonVariants({ variant: "outline" })}
          >
            <span className="flex items-center justify-center gap-1">
              <FaPlus />
              Add new resource
            </span>
          </Link>
        </div>
        <div className="mt-20 flex flex-col gap-8 md:mt-36">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {homepageCards.map((card) => (
              <SingleCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
