import React, { useEffect, useState } from "react";
import "./WishlistPage.css";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------ Fetch wishlist items ------------------
  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ YOUR endpoint: @GetMapping("/items") in WishlistController
      const response = await fetch("http://localhost:8888/api/wishlists/items");

      if (!response.ok) {
        throw new Error(
          `Failed to load wishlist items (status ${response.status})`
        );
      }

      const data = await response.json(); // List<Map<String, Object>>

      // normalize keys coming from DAO like: wishlist_items_id, product_name, product_image_url, product_price
      const normalized = (data || []).map((row) => ({
        wishlistItemId:
          row.wishlist_items_id ?? row.wishlistItemId ?? row.id,
        productId: row.product_id ?? row.productId,
        productName: row.product_name ?? row.productName,
        imageUrl:
          row.product_image_url ?? row.image_url ?? row.imageUrl ?? row.image,
        price: row.product_price ?? row.productPrice ?? row.price,
      }));

      setItems(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  // ------------------ Remove from wishlist ------------------
  // @DeleteMapping("/{wishlistItemId}") in WishlistItemController
  const handleRemove = async (wishlistItemId) => {
    if (!window.confirm("Remove this item from your wishlist?")) return;

    try {
      const response = await fetch(
        `http://localhost:8888/api/wishlist-items/${wishlistItemId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to remove wishlist item");
      }

      setItems((prev) =>
        prev.filter((item) => item.wishlistItemId !== wishlistItemId)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // ------------------ Move to Cart ------------------
  // New endpoint we’ll add: POST /api/wishlist-items/{wishlistItemId}/move-to-cart
  const handleMoveToCart = async (wishlistItemId) => {
    try {
      const response = await fetch(
        `http://localhost:8888/api/wishlist-items/${wishlistItemId}/move-to-cart`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to move item to cart");
      }

      // remove from wishlist UI after moving
      setItems((prev) =>
        prev.filter((item) => item.wishlistItemId !== wishlistItemId)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="wishlist-page-wrapper">
      <div className="wishlist-card">
        <h1 className="wishlist-heading">My Wishlist</h1>
        <p className="wishlist-sub">
          Save items you love and move them to your cart when you're ready.
        </p>

        {loading && <p className="wishlist-info">Loading wishlist...</p>}
        {error && <p className="wishlist-error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="wishlist-summary">
              <span>{items.length} item(s) in your wishlist</span>
            </div>

            {items.length === 0 ? (
              <p className="wishlist-info">
                Your wishlist is empty. Start exploring products!
              </p>
            ) : (
              <div className="wishlist-items-box">
                {items.map((item) => (
                  <div
                    className="wishlist-row"
                    key={item.wishlistItemId}
                  >
                    {/* image */}
                    <div className="wishlist-product-img-wrap">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="wishlist-product-img"
                        />
                      )}
                    </div>

                    {/* product details */}
                    <div className="wishlist-details">
                      <div className="wishlist-product-name">
                        {item.productName}
                      </div>
                      <div className="wishlist-price">
                        ₹{(item.price ?? 0).toLocaleString("en-IN")}
                      </div>
                      <div className="wishlist-stock wishlist-stock-yes">
                        In stock
                      </div>
                    </div>

                    {/* actions */}
                    <div className="wishlist-actions-cell">
                      <button
                        className="wishlist-btn-move"
                        onClick={() =>
                          handleMoveToCart(item.wishlistItemId)
                        }
                      >
                        Move to Cart
                      </button>

                      <button
                        className="wishlist-btn-remove"
                        onClick={() =>
                          handleRemove(item.wishlistItemId)
                        }
                        aria-label="Remove from wishlist"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;