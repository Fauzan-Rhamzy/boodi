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

export type ReadingSession = {
  logged_at: string;
  current_page: number;
  total_pages: number;
  title: string;
  cover: string;
  book_id: number;
};
