import { Header, Navbar } from "@/components";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="grow pt-[57px] bg-[#F8EEE2]">
      <Header />
      <Outlet />
      {/* <Navbar /> */}
    </div>
  );
}
