import api from "../lib/axios";
import type { Genre } from "../types/genre";

export async function getAllGenres(): Promise<Genre[]> {
  const response = await api.get(`/api/genres`);
  return response.data;
}

export async function addGenreFromBook(name: string) {
  const response = await api.post("/api/genre", { name });
  return response.data;
}

export async function getGenreBooks(genreId: number) {
  const res = await api.get(`/api/genre/${genreId}/books`);
  return res.data;
}

export async function getGenreByID(genreId: number) {
  const res = await api.get(`/api/genre/${genreId}`);
  return res.data;
}
