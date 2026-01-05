import Navbar from "../../components/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";

export default function LayoutMain() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
