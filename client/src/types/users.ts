export type User = {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  profile_pic?: string;
  role?: string;
  joined_date?: string;
};

export type TrackProgressPayload = {
  book_id: number;
  pages_read: number;
  read_date: string;
};