import api from "../lib/axios";
import type { Book } from "../types/book";

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await api.get("api/book/search", {
    params: {
      q: query,
    },
  });
  return response.data;
}
export async function getTrendingBooks(): Promise<Book[]> {
  const response = await api.get<Book[]>("/api/books/trending");

  return response.data.data;
}
export async function getCurrentlyReading(): Promise<Book[]> {
  const response = await api.get<{
    data: Book[];
    success: boolean;
  }>("/api/books/currently-reading");

  return response.data.data;
}

export async function getById(id: number): Promise<Book> {
  const response = await api.get<Book>(`/api/bookDetail/${id}`);
  return response.data.data;
}
