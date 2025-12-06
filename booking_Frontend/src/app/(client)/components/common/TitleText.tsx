"use client";
import React from "react";
import TitleTextCss from "./TitleText.module.css";
interface Iprops {
  title: string;
  tilteSub: string;
}

const TitleText = ({ title, tilteSub }: Iprops) => {
  return (
    <div className="relative ">
      <div className={`font-bold opacity-70 z-10 ${TitleTextCss.maskGradient}`}>
        <p className="font-bold text-[50px] md:text-[100px] tracking-tight text-nowrap  text-red-500">
          {title}
        </p>
      </div>

      <div className="absolute top-10 md:top-21 md:left-0   ">
        <p className="font-semibold text-lg md:text-[32px] underline text-center">
          {tilteSub}
        </p>
      </div>
    </div>
  );
};

export default TitleText;
