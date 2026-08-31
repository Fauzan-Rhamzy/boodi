export type Book = {
  id: number;
  title: string;
  price: number;
  year: number;
  page: number;
  language: string;
  description: string;
  cover: string;
  current_page: number;
  genres: {
    id: number;
    name: string;
  }[];
  authors: { id: number; name: string }[];
};
