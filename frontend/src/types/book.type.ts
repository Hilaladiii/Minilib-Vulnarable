interface IBook {
  id: string;
  title: string;
  cover_image: string;
  author_name: string;
  publisher_name: string;
  year_published: number;
  quantity: number;
}

interface ICatalog {
  id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  status: string;
  title: string;
  cover_image: string;
}
