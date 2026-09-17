import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import pfp from "../assets/dummy-pfp.png";

export default function AdminHomepage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center flex-col items-center mt-20">
      <h1>Admin Dashboard</h1>
      <UserProfile pfp={pfp} />

      <div className="flex flex-col gap-20 mt-10">
        <button className="bg-white" onClick={() => navigate("/admin/books")}>
          Manage Books
        </button>

        <button className="bg-white" onClick={() => navigate("/admin/authors")}>
          Manage Authors
        </button>

        <button className="bg-white" onClick={() => navigate("/admin/genres")}>
          Manage Genres
        </button>
      </div>
    </div>
  );
}
