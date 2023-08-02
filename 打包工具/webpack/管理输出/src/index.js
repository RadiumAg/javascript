import './style.css';
import _ from 'lodash';
import tomal from './data.toml';
import yaml from './data.yaml';
import json from './data.json5';
import Icon from './icon.png';
import Data from './data.csv';
import Notes from './data.xml';

console.log(tomal.title);
console.log(tomal.owner.name);

console.log(yaml.title);
console.log(yaml.owner.name);

console.log(json.title);
console.log(json.owner.name);

function component() {
  const elememt = document.createElement('div');

  elememt.innerHTML = _.join(['Hello', 'webpack'], ' ');
  elememt.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = Icon;
  elememt.append(myIcon);

  console.log(Data);
  console.log(Notes);

  return elememt;
}

document.body.append(component());
