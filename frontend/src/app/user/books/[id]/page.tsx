"use client";

import { useToast } from "@/hooks/use-toast";
import { getBookByIdService } from "@/services/book";
import { borrowBook } from "@/services/borrow";
import { useEffect, useState } from "react";
import { use } from "react";

type Params = Promise<{ id: string }>;
export default function BooksDetail({ params }: { params: Params }) {
  const { id } = use(params);

  const [book, setBook] = useState<IBook>();

  useEffect(() => {
    const fetchbook = async () => {
      const res = await await getBookByIdService(id);
      if (res.statusCode == 200) {
        setBook(res.data);
      }
    };
    fetchbook();
  }, [id]);
  const { toast } = useToast();
  const handleBorrowBook = async (id: string) => {
    const res = await borrowBook(id);
    if (res.statusCode == 201) {
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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-lg">
      <h1 className="text-3xl font-semibold mb-4">{book?.title}</h1>
      <div className="mb-4">
        <img
          src={book?.cover_image}
          alt={book?.title}
          className="w-full h-72 object-cover rounded-md"
        />
      </div>
      <div className="mb-4">
        <p>
          <strong>Author:</strong> {book?.author_name}
        </p>
        <p>
          <strong>Publisher:</strong> {book?.publisher_name}
        </p>
        <p>
          <strong>Year Published:</strong> {book?.year_published}
        </p>
        <p>
          <strong>Available Quantity:</strong> {book?.quantity}
        </p>
      </div>
      <div className="mt-4">
        <button
          onClick={() => handleBorrowBook(book?.id!)}
          disabled={book?.quantity! <= 0}
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
        >
          Borrow this book
        </button>
      </div>
    </div>
  );
}
