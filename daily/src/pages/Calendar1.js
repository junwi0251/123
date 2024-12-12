import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import axios from 'axios';
import styles from '../css/Calendar.module.css';
import Modal from '../components/Modal';
import useAuth from '../services/useAuth'; // useAuth 훅을 가져옴

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 5000,
});

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 })
        .map(() => letters[Math.floor(Math.random() * 16)])
        .join('')}`;
};

const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => (
    <div className={styles.header}>
        <div className={`${styles.col} ${styles.colStart}`}>
            <span className={styles.text}>
                {format(currentMonth, 'yyyy')}년{' '}
                <span className={styles.month}>{format(currentMonth, 'M')}월</span>
            </span>
        </div>
        <div className={`${styles.col} ${styles.colEnd}`}>
            <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} width={30} height={30} />
            <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} width={30} height={30} />
        </div>
    </div>
);

const RenderDays = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
        <div className={styles.col} key={i}>
            {day}
        </div>
    ));
    return <div className={styles.days}>{days}</div>;
};

const RenderCells = ({ currentMonth, selectedDate, rightClickDate, onDateClick, onRightClick, events, onEventClick }) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            const formattedDate = format(day, 'yyyy-MM-dd');
            const isEvent = events[formattedDate];
            const cloneDay = day;

            days.push(
                <div
                    className={`${styles.col} ${styles.cell} ${
                        !isSameMonth(day, monthStart)
                            ? styles.notValid
                            : isSameDay(day, selectedDate)
                            ? styles.selected
                            : isSameDay(day, rightClickDate)
                            ? styles.rightClicked
                            : styles.valid
                    }`}
                    key={day}
                    onClick={() => onDateClick(cloneDay)}
                    onContextMenu={(e) => onRightClick(e, cloneDay)}
                >
                    <span>{format(day, 'd')}</span>
                    {isEvent &&
                        isEvent.map((event, idx) => (
                            <div
                                className={styles.event}
                                key={idx}
                                style={{ backgroundColor: event.color }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEventClick(event);
                                }}
                            >
                                {event.title}
                            </div>
                        ))}
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className={styles.row} key={day}>
                {days}
            </div>
        );
        days = [];
    }

    return <div className={styles.body}>{rows}</div>;
};

export const Calendar = ({ currentMonth, prevMonth, nextMonth, selectedDate, onSelectDate }) => {
    const userid = useAuth(); // useAuth로 userid 가져오기
    const [rightClickDate, setRightClickDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDateString, setSelectedDateString] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState({});

    useEffect(() => {
        if (!userid) return; // userid가 없으면 실행하지 않음

        const fetchEvents = async () => {
            try {
                const response = await api.get(`${process.env.REACT_APP_API_URL}/userentity/${userid}`);
                const fetchedEvents = response.data.reduce((acc, event) => {
                    const dateKey = event.date; // yyyy-MM-dd 형식
                    if (!acc[dateKey]) acc[dateKey] = [];
                    acc[dateKey].push(event);
                    return acc;
                }, {});
                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };

        fetchEvents();
    }, [currentMonth, userid]);

    const onRightClick = (e, day) => {
        e.preventDefault();
        setRightClickDate(day);
        setSelectedDateString(format(day, 'yyyy-MM-dd'));
        setIsModalOpen(true);
    };

    const onDateClick = (day) => {
        onSelectDate(day);
        setRightClickDate(null);
    };

    const closeModal = () => setIsModalOpen(false);
    const closeDetailModal = () => setIsDetailModalOpen(false);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newEvent = {
            date: selectedDateString,
            time: formData.get('time'),
            title: formData.get('title'),
            description: formData.get('description'),
            color: getRandomColor(),
        };

        try {
            const response = await api.post(`/calendar/create/${userid}`, newEvent);
            setEvents((prev) => ({
                ...prev,
                [selectedDateString]: [...(prev[selectedDateString] || []), response.data],
            }));
            closeModal();
        } catch (error) {
            console.error('Failed to add event:', error);
        }
    };

    const handleDeleteEvent = async () => {
        try {
            await api.delete(`/calendar/delete/${userid}/${selectedEvent.id}`);
            setEvents((prev) => {
                const updatedEvents = { ...prev };
                updatedEvents[selectedDateString] = updatedEvents[selectedDateString].filter(
                    (event) => event.id !== selectedEvent.id
                );
                return updatedEvents;
            });
            closeDetailModal();
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsDetailModalOpen(true);
    };

    return (
        <div className={styles.calendar}>
            <RenderHeader currentMonth={currentMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
            <RenderDays />
            <RenderCells
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                rightClickDate={rightClickDate}
                onDateClick={onDateClick}
                onRightClick={onRightClick}
                events={events}
                onEventClick={handleEventClick}
            />
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleAddEvent} className={styles.Modalform}>
                    <label className={styles.Modallabel}>
                        시간:
                        <input type="time" name="time" defaultValue={getCurrentTime()} required className={styles.Modalinput} />
                    </label>
                    <label className={styles.Modallabel}>
                        제목:
                        <input type="text" name="title" placeholder="제목을 입력하세요" required className={styles.Modalinput} />
                    </label>
                    <label className={styles.Modallabel}>
                        내용:
                        <textarea name="description" placeholder="내용을 입력하세요" required className={styles.Modalinput} />
                    </label>
                    <button type="submit" className={styles.Modalbtn}>추가</button>
                </form>
            </Modal>
            <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal}>
                <h2 className={styles.Modalh2}>일정 상세</h2>
                {selectedEvent && (
                    <>
                        <p className={styles.Modalp}>시간: {selectedEvent.time}</p>
                        <p className={styles.Modalp}>제목: {selectedEvent.title}</p>
                        <p className={styles.Modalp}>내용: {selectedEvent.description}</p>
                        <button onClick={handleDeleteEvent} className={styles.Modalbtn}>삭제</button>
                    </>
                )}
                <button onClick={closeDetailModal} className={styles.Modalbtn}>닫기</button>
            </Modal>
        </div>
    );
};
