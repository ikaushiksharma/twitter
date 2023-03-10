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
import { useState, useEffect } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
import { useRouter } from "next/router";
import { userState } from "../atom/userAtom";
export default function Post({ post, id }) {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [currentUser] = useRecoilState(userState);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
      setLikes(snapshot.docs),
    );
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts", id, "comments"), (snapshot) =>
      setComments(snapshot.docs),
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser]);

  async function likePost() {
    if (currentUser) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", currentUser?.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", currentUser?.uid), {
          username: currentUser?.username,
        });
      }
    } else {
      router.push("/auth/signin");
    }
  }
  async function deletePost() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteDoc(doc(db, "posts", id));
      if (post.data().image) deleteObject(ref(storage, `posts/${id}/image`));
      router.push("/");
    }
  }
  const { username, name, userImg, image, text, timestamp } = post?.data() || {};
  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      <img className="h-11 w-11 rounded-full mr-4" src={userImg} alt="user image" />
      <div className="flex-1">
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
        <p
          onClick={() => router.push(`/posts/${id}`)}
          className="text-gray-800 text-[15px] sm:text-[16px] mb-2"
        >
          {text}
        </p>
        <img
          onClick={() => router.push(`/posts/${id}`)}
          className="rounded-2xl mr-2"
          src={image}
          alt=""
        />
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatBubbleOvalLeftEllipsisIcon
              onClick={() => {
                if (!currentUser) {
                  router.push("/auth/signin");
                } else {
                  setPostId(id);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {comments.length > 0 && <span className="text-sm">{comments.length}</span>}
          </div>
          {currentUser?.uid === post?.data()?.id && (
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
