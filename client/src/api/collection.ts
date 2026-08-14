import api from "../lib/axios";
import type { Book } from "../types/book";
import type {
  CurrentlyReadingBook,
  LibraryResponse,
} from "../types/collection";

export async function getTrendingBooks(): Promise<Book[]> {
  const response = await api.get<Book[]>("/api/books/trending");

  return response.data.data;
}

export async function getCurrentlyReading(): Promise<CurrentlyReadingBook[]> {
  const response = await api.get("/currently-reading");
  return response.data.data;
}
export async function getLibrary(id: number): Promise<LibraryResponse> {
  const response = await api.get(`/library/${id}`);
  return response.data.data;
}
