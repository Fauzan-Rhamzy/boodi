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
