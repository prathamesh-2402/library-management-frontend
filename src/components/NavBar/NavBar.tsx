"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const NavBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-4 md:px-14 lg:px-28 py-5 border-b relative">
      <Image
        src="/logo.png"
        alt="logo"
        width={112}
        height={112}
        className="hidden lg:block"
      />
      {!isMenuOpen && <Menu className="md:hidden" onClick={() => setIsMenuOpen(true)} />}
      {isMenuOpen && <X onClick={() => setIsMenuOpen(false)} />}
      <ul className="md:flex align-items gap-4 hidden">
        <li className="text-lg lg:text-xl">
          <Link
            className={`link ${
              pathname === "/"
                ? "font-semibold text-emerald-700 transition-all ease-in-out "
                : ""
            } hover:text-emerald-700`}
            href="/"
          >
            Books
          </Link>
        </li>
        <li className="text-lg lg:text-xl">
          <Link
            className={`link ${
              pathname === "/branches"
                ? "font-semibold text-emerald-700 transition-all ease-in-out "
                : ""
            } hover:text-emerald-700`}
            href="/branches"
          >
            Branches
          </Link>
        </li>
        <li className="text-lg lg:text-xl">
          <Link
            className={`link ${
              pathname === "/checkouts"
                ? "font-semibold text-emerald-700 transition-all ease-in-out "
                : ""
            } hover:text-emerald-700`}
            href="/checkouts"
          >
            Checkouts
          </Link>
        </li>
        <li className="text-lg lg:text-xl">
          <Link
            className={`link ${
              pathname === "/transfer"
                ? "font-semibold text-emerald-700 transition-all ease-in-out "
                : ""
            } hover:text-emerald-700`}
            href="/transfer"
          >
            Book Transfer
          </Link>
        </li>
      </ul>
      {isMenuOpen && (
        <div className="absolute left-0 bg-background top-[5rem] border w-full z-50">
          <div className="flex flex-col p-5">
          <ul className="flex flex-col align-items gap-4">
            <li className="text-lg lg:text-xl">
              <Link
                className={`link ${
                  pathname === "/"
                    ? "font-semibold text-emerald-700 transition-all ease-in-out "
                    : ""
                } hover:text-emerald-700`}
                href="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Books
              </Link>
            </li>
            <li className="text-lg lg:text-xl">
              <Link
                className={`link ${
                  pathname === "/branches"
                    ? "font-semibold text-emerald-700 transition-all ease-in-out "
                    : ""
                } hover:text-emerald-700`}
                href="/branches"
                onClick={() => setIsMenuOpen(false)}
              >
                Branches
              </Link>
            </li>
            <li className="text-lg lg:text-xl">
              <Link
                className={`link ${
                  pathname === "/checkouts"
                    ? "font-semibold text-emerald-700 transition-all ease-in-out "
                    : ""
                } hover:text-emerald-700`}
                href="/checkouts"
                onClick={() => setIsMenuOpen(false)}
              >
                Checkouts
              </Link>
            </li>
            <li className="text-lg lg:text-xl">
              <Link
                className={`link ${
                  pathname === "/transfer"
                    ? "font-semibold text-emerald-700 transition-all ease-in-out "
                    : ""
                } hover:text-emerald-700`}
                href="/transfer"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Transfer
              </Link>
            </li>
          </ul>
          </div>
        </div>
      )}
      <a href="https://github.com/prathamesh-2402" target="_blank">
      <Avatar>
        <AvatarImage src="https://github.com/prathamesh-2402.png" />
        <AvatarFallback>AU</AvatarFallback>
      </Avatar>
      </a>
    </nav>
  );
};

export default NavBar;
