import React from "react";
import { LoaderCircle } from "lucide-react";

export function FullPageLoader() {
  <div className="flex flex-row justify-center items-center h-[100dvh] my-auto w-full text-3xl text-muted-foreground uppercase">
    <LoaderCircle
      className="animate-spin me-4"
      width="56"
      height="56"
    ></LoaderCircle>{" "}
    Loading...
  </div>;
}
