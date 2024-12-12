import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Signup.module.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ level: 0, text: '' });
    const navigate = useNavigate();

    const { username, email, phone, password, confirmPassword } = formData;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            let formattedPhone = value.replace(/\D/g, '');
            if (formattedPhone.length > 3 && formattedPhone.length <= 7) {
                formattedPhone = `${formattedPhone.slice(0, 3)}-${formattedPhone.slice(3)}`;
            } else if (formattedPhone.length > 7) {
                formattedPhone = `${formattedPhone.slice(0, 3)}-${formattedPhone.slice(3, 7)}-${formattedPhone.slice(7)}`;
            }
            setFormData((prev) => ({ ...prev, phone: formattedPhone }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        if (name === 'password') {
            evaluatePasswordStrength(value);
        }
    };

    // 비밀번호 강도 평가
    const evaluatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;

        const levels = [
            { level: 0, text: '매우 약함', color: '#ff4d4f' },
            { level: 1, text: '약함', color: '#ff7a45' },
            { level: 2, text: '보통', color: '#ffa940' },
            { level: 3, text: '강함', color: '#36cfc9' },
            { level: 4, text: '매우 강함', color: '#73d13d' },
        ];

        setPasswordStrength(levels[strength]);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/join`, {
                userid: username,
                email: email,
                mobile: phone,
                password: password,
                password2: confirmPassword,
            });

            console.log('회원가입 성공:', response.data);
            setFormData({
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
            });
            setPasswordStrength({ level: 0, text: '' });
            navigate('/loginkiss');
        } catch (error) {
            console.error('회원가입 실패:', error.response?.data || error.message);
            if (error.response?.status === 400) {
                setError(error.response.data.message || '입력값을 확인하세요.');
            } else {
                setError('서버와 통신 중 문제가 발생했습니다. 다시 시도해주세요.', error.status);
            }
        }
    };

    return (
        <div id="background" className={styles.signupbackground}>
            <div className={styles.signupcontainer}>
                <h2 className={styles.signuph2}>회원가입</h2>
                <form onSubmit={handleSignup} autoComplete="off" className={styles.signupform}>
                    <div className={styles.signupformgroup}>
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            minLength="4"
                            maxLength="20"
                            value={username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.signupformgroup}>
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.signupformgroup}>
                        <label htmlFor="phone">전화번호</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.signupformgroup}>
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={handleInputChange}
                        />
                        <div className={styles.signuppasswordstrengthbar}>
                            <div
                                className={styles.signupstrengthbox}
                                style={{
                                    width: `${(passwordStrength.level / 4) * 100}%`,
                                    backgroundColor: passwordStrength.color,
                                }}
                            />
                        </div>
                        <p className={styles.signupstrengthtext}>{passwordStrength.text}</p>
                    </div>
                    <div className={styles.signupformgroup}>
                        <label htmlFor="confirm-password">비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                    {error && <p className={styles.signuperror}>{error}</p>}
                    <button type="submit" className={styles.signupbutton}>회원가입</button>
                </form>
                <p className={styles.signupsignup}>
                    이미 회원이신가요? <a href="/loginkiss">로그인</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
