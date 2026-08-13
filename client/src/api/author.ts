import api from "../lib/axios";
import type { Author } from "../types/author";

export async function getAuthorByID(id: number): Promise<Author> {
  const response = await api.get<Author>(`/api/author/${id}`);
  return response.data.data;
}