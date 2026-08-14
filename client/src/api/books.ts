import api from "../lib/axios";
import type { Book, CurrentlyReadingBook } from "../types/book";

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await api.get("api/book/search", {
    params: {
      q: query,
    },
  });
  return response.data;
}

export async function getById(id: number): Promise<Book> {
  const response = await api.get<Book>(`/api/bookDetail/${id}`);
  return response.data.data;
}
