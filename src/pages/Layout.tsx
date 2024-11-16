import React from "react";
import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  return (
    <div className="grow pt-[57px]">
      <Header />
      <Outlet />
      <Toaster />
    </div>
  );
}
