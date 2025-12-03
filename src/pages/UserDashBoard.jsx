

// import React, { useState } from "react";
// import profileAvatar from '../images/blank_1.avif';
// import SearchBar from "../components/SearchBar";

// const categories = [
//   "All",
//   "Bags & Backpacks",
//   "Decoration",
//   "Essentials",
//   "Interior",
// ];

// const products = [
//   {
//     id: 1,
//     name: "Modern Shell Chair",
//     price: "$139.00",
//     img: "https://via.placeholder.com/400x450?text=Chair",
//     tag: "-18%",
//   },
//   {
//     id: 2,
//     name: "Pendant Lamp",
//     price: "$89.00",
//     img: "https://via.placeholder.com/400x450?text=Lamp",
//   },
//   {
//     id: 3,
//     name: "Lighthouse Lantern",
//     price: "$49.00",
//     img: "https://via.placeholder.com/400x450?text=Lantern",
//   },
//   {
//     id: 4,
//     name: "Wall Clock",
//     price: "$79.00",
//     img: "https://via.placeholder.com/400x450?text=Clock",
//   },
// ];

// export default function UserDashboard() {
//   const [active, setActive] = useState("All");

//   return (
//     <div className="w-full min-h-screen bg-gray-50 text-gray-900">

//       {/* ------------------------ NAVBAR ------------------------ */}
//       <nav className="flex items-center justify-between px-10 py-6 bg-white shadow-sm">
//         <h1 className="text-2xl font-bold tracking-wide"><i>ShopSphere</i></h1>

//         <div className="hidden md:flex items-center">
//           <SearchBar className="w-[28rem]" />
//         </div>

//         <div className="flex gap-6 text-lg">
//           <button>
//             <img src={profileAvatar} alt="Profile" className="h-6 w-6 rounded-full object-cover" loading="lazy"/>
//           </button>
//           <button>🛒</button>
//         </div>
//       </nav>

//       {/* ------------------------ HERO BANNER ------------------------ */}
//       <section className="relative w-full h-[420px] bg-gray-800 flex items-center px-20">
//         <div>
//           <h2 className="text-white text-4xl font-bold mb-3">
//             Contemporary Pendant Lighting
//           </h2>
//           <p className="text-gray-300 mb-5">Ambient LED lightbulbs</p>

//           <button className="px-5 py-2 bg-white text-gray-800 font-medium rounded-md shadow-sm">
//             Interior
//           </button>
//         </div>

//         <img
//           className="absolute right-20 top-10 w-[380px] opacity-80"
//           src="https://via.placeholder.com/350x450?text=Lamp+Banner"
//           alt="hero"
//         />
//       </section>

//       {/* ------------------------ CATEGORY TABS ------------------------ */}
//       <div className="flex gap-8 px-10 py-8 text-lg font-medium overflow-x-auto">
//         {categories.map((c) => (
//           <button
//             key={c}
//             onClick={() => setActive(c)}
//             className={`pb-1 border-b-2 whitespace-nowrap ${
//               active === c
//                 ? "border-black text-black"
//                 : "border-transparent text-gray-500"
//             }`}
//           >
//             {c}
//           </button>
//         ))}
//       </div>

//       {/* ------------------------ PRODUCT GRID ------------------------ */}
//       <section className="px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 pb-20">

//         {products.map((p) => (
//           <div key={p.id} className="group">
//             <div className="relative">
//               {p.tag && (
//                 <span className="absolute top-3 left-3 bg-black text-white text-sm px-2 py-1 rounded">
//                   {p.tag}
//                 </span>
//               )}

//               <img
//                 src={p.img}
//                 alt={p.name}
//                 className="rounded-xl shadow-sm group-hover:shadow-lg transition-all"
//               />
//             </div>

//             <h3 className="mt-4 text-lg font-medium">{p.name}</h3>
//             <p className="text-gray-600">{p.price}</p>
//           </div>
//         ))}
//       </section>

//       {/* ------------------------ LOAD MORE ------------------------ */}
//       <div className="flex justify-center pb-12">
//         <button className="px-6 py-3 border border-gray-400 rounded-md hover:bg-gray-100">
//           Load more
//         </button>
//       </div>

//       {/* ------------------------ FOOTER ------------------------ */}
//       <footer className="bg-gray-900 text-gray-300 px-10 py-12">
//         <div className="flex gap-10 mb-6 text-lg">
//           <a href="#">About Us</a>
//           <a href="#">Blog</a>
//           <a href="#">FAQs</a>
//           <a href="#">Order Tracking</a>
//           <a href="#">Contact</a>
//         </div>

//         <p className="text-sm opacity-70">
//           © 2025 ShopSphere
//         </p>
//       </footer>
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import profileAvatar from "../images/blank_1.avif";

