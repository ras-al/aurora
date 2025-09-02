// src/components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';
import '../styles/CountdownTimer.css';

function CountdownTimer({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown-timer">
      <div className="time-block">
        <span className="time">{timeLeft.days || '0'}</span>
        <span className="label">Days</span>
      </div>
      <div className="time-block">
        <span className="time">{timeLeft.hours || '0'}</span>
        <span className="label">Hours</span>
      </div>
      <div className="time-block">
        <span className="time">{timeLeft.minutes || '0'}</span>
        <span className="label">Minutes</span>
      </div>
      <div className="time-block">
        <span className="time">{timeLeft.seconds || '0'}</span>
        <span className="label">Seconds</span>
      </div>
    </div>
  );
}

export default CountdownTimer;