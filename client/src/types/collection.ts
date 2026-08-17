import type { Book } from "./book";

export type CurrentlyReadingBook = Book & {
  logged_at: string;
};
export type LibraryResponse = {
  collection_id: number;
  name: string;
  books: Book[];
};

export type LibraryResponseWrapper = {
  data: LibraryResponse;
  success: boolean;
};

export type FavouriteBooks = Book
