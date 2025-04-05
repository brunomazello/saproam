"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md text-white z-50">
      <div className="max-w-[1240px] mx-auto px-5 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-heading font-bold hover:cursor-pointer hover:text-gray-300 transition-colors duration-300"
        >
          SAPAL 2025
        </Link>

        <div className="hidden md:flex space-x-6 font-heading font-bold">
          <Link href="/calendario" className="hover:text-gray-300">
            Calendário
          </Link>
          <Link href="/times" className="hover:text-gray-300">
            Times
          </Link>
          <Link href="/ranking" className="hover:text-gray-300">
            Ranking
          </Link>
          <Link href="/combine" className="hover:text-gray-300">
            Combine
          </Link>
          <Link href="/regras" className="hover:text-gray-300">
            Regras
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 text-white flex flex-col space-y-4 py-4 px-5 font-heading font-bold">
          <Link
            href="/"
            className="hover:text-gray-300 "
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/calendario"
            className="hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Calendário
          </Link>
          <Link
            href="/times"
            className="hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Times
          </Link>
          <Link
            href="/ranking"
            className="hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Ranking
          </Link>
          <Link
            href="/combine"
            className="hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Combine
          </Link>
          <Link
            href="/regras"
            className="hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Regras
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
