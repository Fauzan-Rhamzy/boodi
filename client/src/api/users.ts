import api from "../lib/axios";
// import Users from "../types/users";

export async function getUserProfile(userId: number) {
  const result = await api.get(`/api/users/${userId}`);
  return result.data.data;
}

export async function updateProfile(userId: number, data: FormData) {
  const res = await api.put(`/api/users/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export interface TrackProgressPayload {
  book_id: number;
  pages_read: number;
  read_date: string;
}

export async function trackBookProgress(bookId: number, pagesRead: number, readDate: string) {
  const res = await api.post("/api/users/track-progress", {
    book_id: bookId,
    pages_read: pagesRead,
    read_date: readDate,
  }, {
  });
  return res.data;
}

export async function getUserBookProgress(bookId: number) {
  const res = await api.get(`/api/users/books/${bookId}/progress`, {
  });
  return res.data; 
}