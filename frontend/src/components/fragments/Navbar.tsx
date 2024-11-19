"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/assets/logo.svg";
import { useState } from "react";
import { Button } from "../ui/button";
import { User01 } from "@untitled-ui/icons-react";
import { logout } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.statusCode == 200) {
      router.push("/login");
      toast({
        description: res.message,
      });
    } else {
      toast({
        description: res.message,
        variant: "destructive",
      });
    }
  };

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
          href={"/user"}
          className={cn("", {
            "border-b-4 border-b-sky pb-1 transition-all duration-100":
              pathname == "/user",
          })}
        >
          Home
        </Link>
        <Link
          href={"/user/user-book"}
          className={cn("", {
            "border-b-4 border-b-sky pb-1 transition-all duration-100":
              pathname.includes("/user/user-book"),
          })}
        >
          My Book
        </Link>
      </div>
      <div className="flex flex-row items-center gap-5">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
}
