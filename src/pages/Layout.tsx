import React from "react";
import { Header } from "@/components";
import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  return (
    <div className="grow pt-[57px] bg-[#F8EEE2]">
      <Header />
      <Outlet />
      <Toaster />
    </div>
  );
}
