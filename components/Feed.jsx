import { SparklesIcon } from "@heroicons/react/24/outline";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "../firebase";
import Input from "./Input";
import Post from "./Post";
import { useRecoilState } from "recoil";
import { userState } from "@/atom/userAtom";
import { useRouter } from "next/router";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [currentUser] = useRecoilState(userState);
  const router = useRouter();
  useEffect(
    () =>
      onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshot) => {
        setPosts(snapshot.docs);
      }),
    [],
  );
  return (
    <div className="xl:ml-[370px] border-x border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex py-2 bg-white px-3 sticky top-0 z-50 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div
          onClick={() => {
            if (!currentUser) router.push("/auth/signin");
            return;
          }}
          className="hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9"
        >
          <SparklesIcon className="h-5" />
        </div>
      </div>
      <Input />
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Post key={post.id} id={post.id} post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
