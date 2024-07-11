import { useState } from "react";
import { useContactUs } from "../hooks/useContactUs";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [showAlert, setShowAlert] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const { ContactUs, isLoading, error } = useContactUs();
    const handleSubmit = async (e) => {
        e.preventDefault();
        //await ContactUs(formData.name, formData.email, formData.message);
        console.log("Form data submitted:", formData);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
        setFormData({ name: "", email: "", message: "" }); // Clear form fields
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    {showAlert && (
                        <Alert
                            variant="success"
                            onClose={() => setShowAlert(false)}
                            dismissible
                        >
                            Your message has been sent successfully!
                        </Alert>
                    )}
                    <h1>Contact Us</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formMessage" className="mt-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter your message"
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                        >
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactUs;
