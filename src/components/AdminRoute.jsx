import {
  Navigate
} from "react-router-dom";

const AdminRoute = ({
  children
}) => {

  const token =
    sessionStorage.getItem("token");

  const role =
    sessionStorage.getItem("role");

  // console.log(
  //   "ADMIN TOKEN:",
  //   token
  // );

  // console.log(
  //   "ADMIN ROLE:",
  //   role
  // );

  if (!token) {

    return (
      <Navigate to="/login" />
    );
  }

  if (role !== "ADMIN") {

    return (
      <Navigate to="/" />
    );
  }

  return children;
};

export default AdminRoute;