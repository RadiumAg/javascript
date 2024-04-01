import { cube } from './math.js';

function component() {
  const element = document.createElement('pre');

  element.innerHTML = ['你好 webpack!', `5 的立方等于${cube(5)}`];

  return element;
}

document.body.append(component());
