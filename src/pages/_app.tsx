import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Navbar from "~/components/Navbar";
import { Toaster } from "~/components/ui/toaster";
import Footer from "~/components/Footer";

const inter = Inter({ subsets: ["latin"] });
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <div className={inter.className}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
        <Footer />
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
