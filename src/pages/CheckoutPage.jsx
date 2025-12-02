
// src/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import api from '../api/axios';

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;

  const fetchCartItems = async () => {
    if (!userId) {
      setError("User not found. Please log in again.");
      setLoadingCart(false);
      return;
    }

    try {
      setLoadingCart(true);
      setError(null);

      const response = await fetch(
        `http://localhost:8888/api/carts/userCart/items/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load cart items (status ${response.status})`
        );
      }

      const data = await response.json();
      setItems(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const totalAmount = items.reduce((sum, item) => {
    const price = item.productPrice ?? item.price ?? 0;
    const qty = item.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("User not found. Please log in again.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const shippingAddress = `${addressLine}, ${city}, ${stateName} - ${pincode}. Name: ${name}, Phone: ${phone}`;

    const payload = {
      userId: userId,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      orderStatus: "PENDING",
      paymentMethod: paymentMethod,
      razorpayOrderId: null,
    };

    try {
      setPlacingOrder(true);

      const response = await api.post("/orders", payload);
      const order = response.data;

      const orderId = order.order_id ?? order.orderId ?? order.id;

      if (!orderId) {
        throw new Error("Order created but ID not found in response");
      }

      if (paymentMethod === "COD") {
        navigate("/order-success", {
          state: {
            orderId: orderId,
            paymentMethod: "COD",
            order,
          },
        });
      } else {
        navigate(`/payment/upi/${orderId}`, {
          state: { order },
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="cart-page-wrapper">
      <div className="cart-card">
        <h1 className="cart-heading">Checkout</h1>
        <p className="cart-sub">
          Enter your details and choose your payment method
        </p>

        {loadingCart && <p className="cart-info">Loading cart...</p>}
        {error && <p className="cart-error">{error}</p>}

        {!loadingCart && !error && items.length === 0 && (
          <p className="cart-info">Your cart is empty.</p>
        )}

        {!loadingCart && !error && items.length > 0 && (
          <div className="checkout-layout">
            {/* LEFT: form */}
            <form className="checkout-form" onSubmit={handlePlaceOrder}>
              <h2 className="section-heading">Shipping Details</h2>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  rows="2"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <h2 className="section-heading">Payment Method</h2>
              <div className="payment-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery (COD)
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  UPI (Scan & Pay)
                </label>
              </div>

              <button
                type="submit"
                className="btn-checkout"
                disabled={placingOrder}
              >
                {placingOrder
                  ? "Placing Order..."
                  : paymentMethod === "COD"
                  ? "Place Order"
                  : "Proceed to UPI Payment"}
              </button>
            </form>

            {/* RIGHT: summary */}
            <div className="checkout-summary">
              <h2 className="section-heading">Order Summary</h2>
              <div className="cart-items-box">
                {items.map((item) => {
                  const name = item.productName || item.name || "Product";
                  const qty = item.quantity ?? 1;
                  const price = item.productPrice ?? item.price ?? 0;
                  return (
                    <div className="cart-row" key={item.cartItemId}>
                      <div className="cart-product-cell">
                        <span className="cart-product-name">{name}</span>
                      </div>
                      <span>x {qty}</span>
                      <span>
                        ₹{(price * qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}

                <div className="cart-row cart-total">
                  <span className="cart-product-cell cart-total-label">
                    Total
                  </span>
                  <span></span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;