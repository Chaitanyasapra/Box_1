// import React, { useEffect, useState } from "react";
// import "./CartPage.css";

// const CartPage = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const storedUserId = localStorage.getItem("userId");
//   const userId = storedUserId ? parseInt(storedUserId, 10) : null;
//   const role = localStorage.getItem("role"); // "BUYER" or "SELLER"

//   const fetchCartItems = async () => {
//     if (!userId) {
//       setError("User not found. Please login again.");
//       setLoading(false);
//       return;
//     }

//     if (role !== "BUYER") {
//       setError("Only buyers have a cart.");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         `http://localhost:8888/api/carts/userCart/${userId}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to load cart items (status ${response.status})`
//         );
//       }

//       const data = await response.json();
//       setItems(data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCartItems();
//   }, [userId, role]);

//   // -------- Delete item (CartItemController) --------
//   // @DeleteMapping("/{cartItemId}") under /api/cart-items
//   const handleRemove = async (cartItemId) => {
//     if (!window.confirm("Remove this item from your cart?")) return;

//     try {
//       const response = await fetch(
//         `http://localhost:8888/api/cart-items/${cartItemId}`,
//         { method: "DELETE" }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete cart item");
//       }

//       await fetchCartItems();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   // -------- Update quantity (CartItemController) --------
//   // @PutMapping("/{cartItemId}/quantity/{quantity}") under /api/cart-items
//   const handleQuantityChange = async (cartItemId, newQty) => {
//     if (newQty < 1) return;

//     try {
//       const response = await fetch(
//         `http://localhost:8888/api/cart-items/${cartItemId}/quantity/${newQty}`,
//         { method: "PUT" }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update quantity");
//       }

//       await fetchCartItems();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   // -------- Total --------
//   const total = items.reduce((sum, item) => {
//     const price = item.productPrice ?? item.price ?? 0;
//     const qty = item.quantity ?? 1;
//     return sum + price * qty;
//   }, 0);

//   return (
//     <div className="cart-page-wrapper">
//       <div className="cart-card">
//         <h1 className="cart-heading">My Cart</h1>
//         <p className="cart-sub">Review your products before checkout</p>

//         {loading && <p className="cart-info">Loading cart...</p>}
//         {error && <p className="cart-error">{error}</p>}

//         {!loading && !error && (
//           <>
//             {items.length === 0 ? (
//               <p className="cart-info">Your cart is empty.</p>
//             ) : (
//               <div className="cart-items-box">
//                 <div className="cart-row cart-header">
//                   <span>Product</span>
//                   <span>Qty</span>
//                   <span>Price</span>
//                   <span></span>
//                 </div>

//                 {items.map((item) => {
//                   const img =
//                     item.image_url || item.imageUrl || item.image || null;
//                   const name = item.productName || item.name || "Product";
//                   const qty = item.quantity ?? 1;
//                   const price = item.productPrice ?? item.price ?? 0;

//                   return (
//                     <div className="cart-row" key={item.cartItemId}>
//                       {/* image + name */}
//                       <div className="cart-product-cell">
//                         {img && (
//                           <img
//                             src={img}
//                             alt={name}
//                             className="cart-product-img"
//                           />
//                         )}
//                         <span className="cart-product-name">{name}</span>
//                       </div>

//                       {/* quantity controls */}
//                       <div className="cart-qty-box">
//                         <button
//                           className="qty-btn"
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, qty - 1)
//                           }
//                         >
//                           -
//                         </button>
//                         <span className="qty-value">{qty}</span>
//                         <button
//                           className="qty-btn"
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, qty + 1)
//                           }
//                         >
//                           +
//                         </button>
//                       </div>

//                       {/* price */}
//                       <span>₹{price.toLocaleString("en-IN")}</span>

//                       {/* remove cross */}
//                       <button
//                         className="cart-remove-btn"
//                         onClick={() => handleRemove(item.cartItemId)}
//                         aria-label="Remove item"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   );
//                 })}

//                 <div className="cart-row cart-total">
//                   <span className="cart-product-cell cart-total-label">
//                     Total
//                   </span>
//                   <span></span>
//                   <span></span>
//                   <span>₹{total.toLocaleString("en-IN")}</span>
//                 </div>
//               </div>
//             )}

//             <div className="cart-actions">
//               <button
//                 className="btn-back"
//                 onClick={() => (window.location.href = "/products")}
//               >
//                 Continue Shopping
//               </button>

