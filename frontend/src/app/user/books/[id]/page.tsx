"use client";

import { CardComment } from "@/components/fragments/CardComment";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getBookByIdService } from "@/services/book";
import { borrowBook } from "@/services/borrow";
import { getCommentByBookId } from "@/services/comment";
import { IComment } from "@/types/comment.type";
import { useEffect, useState } from "react";
import { use } from "react";

type Params = Promise<{ id: string }>;
export default function BooksDetail({ params }: { params: Params }) {
  const { id } = use(params);

  const [book, setBook] = useState<IBook>();
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    const fetchbook = async () => {
      const book = await getBookByIdService(id);
      if (book.statusCode == 200) {
        setBook(book.data);
      }
      const comment = await getCommentByBookId(id);
      if (comment.statusCode == 200) {
        setComments(comment.data);
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
        <Button
          onClick={() => handleBorrowBook(book?.id!)}
          disabled={book?.quantity! <= 0}
          className="w-full"
        >
          Borrow this book
        </Button>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment, i) => (
            <CardComment key={i} comment={comment} />
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
