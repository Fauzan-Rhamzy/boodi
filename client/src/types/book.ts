export type Book = {
  id: number;
  title: string;
  price: number;
  year: number;
  page: number;
  language: string;
  description: string;
  cover: string;
  genres: string[];
  authors: { id: number; name: string }[];
};
