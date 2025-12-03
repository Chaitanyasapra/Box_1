// src/SellerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios"; // adjust path if needed

function IconOrders() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 7h18M3 12h18M3 17h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconProducts() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2l8 4-8 4-8-4 8-4zM4 10v6l8 4 8-4v-6" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Seller Dashboard Component ---------- */
export default function SellerDashboard() {
  const tabs = [
    { id: "orders", label: "Orders", icon: <IconOrders /> },
    { id: "products", label: "Products", icon: <IconProducts /> },
    { id: "details", label: "Seller Details", icon: <IconUser /> },
    { id: "settings", label: "Settings", icon: null },
  ];

  const [activeTab, setActiveTab] = useState("orders");

  /* ---------- Orders State ---------- */
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  /* ---------- Products State ---------- */
  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [prodError, setProdError] = useState(null);

  /* ---------- Seller Details ---------- */
  const [seller, setSeller] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState(null);

  /* ---------- UI State: Modals & edit item ---------- */
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showEditSeller, setShowEditSeller] = useState(false);

  /* ---------- Fetch functions ---------- */
  useEffect(() => {
    // fetch initial tab data depending on activeTab
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "products") fetchProducts();
    if (activeTab === "details") fetchSellerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /* Orders */
  async function fetchOrders() {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await api.get("/seller/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("fetchOrders", err);
      setOrdersError(err?.response?.data || err.message);
    } finally {
      setOrdersLoading(false);
    }
  }

  /* Products */
  async function fetchProducts() {
    setProdLoading(true);
    setProdError(null);
    try {
      const res = await api.get("/seller/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("fetchProducts", err);
      setProdError(err?.response?.data || err.message);
    } finally {
      setProdLoading(false);
    }
  }

  async function createProduct(payload) {
    try {
      const res = await api.post("/seller/products", payload);
      setProducts((s) => [res.data, ...s]);
      setShowAddProduct(false);
    } catch (err) {
      throw err;
    }
  }

  async function updateProduct(id, payload) {
    try {
      const res = await api.put(`/seller/products/${id}`, payload);
      setProducts((s) => s.map((p) => (p.id === id ? res.data : p)));
      setEditProduct(null);
    } catch (err) {
      throw err;
    }
  }

  async function deleteProduct(id) {
    //if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/seller/products/${id}`);
      setProducts((s) => s.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product: " + (err?.response?.data?.message || err.message));
    }
  }

  /* Seller details */
  async function fetchSellerDetails() {
    setSellerLoading(true);
    setSellerError(null);
    try {
      const res = await api.get("/seller/details");
      setSeller(res.data);
    } catch (err) {
      console.error("fetchSellerDetails", err);
      setSellerError(err?.response?.data || err.message);
    } finally {
      setSellerLoading(false);
    }
  }

  async function saveSellerDetails(payload) {
    try {
      const res = await api.put("/seller/details", payload);
      setSeller(res.data);
      setShowEditSeller(false);
    } catch (err) {
      throw err;
    }
  }

  /* ---------- Small helpers ---------- */
  const orderCount = orders.length;
  const productCount = products.length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-wide">ShopSphere Seller DashBoard</h1>
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-600">{seller?.companyName ?? "Seller Panel"}</div>
          <button className="px-3 py-2 rounded bg-gray-100">New Product</button>
        </div>
      </nav>

      {/* LAYOUT: 3 columns (left tabs, main content center, right summary) */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 px-6 py-8">
        {/* LEFT: vertical tabs */}
        <aside className="col-span-3">
          <div className="bg-white rounded-lg shadow-sm py-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 
                  ${activeTab === t.id ? "bg-gray-100 border-l-4 border-black" : ""}`}
              >
                <span className="text-gray-600">{t.icon}</span>
                <span className="flex-1">{t.label}</span>
                {t.id === "orders" && orderCount > 0 && (
                  <span className="text-sm text-gray-500">{orderCount}</span>
                )}
                {t.id === "products" && productCount > 0 && (
                  <span className="text-sm text-gray-500">{productCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* quick action */}
          <div className="mt-6">
            <button
              onClick={() => { setActiveTab("products"); setShowAddProduct(true); }}
              className="w-full px-4 py-3 rounded-lg bg-black text-white hover:opacity-95"
            >
              Add product
            </button>
          </div>
        </aside>

        {/* CENTER: tab contents */}
        <main className="col-span-7">
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[420px]">
            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                loading={ordersLoading}
                error={ordersError}
                refresh={fetchOrders}
              />
            )}

            {activeTab === "products" && (
              <ProductsTab
                products={products}
                loading={prodLoading}
                error={prodError}
                onAdd={() => setShowAddProduct(true)}
                onEdit={(p) => setEditProduct(p)}
                onDelete={(id) => deleteProduct(id)}
                refresh={fetchProducts}
              />
            )}

            {activeTab === "details" && (
              <DetailsTab
                seller={seller}
                loading={sellerLoading}
                error={sellerError}
                onEdit={() => setShowEditSeller(true)}
                refresh={fetchSellerDetails}
              />
            )}

            {activeTab === "settings" && (
              <div>
                <h3 className="text-lg font-medium mb-3">Settings</h3>
                <p className="text-gray-600">Coming soon — shipping, payouts, store settings.</p>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT: summary */}
        <aside className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-medium text-gray-600">Summary</h4>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between text-sm"><span>Orders</span><span>{orderCount}</span></div>
              <div className="flex justify-between text-sm"><span>Products</span><span>{productCount}</span></div>
              <div className="flex justify-between text-sm"><span>Active</span><span>{products.filter(p=>p.status==='ACTIVE').length}</span></div>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-500">
          © 2025 NordicMade — Seller dashboard
        </div>
      </footer>

      {/* Modals */}
      {showAddProduct && (
        <ProductModal
          title="Add Product"
          onClose={() => setShowAddProduct(false)}
          onSave={async (payload) => {
            try {
              await createProduct(payload);
            } catch (err) {
              alert("Create failed: " + (err?.response?.data?.message || err.message));
            }
          }}
        />
      )}

      {editProduct && (
        <ProductModal
          title="Edit Product"
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={async (payload) => {
            try {
              await updateProduct(editProduct.id, payload);
            } catch (err) {
              alert("Update failed: " + (err?.response?.data?.message || err.message));
            }
          }}
        />
      )}

      {showEditSeller && seller && (
        <SellerModal
          title="Edit Seller"
          seller={seller}
          onClose={() => setShowEditSeller(false)}
          onSave={async (payload) => {
            try {
              await saveSellerDetails(payload);
            } catch (err) {
              alert("Save failed: " + (err?.response?.data?.message || err.message));
            }
          }}
        />
      )}
    </div>
  );
}

/* ---------- Orders Tab Component ---------- */
function OrdersTab({ orders, loading, error, refresh }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Orders</h3>
        <div className="text-sm text-gray-500">
          <button onClick={refresh} className="px-3 py-1 border rounded">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading orders…</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">Error loading orders</div>
      ) : orders.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No orders yet</div>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border rounded p-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-gray-500">#{o.id} · {new Date(o.createdAt).toLocaleString()}</div>
                  <div className="font-medium">{o.buyerName || "Buyer"}</div>
                  <div className="text-sm text-gray-600">{o.address}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="font-medium">{o.total}</div>
                  <div className="mt-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${o.status === "SHIPPED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500">
                    <tr><th>Product</th><th>Qty</th><th>Price</th></tr>
                  </thead>
                  <tbody>
                    {o.items?.map((it, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2">{it.name}</td>
                        <td className="py-2">{it.qty}</td>
                        <td className="py-2">{it.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Products Tab Component ---------- */
function ProductsTab({ products, loading, error, onAdd, onEdit, onDelete, refresh }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Products</h3>
        <div className="flex gap-3">
          <button onClick={onAdd} className="px-3 py-1 rounded bg-black text-white">Add Product</button>
          <button onClick={refresh} className="px-3 py-1 border rounded">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading products…</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">Error loading products</div>
      ) : products.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No products</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="flex gap-4 border rounded p-3 items-center">
              <div className="w-24 h-24 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-xs text-gray-400">No image</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.description}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium">{p.price}</div>
                    <div className="text-sm text-gray-500">Qty: {p.qty ?? 0}</div>
                    <div className={`mt-1 text-xs inline-block px-2 py-1 rounded ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                      {p.status ?? "UNKNOWN"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => onEdit(p)} className="px-3 py-1 border rounded text-sm">Edit</button>
                  <button onClick={() => onDelete(p.id)} className="px-3 py-1 border rounded text-sm text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Details Tab Component ---------- */
function DetailsTab({ seller, loading, error, onEdit, refresh }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Seller Details</h3>
        <div>
          <button onClick={onEdit} className="px-3 py-1 border rounded">Edit</button>
          <button onClick={refresh} className="ml-2 px-3 py-1 border rounded">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading…</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">Error loading details</div>
      ) : !seller ? (
        <div className="py-8 text-center text-gray-500">No seller info</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="text-sm"><span className="font-medium">Company: </span>{seller.companyName}</div>
          <div className="text-sm"><span className="font-medium">Name: </span>{seller.name}</div>
          <div className="text-sm"><span className="font-medium">Email: </span>{seller.email}</div>
          <div className="text-sm"><span className="font-medium">Phone: </span>{seller.phone}</div>
          <div className="text-sm"><span className="font-medium">Address: </span>{seller.address}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- Product Modal (Add/Edit) ---------- */
function ProductModal({ title, onClose, onSave, product }) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [qty, setQty] = useState(product?.qty ?? 0);
  const [status, setStatus] = useState(product?.status || "INACTIVE");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [description, setDescription] = useState(product?.description || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name || !price) {
      alert("Name and price are required");
      return;
    }
    setSaving(true);
    try {
      await onSave({ name, price, qty, status, imageUrl, description });
      // parent will close or update
    } catch (err) {
      alert("Save failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">{title}</h4>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">Name
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Price
              <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </label>

            <label className="text-sm">Quantity
              <input type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value || 0))} className="w-full mt-1 px-3 py-2 border rounded" />
            </label>
          </div>

          <label className="text-sm">Status
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          <label className="text-sm">Image URL
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
          </label>

          <label className="text-sm">Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" rows={3} />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-black text-white rounded">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Seller Modal ---------- */
function SellerModal({ title, seller, onClose, onSave }) {
  const [form, setForm] = useState({
    name: seller?.name || "",
    email: seller?.email || "",
    companyName: seller?.companyName || "",
    phone: seller?.phone || "",
    address: seller?.address || "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      alert("Save failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">{title}</h4>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">Company Name
            <input value={form.companyName} onChange={e => setForm(f => ({...f, companyName: e.target.value}))} className="w-full mt-1 px-3 py-2 border rounded" />
          </label>

          <label className="text-sm">Name
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full mt-1 px-3 py-2 border rounded" />
          </label>

          <label className="text-sm">Email
            <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full mt-1 px-3 py-2 border rounded" />
          </label>

          <label className="text-sm">Phone
            <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="w-full mt-1 px-3 py-2 border rounded" />
          </label>

          <label className="text-sm">Address
            <textarea value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} className="w-full mt-1 px-3 py-2 border rounded" rows={3} />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-black text-white rounded">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}