//               <button
//                 className="btn-checkout"
//                 onClick={() => (window.location.href = "/checkout")}
//               >
//                 Checkout
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
// export default CartPage;

// import React, { useEffect, useState } from "react";
// import "./CartPage.css";

// const CartPage = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Get user info from localStorage
//   const storedUserId = localStorage.getItem("userId");
//   const storedRole = localStorage.getItem("role"); // "BUYER" or "SELLER"
//   const userId = storedUserId ? parseInt(storedUserId, 10) : null;

//   useEffect(() => {
//     if (!userId) {
//       setError("User not found. Please login again.");
//       setLoading(false);
//       return;
//     }

//     if (storedRole !== "BUYER") {
//       setError("Only buyers have a cart.");
//       setLoading(false);
//       return;
//     }

//     fetchCartItems();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userId, storedRole]);

//   // -------- Fetch Cart Items --------
//   const fetchCartItems = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Missing auth token. Please login again.");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(
//         `http://localhost:8888/api/carts/userCart/${userId}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data?.message || "Failed to fetch cart items");
//       }

//       setItems(data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------- Delete item --------
//   const handleRemove = async (cartItemId) => {
//     if (!window.confirm("Remove this item from your cart?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `http://localhost:8888/api/cart-items/${cartItemId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data?.message || "Failed to delete cart item");
//       }

//       await fetchCartItems();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   // -------- Update quantity --------
//   const handleQuantityChange = async (cartItemId, newQty) => {
//     if (newQty < 1) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `http://localhost:8888/api/cart-items/${cartItemId}/quantity/${newQty}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data?.message || "Failed to update quantity");
//       }

//       await fetchCartItems();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   // -------- Total --------
//   const total = items.reduce((sum, item) => {
//     const price = item.productPrice ?? item.price ?? 0;
//     const qty = item.quantity ?? 1;
//     return sum + price * qty;
//   }, 0);

//   return (
//     <div className="cart-page-wrapper">
//       <div className="cart-card">
//         <h1 className="cart-heading">My Cart</h1>
//         <p className="cart-sub">Review your products before checkout</p>

//         {loading && <p className="cart-info">Loading cart...</p>}
//         {error && <p className="cart-error">{error}</p>}

//         {!loading && !error && (
//           <>
//             {items.length === 0 ? (
//               <p className="cart-info">Your cart is empty.</p>
//             ) : (
//               <div className="cart-items-box">
//                 <div className="cart-row cart-header">
//                   <span>Product</span>
//                   <span>Qty</span>
//                   <span>Price</span>
//                   <span></span>
//                 </div>

//                 {items.map((item) => {
//                   const img =
//                     item.image_url || item.imageUrl || item.image || null;
//                   const name = item.productName || item.name || "Product";
//                   const qty = item.quantity ?? 1;
//                   const price = item.productPrice ?? item.price ?? 0;

//                   return (
//                     <div className="cart-row" key={item.cartItemId}>
//                       {/* image + name */}
//                       <div className="cart-product-cell">
//                         {img && (
//                           <img
//                             src={img.startsWith("http") ? img : `http://localhost:8888/uploads/${img}`}
//                             alt={name}
//                             className="cart-product-img"
//                           />
//                         )}
//                         <span className="cart-product-name">{name}</span>
//                       </div>

//                       {/* quantity controls */}
//                       <div className="cart-qty-box">
//                         <button
//                           className="qty-btn"
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, qty - 1)
//                           }
//                         >
//                           -
//                         </button>
//                         <span className="qty-value">{qty}</span>
//                         <button
//                           className="qty-btn"
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, qty + 1)
//                           }
//                         >
//                           +
//                         </button>
//                       </div>

//                       {/* price */}
//                       <span>₹{price.toLocaleString("en-IN")}</span>

//                       {/* remove cross */}
//                       <button
//                         className="cart-remove-btn"
//                         onClick={() => handleRemove(item.cartItemId)}
//                         aria-label="Remove item"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   );
//                 })}

//                 <div className="cart-row cart-total">
//                   <span className="cart-product-cell cart-total-label">
//                     Total
//                   </span>
//                   <span></span>
//                   <span></span>
//                   <span>₹{total.toLocaleString("en-IN")}</span>
//                 </div>
//               </div>
//             )}

//             <div className="cart-actions">
//               <button
//                 className="btn-back"
//                 onClick={() => (window.location.href = "/products")}
//               >
//                 Continue Shopping
//               </button>

