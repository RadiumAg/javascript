import './css/public.css';
import './css/index.css';

import 'jquery';
import './js/public';
import './js/nav';

// treeshaking触发方式
// 1. 通过解构的方式获取方法，可以触发treeshaking
// 2. 调用的npm包必须使用ESM
// 3. 同意给文件的treeshaking的触发条件，条件就是mode=production
import { get } from '_';
