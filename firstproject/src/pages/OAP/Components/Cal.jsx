// src/components/CommunityComponents/Calendar.jsx
import React from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Calendar({ onDateSelect, value }) {
  const handleChange = (date) => {
    if (onDateSelect) onDateSelect(date);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <ReactCalendar
        onChange={handleChange}
        value={value || new Date()}
        calendarType="US"
        className="react-calendar-custom"
      />
    </div>
  );
}
