"use client";

import { useToast } from "@/hooks/use-toast";
import { returnBookService } from "@/services/borrow";
import { createCommentService } from "@/services/comment";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import Modal from "../layouts/Modal";
import Link from "next/link";

export default function CardCatalog({
  id,
  book_id,
  borrow_date,
  due_date,
  status,
  title,
  cover_image,
}: {
  id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  status: string;
  title: string;
  cover_image: string;
}) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");

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

  const handleCommentSubmit = async () => {
    if (!commentContent) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const res = await createCommentService({
      book_id,
      borrowing_id: id,
      content: commentContent,
    });

    if (res.statusCode === 201) {
      toast({
        title: "Comment added",
        description: res.message,
      });
      setIsModalOpen(false);
      setCommentContent("");
    } else {
      toast({
        title: "Failed to add comment",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="dark:bg-dark2 dark:border-dark1 max-w-sm rounded-md border-2 border-cloud p-3">
      <Link href={`/user/books/${book_id}`}>
        <Image
          src={cover_image}
          alt={title}
          width={500}
          height={500}
          className="mb-6 h-[250px] w-[390px] rounded-md object-cover object-center"
        />
      </Link>
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
      {status === "RETURNED" && (
        <Button onClick={() => setIsModalOpen(true)}>Comment</Button>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl mb-4">Add Comment</h2>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full mb-4 p-2 border rounded-md"
        />
        <div className="flex justify-end space-x-4">
          <Button onClick={() => setIsModalOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleCommentSubmit}>Submit</Button>
        </div>
      </Modal>
    </div>
  );
}
