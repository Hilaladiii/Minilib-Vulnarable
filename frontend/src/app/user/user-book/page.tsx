import CardCatalog from "@/components/fragments/CardCatalog";
import { getBorrowUserService } from "@/services/borrow";

export default async function UserBorrowPage() {
  const books = await getBorrowUserService();
  return (
    <div className="grid grid-cols-3 gap-5">
      {books.data.map((book: ICatalog, i: number) => (
        <CardCatalog
          key={i}
          borrow_date={book.borrow_date}
          cover_image={book.cover_image}
          title={book.title}
          due_date={book.due_date}
          status={book.status}
          id={book.id}
          book_id={book.book_id}
        />
      ))}
    </div>
  );
}
