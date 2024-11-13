import React from "react";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";

function MainLayout({ children }) {
  return (
    <div className="flex">
      <div className="left-bar w-[20vw] h-[100vh] bg-black text-white fixed left-0 top-0">
        <LeftBar />
      </div>
      <div className="w-[60vw] mx-auto ml-[20vw] mr-[20vw]">
        {children}
      </div>
      <div className="right-bar w-[20vw] h-[100vh] bg-black text-white fixed right-0 top-0">
        <RightBar />
      </div>
    </div>
  );
}

export default MainLayout;
