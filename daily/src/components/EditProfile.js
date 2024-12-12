import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/EditProfile.module.css";
import logo from "../images/logo.png";
import { AiOutlineArrowLeft } from "react-icons/ai"; // 아이콘 import

function EditProfile() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/editprofile");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/update/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setFormData({
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          password: "",
        });
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.phone || !formData.address) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError("유효한 이메일 주소를 입력해 주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("사용자 ID가 없습니다.");
        return;
      }

      await axios.patch(
        `http://localhost:8082/update/${userId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("회원 정보가 수정되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("회원 정보 수정 중 오류 발생:", error);
      setError("회원 정보를 수정하는 데 실패했습니다.");
    }
  };

  return (
    <div className={styles.editProfileContainer}>
      {/* 홈으로 돌아가기 버튼 */}
      <button
        className={styles.editProfilehomeButton}
        onClick={() => navigate("/home")}
      >
        <AiOutlineArrowLeft size={20} /> 홈으로
      </button>

      <img src={logo} alt="Logo" className={styles.editProfilelogo} />
      <form onSubmit={handleSubmit} className={styles.editProfileForm}>
        <h1 className={styles.editProfileTitle}>프로필 수정</h1>
        <div className={styles.editProfileformGroup}>
          <label className={styles.editProfileformLabel}>이름:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={styles.editProfileformInput}
          />
        </div>
        <div className={styles.editProfileformGroup}>
          <label className={styles.editProfileformLabel}>이메일:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.editProfileformInput}
          />
        </div>
        <div className={styles.editProfileformGroup}>
          <label className={styles.editProfileformLabel}>전화번호:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.editProfileformInput}
          />
        </div>
        <div className={styles.editProfilelinkContainer}>
          <Link to="/change-password" className={styles.editProfilehelpLink}>비밀번호 변경</Link>
          <Link to="/deleteaccount" className={styles.editProfilehelpLink}>회원 탈퇴</Link>
        </div>
        {error && <div className={styles.editProfileerrorMessage}>{error}</div>}
        <button type="submit" className={styles.editProfilesubmitButton}>저장</button>
      </form>
    </div>
  );
}

export default EditProfile;
