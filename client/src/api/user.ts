import api from "../lib/axios";
import type { User } from "../types/user";

export async function getUserById(id: number): Promise<User> {
  const response = await api.get<User>(`/api/user/${id}`);
  return response.data.data;
}