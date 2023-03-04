import {
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebase";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
export default function Post({ post }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts", post.id, "likes"), (snapshot) =>
      setLikes(snapshot.docs),
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.user.uid) !== -1);
  }, [likes]);

  async function likePost() {
    if (session) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", post.id, "likes", session?.user.uid));
      } else {
        await setDoc(doc(db, "posts", post.id, "likes", session?.user.uid), {
          username: session.user.username,
        });
      }
    } else {
      signIn();
    }
  }
  async function deletePost() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteDoc(doc(db, "posts", post.id));
      if (post.data().image) deleteObject(ref(storage, `posts/${post.id}/image`));
    }
  }
  const { id, username, name, userImg, image, text, timestamp } = post.data();
  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      <img className="h-11 w-11 rounded-full mr-4" src={userImg} alt="user image" />
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">{name}</h4>
            <span className="text-sm sm:text-[15px]">@{username} - </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{timestamp?.toDate()}</Moment>
            </span>
          </div>
          <EllipsisHorizontalIcon className="h-10 w-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500" />
        </div>
        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">{text}</p>
        <img className="rounded-2xl mr-2" src={image} alt="" />
        <div className="flex justify-between text-gray-500 p-2">
          <ChatBubbleOvalLeftEllipsisIcon
            onClick={() => {
              if (!session) {
                signIn();
              } else {
                setPostId(post.id);
                setOpen(!open);
              }
            }}
            className="h-9 w-9 hoverEffect p-2 hover:bg-sky-100 hover:text-sky-500"
          />
          {session?.user.uid === id && (
            <TrashIcon
              onClick={deletePost}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes.length > 0 && (
              <span className={`${hasLiked && "text-red-600"} text-sm select-none`}>
                {" "}
                {likes.length}
              </span>
            )}
          </div>
          <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:bg-sky-100 hover:text-sky-500" />
          <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:bg-sky-100 hover:text-sky-500" />
        </div>
      </div>
    </div>
  );
}
