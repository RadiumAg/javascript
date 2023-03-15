import { dump, parse } from '../translate.js';

const ast = parse('<div><p>Vue</p><p>Template</p></div>');

console.log(ast);

console.log(dump(ast));
