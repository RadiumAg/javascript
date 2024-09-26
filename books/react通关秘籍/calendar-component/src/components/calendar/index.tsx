import React, { CSSProperties } from 'react';
import './index.scss';
import { Dayjs } from 'dayjs';
import MonthCalendar from './month-calendar';
import Header from './header';
import cls from 'classnames';

export type CalendarProps = {
  value?: Dayjs;
  style?: CSSProperties;
  className?: string | string[];
  // 定制日期显示，完全覆盖日期单元格
  dateRender?: (currentDate: Dayjs) => React.ReactNode;
  // 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效
  dateInnerContent?: (currentDate: Dayjs) => React.ReactNode;
  // 国际化先关
  locale?: string;
  onChange?: (value: Dayjs) => void;
};

const Calendar: React.FC<CalendarProps> = (props) => {
  const { style, className } = props;

  const classNames = cls('calendar', className);

  return (
    <div className={classNames} style={style}>
      <Header></Header>
      <MonthCalendar {...props}></MonthCalendar>
    </div>
  );
};

export default Calendar;
