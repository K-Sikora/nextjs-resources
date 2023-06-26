import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Navbar from "~/components/Navbar";
const inter = Inter({ subsets: ["latin"] });
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <div className={inter.className}>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
