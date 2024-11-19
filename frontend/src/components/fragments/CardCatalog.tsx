"use client";

import { useToast } from "@/hooks/use-toast";
import { returnBookService } from "@/services/borrow";
import Image from "next/image";
import { Button } from "../ui/button";

export default function CardCatalog({
  id,
  borrow_date,
  due_date,
  status,
  title,
  cover_image,
}: {
  id: number;
  borrow_date: string;
  due_date: string;
  status: string;
  title: string;
  cover_image: string;
}) {
  const { toast } = useToast();

  const handleReturnBook = async (id: number) => {
    const res = await returnBookService(id);
    if (res.statusCode === 200) {
      toast({
        title: "Success",
        description: res.message,
      });
    } else {
      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="dark:bg-dark2 dark:border-dark1 max-w-sm rounded-md border-2 border-cloud p-3">
      <Image
        src={cover_image}
        alt={title}
        width={500}
        height={500}
        className="mb-6 h-[250px] w-[390px] rounded-md object-cover object-center"
      />
      <h1 className="dark:text-light mb-4 text-2xl font-semibold">{title}</h1>
      <p className="mb-2 text-sm text-gray-500">
        Borrowed: {new Date(borrow_date).toLocaleDateString()}
      </p>
      <p className="mb-2 text-sm text-gray-500">
        Due: {new Date(due_date).toLocaleDateString()}
      </p>
      <p
        className={`mb-4 text-sm font-semibold ${
          status === "OVERDUE"
            ? "text-red-500"
            : status === "BORROWED"
            ? "text-yellow-500"
            : "text-green-500"
        }`}
      >
        Status: {status}
      </p>

      {status === "BORROWED" && (
        <Button onClick={() => handleReturnBook(id)}>Return</Button>
      )}
    </div>
  );
}
