import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div
      className="w-full h-screen flex-col flex justify-center items-center"
      style={{
        backgroundColor: "#BBE6E4",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-7xl">404</h1>

      <p>Page Not Found</p>
      {/* harus diganti linknya kalau login udh implemented, jadi check login?link to home:landing page */}
      <Link
        to="/"
        className="mt-6 rounded-lg bg-[#084B83] px-4 py-2 text-white hover:bg-[#42BFDD]"
      >
        Back to Home
      </Link>
    </div>
  );
}
