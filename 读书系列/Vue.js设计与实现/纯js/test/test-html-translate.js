import { parse } from '../html-translate.js';

const ast = parse('<div>foo {{bar}} baz</div>');

console.log(ast);
