import Modal from "@/components/layouts/Modal";
import BookIcon from "@/assets/book-icon.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChangeEvent, FormEvent, useState } from "react";
import { addBookService } from "@/services/book";

export default function ModalAddBook({
  isOpen,
  onClose,
  fetchReload,
}: {
  isOpen: boolean;
  onClose: () => void;
  fetchReload: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [bookData, setBookData] = useState({
    title: "",
    file: null as File | null,
    author_name: "",
    publisher_name: "",
    year_published: "",
    quantity: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || "" : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBookData((prev) => ({
      ...prev,
      file,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...bookData,
      year_published: parseInt(bookData.year_published),
      quantity: parseInt(bookData.quantity),
      file: bookData.file || undefined,
    };
    const res = await addBookService(payload);
    if (res.statusCode === 201) {
      toast({
        title: "Success",
        description: res.message,
      });
      onClose();
      fetchReload();
    } else {
      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full">
        <div className="flex gap-3 items-center border-b pb-3 border-b-gray-800">
          <div className="bg-gray-200 rounded-lg p-3 w-fit">
            <BookIcon />
          </div>
          <h1 className="font-semibold text-xl">Add Book</h1>
        </div>
        <form onSubmit={onSubmit}>
          <div className="space-y-3 my-5">
            <Input
              name="title"
              placeholder="Title"
              value={bookData.title}
              onChange={handleChange}
            />
            <div className="w-full">
              <label
                htmlFor="file"
                className="w-full mt-2 flex h-[100px] cursor-pointer items-center justify-center rounded-xl border border-dashed"
              >
                <div className="flex flex-col items-center gap-5">
                  <div className="text-gray-900 text-xs">
                    {bookData.file ? bookData.file.name : "Upload Cover"}
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  id="file"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <Input
              name="author_name"
              placeholder="Author name"
              value={bookData.author_name}
              onChange={handleChange}
            />
            <Input
              name="publisher_name"
              placeholder="Publisher name"
              value={bookData.publisher_name}
              onChange={handleChange}
            />
            <Input
              name="year_published"
              type="number"
              placeholder="Year published"
              value={bookData.year_published}
              onChange={handleChange}
            />
            <Input
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={bookData.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
