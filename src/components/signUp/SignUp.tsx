import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface User {
  name: string;
  email: string;
  company: string;
  subject: string;
  password: string;
  confirmPassword: string;
}

function SignUp() {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "",
          email: "",
          company: "",
          password: "",
          confirmPassword: "",
        };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

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
    setUser((prevUser) => ({ ...prevUser, [name]: value }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string) => {
    const passwordRequirements = [
      { regex: /(?=.*\d)/, message: "At least one digit" },
      { regex: /(?=.*[a-z])/, message: "At least one lowercase letter" },
      { regex: /(?=.*[A-Z])/, message: "At least one uppercase letter" },
      { regex: /(?=.*\W)/, message: "At least one special character" },
      { regex: /.{8,}/, message: "At least 8 characters long" },
    ];

    const failedRequirements = passwordRequirements.filter(
      (req) => !req.regex.test(password)
    );
    setPasswordError(failedRequirements.map((req) => req.message));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formErrors: Partial<Record<keyof User, string>> = {};

    if (form.checkValidity() === false || passwordError.length > 0) {
      e.stopPropagation();
      setShowAlert(true);
    } else {
      if (user.password !== user.confirmPassword) {
        formErrors.confirmPassword = "Passwords do not match.";
        setErrors(formErrors);
        setShowAlert(true);
      } else {
        try {
          const response = await axios.post(
            "http://localhost:5000/signup",
            user
          );
          setMessage("Sign up successful! Welcome " + response.data.user.name);
          setUser({
            name: "",
            email: "",
            subject: "",
            company: "",
            password: "",
            confirmPassword: "",
          });
          setShowAlert(false);
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            setMessage("Sign up failed. " + error.response.data.message);
          } else {
            setMessage("Sign up failed. Unknown error");
          }
          setShowAlert(true);
        }
      }
    }
    setValidated(true);
  };

  return (
    <Container>
      <Row className="text-start justify-content-center">
        <Col lg={10} sm={10} className="bg-primary text-white p-4">
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Row>
              {/* Name */}
              <Col md={6} sm={12}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter Name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Email */}
              <Col md={6} sm={12}>
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
              </Col>

              {/* Company */}
              <Col md={6} sm={12}>
                <Form.Group className="mb-3" controlId="formBasicCompany">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={user.company}
                    onChange={handleChange}
                    required
                    placeholder="Enter company"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a company name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              {/* Subject */}
              <Col md={6} sm={12}>
                <Form.Group className="mb-3" controlId="formBasicSubject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={user.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter subject"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a subject.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              {/* Password */}
              <Col md={6} sm={12}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      required
                      placeholder="Password"
                      isInvalid={passwordError.length > 0}
                    />
                    <Button
                      variant="secondary"
                      onClick={togglePasswordVisibility}
                      aria-label="Toggle password visibility"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {passwordError.length > 0
                        ? "Please meet the password requirements."
                        : "Please provide a password."}
                    </Form.Control.Feedback>
                  </InputGroup>
                  {passwordError.length > 0 && (
                    <ListGroup className="mt-2">
                      {passwordError.map((error, index) => (
                        <ListGroup.Item key={index} variant="danger">
                          {error}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Form.Group>
              </Col>

              {/* Confirm Password */}
              <Col md={6} sm={12}>
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Password"
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Button
                      variant="secondary"
                      onClick={togglePasswordVisibility}
                      aria-label="Toggle password visibility"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
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

export default SignUp;
