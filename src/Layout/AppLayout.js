import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../common/component/Sidebar";
import Navbar from "../common/component/Navbar";
import ToastMessage from "../common/component/ToastMessage";
import { loginWithToken } from "../features/user/userSlice";
import { getCartQty, initialCart } from "../features/cart/cartSlice";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(loginWithToken());
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (user) {
      dispatch(getCartQty());
      if (location.pathname === "/login") {
        navigate("/");
      }
    } else {
      dispatch(initialCart());
    }
  }, [user, dispatch, location.pathname, navigate]);
  return (
    <div>
      <ToastMessage />
      {location.pathname.includes("admin") ? (
        <Row className="vh-100">
          <Col xs={12} md={3} className="sidebar mobile-sidebar">
            <Sidebar />
          </Col>
          <Col xs={12} md={9}>
            {children}
          </Col>
        </Row>
      ) : (
        <>
          <Navbar />
          {children}
        </>
      )}
    </div>
  );
};

export default AppLayout;
