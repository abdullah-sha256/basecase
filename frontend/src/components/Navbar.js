import React from "react";
import useToken from "../hooks/useToken";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const { token, removeToken } = useToken();

  const Links = () => {
    if (token) {
      // Logged in links
      return (
        <>
          <Link to={"/dashboard"} className="nav-link">
            Dashboard
          </Link>
          <Link to={"/problems"} className="nav-link">
            Browse
          </Link>
          <Link to={"/stats"} className="nav-link">
            Stats
          </Link>
          <Link to={"/profile"} className="nav-link">
            Profile
          </Link>
          <Link
            to={"/"}
            className="nav-link"
            onClick={() => {
              removeToken();
              onLogout();
            }}
          >
            Logout
          </Link>
        </>
      );
    } else {
      // Logged out links
      return (
        <>
          <Link to={"/"} className="nav-link active">
            Home
          </Link>
          <Link to={"/login"} className="nav-link active">
            Login
          </Link>
          <Link to={"/register"} className="nav-link active">
            Register
          </Link>
        </>
      );
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light ">
        <div className="container">
          <a className="navbar-brand">CodeNext</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNavAltMarkup"
          >
            <div className="navbar-nav">
              <Links />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
