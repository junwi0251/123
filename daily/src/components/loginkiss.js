import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import ImageSlider from "./ImageSlider";
import EditProfile from "./EditProfile";
import styles from "../css/LoginForm.module.css";
import Home from "./Home";
import Signup from "./Signup";

const loginkiss = () => {
  return (
      <Routes>
        {/* 메인 페이지 */}
        <Route
          path="/"
          element={
            <div className={styles.lfcontainer}>
              {/* 왼쪽 - 로그인 화면 */}
              <LoginForm />
              {/* 오른쪽 - 이미지 슬라이더 */}
              <ImageSlider />
            </div>
          }
        />

        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<Signup />} />

        {/* 프로필 수정 페이지 */}
        <Route path="/home" element={<Home />} />
        <Route path="/editprofile" element={<EditProfile />} />
      </Routes>
  );
};

export default loginkiss;
