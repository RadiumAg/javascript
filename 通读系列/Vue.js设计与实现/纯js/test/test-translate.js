import { dump, parse, transform } from '../translate.js';

const ast = parse('<div><p>Vue</p><p>Template</p></div>');

console.log(ast);

console.log(dump(ast));

transform(ast);
