import Link from "next/link";
import Head from "next/head";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { buttonVariants } from "~/components/ui/button";

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>404 - Not found</title>
        <meta name="description" content="Next.js Resources" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-start gap-14 px-4 py-36 text-center text-black">
        <h2 className="text-3xl font-extrabold md:text-5xl">
          404 | Page not found
        </h2>
        <h2 className="text-5xl">😕</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            <span className="flex items-center justify-center gap-1">
              Homepage
            </span>
          </Link>
          <Link href="/resources" className={buttonVariants()}>
            Explore resources
          </Link>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
