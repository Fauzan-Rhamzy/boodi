import api from "../lib/axios";
import type { Book } from "../types/book";
import type {
  Collection,
  CurrentlyReadingBook,
  FavouriteBooks,
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

export async function getFavouriteBooks(): Promise<FavouriteBooks[]> {
  const response = await api.get("/favourite-books");
  return response.data.data;
}

export async function getCollections(): Promise<Collection[]> {
  const res = await api.get("/api/collection");
  return res.data;
}

export async function createCollection(formData: FormData) {
  const res = await api.post("/api/collection", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}
