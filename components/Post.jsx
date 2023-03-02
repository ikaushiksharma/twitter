import {
  ChartBarIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React from "react";

export default function Post({ post }) {
  const { id, username, name, userImg, img, text, timestamp } = post;
  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      <img className="h-11 w-11 rounded-full mr-4" src={userImg} alt="user image" />
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">{name}</h4>
            <span className="text-sm sm:text-[15px]">@{username} - </span>
            <span className="text-sm sm:text-[15px] hover:underline">{timestamp}</span>
          </div>
          <EllipsisHorizontalIcon className="h-10 w-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500" />
        </div>
        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">{text}</p>
        <img className="rounded-2xl mr-2" src={img} alt="" />
        <div className="flex justify-between text-gray-500 p-2">
          <ChatBubbleOvalLeftEllipsisIcon className="h-9 w-9 hoverEffect p-2 hover:bg-sky-100 hover:text-sky-500" />
          <TrashIcon className="h-9 w-9 hoverEffect p-2 hover:bg-red-100 hover:text-red-600" />
          <HeartIcon className="h-9 w-9 hoverEffect p-2 hover:bg-red-100 hover:text-red-600" />
          <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:bg-sky-100 hover:text-sky-500" />
          <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:bg-sky-100 hover:text-sky-500" />
        </div>
      </div>
    </div>
  );
}
