import api from "../../lib/axios";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
};

export type AuthUser = {
  user_id: number;
  role: string;
};

export async function login(data: LoginRequest): Promise<void> {
  await api.post("/api/auth/login", data);
}

export async function register(data: RegisterRequest): Promise<void> {
  await api.post("/api/auth/register", data);
}

export async function logout(): Promise<void> {
  await api.get("/api/auth/logout");
}

export async function getMe() {
  const res = await api.get("/api/auth/me");
  return res.data;
}