// ---------------- Toast Component ----------------
const Toast = ({ message, type }) => (
  <div className={`toast toast-${type}`}>{message}</div>
);

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartExists, setCartExists] = useState(false);
  const [wishlistExists, setWishlistExists] = useState(false);
  // wishlistItems: array of { wishlistItemsId, productId }
  const [wishlistItems, setWishlistItems] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 2500);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchProducts(), checkCart(), checkWishlist()]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- SAFE JSON PARSER ----------------
  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      const txt = await res.text();
      return { __raw: txt };
    }
  };

  // ---------------- Fetch Products ----------------
  const fetchProducts = async () => {
    if (!token) return console.error("Please login.");
    try {
      const res = await fetch("http://localhost:8888/api/products", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to fetch products");
      }

      const data = await safeJson(res);
      // If backend returned { __raw: "..." } treat as error
      if (data && data.__raw) throw new Error(data.__raw);
      // data expected as array of product objects (shape A)
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Product fetch error:", err);
      showToast(err.message || "Failed to load products", "error");
    }
  };

  // ---------------- Check Cart ----------------
  const checkCart = async () => {
    if (!userId || !token) return;
    try {
      const res = await fetch(`http://localhost:8888/api/carts/exists/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // treat as no cart
        setCartExists(false);
        return;
      }

      const exists = await safeJson(res);
      // exists expected boolean; handle raw text as false
      setCartExists(Boolean(exists && typeof exists === "boolean" ? exists : exists?.exists ?? exists));
    } catch (err) {
      console.error("Cart check failed:", err);
      setCartExists(false);
    }
  };

  // ---------------- Check Wishlist ----------------
  const checkWishlist = async () => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8888/api/wishlist/exists`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setWishlistExists(false);
        return;
      }

      const exists = await safeJson(res);
      const existsBool = Boolean(exists && typeof exists === "boolean" ? exists : exists?.exists ?? exists);
      setWishlistExists(existsBool);

      if (existsBool) {
        await fetchWishlistItems();
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.error("Wishlist check error:", err);
      setWishlistExists(false);
    }
  };

  // ---------------- Fetch Wishlist Items ----------------
  const fetchWishlistItems = async () => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8888/api/wishlist/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch wishlist items (status ${res.status})`);
      }

      const data = await safeJson(res);
      // Expecting array of { wishlistItemsId, wishlistId, productId }
      const normalized = (Array.isArray(data) ? data : []).map((row) => ({
        wishlistItemsId: row.wishlistItemsId ?? row.id ?? row.wishlist_items_id,
        productId: row.productId ?? row.product_id,
      }));
      setWishlistItems(normalized);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
      setWishlistItems([]);
    }
  };

  // ---------------- Add to Cart ----------------
  const handleAddToCart = async (productId) => {
    if (!userId) return showToast("Please login.", "error");

    try {
      // 1️⃣ get cart for user
      let cartData;
      const cartRes = await fetch(`http://localhost:8888/api/carts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!cartRes.ok) {
        // try to create cart by POST /api/carts/{userId}
        const createRes = await fetch(`http://localhost:8888/api/carts/${userId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!createRes.ok) throw new Error("Failed to create cart");
        cartData = await safeJson(createRes);
      } else {
        cartData = await safeJson(cartRes);
      }

      const cartId = cartData?.cartId ?? cartData?.id;
      if (!cartId) throw new Error("Cart id not available");

      // 2️⃣ add cart item
      const addRes = await fetch(`http://localhost:8888/api/cart-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cartId, productId, quantity: 1 }),
      });

      if (!addRes.ok) {
        const txt = await addRes.text();
        throw new Error(txt || "Failed to add item to cart");
      }

      showToast("Item added to cart");
      // setting cartExists true to reflect created cart
      setCartExists(true);
    } catch (err) {
      console.error("Add to cart error:", err);
      showToast(err.message || "Failed to add to cart", "error");
    }
  };

  // ---------------- Add / Remove Wishlist ----------------
  const handleWishlistToggle = async (product) => {
    try {
      const productId = product.product_id ?? product.productId;

      // check if this product is already in wishlist
      const existing = wishlistItems.find((i) => Number(i.productId) === Number(productId));

      // ---------- REMOVE ----------
      if (existing) {
        const delRes = await fetch(`http://localhost:8888/api/wishlist-items/${existing.wishlistItemsId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!delRes.ok) {
          const txt = await delRes.text();
          throw new Error(txt || "Failed to remove from wishlist");
        }

        // update UI immediately
        setWishlistItems((prev) => prev.filter((i) => Number(i.productId) !== Number(productId)));
        showToast("Removed from wishlist", "success");
        return;
      }

      // ---------- ADD ----------
      // ensure wishlist exists and fetch wishlistId
      let wishlistId = null;

      if (!wishlistExists) {
        // create wishlist
        const createRes = await fetch(`http://localhost:8888/api/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({}),
        });

        if (!createRes.ok) {
          // try to read text for helpful message
          const txt = await createRes.text();
          throw new Error(txt || "Failed to create wishlist");
        }

        const created = await safeJson(createRes);
        wishlistId = created?.wishlistId ?? created?.id ?? created?.wishlist_id;
        setWishlistExists(true);
      }

      // if we still don't have wishlistId, fetch my wishlist
      if (!wishlistId) {
        const myRes = await fetch(`http://localhost:8888/api/wishlist/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!myRes.ok) {
          const txt = await myRes.text();
          throw new Error(txt || "Failed to get wishlist id");
        }
        const my = await safeJson(myRes);
        wishlistId = my?.wishlistId ?? my?.id ?? my?.wishlist_id;
      }

      if (!wishlistId) throw new Error("Wishlist id not available");

      // post wishlist-item
      const addRes = await fetch(`http://localhost:8888/api/wishlist-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ wishlistId, productId }),
      });

      if (!addRes.ok) {
        const txt = await addRes.text();
        throw new Error(txt || "Failed to add to wishlist");
      }

      const added = await safeJson(addRes);
      // added expected to be Map with id field
      const addedId = added?.id ?? added?.wishlistItemsId ?? added?.wishlist_items_id ?? Date.now();

      // update UI so heart turns red immediately
      setWishlistItems((prev) => [...prev, { wishlistItemsId: addedId, productId }]);
      setWishlistExists(true);
      showToast("Added to wishlist", "success");
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      showToast(err.message || "Wishlist action failed", "error");
    }
  };

  // ---------------- Category Filter ----------------
  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => (p.categoryId ?? p.category_id) === activeCategory);

  const categoryTabs = [
    { id: "All", label: "All" },
    { id: 1, label: "Electronics" },
    { id: 2, label: "Fashion" },
    { id: 3, label: "Books" },
    { id: 4, label: "Kitchen" },
    { id: 5, label: "Sports" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900">
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-wide italic">ShopSphere</h1>
        <div className="hidden md:flex items-center">
          <SearchBar className="w-[28rem]" />
        </div>
        <div className="flex gap-6 text-lg">
          <img src={profileAvatar} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
          <Link to="/cart" className="nav-cart-icon">🛒</Link>
          <Link to="/wishlist" className="nav-cart-icon">❤️</Link>
        </div>
      </nav>

      {/* CATEGORY TABS */}
      <div className="flex gap-6 px-10 py-4 text-lg font-medium overflow-x-auto mb-8">
        {categoryTabs.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`pb-1 border-b-2 whitespace-nowrap ${
              activeCategory === c.id ? "border-black text-black" : "border-transparent text-gray-500"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <section className="px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-20">
        {loading ? (
          <div className="col-span-4 text-center">Loading...</div>
        ) : (
          filteredProducts.map((p) => {
            const productId = p.product_id ?? p.productId;
            const inWishlist = wishlistItems.some(item => Number(item.productId) === Number(productId));

            return (
              <div
                key={productId}
                className="group bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition relative"
              >
                <img
                  src={`/images/products/${p.imageUrl}`}
                  alt={p.productName ?? p.name}
                  className="rounded-xl h-52 w-full object-cover mb-4"
                />

                <h3 className="text-lg font-semibold">{p.productName}</h3>
                <p className="text-gray-500 text-sm">{p.brand}</p>

                <p className="text-gray-700 font-bold mt-1">
                  ₹{p.productPrice}
                  <span className="text-gray-400 line-through ml-2 text-sm">₹{p.productMrp}</span>
                </p>

                {/* BUTTONS */}
                <div className="absolute bottom-2 right-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleAddToCart(productId)}
                    className="bg-green-500 text-white font-bold px-3 py-1 rounded-full hover:bg-green-600 transition"
                    title="Add to cart"
                  >
                    🛒
                  </button>

                  <button
                    onClick={() => handleWishlistToggle(p)}
                    className="text-2xl transition hover:scale-110"
                    title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {inWishlist ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      <div className="flex justify-center pb-12">
        <button className="px-6 py-3 border border-gray-400 rounded-md hover:bg-gray-100">
          Load more
        </button>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 px-10 py-12">
        <div className="flex gap-10 mb-6 text-lg">
          <a href="#">About Us</a>
          <a href="#">Blog</a>
          <a href="#">FAQs</a>
          <a href="#">Order Tracking</a>
          <a href="#">Contact</a>
        </div>

        <p className="text-sm opacity-70">© 2025 ShopSphere</p>
      </footer>
    </div>
  );
}
