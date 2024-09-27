import zhCN from './zh-CN';
import enUS from './en-US';
import { CalendarType } from './type';

const allLocales: Record<string, CalendarType> = {
  'zh': zhCN,
  'en': enUS,
};

export default allLocales;
