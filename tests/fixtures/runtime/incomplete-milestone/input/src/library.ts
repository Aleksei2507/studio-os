export interface Book {
  id: string;
  title: string;
}

const books: Book[] = [];

export function addBook(book: Book): void {
  books.push(book);
}

export function listBooks(): readonly Book[] {
  return books;
}
