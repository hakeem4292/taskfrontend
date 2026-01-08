import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    role: "viewer",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Central logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔹 GET users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        console.error("Error fetching users:", err.response?.data || err.message);
      }
    }
  };

  // 🔹 CREATE user (register)
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", newUser);
      setNewUser({ email: "", password: "", name: "", role: "viewer" });
      fetchUsers();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        alert(err.response?.data?.error || "Error creating user");
      }
    }
  };

  // 🔹 UPDATE role
  const handleUpdateRole = async (userId, role) => {
    try {
      await api.put(`/users/${userId}`, { role });
      fetchUsers();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        alert(err.response?.data?.error || "Error updating user");
      }
    }
  };

  // 🔹 DELETE user
  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        alert(err.response?.data?.error || "Error deleting user");
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
        <h2 style={{ marginTop: "20px" }}>Users</h2>
      </div>

      {/* Add User Form */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <h3>Add New User</h3>
        <form onSubmit={handleCreateUser}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
              required
              style={{ flex: 1, padding: "8px" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
              style={{ flex: 1, padding: "8px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
              style={{ flex: 1, padding: "8px" }}
            />
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              style={{ flex: 1, padding: "8px" }}
            >
              <option value="admin">Admin</option>
              <option value="product_manager">Product Manager</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: "8px 15px",
              background: "#28a745",
              color: "white",
              border: "none",
            }}
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Email
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Role
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {user.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {user.email}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleUpdateRole(user._id, e.target.value)
                  }
                  style={{ padding: "5px" }}
                >
                  <option value="admin">Admin</option>
                  <option value="product_manager">Product Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                <button
                  onClick={() => handleDelete(user._id)}
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

export default Users;
