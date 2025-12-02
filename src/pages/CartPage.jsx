import React, { useEffect, useState } from "react";
import "./CartPage.css";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // get userId (adjust if you store differently)
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;

  // -------- Fetch Cart Items (CartController) --------
  const fetchCartItems = async () => {
    if (!userId) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ YOUR CartController endpoint:
      // @GetMapping("/userCart/items/{userId}")
      const response = await fetch(
        `http://localhost:8888/api/carts/userCart/items/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load cart items (status ${response.status})`
        );
      }

      const data = await response.json(); // List<CartItemDto>
      setItems(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // -------- Delete item (CartItemController) --------
  // @DeleteMapping("/{cartItemId}") under /api/cart-items
  const handleRemove = async (cartItemId) => {
    if (!window.confirm("Remove this item from your cart?")) return;

    try {
      const response = await fetch(
        `http://localhost:8888/api/cart-items/${cartItemId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete cart item");
      }

      await fetchCartItems();
    } catch (err) {
      alert(err.message);
    }
  };

  // -------- Update quantity (CartItemController) --------
  // @PutMapping("/{cartItemId}/quantity/{quantity}") under /api/cart-items
  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return;

    try {
      const response = await fetch(
        `http://localhost:8888/api/cart-items/${cartItemId}/quantity/${newQty}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      await fetchCartItems();
    } catch (err) {
      alert(err.message);
    }
  };

  // -------- Total --------
  const total = items.reduce((sum, item) => {
    const price = item.productPrice ?? item.price ?? 0;
    const qty = item.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className="cart-page-wrapper">
      <div className="cart-card">
        <h1 className="cart-heading">My Cart</h1>
        <p className="cart-sub">Review your products before checkout</p>

        {loading && <p className="cart-info">Loading cart...</p>}
        {error && <p className="cart-error">{error}</p>}

        {!loading && !error && (
          <>
            {items.length === 0 ? (
              <p className="cart-info">Your cart is empty.</p>
            ) : (
              <div className="cart-items-box">
                <div className="cart-row cart-header">
                  <span>Product</span>
                  <span>Qty</span>
                  <span>Price</span>
                  <span></span>
                </div>

                {items.map((item) => {
                  const img =
                    item.image_url || item.imageUrl || item.image || null;
                  const name = item.productName || item.name || "Product";
                  const qty = item.quantity ?? 1;
                  const price = item.productPrice ?? item.price ?? 0;

                  return (
                    <div className="cart-row" key={item.cartItemId}>
                      {/* image + name */}
                      <div className="cart-product-cell">
                        {img && (
                          <img
                            src={img}
                            alt={name}
                            className="cart-product-img"
                          />
                        )}
                        <span className="cart-product-name">{name}</span>
                      </div>

                      {/* quantity controls */}
                      <div className="cart-qty-box">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleQuantityChange(item.cartItemId, qty - 1)
                          }
                        >
                          -
                        </button>
                        <span className="qty-value">{qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleQuantityChange(item.cartItemId, qty + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* price */}
                      <span>₹{price.toLocaleString("en-IN")}</span>

                      {/* remove cross */}
                      <button
                        className="cart-remove-btn"
                        onClick={() => handleRemove(item.cartItemId)}
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                <div className="cart-row cart-total">
                  <span className="cart-product-cell cart-total-label">
                    Total
                  </span>
                  <span></span>
                  <span></span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}

            <div className="cart-actions">
              <button
                className="btn-back"
                onClick={() => (window.location.href = "/products")}
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
          </>
        )}
      </div>
    </div>
  );
};
export default CartPage;