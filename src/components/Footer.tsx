import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { useTheme } from "next-themes";

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <footer className="">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              {theme === "dark" ? (
                <img
                  src="/logo-dark.svg"
                  className="mr-3 w-10"
                  alt="Site logo"
                />
              ) : (
                <img src="/logo.svg" className="mr-3 w-10" alt="Site logo" />
              )}
              <span className="text-lg">Next.js Resources</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-slate-900 dark:text-white">
                Navigation
              </h2>
              <ul className="font-medium text-slate-800 dark:text-slate-50">
                <li className="mb-4">
                  <Link href="/" className="text-sm font-light hover:underline">
                    Homepage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="text-sm font-light hover:underline"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-slate-900 dark:text-white">
                Links
              </h2>
              <ul className="font-medium text-slate-800 dark:text-slate-50">
                <li className="mb-4">
                  <Link
                    target="_blank"
                    href="https://github.com/K-Sikora/nextjs-resources"
                    className="text-sm font-light hover:underline "
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-slate-900 dark:text-white">
                Help
              </h2>
              <ul className="font-medium text-slate-800 dark:text-slate-50">
                <li className="mb-4">
                  <Link
                    href="/terms-and-conditions"
                    className="text-sm font-light hover:underline"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
            © 2023{" "}
            <Link href="/" className="text-sm hover:underline">
              Next.js Resources
            </Link>
          </span>
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Link
              href="https://github.com/K-Sikora/nextjs-resources"
              target="_blank"
              className="hover dark:text-white:text-slate-900 text-slate-500 duration-200 dark:text-slate-300 dark:hover:text-white"
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
