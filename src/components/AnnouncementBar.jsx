import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import './AnnouncementBar.css';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function AnnouncementBar() {
  const { storeData } = useStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 3, seconds: 0 });
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          hours = 0;
          minutes = 3;
          seconds = 0;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (storeData?.announcements?.length > 0) {
      const cycleInterval = setInterval(() => {
        setCurrentAnnouncementIndex((prev) => (prev + 1) % storeData.announcements.length);
      }, 5000);
      return () => clearInterval(cycleInterval);
    }
  }, [storeData?.announcements?.length]);

  const apiMessages = storeData?.announcements?.length > 0
    ? storeData.announcements.map(a => a.message || a.text || '')
    : [];

  const staticMessages = [
    'Extra discounts of Rs.650 at checkout',
    'Hurry Up, Shop Now!',
    '50% Off',
    `Limited Time: ${pad(timeLeft.hours)}H:${pad(timeLeft.minutes)}M:${pad(timeLeft.seconds)}S`,
    'Save Min 50% on all orders and get free shipping',
  ];

  const messages = apiMessages.length > 0 ? apiMessages : staticMessages;

  const currentMessage = messages[currentAnnouncementIndex] || messages[0];

  return (
    <div className="announcement-bar">
      <div className="announcement-marquee">
        <div className="announcement-track">
          {[...messages, ...messages, ...messages, ...messages].map((msg, i) => (
            <span key={i} className="announcement-item">
              <span className="announcement-diamond">◆</span>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
