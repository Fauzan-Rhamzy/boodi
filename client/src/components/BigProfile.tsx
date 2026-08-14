import { useAuth } from "../features/auth/AuthContext";

export default function BigProfile({ pfp }: { pfp?: string }) {
  const { user } = useAuth();
  return (
    <img
      src={`http://localhost:8080/images/${user?.profile_picture}`}
      className="w-60 h-60 rounded-full"
    />
  );
}
