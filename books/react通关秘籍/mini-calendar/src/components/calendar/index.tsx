import React, { useImperativeHandle } from 'react';

import './index.css';
import { useControllableValue } from 'ahooks';

type CalendarProps = {
  defaultValue?: Date;
  onChange?: (date: Date) => void;
};

type CalendarRef = {
  getDate: () => Date;
  setDate: (date: Date) => void;
};

const Calendar = React.forwardRef<CalendarRef, CalendarProps>((props, ref) => {
  const { onChange } = props;
  const [date, setDate] = useControllableValue(props, {
    defaultValue: new Date(),
  });
  const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];
  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderDates = () => {
    const days = [];

    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

    for (let i = 1; i <= firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let i = 1; i <= daysCount; i++) {
      const handleClick = () => {
        const curDate = new Date(date.getFullYear(), date.getMonth(), i);
        setDate(curDate);
        onChange?.(curDate);
      };

      if (i === date.getDate()) {
        days.push(
          <div key={i} className="day selected" onClick={handleClick}>
            {i}
          </div>
        );
      } else {
        days.push(
          <div key={i} className="day" onClick={handleClick}>
            {i}
          </div>
        );
      }
    }

    return days;
  };

  useImperativeHandle(ref, () => ({
    getDate: () => date,
    setDate: (date: Date) => {
      setDate(date);
      onChange?.(date);
    },
  }));

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <div>
          {date.getFullYear()}年{monthNames[date.getMonth()]}
        </div>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="days">
        <div className="day">日</div>
        <div className="day">一</div>
        <div className="day">二</div>
        <div className="day">三</div>
        <div className="day">四</div>
        <div className="day">五</div>
        <div className="day">六</div>
        {renderDates()}
      </div>
    </div>
  );
});

export default Calendar;
