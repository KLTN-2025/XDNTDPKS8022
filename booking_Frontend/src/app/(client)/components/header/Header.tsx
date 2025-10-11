"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "./NavBar";
import Image from "next/image";
import ListItem from "../ListHeader/ListItem";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <header className="bg-gradient-to-br from-blue-500/10 to-teal-800/90  border-b border-white/10 hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="text-white text-xl font-bold">
              <Link href={"/"}>
                <Image
                  alt="Logo"
                  src={"/image/logo2.png"}
                  width={100}
                  height={100}
                  className="w-32 md:w-40 object-contain"
                />
              </Link>
            </div>

            {/* Navigation Menu */}
            <ListItem />
          </nav>
        </div>
      </header>
      <div className="flex justify-between items-center px-4 py-2 md:hidden bg-gradient-to-br from-blue-500/10 to-teal-800/90 border-b border-white/10">
        {/* Logo */}
        <Link href={"/"}>
          <Image
            alt="Logo"
            src={"/image/logo2.png"}
            width={80}
            height={80}
            className="w-24 object-contain"
          />
        </Link>

        {/* Mobile NavBar (hamburger menu) */}
        <NavBar open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default Header;
