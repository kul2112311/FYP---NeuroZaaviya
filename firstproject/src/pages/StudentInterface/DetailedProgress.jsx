import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import "./style/DetailedProgress.css";

const STUDENT_USER_ID = "a1111111-1111-1111-1111-111111111111"; // Ushna

function DetailedProgress() {
  const [weeklyData, setWeeklyData] = useState({
    dailyProgress: [],
    tasks: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyProgress();
  }, []);

  const fetchWeeklyProgress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/weekly-progress/${STUDENT_USER_ID}`);
      const data = await response.json();
      
      console.log('📊 Weekly data:', data);
      setWeeklyData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching weekly progress:", error);
      setIsLoading(false);
    }
  };

  // Get last 7 days including today
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        date: date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: date.toISOString().split('T')[0],
        isToday: i === 0
      });
    }
    
    return days;
  };

  const days = getLast7Days();

  // Map progress data to days
  const getDayData = (dateStr) => {
    const progressData = weeklyData.dailyProgress.find(p => p.date === dateStr);
    const dayTasks = weeklyData.tasks.filter(t => {
      if (!t.due_date) return false;
      const taskDate = new Date(t.due_date).toISOString().split('T')[0];
      return taskDate === dateStr;
    });

    return {
      progress: progressData ? progressData.progress_percentage : 0,
      completed: progressData ? progressData.tasks_completed : 0,
      total: progressData ? progressData.tasks_total : 0,
      studyTime: progressData ? progressData.study_time_minutes : 0,
      tasks: dayTasks
    };
  };

  // Calculate overall weekly progress
  const calculateWeeklyProgress = () => {
    if (weeklyData.dailyProgress.length === 0) return 0;
    const sum = weeklyData.dailyProgress.reduce((acc, day) => acc + day.progress_percentage, 0);
    return sum / weeklyData.dailyProgress.length;
  };

  const weeklyProgress = calculateWeeklyProgress();

  if (isLoading) {
    return (
      <div className="detailed-progress">
        <h2>Detailed Progress</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
          <Loader className="animate-spin" size={32} />
          <span style={{ marginLeft: '12px' }}>Loading your progress...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="detailed-progress">
      <h2>Detailed Progress</h2>
      <div className="days-container">
        {days.map((day) => {
          const dayData = getDayData(day.dateStr);
          const hasData = dayData.total > 0;

          return (
            <div 
              key={day.dateStr} 
              className={`day-container ${day.isToday ? 'is-today' : ''}`}
            >
              <div className="day-header">
                <h3>{day.dayName}</h3>
                <span>{hasData ? dayData.progress.toFixed(0) : 0}%</span>
              </div>

              {/* Day progress bar */}
              <div className="progress-track">
                <div 
                  className="progress-fill"
                  style={{ width: `${hasData ? dayData.progress : 0}%` }}
                />
              </div>

              {/* Summary Stats */}
              {hasData && (
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.45)', 
                  padding: '10px', 
                  borderRadius: '12px',
                  marginBottom: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.04)'
                }}>
                  <div style={{ fontSize: '13px', color: '#2a2147', marginBottom: '6px' }}>
                    <strong>{dayData.completed}</strong> of <strong>{dayData.total}</strong> tasks completed
                  </div>
                  {dayData.studyTime > 0 && (
                    <div style={{ fontSize: '12px', color: '#5a4aa8' }}>
                      📚 {dayData.studyTime} min studied
                    </div>
                  )}
                </div>
              )}

              {/* Task list */}
              <div className="task-list">
                {dayData.tasks.length > 0 ? (
                  dayData.tasks.map((task) => (
                    <div key={task.id} className="task-item">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        readOnly
                      />
                      <span className={task.status === 'completed' ? 'task-checked' : ''}>
                        {task.title}
                      </span>
                      {task.priority && (
                        <span className={`priority ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-tasks">
                    {hasData ? 'No tasks scheduled' : 'No data recorded'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall progress */}
      <div className="overall-progress">
        <h3>Overall Progress: {weeklyProgress.toFixed(0)}%</h3>
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>
        
        {weeklyData.dailyProgress.length > 0 && (
          <div style={{ 
            marginTop: '16px', 
            display: 'flex', 
            justifyContent: 'space-around',
            fontSize: '14px',
            color: '#2a2147'
          }}>
            <div>
              <strong style={{ color: '#6b4eff' }}>
                {weeklyData.dailyProgress.reduce((sum, d) => sum + d.tasks_completed, 0)}
              </strong> tasks completed
            </div>
            <div>
              <strong style={{ color: '#6b4eff' }}>
                {weeklyData.dailyProgress.reduce((sum, d) => sum + d.study_time_minutes, 0)}
              </strong> min studied
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailedProgress;