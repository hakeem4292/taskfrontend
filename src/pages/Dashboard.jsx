// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchStats(parsedUser);
  }, []);

  // 🔹 Logout ONLY for 401
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔹 Fetch dashboard stats
  const fetchStats = async (currentUser) => {
    try {
      // Products & Categories → allowed for most roles
      const requests = [
        api.get("/products"),
        api.get("/categories"),
      ];

      // Users → admin only
      if (currentUser.role === "admin") {
        requests.push(api.get("/users"));
      }

      const responses = await Promise.all(requests);

      setStats({
        products: responses[0].data.products?.length || 0,
        categories: responses[1].data.categories?.length || 0,
        users:
          currentUser.role === "admin"
            ? responses[2]?.data.users?.length || 0
            : 0,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else if (err.response?.status === 403) {
        alert("You do not have permission to view some dashboard data.");
      } else {
        console.error("Dashboard stats error:", err.message);
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Dashboard</h2>
        <div>
          <span style={{ marginRight: "15px" }}>
            Welcome, {user.name} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 15px",
              background: "#dc3545",
              color: "white",
              border: "none",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <Link
          to="/products"
          style={{
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            textDecoration: "none",
          }}
        >
          Products
        </Link>

        <Link
          to="/categories"
          style={{
            padding: "10px 20px",
            background: "#17a2b8",
            color: "white",
            textDecoration: "none",
          }}
        >
          Categories
        </Link>

        {user.role === "admin" && (
          <Link
            to="/users"
            style={{
              padding: "10px 20px",
              background: "#6c757d",
              color: "white",
              textDecoration: "none",
            }}
          >
            Users
          </Link>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            flex: 1,
            padding: "20px",
            border: "1px solid #007bff",
            background: "#e3f2fd",
          }}
        >
          <h3>Products</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {stats.products}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            padding: "20px",
            border: "1px solid #28a745",
            background: "#e8f5e9",
          }}
        >
          <h3>Categories</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {stats.categories}
          </p>
        </div>

        {user.role === "admin" && (
          <div
            style={{
              flex: 1,
              padding: "20px",
              border: "1px solid #ffc107",
              background: "#fff3cd",
            }}
          >
            <h3>Users</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
              {stats.users}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
