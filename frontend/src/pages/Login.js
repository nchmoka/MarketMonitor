import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Alert,
    Spinner,
    Image,
    InputGroup,
    Card,
    CardBody
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useLogin();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container
            className="justify-content-center align-items-center"
            style={{ height: "100vh" }}
        >
        <Card className="my-4">
            <CardBody className="my-3">
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
                    <h2 className="text-center mb-4">Login</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <i className="bi bi-person"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <i className="bi bi-lock"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />   
                                    <Button variant="btn btn-secondary" onClick={togglePasswordVisibility}>
                                        <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                                    </Button>                                 
                                </InputGroup>
                        </Form.Group>
                        <p className="text-right mt-3">
                            <Link to="/forgotpassword" className="none-text-decoration">Forgot Password?</Link>
                        </p>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mt-3"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </Form>
                    <p className="text-center mt-3">
                        Don't have an account? <Link to="/signup" className="none-text-decoration">Sign Up</Link>
                    </p>
                    {error && (
                        <div className="text-center mt-3">
                            <Alert variant="danger" dismissible>{error}</Alert>
                        </div>
                    )}
                </Col>
            </Row>
            </CardBody>
        </Card>
        </Container>
    );
};

export default Login;
