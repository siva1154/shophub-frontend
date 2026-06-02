import React, {
  useEffect,
  useState
} from "react";

import API from "../api/axios";

const ROLES = [
  "USER",
  "ADMIN"
];

const AdminUsers = () => {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchUsers();

  }, []);

  /* =========================
     FETCH USERS
  ========================= */

  const fetchUsers = async () => {

    try {

      const res =
        await API.get(
          "/admin/users"
        );

      setUsers(
        res.data || []
      );

    }

    catch (error) {

      console.error(
        "Error fetching users:",
        error
      );

      alert(
        "Failed to load users"
      );
    }

    finally {

      setLoading(false);
    }
  };

  /* =========================
     UPDATE ROLE
  ========================= */

  const updateRole = async (
    userId,
    newRole
  ) => {

    try {

      await API.put(

        `/admin/users/${userId}/role?role=${newRole}`
      );

      setUsers((prev) =>

        prev.map((user) =>

          user.id === userId

            ? {
                ...user,
                role: newRole
              }

            : user
        )
      );

      alert(
        "User role updated successfully"
      );
    }

    catch (error) {

      console.error(
        "Error updating role:",
        error
      );

      alert(
        "Failed to update role"
      );
    }
  };

  /* =========================
     TOGGLE ACCOUNT STATUS
  ========================= */

  const toggleUserStatus =
    async (
      userId,
      currentStatus
    ) => {

    try {

      await API.put(

        `/admin/users/${userId}/status?active=${!currentStatus}`
      );

      setUsers((prev) =>

        prev.map((user) =>

          user.id === userId

            ? {
                ...user,
                active:
                  !currentStatus
              }

            : user
        )
      );

      alert(

        currentStatus

          ? "User disabled"

          : "User enabled"
      );
    }

    catch (error) {

      console.error(
        "Error updating user status:",
        error
      );

      alert(
        "Failed to update user status"
      );
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (
      <p>
        Loading users...
      </p>
    );
  }

  return (

    <div
      style={{
        marginTop: "50px"
      }}
    >

      <h3>
        User Management
      </h3>

      {users.length === 0 ? (

        <p>
          No users found.
        </p>

      ) : (

        <div className="table-responsive mt-3">

          <table
            className="
              table
              table-dark
              table-striped
              table-hover
              align-middle
            "
          >

            <thead>

              <tr>

                <th>ID</th>

                <th>Email</th>

                <th>Role</th>

                <th>Status</th>

                <th>Change Role</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user.id}>

                  {/* ID */}

                  <td>
                    {user.id}
                  </td>

                  {/* EMAIL */}

                  <td>
                    {user.email}
                  </td>

                  {/* ROLE */}

                  <td>

                    <span
                      className={`badge ${
                        user.role === "ADMIN"

                          ? "bg-danger"

                          : "bg-primary"
                      }`}
                    >

                      {user.role}

                    </span>

                  </td>

                  {/* STATUS */}

                  <td>

                    <span
                      className={`badge ${
                        user.active

                          ? "bg-success"

                          : "bg-secondary"
                      }`}
                    >

                      {user.active
                        ? "ACTIVE"
                        : "DISABLED"}

                    </span>

                  </td>

                  {/* CHANGE ROLE */}

                  <td>

                    <select

                      className="
                        form-select
                        form-select-sm
                      "

                      value={user.role}

                      onChange={(e) =>

                        updateRole(
                          user.id,
                          e.target.value
                        )
                      }
                    >

                      {ROLES.map((role) => (

                        <option
                          key={role}
                          value={role}
                        >

                          {role}

                        </option>
                      ))}
                    </select>

                  </td>

                  {/* ACTIONS */}

                  <td>

                    <button

                      className={`btn btn-sm ${
                        user.active

                          ? "btn-warning"

                          : "btn-success"
                      }`}

                      onClick={() =>

                        toggleUserStatus(
                          user.id,
                          user.active
                        )
                      }
                    >

                      {user.active
                        ? "Disable"
                        : "Enable"}

                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}
    </div>
  );
};

export default AdminUsers;