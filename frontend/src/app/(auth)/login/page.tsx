"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/services/auth";

export default function LoginPage() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await login(userData);
    if (res.statusCode === 200) {
      toast({
        title: "Success",
        description: res.message,
      });
      router.push("/user/dashboard");
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
        <h1 className="text-3xl font-medium text-primary">Welcome Back!</h1>
        <p className="text-xs mt-1 text-primary">
          Please enter your credentials to login
        </p>
        <form onSubmit={onSubmit} className="mt-8">
          <div className="space-y-4">
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
          <Button className="mt-8 w-full">Login</Button>
        </form>
        <span className="inline-flex gap-1 items-center mt-5 text-xs text-gray-800 justify-center">
          <p>Dont have an account?</p>
          <Link href="/register">Register</Link>
        </span>
      </div>
    </div>
  );
}
