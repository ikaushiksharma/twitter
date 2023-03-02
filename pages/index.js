import Head from "next/head";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import Widgets from "@/components/Widgets";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Twitter Clone By Kaushik Sharma" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen max-w-7xl mx-auto">
        <Sidebar />

        <Feed />

        <Widgets />
      </main>
    </>
  );
}
