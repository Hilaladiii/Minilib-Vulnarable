import CardBook from "@/components/fragments/CardBook";
import { getBooksService } from "@/services/book";

export default async function UserHomePage() {
  const books = await getBooksService();

  return (
    <div>
      <div className="grid grid-cols-3 gap-5">
        {books.data.map((book: IBook, i: number) => (
          <CardBook
            title={book.title}
            image={book.cover_image}
            authorName={book.author_name}
            publisherName={book.publisher_name}
            quantity={book.quantity}
            href={`/user/books/${book.id}`}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
