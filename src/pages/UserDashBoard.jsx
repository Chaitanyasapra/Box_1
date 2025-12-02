import React, { useState } from "react";
import profileAvatar from '../images/blank_1.avif';
import SearchBar from "../components/SearchBar";
import {Link} from 'react-router-dom';

const categories = [
  "All",
  "Bags & Backpacks",
  "Decoration",
  "Essentials",
  "Interior",
];

const products = [
  {
    id: 1,
    name: "Modern Shell Chair",
    price: "$139.00",
    img: "https://via.placeholder.com/400x450?text=Chair",
    tag: "-18%",
  },
  {
    id: 2,
    name: "Pendant Lamp",
    price: "$89.00",
    img: "https://via.placeholder.com/400x450?text=Lamp",
  },
  {
    id: 3,
    name: "Lighthouse Lantern",
    price: "$49.00",
    img: "https://via.placeholder.com/400x450?text=Lantern",
  },
  {
    id: 4,
    name: "Wall Clock",
    price: "$79.00",
    img: "https://via.placeholder.com/400x450?text=Clock",
  },
];

export default function UserDashboard() {
  const [active, setActive] = useState("All");

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900">

      {/* ------------------------ NAVBAR ------------------------ */}
      <nav className="flex items-center justify-between px-10 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-wide"><i>ShopSphere</i></h1>

        <div className="hidden md:flex items-center">
          <SearchBar className="w-[28rem]" />
        </div>

        <div className="flex gap-6 text-lg">
          <button>
            <img src={profileAvatar} alt="Profile" className="h-6 w-6 rounded-full object-cover" loading="lazy"/>
          </button>
           <Link to="/cart" className="nav-cart-icon">🛒</Link>
          <Link to="/wishlist" className="nav-cart-icon">❤️</Link>
        </div>
      </nav>

      {/* ------------------------ HERO BANNER ------------------------ */}
      <section className="relative w-full h-[420px] bg-gray-800 flex items-center px-20">
        <div>
          <h2 className="text-white text-4xl font-bold mb-3">
            Contemporary Pendant Lighting
          </h2>
          <p className="text-gray-300 mb-5">Ambient LED lightbulbs</p>

          <button className="px-5 py-2 bg-white text-gray-800 font-medium rounded-md shadow-sm">
            Interior
          </button>
        </div>

        <img
          className="absolute right-20 top-10 w-[380px] opacity-80"
          src="https://via.placeholder.com/350x450?text=Lamp+Banner"
          alt="hero"
        />
      </section>

      {/* ------------------------ CATEGORY TABS ------------------------ */}
      <div className="flex gap-8 px-10 py-8 text-lg font-medium overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`pb-1 border-b-2 whitespace-nowrap ${
              active === c
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ------------------------ PRODUCT GRID ------------------------ */}
      <section className="px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 pb-20">

        {products.map((p) => (
          <div key={p.id} className="group">
            <div className="relative">
              {p.tag && (
                <span className="absolute top-3 left-3 bg-black text-white text-sm px-2 py-1 rounded">
                  {p.tag}
                </span>
              )}

              <img
                src={p.img}
                alt={p.name}
                className="rounded-xl shadow-sm group-hover:shadow-lg transition-all"
              />
            </div>

            <h3 className="mt-4 text-lg font-medium">{p.name}</h3>
            <p className="text-gray-600">{p.price}</p>
          </div>
        ))}
      </section>

      {/* ------------------------ LOAD MORE ------------------------ */}
      <div className="flex justify-center pb-12">
        <button className="px-6 py-3 border border-gray-400 rounded-md hover:bg-gray-100">
          Load more
        </button>
      </div>

      {/* ------------------------ FOOTER ------------------------ */}
      <footer className="bg-gray-900 text-gray-300 px-10 py-12">
        <div className="flex gap-10 mb-6 text-lg">
          <a href="#">About Us</a>
          <a href="#">Blog</a>
          <a href="#">FAQs</a>
          <a href="#">Order Tracking</a>
          <a href="#">Contact</a>
        </div>

        <p className="text-sm opacity-70">
          © 2025 ShopSphere
        </p>
      </footer>
    </div>
  );
}