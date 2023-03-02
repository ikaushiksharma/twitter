import Head from "next/head";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import Widgets from "@/components/Widgets";

export default function Home({ newsResults }) {
  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Twitter Clone By Kaushik Sharma" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen mx-auto">
        <Sidebar />

        <Feed />

        <Widgets newsResults={newsResults.articles} />
      </main>
    </>
  );
}

//https://saurav.tech/NewsAPI/top-headlines/category/business/us.json

export async function getServerSideProps(context) {
  const res = await fetch(`https://saurav.tech/NewsAPI/top-headlines/category/business/us.json`);
  const newsResults = await res.json();

  return {
    props: {
      newsResults,
    },
  };
}
