import React, { useRef } from "react";
import { AlignLeft, EllipsisVertical, Home, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

import {
  isDrawerOpenAtom,
  isSearchOpenAtom,
  searchQueryAtom,
} from "@/lib/store";
import { useAtom } from "jotai";
import { Logo } from "./Logo";

export function Header() {
  let location = useLocation();
  const [isSearchOpen] = useAtom(isSearchOpenAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);
  const isListPage =
    location.pathname !== "/" && location.pathname !== "/search";
  return (
    <div className="pt-[env(safe-area-inset-top)] w-full fixed top-0 left-0 z-10 bg-background">
      <div className="flex items-center justify-center p-2 space-x-4 border-b">
        {location.pathname !== "/" ? (
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost">
            <Link to="/">
              <AlignLeft />
            </Link>
          </Button>
        )}

        <p className="grow text-center">
          {!isSearchOpen && (
            <Link
              className="font-semibold uppercase flex flex-row justify-center items-center text-secondary hover:text-primary"
              to="/"
            >
              <Logo width={28} height={28} fill="inherit" />
              <span className="sr-only">Buddy</span>
              <span className="text-xl">Notes</span>
            </Link>
          )}
        </p>
        <div className="flex flex-row space-x-1">
          {!isListPage ? (
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
  const navigate = useNavigate();
  const [_searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const ref = useRef<HTMLInputElement | null>(null);
  const [_, setIsSearchOpen] = useAtom(isSearchOpenAtom);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const inputValue = ref.current?.value.trim();
      if (inputValue && inputValue.length >= 3) {
        setSearchQuery(inputValue);
        navigate(`/search?q=${inputValue}`);
      }
    }
  };
  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        className="h-10 px-5 pr-10 rounded-full text-base focus:outline-none transition-all duration-300 ease-in-out w-12 bg-transparent focus:bg-white focus:w-64 blur:w-12"
        onBlur={() => setIsSearchOpen(false)}
        onFocus={() => setIsSearchOpen(true)}
        placeholder="Search..."
        onKeyUp={handleKeyPress}
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
