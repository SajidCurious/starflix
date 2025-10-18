import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../store/authSlice";
import { authService } from "../../utils/authService";
import "./style.scss";

const UserDropdown = ({ isOpen, onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    setIsDropdownOpen(false);
    onClose();
  };

  const handlePersonalClick = () => {
    navigate("/personal");
    setIsDropdownOpen(false);
    onClose();
  };

  const handleAccountClick = () => {
    // Navigate to account settings (you can create this page later)
    console.log("Account clicked");
    setIsDropdownOpen(false);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="userDropdown" ref={dropdownRef}>
      <div className="userInfo">
        <div className="userAvatar">
          <img src={user.avatar} alt={user.name} />
        </div>
        <div className="userDetails">
          <h4>{user.name}</h4>
          <p>{user.email}</p>
        </div>
      </div>
      
      <div className="dropdownMenu">
        <div className="menuItem" onClick={handlePersonalClick}>
          <FaUser className="menuIcon" />
          <span>Personal</span>
        </div>
        
        <div className="menuItem" onClick={handleAccountClick}>
          <FaCog className="menuIcon" />
          <span>Account</span>
        </div>
        
        <div className="menuDivider"></div>
        
        <div className="menuItem logout" onClick={handleLogout}>
          <FaSignOutAlt className="menuIcon" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
