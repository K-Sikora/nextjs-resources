import Head from "next/head";
import { FaPlus } from "react-icons/fa";
import { buttonVariants } from "~/components/ui/button";
import { homepageCards } from "~/constants/constants";
import Link from "next/link";
import SingleCard from "~/components/Card";
export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js Resources</title>
        <meta name="description" content="Next.js Resources" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-start gap-8 px-4 pb-24 pt-12 text-center text-black md:pt-24">
        <h1 className="text-5xl font-extrabold">Next.js Resources</h1>
        <p className="text-gray-600 md:px-12">
          Next.js Resources is your one-stop destination to find the perfect
          tools for your project&apos;s unique needs. This app is designed to be
          the ultimate hub for developers, offering an extensive collection of
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

        <div className="mt-20 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {homepageCards.slice(2, 5).map((card) => (
            <SingleCard key={card.id} {...card} />
          ))}
        </div>
        <div className="-mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {homepageCards.slice(0, 2).map((card) => (
            <SingleCard key={card.id} {...card} />
          ))}
        </div>
      </main>
    </>
  );
}
