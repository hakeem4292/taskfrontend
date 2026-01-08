import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sku: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // 🔹 Logout ONLY for 401
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔹 GET products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else if (err.response?.status === 403) {
        alert("You do not have permission to view products.");
      } else {
        console.error(err.response?.data || err.message);
      }
    }
  };

  // 🔹 GET categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else if (err.response?.status === 403) {
        alert("You do not have permission to view categories.");
      } else {
        console.error(err.response?.data || err.message);
      }
    }
  };

  // 🔹 CREATE / UPDATE product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
      } else {
        await api.post("/products", formData);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        sku: "",
      });

      fetchProducts();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else if (err.response?.status === 403) {
        alert("You do not have permission to save products.");
      } else {
        alert(err.response?.data?.error || "Failed to save product");
      }
    }
  };

  // 🔹 EDIT product
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id,
      stock: product.stock,
      sku: product.sku,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  // 🔹 DELETE product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else if (err.response?.status === 403) {
        alert("You do not have permission to delete products.");
      } else {
        alert(err.response?.data?.error || "Failed to delete product");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      <button onClick={() => setShowForm(true)}>Add Product</button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          <input
            placeholder="SKU"
            value={formData.sku}
            onChange={(e) =>
              setFormData({ ...formData, sku: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            required
          />

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button type="submit">
            {editingId ? "Update" : "Save"}
          </button>

          <button type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category?.name}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/dashboard">Back</Link>
    </div>
  );
};

export default Products;
