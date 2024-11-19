"use client";

import { getBooksService, deleteBookService } from "@/services/book";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ModalAddBook from "./_components/ModalAddBook";
import { PlusCircle } from "@untitled-ui/icons-react";
import { Edit05 } from "@untitled-ui/icons-react";
import { Trash01 } from "@untitled-ui/icons-react";
import ModalEditBook from "./_components/ModalEditBook";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function AdminBookPage() {
  const [modal, setModal] = useState({
    add: false,
    edit: false,
  });

  const { toast } = useToast();

  const [books, setBooks] = useState<IBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<IBook>();

  const fetchData = async () => {
    const res = await getBooksService();
    setBooks(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async (id: string) => {
    const res = await deleteBookService(id);
    if (res.statusCode == 200) {
      toast({
        title: "Success",
        description: res.message,
      });
      fetchData();
    } else {
      toast({
        title: "Failed",
        description: res.message,
      });
    }
  };

  const handleEditBook = (id: string) => {
    setSelectedBook(books.find((book) => book.id == id));
    setModal((prev) => ({ ...prev, edit: true }));
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl">Book Management</h1>
          <Button
            className="w-fit inline-flex gap-2 items-center px-3 py-2"
            onClick={() => setModal((prev) => ({ ...prev, add: true }))}
          >
            <PlusCircle /> add book
          </Button>
        </div>

        <div className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Publisher</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="flex justify-end">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book, i) => (
                <TableRow key={i}>
                  <TableCell className="w-52">
                    <Image
                      src={book.cover_image}
                      alt={book.title}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author_name}</TableCell>
                  <TableCell>{book.publisher_name}</TableCell>
                  <TableCell>{book.year_published}</TableCell>
                  <TableCell>{book.quantity}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleEditBook(book.id)}
                    >
                      <Edit05 />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      <Trash01 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <ModalAddBook
        isOpen={modal.add}
        fetchReload={fetchData}
        onClose={() => setModal((prev) => ({ ...prev, add: false }))}
      />
      <ModalEditBook
        isOpen={modal.edit}
        fetchReload={fetchData}
        onClose={() => setModal((prev) => ({ ...prev, edit: false }))}
        initialData={selectedBook}
      />
    </>
  );
}
