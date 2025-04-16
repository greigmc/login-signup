import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";

interface User {
  email: string;
  password: string;
}

function SignIn() {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { email: "", password: "" };
  });

  const [message, setMessage] = useState<string>("");
  const [validated, setValidated] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setShowAlert(true);
    } else {
      try {
        await axios.post("http://localhost:5000/signin", user);
        setMessage("Sign in successful! Welcome back.");
        localStorage.setItem("user", JSON.stringify(user));
        setUser({ email: "", password: "" });
        setShowAlert(false);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        setMessage(
          "Sign in failed. " +
            (axiosError.response?.data?.message || axiosError.message)
        );
        setShowAlert(true);
      }
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className="text-start justify-content-center">
        <Col lg={10} sm={10} className="bg-primary text-white p-4">
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
                placeholder="Password"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password.
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="light" type="submit">
              Submit
            </Button>
          </Form>
          {message && (
            <Alert variant={showAlert ? "danger" : "success"} className="mt-3">
              {message}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SignIn;
