export type Book = {
  id: number;
  title: string;
  price: number;
  year: number;
  page: number;
  language: string;
  description: string;
  cover: string;
  genres: {
    id: number;
    name: string;
  }[];
  authors: { id: number; name: string }[];
};
