"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/assets/logo.svg";
import { useState } from "react";
import { Button } from "../ui/button";
import { User01 } from "@untitled-ui/icons-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="fixed top-0 z-50 flex h-28 w-full flex-row items-center justify-around bg-white dark:bg-dark2 dark:text-light shadow-md">
      <Link
        href="/"
        className="cursor-pointer flex justify-center items-center gap-2 font-semibold"
      >
        <Logo /> MINILIB
      </Link>
      <div className="hidden space-x-10 text-charcoal dark:text-light md:flex">
        <Link
          href={"/"}
          className={cn("", {
            "border-b-4 border-b-sky pb-1 transition-all duration-100":
              pathname == "/",
          })}
        >
          Home
        </Link>
        <Link
          href={"/blog"}
          className={cn("", {
            "border-b-4 border-b-sky pb-1 transition-all duration-100":
              pathname.includes("/blog"),
          })}
        >
          My Book
        </Link>
      </div>
      <div className="flex flex-row items-center gap-5">
        <div className="group relative hidden md:flex">
          <User01 />
          <div className="absolute -bottom-32 hidden space-y-3 rounded bg-white p-2 shadow-md group-hover:flex group-hover:flex-col dark:bg-dark1 dark:text-light">
            <Link href={"/"}>My Profile</Link>
            <Link href={"/"}>My Favorite</Link>
            <Button onClick={() => {}}>SignOut</Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute -bottom-28 right-5 z-50 flex flex-col gap-3 bg-white p-5 shadow-md dark:bg-dark2 dark:text-white">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Button onClick={() => {}}>SignOut</Button>
        </div>
      )}
    </nav>
  );
}
