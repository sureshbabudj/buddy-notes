import React, { useRef } from "react";
import { EllipsisVertical, Home, PlusCircle, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

import { isDrawerOpenAtom, isSearchOpenAtom } from "@/lib/store";
import { useAtom } from "jotai";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";

export function Header() {
  let location = useLocation();
  const [isSearchOpen] = useAtom(isSearchOpenAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);
  return (
    <div className="pt-[env(safe-area-inset-top)] w-full fixed top-0 left-0 z-10">
      <div className="flex items-center justify-center p-2 space-x-4 border-b bg-[#F8EEE2] ">
        {location.pathname !== "/" ? (
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost">
            <Link to="/create">
              <PlusCircle />
            </Link>
          </Button>
        )}

        <p className="grow text-center">
          {!isSearchOpen && (
            <Link className="font-semibold text-lg uppercase" to="/">
              Notely
            </Link>
          )}
        </p>
        <div className="flex flex-row space-x-1">
          {location.pathname === "/" ? (
            <Searchbar />
          ) : (
            <Button variant="ghost" onClick={() => setIsDrawerOpen(true)}>
              <EllipsisVertical />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Searchbar() {
  const ref = useRef<HTMLInputElement | null>(null);
  const [_, setIsSearchOpen] = useAtom(isSearchOpenAtom);
  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        className="h-10 px-5 pr-10 rounded-full text-base focus:outline-none transition-all duration-300 ease-in-out w-12 bg-transparent focus:bg-white focus:w-64 blur:w-12"
        onBlur={() => setIsSearchOpen(false)}
        onFocus={() => setIsSearchOpen(true)}
        placeholder="Search..."
      />
      <button
        type="submit"
        className="absolute right-0 top-0 mt-3 mr-4"
        onClick={() => ref.current?.focus()}
      >
        <Search width={20} height={20} />
      </button>
    </div>
  );
}

export function ActionSheet({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <ul className="flex flex-col">
          <li>
            <Button
              className="w-full justify-start text-left "
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              menu 1
            </Button>
          </li>
          <li>
            <Button
              className="w-full justify-start text-left"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              menu 2
            </Button>
          </li>
          <li>
            <Button
              className="w-full justify-start text-left"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              menu 3
            </Button>
          </li>
          <li>
            <Button
              className="w-full justify-start text-left"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              menu 4
            </Button>
          </li>
          <li>
            <Button
              className="w-full justify-start text-left"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              menu 5
            </Button>
          </li>
          <li>
            <Button
              className="w-full justify-start text-left"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              menu 6
            </Button>
          </li>
          <li>
            <Button
              className="w-full justify-start text-left"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              menu 7
            </Button>
          </li>
        </ul>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
