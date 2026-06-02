import React, {
  useState,
  useEffect
} from "react";

import API from "../api/axios";

import "../styles/settings.css";

const Settings = () => {

  /* =========================
     STATE
  ========================= */

  const [form, setForm] =
    useState({

      currentPassword: "",

      newPassword: "",

      confirmPassword: "",
    });

  const [notifications,
    setNotifications] =

    useState({

      orderNotifications: true,

      promotionalEmails: false,
    });

  const [loading,
    setLoading] =

    useState(false);

  /* =========================
     LOAD NOTIFICATIONS
  ========================= */

  useEffect(() => {

    fetchNotifications();

  }, []);

  const fetchNotifications =
    async () => {

    try {

      const res =
        await API.get(
          "/settings/notifications"
        );

      setNotifications({

        orderNotifications:

          res.data?.orderNotifications
            ?? true,

        promotionalEmails:

          res.data?.promotionalEmails
            ?? false,
      });

    }

    catch (error) {

      console.error(
        "Error fetching notifications:",
        error
      );

      /* DEFAULTS */

      setNotifications({

        orderNotifications: true,

        promotionalEmails: false,
      });
    }
  };

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (
    e
  ) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */

  const handleChangePassword =
    async () => {

    if (

      !form.currentPassword ||

      !form.newPassword ||

      !form.confirmPassword
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    if (

      form.newPassword !==
      form.confirmPassword
    ) {

      alert(
        "Passwords do not match"
      );

      return;
    }

    if (
      form.newPassword.length < 6
    ) {

      alert(
        "Password must be at least 6 characters"
      );

      return;
    }

    try {

      setLoading(true);

      const res =
        await API.put(

          "/settings/change-password",

          form
        );

      alert(

        res.data ||

        "Password updated successfully"
      );

      setForm({

        currentPassword: "",

        newPassword: "",

        confirmPassword: "",
      });
    }

    catch (error) {

      console.error(
        "Password change error:",
        error
      );

      const message =

        error.response?.data ||

        "Failed to change password";

      alert(message);
    }

    finally {

      setLoading(false);
    }
  };

  /* =========================
     NOTIFICATIONS
  ========================= */

  const handleNotificationChange =
    (e) => {

    const {
      name,
      checked
    } = e.target;

    setNotifications({

      ...notifications,

      [name]: checked,
    });
  };

  const saveNotifications =
    async () => {

    try {

      await API.put(

        "/settings/notifications",

        notifications
      );

      alert(
        "Notification settings updated"
      );
    }

    catch (error) {

      console.error(
        "Notification update error:",
        error
      );

      alert(
        "Failed to update notification settings"
      );
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const logoutAllDevices =
    () => {

    const confirmed =
      window.confirm(

        "Are you sure you want to logout?"
      );

    if (!confirmed) return;

    sessionStorage.clear();

    alert(
      "Logged out successfully"
    );

    window.location.href =
      "/login";
  };

  /* =========================
     DEACTIVATE ACCOUNT
  ========================= */

  const deactivateAccount =
    async () => {

    const confirmed =
      window.confirm(

        "Are you sure you want to deactivate your account?"
      );

    if (!confirmed) return;

    try {

      await API.put(
        "/auth/deactivate-account"
      );

      /* CLEAR SESSION */

      sessionStorage.clear();

      alert(
        "Account deactivated successfully"
      );

      /* REDIRECT */

      window.location.href =
        "/login";
    }

    catch (error) {

      console.error(
        "Deactivate account error:",
        error
      );

      const message =

        error.response?.data ||

        "Failed to deactivate account";

      alert(message);
    }
  };

  /* =========================
     UI
  ========================= */

  return (

    <div className="settings-page">

      <div className="settings-wrapper">

        <h2 className="settings-title">
          Settings
        </h2>

        {/* SECURITY */}

        <div className="settings-card glass-card">

          <h3>
            Security
          </h3>

          <p>
            Change your account password.
          </p>

          <div className="settings-form">

            <div className="settings-input-group">

              <label>
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />

            </div>

            <div className="settings-input-group">

              <label>
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />

            </div>

            <div className="settings-input-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />

            </div>

            <button
              className="primary-btn"
              onClick={handleChangePassword}
              disabled={loading}
            >

              {loading
                ? "Updating..."
                : "Change Password"}

            </button>

          </div>

        </div>

        {/* APPEARANCE */}

        {/* <div className="settings-card glass-card">

          <h3>
            Appearance
          </h3>

          <p>
            Theme preference is controlled from navbar.
          </p>

        </div> */}

        {/* NOTIFICATIONS */}

        <div className="settings-card glass-card">

          <h3>
            Notifications
          </h3>

          <p>
            Manage your notification preferences.
          </p>

          <label className="settings-checkbox">

            <input
              type="checkbox"
              name="orderNotifications"
              checked={notifications.orderNotifications}
              onChange={handleNotificationChange}
            />

            Receive order updates

          </label>

          <label className="settings-checkbox">

            <input
              type="checkbox"
              name="promotionalEmails"
              checked={notifications.promotionalEmails}
              onChange={handleNotificationChange}
            />

            Receive promotional emails

          </label>

          <button
            className="primary-btn mt-3"
            onClick={saveNotifications}
          >

            Save Notification Preferences

          </button>

        </div>

        {/* SESSIONS */}

        <div className="settings-card glass-card">

          <h3>
            Sessions
          </h3>

          <p>
            Logout from your account.
          </p>

          <button
            className="secondary-btn"
            onClick={logoutAllDevices}
          >

            Logout

          </button>

        </div>

        {/* ACCOUNT */}

        <div className="settings-card glass-card danger-zone">

          <h3>
            Account Control
          </h3>

          <p>
            Temporarily deactivate your account.
          </p>

          <button
            className="danger-btn"
            onClick={deactivateAccount}
          >

            Deactivate Account

          </button>

        </div>

      </div>

    </div>
  );
};

export default Settings;