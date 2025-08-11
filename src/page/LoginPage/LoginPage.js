import { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import "./style/login.style.css";
import { loginWithEmail, loginWithGoogle } from "../../features/user/userSlice";
import { clearState } from "../../features/user/userSlice";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (formError) setFormError("");
    if (loginError) dispatch(clearState());
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (formError) setFormError("");
    if (loginError) dispatch(clearState());
  };

  const handleLoginWithEmail = (event) => {
    event.preventDefault();

    setFormError("");
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
    if ((!password || !password.trim()) && passwordInputRef.current) {
      setFormError("비밀번호를 입력해주세요.");
      passwordInputRef.current.focus();
      return;
    }

    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (googleData) => {
    dispatch(loginWithGoogle(googleData.credential));
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    return () => {
      dispatch(clearState());
    };
  }, [user, navigate, dispatch]);

  return (
    <>
      <Container className="login-area">
        {(loginError || formError) && (
          <div className="error-message">
            <Alert variant="danger">{loginError || formError}</Alert>
          </div>
        )}
        <Form className="login-form" onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              ref={emailInputRef}
              onChange={handleEmailChange}
              value={email}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={passwordInputRef}
              onChange={handlePasswordChange}
              value={password}
            />
          </Form.Group>
          <div className="display-space-between login-button-area">
            <Button variant="danger" type="submit">
              Login
            </Button>
            <div>
              아직 계정이 없으세요?<Link to="/register">회원가입 하기</Link>{" "}
            </div>
          </div>

          <div className="text-align-center mt-2">
            <p>-외부 계정으로 로그인하기-</p>
            {/* 
            1. 구글 로그인 버튼 가져오기
            2. Oauth 로그인을 위해서 Google API 사이트에 가입하고 클라이언트 키, 시크릿 키 받아오기
            3. 로그인
            4. 백엔드에서 로그인하기
               토큰값을 읽어와서 유저 정보를 뽑아내고 email
               (1) 이미 로그인을 한 적이 있는 유저 => 로그인 시키고, 토큰값 주면 됨!
               (2) 처음 로그인 시도를 한 유저 => 유저 정보 먼저 새로 생성하고, 토큰값 주면 됨!
             */}
            <div className="display-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.error("Login Failed");
                }}
              />
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
