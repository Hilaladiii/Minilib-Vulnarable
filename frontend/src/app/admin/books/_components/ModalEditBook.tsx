import Modal from "@/components/layouts/Modal";
import BookIcon from "@/assets/book-icon.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateBookService } from "@/services/book";
import { useToast } from "@/hooks/use-toast";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";

export default function ModalEdiTUpdateBook({
  isOpen,
  onClose,
  fetchReload,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  fetchReload: () => Promise<void>;
  initialData?: IBook;
}) {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    file: undefined as File | undefined,
    author_name: "",
    publisher_name: "",
    year_published: 0,
    quantity: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        file: undefined,
        author_name: initialData.author_name,
        publisher_name: initialData.publisher_name,
        year_published: initialData.year_published,
        quantity: initialData.quantity,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || "" : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await updateBookService(initialData?.id!, formData);
    if (res.statusCode === 200) {
      toast({
        title: "Success",
        description: res.message,
      });
      fetchReload();
      onClose();
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
          <h1 className="font-semibold text-xl">Edit Book</h1>
        </div>
        <form onSubmit={onSubmit}>
          <div className="space-y-3 my-5">
            <Input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />
            <div className="w-full">
              <label
                htmlFor="file"
                className="w-full mt-2 flex h-[100px] cursor-pointer items-center justify-center rounded-xl border border-dashed"
              >
                <div className="flex flex-col items-center gap-5">
                  <div className="text-gray-900 text-xs">
                    {formData.file ? formData.file.name : "Upload Cover"}
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
              value={formData.author_name}
              onChange={handleChange}
            />
            <Input
              name="publisher_name"
              placeholder="Publisher name"
              value={formData.publisher_name}
              onChange={handleChange}
            />
            <Input
              name="year_published"
              type="number"
              placeholder="Year published"
              value={formData.year_published}
              onChange={handleChange}
            />
            <Input
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
