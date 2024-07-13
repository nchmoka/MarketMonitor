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
    InputGroup,
    Card,
    CardBody
} from "react-bootstrap";
import { Link } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";


const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { signup, isLoading, error } = useSignup();
    const [showSuccessModal, setShowSuccessModal] = useState(false); // modal
    
    // modal
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(email, password, confirmPassword);
        if (success) {
            setShowSuccessModal(true); // Show modal on successful signup
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false); // Close modal
    };
    // modal

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

                            <h2 className="text-center mb-4">Sign Up</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicEmail" className="my-3">
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

                                <Form.Group controlId="formBasicPassword" className="my-3">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <i className="bi bi-lock"></i>
                                        </InputGroup.Text>                           
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            title="At least 8 characters long, at least one uppercase letter, at least one lowercase letter, at least one number, at least one special character"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId="formBasicConfirmPassword" className="my-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <i className="bi bi-lock-fill"></i>
                                        </InputGroup.Text>                                
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm Password"
                                            title="At least 8 characters long, at least one uppercase letter, at least one lowercase letter, at least one number, at least one special character"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </InputGroup>
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
                                Already have an account? <Link to="/login" className="none-text-decoration">Login</Link>
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

            {/* Success Modal */}
            <SuccessModal
                show={showSuccessModal}
                handleClose={handleCloseSuccessModal}
                title="Signup Successful"
                content="You have successfully signed up!"
            />

        </Container>
    );
};

export default Signup;
