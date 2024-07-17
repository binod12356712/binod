import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../wallet/WalletDashboard.css"; // Reuse the CSS file for styling
import logo3 from "./logo3.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
import axios from "axios";

export default function Settings() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const uid = localStorage.getItem("_id");
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [showKycModal, setShowKycModal] = useState(false); // State to manage KYC modal visibility
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status
  const usersid = localStorage.getItem("userId");
  useEffect(() => {
    const checkKycStatus = async () => {
      try {
        const response = await axios.get(
          `https://77.37.86.134:3001/api/kyc/${uid}`
        );
        setKycStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };
    checkKycStatus();
  }, [uid]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("userId", uid);

    try {
      await axios.post("https://77.37.86.134:3001/api/kyc", formData);
      setKycStatus("pending");
      setShowKycModal(false);
    } catch (error) {
      console.error("Error submitting KYC:", error);
    }
  };

  const renderKycStatus = () => {
    switch (kycStatus) {
      case "approved":
        return (
          <p>
            KYC Verified{" "}
            <i className="fas fa-check-circle" style={{ color: "green" }}></i>
          </p>
        );
      case "pending":
        return (
          <p>
            KYC Pending{" "}
            <i
              className="fas fa-spinner fa-spin"
              style={{ color: "orange" }}
            ></i>
          </p>
        );
      case "rejected":
        return (
          <p>
            KYC Rejected{" "}
            <i className="fas fa-times-circle" style={{ color: "red" }}></i>
          </p>
        );
      default:
        return (
          <button
            onClick={() => setShowKycModal(true)}
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Fill up KYC
          </button>
        );
    }
  };

  return (
    <div className="container">
      <header style={{ backgroundColor: "#4caf50" }}>
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <h1>
            <Link to="/">TrustCoinFX</Link>
          </h1>

          <button className="menu-button" onClick={toggleMenu}>
            &#9776;
          </button>
        </div>
      </header>

      <div
        id="sidebar"
        className={`sidebar ${isMenuOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <img src={logo3} alt="logo" />
          <p>
            <b>UID: {usersid}</b>
          </p>
        </div>

        <div className="functions">
          <ul>
            <li>
              <Link to="/wallet" className="link">
                <i className="fas fa-wallet"></i> Wallet
              </Link>
            </li>
            <li>
              <Link to="/tradepage">
                <i className="fas fa-exchange-alt"></i> Trade
              </Link>
            </li>
            <li>
              <Link to="/result">
                <i className="fas fa-chart-line"></i> Result
              </Link>
            </li>
            <li>
              <Link to="/transaction">
                <i className="fas fa-pen"></i> Transactions
              </Link>
            </li>
            <li>
              <Link to="/terms">
                <i className="fas fa-book"></i> Privacy Policy
              </Link>
            </li>
          </ul>
          <div className="more-options">
            <ul>
              {isLoggedIn ? (
                <li>
                  <Link to="/settings">
                    <i className="fa-solid fa-gear"></i> Settings
                  </Link>
                </li>
              ) : (
                <li>
                  <button onClick={() => setShowLoginModal(true)}>
                    <i className="fa-solid fa-person"></i> Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="banner">
          <h2>Account Settings</h2>
          <p>Manage your account settings and set preferences.</p>
        </div>
        <div className="settings-content">
          {renderKycStatus()}
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {showKycModal && (
        <div
          className="modal show"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            zIndex: 1000,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fefefe",
              padding: "20px",
              border: "1px solid #888",
              width: "80%",
              maxWidth: "400px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxHeight: "80%", // Add maxHeight for scrolling
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <span
              className="close"
              onClick={() => setShowKycModal(false)}
              style={{
                color: "#aaa",
                fontSize: "28px",
                fontWeight: "bold",
                position: "absolute",
                top: "10px",
                right: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </span>
            <h2>Fill up KYC</h2>
            <form onSubmit={handleKycSubmit}>
              <div className="form-group">
                <label>Date of Birth:</label>
                <input type="date" name="dob" required />
              </div>
              <div className="form-group">
                <label>Living Country:</label>
                <input type="text" name="country" required />
              </div>
              <div className="form-group">
                <label>Street Address:</label>
                <input type="text" name="address" required />
              </div>
              <div className="form-group">
                <label>Zip Code:</label>
                <input type="text" name="zip" required />
              </div>
              <div className="form-group">
                <label>Contact Number:</label>
                <input type="text" name="contact" required />
              </div>
              <div className="form-group">
                <label>Proof of Identity:</label>
                <input
                  type="file"
                  name="identityProof"
                  accept="image/*"
                  required
                />
              </div>
              <div className="form-group">
                <label>Photo (PP Size):</label>
                <input type="file" name="photo" accept="image/*" required />
              </div>
              <button
                type="submit"
                className="submit-button"
                style={{ backgroundColor: "#4caf50", color: "white" }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}
      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
}
