import _ from 'lodash';
import Print from './print';

function component() {
  const elememt = document.createElement('div');
  const btn = document.createElement('button');

  elememt.innerHTML = _.join(['Hello', 'webpack'], ' ');
  elememt.classList.add('hello');
  elememt.addEventListener('click', Print.bind(null, 'Hello webpack'));

  btn.innerHTML = 'Click me and check the console!';

  elememt.append(btn);

  return elememt;
}

document.body.append(component());
