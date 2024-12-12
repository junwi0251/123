import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [auth, setAuth] = useState({
    userid: null,
    token: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userId');

    if (token && userid) {
      setAuth({ token, userid }); // localStorage에서 정보 가져오기
    }
  }, []);

  const setAuthData = ({ token, userid }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userid);
    setAuth({ token, userid });
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setAuth({ token: null, userid: null });
    navigate('/login');
  };

  return { auth, setAuth: setAuthData, clearAuth };
};

export default useAuth;
