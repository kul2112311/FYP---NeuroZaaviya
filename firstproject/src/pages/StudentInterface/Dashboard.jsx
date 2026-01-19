import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./style/Dashboard.css";

function Dashboard() {
  const [progress, setProgress] = useState({
    Mon: 80,
    Tue: 70,
    Wed: 90,
    Thu: 50,
    Fri: 60,
    Sat: 40,
    Sun: 30,
  });

  const [view, setView] = useState("week");
  const [tasks, setTasks] = useState([
    "Dashboard UI",
    "Final testing",
    "Anonymous post logic",
  ]);
  const [newTask, setNewTask] = useState("");

  const weeklyProgress =
    Object.values(progress).reduce((a, b) => a + b, 0) / 7;

  const handleProgressClick = (day) => {
    setProgress({
      ...progress,
      [day]: progress[day] < 100 ? progress[day] + 10 : 0,
    });
  };

  const toggleView = () => {
    setView(view === "week" ? "month" : "week");
  };

  const handleAddTask = () => {
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTask(""); // Reset input field after adding the task
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((task, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && newTask) {
      handleAddTask();
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  return (
    <div className="dashboard">
      <div className="main-container">
        {/* 🔹 LEFT SECTION: Welcome + Progress Bar */}
        <div className="left-section">
          {/* Welcome Text */}
          <div className="welcome-text">
            <h2>Welcome back, Fatima! ✨</h2>
            <p>Progress over perfection, always. You’ve got this! 🌸</p>
          </div>

          {/* 🔹 Detailed Progress Button */}
          <div className="detailed-progress-btn">
            <Link to="/detailed-progress">
              <button>View Detailed Progress</button>
            </Link>
          </div>

          {/* 🔹 Weekly Progress */}
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${weeklyProgress}%` }}
              />
            </div>
            <span className="progress-text">{Math.round(weeklyProgress)}%</span>

            <div className="week-days">
              {Object.keys(progress).map((day) => (
                <div key={day} className="day-wrapper">
                  <div
                    className="day-circle"
                    style={{
                      background: `conic-gradient(#6b4eff ${progress[day]}%, #e6dcf3 ${progress[day]}%)`,
                    }}
                    onClick={() => handleProgressClick(day)}
                  />
                  <span className="day-label">{day}</span>
                  <span className="day-percent">{progress[day]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔹 RIGHT SECTION: Cards + Calendar + To-Do */}
        <div className="right-section">
          {/* 🔹 Cards: Early Bird, Study Streak, Progress Hero */}
          <div className="icons-container">
            <div className="icon">Early Bird</div>
            <div className="icon">Study Streak</div>
            <div className="icon">Progress Hero</div>
          </div>

          {/* 🔹 Calendar */}
          <div className="calendar-container">
            <div className="calendar-header">
              <span className="calendar-title">Week View - December 2025</span>
              <div className="calendar-toggle">
                <button onClick={toggleView}>
                  {view === "week" ? "Month" : "Week"}
                </button>
              </div>
            </div>

            {/* Calendar View */}
            <div className={`calendar-grid ${view}`}>
              {view === "week" ? (
                <div className="week-view">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
              ) : (
                <div className="month-view">
                  {Array.from(
                    { length: getDaysInMonth(new Date(2025, 11)) }, // December 2025
                    (_, i) => (
                      <div key={i}>{i + 1}</div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 🔹 To-Do Section */}
          <div className="todo-section">
            <div className="todo-header">
              <h3>My To-Do's</h3>
            </div>
            <div className="todo-list">
              {tasks.map((task, index) => (
                <div key={index} className="todo-item">
                  <input type="checkbox" /> {task}
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTask(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <div className="todo-input">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={handleEnterKey}
                />
                <button onClick={handleAddTask}>Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
