import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const MyNavbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const handleClick = () => {
        logout();
    };

    return (
        <Navbar className="navbar-custom" expand="lg">
            <Container>
                <Link to="/" className="navbar-brand navbar-brand-custom">
                    Market Monitor
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user ? (
                            <>
                                <Nav.Item>
                                    <Button
                                        variant="outline-danger"
                                        onClick={handleClick}
                                        className="button-custom"
                                    >
                                        Logout
                                    </Button>
                                </Nav.Item>
                            </>
                        ) : (
                            <>
                                <Nav.Item>
                                    <Link
                                        to="/contactus"
                                        className="nav-link nav-link-custom"
                                    >
                                        Contact Us
                                    </Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link
                                        to="/login"
                                        className="nav-link nav-link-custom"
                                    >
                                        Login
                                    </Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link
                                        to="/signup"
                                        className="nav-link nav-link-custom"
                                    >
                                        Sign Up
                                    </Link>
                                </Nav.Item>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
