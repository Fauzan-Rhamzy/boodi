import api from "../lib/axios";
import type { Author } from "../types/author";

export async function getAuthorByID(id: number): Promise<Author> {
  const response = await api.get<Author>(`/api/author/${id}`);
  return response.data.data;
}

export async function getAllAuthors(): Promise<Author[]> {
  const response = await api.get(`/api/authors`);
  return response.data;
}

export async function addAuthorFromBook(name: string): Promise<Author> {
  const request = await api.post("/api/author", { name });
  return request.data;
}