//               <button
//                 className="btn-checkout"
//                 onClick={() => (window.location.href = "/checkout")}
//               >
//                 Checkout
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;


import React, { useEffect, useState } from "react";
import "./CartPage.css";

// ---------------- Toast Component ----------------
const Toast = ({ message, type }) => (
  <div className={`toast toast-${type}`}>
    {message}
  </div>
);

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartExists, setCartExists] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 2500);
  };

  const storedUserId = localStorage.getItem("userId");
  const storedRole = localStorage.getItem("role");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;

  useEffect(() => {
    if (!userId) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }

    if (storedRole !== "BUYER") {
      setError("Only buyers have a cart.");
      setLoading(false);
      return;
    }

    checkCartExists();
  }, [userId, storedRole]);

  // -------- Check if cart exists --------
  const checkCartExists = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8888/api/carts/exists/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const exists = await res.json();
      setCartExists(exists);
      if (exists) fetchCartItems();
    } catch (err) {
      setError("Failed to check cart existence");
      setLoading(false);
    }
  };

  // -------- Create Cart --------
  const handleCreateCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8888/api/carts/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartExists(true);
      showToast("Cart created successfully!");
      fetchCartItems();
    } catch (err) {
      showToast("Failed to create cart", "error");
    }
  };

  // -------- Fetch Cart Items --------
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8888/api/carts/userCart/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch cart items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------- Delete Cart Item --------
  const handleRemove = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8888/api/cart-items/${cartItemId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to delete item");
      showToast("Item removed from cart");
      fetchCartItems();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // -------- Update Quantity --------
  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8888/api/cart-items/${cartItemId}/quantity/${newQty}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to update quantity");
      showToast("Quantity updated");
      fetchCartItems();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // -------- Move Item to Wishlist --------
  const handleMoveToWishlist = (item) => {
    showToast(`"${item.productName}" moved to wishlist`);
  };

  const total = items.reduce((sum, item) => {
    const price = item.productPrice ?? 0;
    const qty = item.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className="cart-page-wrapper">

      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <h1 className="cart-heading">My Cart</h1>
      <p className="cart-sub">Review your products before checkout</p>

      {loading && <p className="cart-info">Loading cart...</p>}
      {error && <p className="cart-error">{error}</p>}

      {!loading && !cartExists && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleCreateCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Create Cart
          </button>
        </div>
      )}

      {/* Cart Items or Empty Message */}
      {!loading && cartExists && (
        <div className="cart-items-box">
          {items.length === 0 ? (
            <p className="cart-info">Your cart is empty.</p>
          ) : (
            items.map((item) => {
              const cartItemId = item.cartItemsId;
              const img = item.imageUrl;
              const name = item.productName ?? "Product";
              const qty = item.quantity ?? 1;
              const price = item.productPrice ?? 0;

              return (
                <div className="cart-row" key={cartItemId}>
                  <div className="cart-product-cell">
                    {img && (
                      <img
                        src={
                          img.startsWith("http")
                            ? img
                            : `http://localhost:8888/uploads/${img}`
                        }
                        alt={name}
                        className="cart-product-img"
                      />
                    )}
                    <span className="cart-product-name">{name}</span>
                  </div>

                  <div className="cart-qty-box">
                    <button className="qty-btn" onClick={() =>
                      handleQuantityChange(cartItemId, qty - 1)
                    }>-</button>

                    <span className="qty-value">{qty}</span>

                    <button className="qty-btn" onClick={() =>
                      handleQuantityChange(cartItemId, qty + 1)
                    }>+</button>
                  </div>

                  <span>₹{price.toLocaleString("en-IN")}</span>

                  <button
                    className="cart-remove-btn"
                    onClick={() => handleRemove(cartItemId)}
                    title="Remove item"
                  >
                    ✕
                  </button>

                  <button
                    className="cart-wishlist-btn"
                    onClick={() => handleMoveToWishlist(item)}
                    title="Move to Wishlist"
                  >
                    ❤️
                  </button>
                </div>
              );
            })
          )}

          {/* Total Row */}
          <div className="cart-row cart-total">
            <span className="cart-product-cell cart-total-label">Total</span>
            <span></span><span></span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          {/* Actions */}
          <div className="cart-actions">
            <button
              className="btn-back"
              onClick={() => (window.location.href = "/userDashboard")}
            >
              Continue Shopping
            </button>
            <button
              className="btn-checkout"
              onClick={() => (window.location.href = "/checkout")}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
