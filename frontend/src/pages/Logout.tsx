import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/user-slice"; // Adjust path if needed
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout()); 
    toast.success("Logged out successfully");
    navigate("/login"); 
  }, [dispatch, navigate]);

  return null; 
};

export default Logout;
