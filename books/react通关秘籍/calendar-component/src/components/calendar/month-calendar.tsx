import React, { useContext } from 'react';
import { CalendarProps } from '.';
import dayjs, { Dayjs } from 'dayjs';
import Header from './header';
import classNames from 'classnames';
import LocaleContext from './locale-context.';
import allLocales from './locale';

type MonthCalendarProps = CalendarProps & {
  value: Dayjs;
  onSelect: (date: Dayjs) => void;
};

function getAllDays(date: Dayjs | undefined) {
  date ||= dayjs();
  const startDate = date.startOf('month');
  const day = startDate.day();

  const daysInfo: Array<{ date: Dayjs; currentMonth: boolean }> = new Array(
    6 * 7
  );

  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day'),
      currentMonth: false,
    };
  }

  for (let i = day; i < daysInfo.length; i++) {
    const calcDate = startDate.add(i - day, 'day');

    daysInfo[i] = {
      date: startDate.add(i - day, 'day'),
      currentMonth: calcDate.month() === date.month(),
    };
  }

  return daysInfo;
}

function renderDays(
  days: { date: Dayjs; currentMonth: boolean }[],
  dateRender: MonthCalendarProps['dateRender'],
  dateInnerContent: MonthCalendarProps['dateInnerContent'],
  value: Dayjs,
  onSelect: MonthCalendarProps['onSelect']
) {
  const rows: React.ReactElement<any>[][] = [];
  for (let i = 0; i < 6; i++) {
    const row: React.ReactElement[] = [];

    for (let j = 0; j < 7; j++) {
      const item = days[i * 7 + j];
      row[j] = (
        <div
          className={classNames('calendar-month-body-cell', {
            'calendar-month-body-cell-current': item.currentMonth,
          })}
          onClick={() => onSelect(item.date)}
        >
          {dateRender ? (
            dateRender(item.date)
          ) : (
            <div className="calendar-month-body-cell-date">
              <div
                className={classNames(
                  'calendar-month-body-cell-date-value',
                  value.format('YYYY-MM-DD') === item.date.format('YYYY-MM-DD')
                    ? 'calendar-month-body-cell-date-selected'
                    : ''
                )}
              >
                {item.date.date()}
              </div>
              <div className="calendar-month-body-cell-date-content">
                {dateInnerContent?.(item.date)}
              </div>
            </div>
          )}
        </div>
      );
    }
    rows.push(row);
  }

  return rows.map((row) => (
    <div className="calendar-month-body-row">{row}</div>
  ));
}

const MonthCalendar: React.FC<MonthCalendarProps> = (props) => {
  const localeContext = useContext(LocaleContext);

  const { value, onSelect, dateRender, dateInnerContent } = props;

  const CalendarLocale = allLocales[localeContext.locale];

  const weekList = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const allDays = getAllDays(props.value);

  return (
    <div className="calendar-month">
      <div className="calendar-month-week-list">
        {weekList.map((week) => (
          <div className="calendar-month-week-list-item" key={week}>
            {CalendarLocale.week[week]}
          </div>
        ))}
      </div>

      <div className="calendar-month-body">
        {renderDays(allDays, dateRender, dateInnerContent, value, onSelect)}
      </div>
    </div>
  );
};

export default MonthCalendar;
