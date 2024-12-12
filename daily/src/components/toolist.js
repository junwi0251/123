import React, { useState } from 'react';
import styles from '../css/todolist.module.css'; // Importing CSS module

function Todolist() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [importance, setImportance] = useState('');
  const [color, setColor] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // 수정 중인 작업의 인덱스
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const colors = ['#FFB3BA', '#FFDFBA', '#F8C8DC', '#BAFFC9', '#BAE1FF'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      name,
      date,
      category,
      level,
      importance,
      color,
      alarmTime,
      completed: false,
      highlighted: false, // 추가된 속성
    };

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = newTask;
      setTasks(updatedTasks);
      alert('Task updated!');
      setEditIndex(null);
    } else {
      setTasks([...tasks, newTask]);
      alert('Task saved!');
    }

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDate('');
    setCategory('');
    setLevel('');
    setImportance('');
    setColor('');
    setAlarmTime('');
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    const task = tasks[index];
    setName(task.name);
    setDate(task.date);
    setCategory(task.category);
    setLevel(task.level);
    setImportance(task.importance);
    setColor(task.color);
    setAlarmTime(task.alarmTime);
    setEditIndex(index);
  };

  const highlightTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, highlighted: !task.highlighted } : task
    );
    setTasks(updatedTasks);
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const generateCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', {
      month: 'long',
    });

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const matchingTask = tasks.find((task) => task.date === formattedDate);

      days.push(
        <div
          key={i}
          className={styles.todolistCalendarDay}
          style={{
            border: matchingTask ? `3px solid ${matchingTask.color}` : '1px solid #ddd',
            boxSizing: 'border-box',
          }}
        >
          {i}
        </div>
      );
    }

    return (
      <div className={styles.todolistCalendar}>
        <div className={styles.todolistCalendarHeader}>
          <button className={styles.todolistCalendarHeaderButton} onClick={goToPreviousMonth}>&lt;</button>
          <h2 className={styles.todolistCalendarHeaderTitle}>
            {currentYear}년 {monthName}
          </h2>
          <button className={styles.todolistCalendarHeaderButton} onClick={goToNextMonth}>&gt;</button>
        </div>
        <div className={styles.todolistCalendarGrid}>{days}</div>
      </div>
    );
  };

  return (
    <div className={styles.todolistAppContainer}>
      <div className={styles.todolistFormSection}>
        <h1 className={styles.todolistCustomHeading}>
          <span className={styles.todolistToDo}>To Do</span> <span className={styles.todolistList}>List!!</span>
        </h1>

        <form onSubmit={handleSubmit} className={styles.todolistTaskForm}>
          <label className={styles.todolistLabel}>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.todolistInput}
              required
            />
          </label>

          <label className={styles.todolistLabel}>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.todolistInput}
              required
            />
          </label>

          <label className={styles.todolistLabel}>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.todolistSelect}
              required
            >
              <option value="">선택</option>
              <option value="일">일</option>
              <option value="공부">공부</option>
              <option value="개인업무">개인업무</option>
            </select>
          </label>

          <label className={styles.todolistLabel}>
            Level:
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={styles.todolistSelect}
              required
            >
              <option value="">선택</option>
              <option value="쉬움">쉬움</option>
              <option value="중간">중간</option>
              <option value="어려움">어려움</option>
            </select>
          </label>

          <label className={styles.todolistLabel}>
            Importance:
            <select
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
              className={styles.todolistSelect}
              required
            >
              <option value="">선택</option>
              <option value="낮음">낮음</option>
              <option value="중간">중간</option>
              <option value="높음">높음</option>
            </select>
          </label>

          <div className={styles.todolistColorPicker}>
            <p className={styles.todolistColorPickerTitle}>Select Color:</p>
            {colors.map((col, index) => (
              <div
                key={index}
                className={`${styles.todolistColorBox} ${color === col ? styles.todolistSelected : ''}`}
                style={{ backgroundColor: col }}
                onClick={() => setColor(col)}
              ></div>
            ))}
          </div>

          <label className={styles.todolistLabel}>
            Alarm Time:
            <select
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className={styles.todolistSelect}
              required
            >
              <option value="">선택</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i < 10 ? '0' : ''}${i}:00`}>
                  {i < 10 ? '0' : ''}{i}:00
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className={styles.todolistButton}>
            {editIndex !== null ? 'Update' : '추가'}
          </button>
        </form>
      </div>

      <div className={styles.todolistCalendarSection}>{generateCalendar()}</div>

      <div className={styles.todolistTaskList}>
        <h2 className={styles.todolistTaskListTitle}>추가된 ToDolist</h2>
        {tasks.map((task, index) => (
          <div
            key={index}
            className={styles.todolistTaskItem}
            style={{
              backgroundColor: task.highlighted ? 'rgba(0, 0, 0, 0.5)' : task.color,
            }}
          >
            <div className={styles.todolistTaskHeader}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(index)}
                className={styles.todolistTaskCheckbox}
              />
              <p className={styles.todolistTaskItemName}>{task.name}</p>
              <button
                className={styles.todolistEditTaskButton}
                onClick={() => editTask(index)}
              >
                ✏️
              </button>
              <button
                className={styles.todolistHighlightTaskButton}
                onClick={() => highlightTask(index)}
              >
                완료
              </button>
              <button className={styles.todolistDeleteTaskButton} onClick={() => deleteTask(index)}>
                ❌
              </button>
            </div>
            <p className={styles.todolistTaskItemDetail}>Date: {task.date}</p>
            <p className={styles.todolistTaskItemDetail}>Category: {task.category}</p>
            <p className={styles.todolistTaskItemDetail}>Level: {task.level}</p>
            <p className={styles.todolistTaskItemDetail}>Importance: {task.importance}</p>
            <p className={styles.todolistTaskItemDetail}>Alarm Time: {task.alarmTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todolist;
