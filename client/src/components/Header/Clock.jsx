import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Derives current local time and formatted date strings.
 */
function getClockData() {
  const d = new Date();
  const h = d.getHours();
  const time = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
  const date = `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  const dshort = `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
  return { time, date, dshort };
}

/**
 * Clock - Header status chip displaying live time and date.
 * Synchronizes with external data-attribute query selectors across the DOM.
 */
export default function Clock() {
  const [clock, setClock] = useState(getClockData);

  useEffect(() => {
    function tick() {
      const data = getClockData();
      setClock(data);

      // Keep external DOM hooks synchronized
      document.querySelectorAll('[data-time]').forEach((e) => {
        if (e.textContent !== data.time) e.textContent = data.time;
      });
      document.querySelectorAll('[data-date]').forEach((e) => {
        if (e.textContent !== data.date) e.textContent = data.date;
      });
      document.querySelectorAll('[data-dshort]').forEach((e) => {
        if (e.textContent !== data.dshort) e.textContent = data.dshort;
      });
      document.querySelectorAll('[data-navtime]').forEach((e) => {
        e.textContent = ' — ' + data.time;
      });
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`${styles.chip} ${styles.clock} chip clock`} aria-label="Local time">
      <span className={`${styles.clockLbl} clock__lbl`}>Local time</span>
      <span className={`${styles.clockTime} clock__time tnum`} data-time>{clock.time}</span>
      <span className={`${styles.clockSep} clock__sep`} aria-hidden="true">•</span>
      <span className={`${styles.clockDate} clock__date`} data-date>{clock.date}</span>
      <span className={`${styles.clockDs} clock__ds`} data-dshort>{clock.dshort}</span>
    </div>
  );
}
