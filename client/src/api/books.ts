import api from "../lib/axios";

export type Book = {
  id: number;
  title: string;
  cover: string;
};

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await api.get("api/book/search", {
    params: {
      q: query,
    },
  });
  return response.data;
}
