import './style.css';
import _ from 'lodash';
import Icon from './icon.png';

function component() {
  const elememt = document.createElement('div');

  elememt.innerHTML = _.join(['Hello', 'webpack'], ' ');
  elememt.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = Icon;
  elememt.append(myIcon);

  return elememt;
}

document.body.append(component());
