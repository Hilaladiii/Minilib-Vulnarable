"use client";
import BarItem from "../fragments/BarItem";
import Logo from "@/assets/logo.svg";
import dashboardIcon from "@/assets/dashboard-icon.svg";
import catalogIcon from "@/assets/catalog-icon.svg";
import bookIcon from "@/assets/book-icon.svg";
import usersIcon from "@/assets/users-icon.svg";
import { Button } from "../ui/button";
import { logout } from "@/services/auth";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const itemBar = [
  {
    icon: dashboardIcon,
    href: "/admin/dashboard",
    text: "Dashboard",
  },
  {
    icon: catalogIcon,
    href: "/admin/catalog",
    text: "Catalog",
  },
  {
    icon: bookIcon,
    href: "/admin/books",
    text: "Books",
  },
  {
    icon: usersIcon,
    href: "/admin/users",
    text: "Users",
  },
];
export function AdminSideBar() {
  const router = useRouter();
  const { toast } = useToast();

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
    <aside className="fixed w-60 bg-black min-h-screen text-white">
      <div className="flex flex-col items-center mt-8 gap-5">
        <Logo className="text-white mb-5" />
        {itemBar.map((item, i) => (
          <BarItem Icon={item.icon} text={item.text} href={item.href} key={i} />
        ))}
        <Button className="mt-12" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );
}
