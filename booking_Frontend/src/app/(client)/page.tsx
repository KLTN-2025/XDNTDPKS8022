"use client";
import React from "react";

import BeanHotel from "./components/header/BeanHotel";
import Banner from "./components/main/Banner";
import RoomShow from "./components/main/RoomShow";
import HotelShow from "./components/main/HotelShow";
import ShearchRoomPage from "./components/main/SearchRoom";
import ChatBoxAL from "./components/main/ChatBoxAl";
import CustomerChat from "./components/main/CustomerChat";
import HotelHighlightsCarousel from "./components/main/Hotel-Highlights";
import ChatBox from "./components/main/ChatBox";

const Page = () => {
  return (
    <div className="">
      {" "}
      <Banner />
      <ShearchRoomPage />
      <BeanHotel />
      <RoomShow />
      <HotelShow />
      <HotelHighlightsCarousel />
      <ChatBoxAL />
      {/* <CustomerChat /> */}
      <ChatBox />
    </div>
  );
};

export default Page;
