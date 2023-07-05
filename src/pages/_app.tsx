import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ThemeProvider } from "next-themes";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Navbar from "~/components/Navbar";
import { Toaster } from "~/components/ui/toaster";
import Footer from "~/components/Footer";

const inter = Inter({ subsets: ["latin"] });
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <div
          className={`${inter.className} bg-gradient-to-br from-slate-50 to-slate-100 text-black dark:from-slate-900 dark:to-slate-950 dark:text-white`}
        >
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
          <Footer />
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
