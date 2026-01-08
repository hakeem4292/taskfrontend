import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Logout ONLY for 401
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
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
        console.error(
          "Fetch categories error:",
          err.response?.data || err.message
        );
      }
    }
  };

  // 🔹 CREATE category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/categories", { name, description });
      setName("");
      setDescription("");
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else if (err.response?.status === 403) {
        alert("You do not have permission to create categories.");
      } else {
        alert(err.response?.data?.error || "Error saving category");
      }
    }
  };

  // 🔹 DELETE category
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else if (err.response?.status === 403) {
        alert("You do not have permission to delete categories.");
      } else {
        alert(err.response?.data?.error || "Error deleting category");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/dashboard"
          style={{
            padding: "8px 15px",
            background: "#6c757d",
            color: "white",
            textDecoration: "none",
          }}
        >
          ← Back
        </Link>
        <h2 style={{ marginTop: "20px" }}>Categories</h2>
      </div>

      {/* Add Category */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <h3>Add Category</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              height: "60px",
              marginBottom: "10px",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "8px 15px",
              background: "#007bff",
              color: "white",
              border: "none",
            }}
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Description
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {category.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {category.description}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                <button
                  onClick={() => handleDelete(category._id)}
                  style={{
                    padding: "5px 10px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
