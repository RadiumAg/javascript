import { compile } from '../translate.js';

const code = compile('<div><p>Vue</p><p>Template</p></div>');
console.log(code);
