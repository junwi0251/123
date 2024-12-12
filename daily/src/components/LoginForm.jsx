import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/useAuth"; // useAuth 훅 가져오기
import styles from "../css/LoginForm.module.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth(); // setAuth 함수 사용

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        userid: username,
        password,
      });

      if (response.status === 200) {
        const { token, userId } = response.data;

        // Store token and userId in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        console.log("Login successful!");
        console.log("Token saved:", localStorage.getItem("token"));
        console.log("UserId saved:", localStorage.getItem("userId"));

        navigate("/home"); // Redirect to home
      } else {
        setErrorMessage(response.data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 오류", error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
        } else if (error.response.status >= 500) {
          setErrorMessage("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        } else {
          setErrorMessage("로그인 요청이 실패했습니다.");
        }
      } else {
        setErrorMessage("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={styles.lfloginsection}>
      <h1 className={styles.lfdailytitle}>
        Daily <span className={styles.lfchallengetitle}>Challenge</span>
      </h1>
      <h2 className={styles.lflogintitle}>LOGIN</h2>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={styles.lfinputfield}
        disabled={isLoading}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.lfinputfield}
        disabled={isLoading}
      />
      {errorMessage && <p className={styles.lferrormessage}>{errorMessage}</p>}

      <div className={styles.lfhelptext}>
        <a href="/find-id" className={styles.lfhelplink}>아이디 찾기</a>
        <span className={styles.lfseparator}>|</span>
        <a href="/find-password" className={styles.lfhelplink}>비밀번호 찾기</a>
        <span className={styles.lfseparator}>|</span>
        <Link to="/signup" className={styles.lfhelplink}>회원가입</Link>
      </div>

      <button
        className={styles.lfloginbutton}
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </div>
  );
};

export default LoginForm;
