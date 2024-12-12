import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../services/useAuth'; // 커스텀 훅 임포트
import styles from '../css/Home.module.css';
import { Calendar } from '../pages/Calendar1';
import Todolist from '../components/toolist';
import { AiOutlineCaretRight, AiOutlineCaretLeft, AiTwotoneCarryOut, AiTwotoneCheckSquare, AiOutlineMenu } from "react-icons/ai";
import { addMonths, subMonths } from 'date-fns';

function Home({ progress }) {
  useAuth(); // 로그인 여부 확인  

  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const formattedDate = `${currentDate.getFullYear()}.${String(
    currentDate.getMonth() + 1
  ).padStart(2, '0')}`;
  
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDayOfWeek = daysOfWeek[currentDate.getDay()];

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setCurrentMonth(today);
    setSelectedDay(today.getDate());
  };

  const handleMouseEnter = () => setIsProfileMenuOpen(true);
  const handleMouseLeave = () => setIsProfileMenuOpen(false);

  const handleToggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  const handleProfileChange = () => {
    navigate('/editprofile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/loginkiss');
  };

  const handleSelectDate = (date) => {
    setSelectedDay(date.getDate());
    setCurrentDate(date);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={styles.homeContainer}>
      <header className={styles.homeHeader}>
        <div className={styles.homeHeaderNav}>
          <button className={styles.homeNavButton} onClick={handleToggleNav}>
            <AiOutlineMenu size={45} />
          </button>
        </div>
        <div
          className={styles.homeProfileContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img src="/asdw.jpg" alt="Profile" className={styles.homeProfileImage} />
          {isProfileMenuOpen && (
            <div className={styles.homeProfileMenu}>
              <button
                className={styles.homeProfileMenuItem}
                onClick={handleProfileChange}
              >
                내 정보 변경하기
              </button>
              <button
                className={styles.homeProfileMenuItem}
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
        <div className={styles.homeHeaderButtons}>
          <button className={styles.homeSquareButton} onClick={() => setActivePage('home')}>
            <AiTwotoneCarryOut size="100" />
          </button>
          <button className={styles.homeSquareButton} onClick={() => setActivePage('about')}>
            <AiTwotoneCheckSquare size="100" />
          </button>
          <button className={styles.homeSquareButton} onClick={() => setActivePage('contact')}>
            {/* Placeholder for another icon or content */}
          </button>
        </div>
      </header>

      {isNavOpen && (
        <nav className={styles.homeNav}>
          <div className={styles.homeMiddleContainer}>
            <div className={styles.homeGaugeContainer}>
              <div className={styles.homeGauge} style={{ width: `${progress}%` }} />
              <span className={styles.homeGaugeText}>{progress}%</span>
            </div>
          </div>
          <div className={styles.homeCalendar}>
            <button onClick={handleToday} className={styles.homeTodayButton}>오늘</button>
            <div className={styles.homeCalendarHeader}>
              <button onClick={handlePrevMonth} className={styles.homeNavButtonMonth}><AiOutlineCaretLeft size={20} /></button>
              <h3 className={styles.homeCalendarTitle}>{formattedDate} ({currentDayOfWeek})</h3>
              <button onClick={handleNextMonth} className={styles.homeNavButtonMonth}><AiOutlineCaretRight size={20} /></button>
            </div>
            <div className={styles.homeCalendarGrid}>
              {days.map((day) => (
                <button
                  key={day}
                  className={`${styles.homeCalendarDay} ${
                    new Date().getDate() === day &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear()
                      ? styles.homeTodayHighlight
                      : ''
                  } ${selectedDay === day ? styles.homeSelectedDay : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <h2 className={styles.homeNavTitle}>캘린더</h2>
          <ul className={styles.homeNavList}>
            <li className={styles.homeNavItem}>내 캘린더</li>
            <li className={styles.homeNavItem}>구독 캘린더</li>
            <li className={styles.homeNavItem}>중요 일정 보기</li>
            <li className={styles.homeNavItem}>범주 일정 보기</li>
          </ul>
        </nav>
      )}

      <main className={styles.homeContent}>
        {activePage === 'home' && (
          <Calendar
            currentMonth={currentMonth}
            prevMonth={handlePrevMonth}
            nextMonth={handleNextMonth}
            selectedDate={selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : null}
            onSelectDate={handleSelectDate}
          />
        )}
        {activePage === 'about' && <Todolist />}
        {activePage === 'contact' && <h1>end</h1>}
      </main>
    </div>
  );
}

export default Home;
