import React from 'react';
import './index.scss';
import { Dayjs } from 'dayjs';
import MonthCalendar from './month-calendar';

export type CalendarProps = {
  value?: Dayjs;
};

const Calendar: React.FC<CalendarProps> = (props) => {
  return (
    <div className="calendar">
      <MonthCalendar {...props}></MonthCalendar>
    </div>
  );
};

export default Calendar;
