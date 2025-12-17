import React, { useEffect, useState } from "react";
import "./style/DetailedProgress.css";  // Corrected path



const API = "http://127.0.0.1:8000/api";  // Ensure the API is correct

const emptyWeek = {
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};

const todayLabel = new Date().toLocaleDateString("en-US", {
  weekday: "short",
});

function DetailedProgress() {
  const [tasks, setTasks] = useState(emptyWeek);

  const fetchWeeklyTasks = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API}/tasks/weekly/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks({ ...emptyWeek, ...data }))
      .catch(console.error);
  };

  useEffect(() => {
    fetchWeeklyTasks();
  }, []);

  const calculateProgress = (dayTasks) => {
    if (!dayTasks.length) return 0;
    const done = dayTasks.filter((t) => t.checked).length;
    return (done / dayTasks.length) * 100;
  };

  const weeklyProgress =
    Object.values(tasks)
      .map((dayTasks) => calculateProgress(dayTasks))
      .reduce((a, b) => a + b, 0) / 7;

  return (
    <div className="detailed-progress">
      <h2>Detailed Progress</h2>
      <div className="days-container">
        {Object.keys(emptyWeek).map((day) => {
          const dayTasks = tasks[day] || [];
          const dayProgress = calculateProgress(dayTasks);
          const isToday = day === todayLabel;

          return (
            <div key={day} className="day-container">
              <div className="day-header">
                <h3>{day}</h3>
                <span>{dayProgress.toFixed(0)}%</span>
              </div>

              {/* Day progress bar */}
              <div
                className="progress-bar"
                style={{
                  width: `${dayProgress}%`,
                  backgroundColor: "#6b4eff",
                  height: "10px",
                  borderRadius: "5px",
                }}
              />

              {/* Task list */}
              <div className="task-list">
                {dayTasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <input
                      type="checkbox"
                      checked={task.checked}
                      disabled={!isToday}
                    />
                    <span className={task.checked ? "task-checked" : ""}>
                      {task.task}
                    </span>
                  </div>
                ))}
                {!dayTasks.length && <p className="no-tasks">No tasks</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall progress */}
      <div className="overall-progress">
        <h3>Overall Progress: {weeklyProgress.toFixed(0)}%</h3>
        <div
          className="progress-bar"
          style={{
            width: `${weeklyProgress}%`,
            backgroundColor: "#6b4eff",
            height: "10px",
            borderRadius: "5px",
          }}
        />
      </div>
    </div>
  );
}

export default DetailedProgress;
