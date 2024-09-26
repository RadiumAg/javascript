import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <div className="calendar-header-icon">&lt;</div>
        <div className="calendar-header-value">2023 年 11 月</div>
        <div className="calendar-header-icon">&gt;</div>
        <button className="calendar-header-btn">今天</button>
      </div>
    </div>
  );
};

export default Header;
