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
export const getAllBooks = async (): Promise<Book[]> => {
  const response = await api.get(`/api/books`);
  return response.data.data;
};

export async function addBook(book: FormData) {
  const res = await api.post("/api/book", book, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteBook(id: number): Promise<number> {
  const res = await api.delete(`/api/book/${id}`);
  return res.data;
}

export async function updateBook(id: number, book: FormData) {
  const res = await api.put(`/api/book/${id}`, book, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
