import React, { useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => {
    return (
      <div>
        <Link
          to="/"
          className="z-[5000] absolute top-[0px] no-underline text-inherit hover:text-inherit font-suit-800 text-[40px] md:text-[50px]"
        >
          Wearly
        </Link>
        <section className="mt-[60px]">
          <div className="font-suit-700 py-[20px] px-[10px] hover:cursor-pointer hover:bg-main/40">
            Admin Account
          </div>
          <ul className="pl-[0px]">
            <li
              className="font-suit-700 py-[20px] px-[10px] hover:cursor-pointer hover:bg-main/40"
              onClick={() => handleSelectMenu("/admin/product?page=1")}
            >
              product
            </li>
            <li
              className="font-suit-700 py-[20px] px-[10px] hover:cursor-pointer hover:bg-main/40"
              onClick={() => handleSelectMenu("/admin/order?page=1")}
            >
              order
            </li>
          </ul>
        </section>
      </div>
    );
  };
  return (
    <>
      <div className="sidebar-toggle">{NavbarContent()}</div>

      <Navbar bg="light" expand={false} className="mobile-sidebar-toggle">
        <Container fluid>
          <img width={80} src="/image/hm-logo.png" alt="hm-logo.png" />
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand`}
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="start"
            className="sidebar"
            show={show}
          >
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;
