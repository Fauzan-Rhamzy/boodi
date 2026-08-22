import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

const AppLayout = () => {
  return (
    <>
      <Toaster />
      <Outlet />
      <Navbar />
    </>
  );
};

export default AppLayout;
