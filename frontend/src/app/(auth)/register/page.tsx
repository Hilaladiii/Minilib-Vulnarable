"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/assets/logo.svg";
import { useToast } from "@/hooks/use-toast";
import { ChangeEvent, FormEvent, useState } from "react";
import { registerService } from "@/services/auth";

export default function LoginPage() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await registerService(userData);
    if (res.statusCode === 201) {
      toast({
        title: "Success",
        description: res.message,
      });
      router.push("/login");
    } else {
      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-full max-w-sm flex flex-col justify-center mx-auto">
        <div className="inline-flex items-center gap-2 mx-auto mb-6">
          <Logo className="text-primary" />
        </div>
        <h1 className="text-3xl font-medium text-primary">
          Welcome to MiniLib!
        </h1>
        <p className="text-xs mt-1">
          Please enter your credentials to register
        </p>
        <form onSubmit={onSubmit} className="mt-8">
          <div className="space-y-4">
            <Input
              placeholder="Username"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
            <Input
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="mt-8 w-full">
            Register
          </Button>
        </form>
        <span className="inline-flex gap-1 items-center mt-5 text-xs text-gray-800 justify-center">
          <p>Already have an account?</p>
          <Link href={"/login"}>Login</Link>
        </span>
      </div>
    </div>
  );
}
