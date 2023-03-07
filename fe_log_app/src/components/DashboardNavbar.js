import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { faKey, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../redux/slices/authSlice";
import "../styles/DashboardNavbar.css";

const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "sidebar-nav-text",
  },
  {
    title: "Log Sources",
    path: "/log-sources",
    icon: <IoIcons.IoIosPaper />,
    cName: "sidebar-nav-text",
  },
];

function DashboardNavbar() {
  const [sidebar, setSidebar] = useState(false);

  const toggleSidebar = () => setSidebar(!sidebar);
  const closeSidebar = () => setSidebar(false);

  let user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    dispatch(logOut());
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" data-testid="navbar">
        <Container>
          <Navbar.Brand data-testid="show-sidebar-btn"
            href="#"
            className="justify-content-center"
            onClick={toggleSidebar}
          >
            <span to="#" className="sidebar-menu-bars">
              <FaIcons.FaBars />
            </span>
            Log Dashboard
          </Navbar.Brand>
          <Nav className="justify-content-end" onClick={closeSidebar}>
            <NavDropdown title={user && user.username} id="basic-nav-dropdown" data-testid="navbar-user-dropdown">
              <NavDropdown.Item href="#">
                <FontAwesomeIcon className="me-2" icon={faUser} />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <FontAwesomeIcon className="me-2" icon={faKey} />
                Change Password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#" onClick={handleLogout} data-testid="navbar-logout">
                <FontAwesomeIcon className="me-2" icon={faSignOutAlt} />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {/* </Navbar.Collapse> */}
        </Container>
      </Navbar>
      <IconContext.Provider value={{ color: "undefined" }}>
        <nav data-testid="sidebar"
          className={sidebar ? "sidebar-nav-menu active" : "sidebar-nav-menu"}
        >
          <ul className="sidebar-nav-menu-items" data-testid="close-sidebar-btn" onClick={closeSidebar}>
            <li className="sidebar-navbar-toggle">
              <Link to="#" className="sidebar-close-icon">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span className="sidebar-item-text">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default DashboardNavbar;
