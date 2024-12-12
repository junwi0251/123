import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext'; // AuthContext 임포트
import Signup from './components/Signup';
import Home from './components/Home';
import { Calendar } from './pages/Calendar1';
import Todolist from './components/toolist'; // 예시
import LoginForm from './components/LoginForm'; // 예시
import ImageSlider from "./components/ImageSlider"
import Loginkiss from './components/loginkiss';
import EditProfile from './components/EditProfile';
import DeleteAccount from './components/DeleteAccount';


const PrivateRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/Loginkiss" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/loginfrom" element={<LoginForm />} />
                    <Route path="/loginkiss" element={<Loginkiss />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/imageslider" element={<ImageSlider />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/calender" element={<Calendar />} />
                    <Route path="/todolist" element={<Todolist />} />
                    <Route path="/editprofile" element={<EditProfile />} />
                    <Route path="/deleteaccount" element={<DeleteAccount />} />
                    <Route path="/home" element={<PrivateRoute element={<Home />} />} /> {/* PrivateRoute 사용 */}
                    <Route path="/" element={<Navigate to="/loginkiss" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
