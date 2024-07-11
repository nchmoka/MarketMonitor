import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Spinner,
    Alert,
    Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup, isLoading, error } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password);
    };
    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
        >
            <Row className="w-100">
                <Col md={{ span: 6, offset: 3 }}>
                    <Image
                        src="/logo.webp"
                        fluid
                        roundedCircle
                        style={{
                            width: "250px",
                            height: "250px",
                            display: "block",
                            margin: "0 auto",
                        }}
                    />
                    <div className="mt-4"></div>

                    <h2 className="text-center mb-4">Sign Up</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mt-3"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </Form>
                    <p className="text-center mt-3">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                    {error && (
                        <div className="text-center mt-3">
                            <Alert variant="danger">{error}</Alert>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;
