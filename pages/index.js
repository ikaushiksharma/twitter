import Head from "next/head";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import Widgets from "@/components/Widgets";

export default function Home({ newsResults,randomUsersResults }) {
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

        <Widgets
          newsResults={newsResults?.articles}
          randomUsersResults={randomUsersResults?.results || null}
        />
      </main>
    </>
  );
}


export async function getServerSideProps(context) {
  const res = await fetch(`https://saurav.tech/NewsAPI/top-headlines/category/business/us.json`);
  const newsResults = await res.json();

  let randomUsersResults = [];

  try {
    const res = await fetch("https://randomuser.me/api/?results=30&inc=name,login,picture");

    randomUsersResults = await res.json();
  } catch (e) {
    randomUsersResults = [];
  }

  return {
    props: {
      newsResults,
      randomUsersResults,
    },
  };
}
