import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";

interface SignInSignUpProps {
  showSignUp?: boolean;
}

const SignInSignUp: React.FC<SignInSignUpProps> = ({ showSignUp = true }) => {
  const [view, setView] = useState<"signin" | "signup">("signup");

  return (
    <Container className="mt-4">
      <Row className="justify-content-center mt-4">
        <Col xs="auto">
          {showSignUp && (
            <>
              <h1>Contact Form with User Authentication</h1>
              <p>
                Create a professional contact form with user authentication that
                allows users to sign up and sign in using Express.js as the server and
                MongoDB as the database. This application ensures secure user
                registration and login, providing a seamless and efficient user
                experience.
              </p>
            </>
          )}
          <ButtonGroup>
            <Button
              variant={view === "signin" ? "primary" : "outline-primary"}
              onClick={() => setView("signin")}
            >
              Sign In
            </Button>
            <Button
              variant={view === "signup" ? "secondary" : "outline-secondary"}
              onClick={() => setView("signup")}
            >
              Sign Up
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>{view === "signin" ? <SignIn /> : <SignUp />}</Col>
      </Row>
    </Container>
  );
};

export default SignInSignUp;
