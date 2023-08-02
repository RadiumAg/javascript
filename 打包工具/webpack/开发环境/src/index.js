import _ from 'lodash';
import printMe from './print';

function component() {
  const elememt = document.createElement('div');
  const btn = document.createElement('button');

  elememt.innerHTML = _.join(['Hello', 'webpack'], ' ');
  elememt.classList.add('hello');

  btn.innerHTML = 'Click me and check the console!';
  btn.addEventListener('click', printMe);

  elememt.append(btn);

  return elememt;
}

document.body.append(component());
