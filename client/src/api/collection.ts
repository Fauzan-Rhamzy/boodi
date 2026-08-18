import api from "../lib/axios";
import type { Book } from "../types/book";
import type {
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

export async function AddToFavourite(bookId: number): Promise<void> {
  await api.post(`/favourite-books/${bookId}`);
}

export async function DeleteFromFavourite(bookId: number): Promise<void> {
  await api.delete(`/favourite-books/${bookId}`);
}

export async function checkIsFavourited(bookId: number): Promise<boolean> {
  const response = await api.get(`/favourite-books/check/${bookId}`);
  return response.data.data.is_favourited;  
}