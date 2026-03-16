import React, { useEffect, useState } from "react";
import { Box, Card, CardContent } from "@mui/material";
import FilterBar from "./UserFilterBar";
import UserDataGrid from "./UserDataGrid";
import UserTableHeader from "./UserTableHeader";
import axios from "../../../config/axios";

const UserManagement = () => {

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("/admin/users")
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleRoleChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleStatusChange = async (userId, newStatus, newRole) => {
    try {
      const user = users.find(u => u.id === userId);
      const updatedStatus = newStatus ?? user.status;
      const updatedRole = newRole ?? user.role;

      await axios.put(`admin/users/${userId}`, {
        status: updatedStatus,
        role: updatedRole,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: updatedStatus, role: updatedRole } : u
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const removeVietnameseTones = (str) =>
    str
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/gi, "d")
      .replace(/\s+/g, "")
      .toLowerCase();

  const filteredUsers = users.filter((user) => {

    const matchRole = roleFilter === "all" || user.role === roleFilter;
    const name = removeVietnameseTones(user.fullName || "");
    const phone = user.phoneNumber || "";
    const keyword = removeVietnameseTones(searchText);
    const matchSearch = name.includes(keyword) || phone.includes(searchText);
    return matchRole && matchSearch;
  });

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <UserTableHeader />

      <Card sx={{ mb: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <CardContent>
          <FilterBar
            roleFilter={roleFilter}
            onRoleChange={handleRoleChange}
            searchText={searchText}
            onSearchChange={(e) => setSearchText(e.target.value)}
            count={filteredUsers.length}
          />

        </CardContent>
        
      </Card>

      <UserDataGrid
        users={filteredUsers}
        loading={loading}
        onStatusChange={handleStatusChange}
      />
    </Box>
  );
};

export default UserManagement;