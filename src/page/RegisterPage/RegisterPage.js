import { useEffect, useRef, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./style/register.style.css";
import { clearState, registerUser } from "../../features/user/userSlice";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const { registrationError } = useSelector((state) => state.user);
  const emailInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const pwInputRef = useRef(null);
  const pwCheckInputRef = useRef(null);

  const register = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, policy } = formData;
    const checkConfirmPassword = password === confirmPassword;

    setFormError("");
    setPolicyError(false);
    dispatch(clearState());

    if ((!email || !email.trim()) && emailInputRef.current) {
      setFormError("이메일을 입력해주세요.");
      emailInputRef.current.focus();
      return;
    }
    if (!emailRegex.test(email)) {
      setFormError("유효한 이메일 형식이 아닙니다.");
      emailInputRef.current.focus();
      return;
    }
    if ((!name || !name.trim()) && nameInputRef.current) {
      setFormError("이름을 입력해주세요.");
      nameInputRef.current.focus();
      return;
    }
    if ((!password || !password.trim()) && pwInputRef.current) {
      setFormError("비밀번호를 입력해주세요.");
      pwInputRef.current.focus();
      return;
    }
    if (
      (!confirmPassword || !confirmPassword.trim()) &&
      pwCheckInputRef.current
    ) {
      setFormError("비밀번호를 다시 입력해주세요.");
      pwCheckInputRef.current.focus();
      return;
    }
    if (!checkConfirmPassword) {
      setFormError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }

    dispatch(registerUser({ name, email, password, navigate }));
  };

  const handleChange = (event) => {
    event.preventDefault();
    let { id, value, type, checked } = event.target;

    if (formError) setFormError("");
    if (registrationError) dispatch(clearState());
    if (policyError) setPolicyError(false);

    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  return (
    <Container className="register-area">
      {(registrationError || formError) && (
        <div>
          <Alert variant="danger" className="error-message">
            {registrationError || formError}
          </Alert>
        </div>
      )}
      <Form onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            ref={emailInputRef}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Enter name"
            onChange={handleChange}
            ref={nameInputRef}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            ref={pwInputRef}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            ref={pwCheckInputRef}
            isInvalid={formError === "비밀번호가 일치하지 않습니다."}
          />
          {formError === "비밀번호가 일치하지 않습니다." && (
            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
              {formError}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
            checked={formData.policy}
          />
          {policyError && (
            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
              이용약관에 동의해주세요.
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Button variant="danger" type="submit">
          회원가입
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
