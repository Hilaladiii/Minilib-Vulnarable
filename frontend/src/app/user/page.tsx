import CardBook from "@/components/fragments/CardBook";
import { getBooksService } from "@/services/book";

export default async function UserHomePage() {
  const books = await getBooksService();

  return (
    <div>
      <div className="flex flex-wrap">
        {books.data.map((book: IBook, i: number) => (
          <CardBook
            title={book.title}
            image={book.cover_image}
            authorName={book.author_name}
            publisherName={book.publisher_name}
            quantity={book.quantity}
            href=""
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
