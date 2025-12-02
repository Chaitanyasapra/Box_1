// src/OrderSuccessPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CartPage.css";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  const orderId =
    location.state?.orderId ||
    order?.order_id ||
    order?.orderId ||
    order?.id;

  const paymentMethod =
    location.state?.paymentMethod || order?.paymentMethod || "COD";

  return (
    <div className="cart-page-wrapper">
      <div className="cart-card success-card">
        <h1 className="cart-heading">🎉 Order Placed Successfully!</h1>

        {orderId && (
          <p className="cart-sub">
            Your Order ID is <strong>{orderId}</strong>.
          </p>
        )}

        <p className="cart-sub">
          Payment method:{" "}
          <strong>{paymentMethod === "UPI" ? "UPI" : "Cash on Delivery"}</strong>
        </p>

        <button
          className="btn-checkout"
          onClick={() => navigate("/UserDashBoard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;