import Link from "next/link";
import React from "react";
import { AiFillGithub } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <img src="/nextjs.svg" className="mr-3 h-8" alt="Site logo" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Navigation
              </h2>
              <ul className="font-medium text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link href="/" className="hover:underline">
                    Homepage
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:underline">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Links
              </h2>
              <ul className="font-medium text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link
                    target="_blank"
                    href="https://github.com/K-Sikora/nextjs-resources"
                    className="hover:underline "
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Help
              </h2>
              <ul className="font-medium text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link href="#" className="hover:underline">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
            © 2023{" "}
            <Link href="/" className="hover:underline">
              Next.js Resources
            </Link>
          </span>
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Link
              href="https://github.com/K-Sikora/nextjs-resources"
              target="_blank"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <AiFillGithub size={32} />
              <span className="sr-only">GitHub account</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
