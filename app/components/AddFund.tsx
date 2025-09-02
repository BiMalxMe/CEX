import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const App: React.FC = () => {
  const TOTAL_HOURS = 20 * 365 * 24;
  const now = new Date();
  const targetDate = new Date(now.getTime() + TOTAL_HOURS * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const difference = targetDate.getTime() - new Date().getTime();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timerComponents = (Object.keys(timeLeft) as (keyof TimeLeft)[]).map(
    (key) => (
      <div
        key={key}
        className="flex flex-col items-center mx-1 px-3 py-2 text-teal-900 rounded-lg"
      >
        <span className="text-xl font-bold">{timeLeft[key]}</span>
        <span className="text-xs">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
      </div>
    )
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 ">
      <div className="p-6 rounded-2xl flex flex-col items-center gap-4 max-w-sm">
        <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <Clock className="w-6 h-6 text-teal-500" />
          This feature will be available 
        </h1>
        <p className="text-center text-sm text-gray-500">
          Your deposited funds will be available in {TOTAL_HOURS.toLocaleString()} hours
        </p>
        <div className="flex justify-center flex-wrap mt-2">
          {timerComponents.length ? timerComponents : <span className="text-sm text-red-500">Time's up!</span>}
        </div>
      </div>
    </div>
  );
};

export default App;
