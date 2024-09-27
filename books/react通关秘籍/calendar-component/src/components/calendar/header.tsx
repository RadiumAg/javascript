import { Dayjs } from 'dayjs';
import React from 'react';

type HeaderProps = {
  curMonth: Dayjs;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
};

const Header: React.FC<HeaderProps> = (props) => {
  const {
    curMonth,
    onToday,
    onPrevMonth: prevMonthHandler,
    onNextMonth: nextMonthHandler,
  } = props;

  return (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <div className="calendar-header-icon" onClick={prevMonthHandler}>
          &lt;
        </div>
        <div className="calendar-header-value">
          {curMonth.format('YYYY 年 MM 月')}
        </div>
        <div className="calendar-header-icon" onClick={nextMonthHandler}>
          &gt;
        </div>
        <button className="calendar-header-btn" onClick={onToday}>
          今天
        </button>
      </div>
    </div>
  );
};

export default Header;
