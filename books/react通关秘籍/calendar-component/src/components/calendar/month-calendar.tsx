import React from 'react';
import { CalendarProps } from '.';
import { Dayjs } from 'dayjs';

type MonthCalendarProps = CalendarProps & {};

function getAllDays(date: Dayjs | undefined) {
  date ||= new Dayjs();
  const daysInMonth = date.daysInMonth();
  const startDate = date.startOf('month');
  const day = startDate.day();

  const daysInfo = new Array(6 * 7);

  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day').format('YYYY-MM-DD'),
      isCurrentMonth: false,
    };
  }

  for (let i = day; i < daysInfo.length; i++) {
    daysInfo[i] = {
      date: startDate.add(i - day, 'day').format('YYYY-MM-DD'),
    };
  }

  return daysInfo;
}

const MonthCalendar: React.FC<MonthCalendarProps> = (props) => {
  const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const allDays = getAllDays(props.value);

  return (
    <div className="calendar-month">
      <div className="calendar-month-week-list">
        {weekList.map((week) => (
          <div className="calendar-month-week-list-item" key={week}>
            {week}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthCalendar;
