import React from 'react';
import './index.scss';
import { Dayjs } from 'dayjs';
import MonthCalendar from './month-calendar';
import Header from './header';

export type CalendarProps = {
  value?: Dayjs;
  style?: CSSPropertyRule;
  className?: string | string[];
  // 定制日期显示，完全覆盖日期单元格
  dateRender?: () => React.ReactNode;
  // 国际化先关
  locale?: string;
  onChange?: (value: Dayjs) => void;
};

const Calendar: React.FC<CalendarProps> = (props) => {
  return (
    <div className="calendar">
      <Header></Header>
      <MonthCalendar {...props}></MonthCalendar>
    </div>
  );
};

export default Calendar;
