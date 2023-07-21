import React, { useState } from "react";
import { Input } from "../../ui/input";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  return (
    <div className="col-span-3 hidden justify-center md:flex">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.length > 0) {
            void router.push({
              pathname: "/search",
              query: { q: query },
            });
          }
        }}
        className="relative w-96"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-xl"
        />
        <button
          type="submit"
          className="absolute right-0 top-1/2 flex h-full w-10 -translate-y-1/2 items-center justify-center rounded-r-xl bg-slate-900"
        >
          <FaSearch className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
