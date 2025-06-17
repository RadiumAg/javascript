const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
context.font = '30px Arial';
context.fillStyle = 'cornflowblue';
context.strokeStyle = 'blue';
context.fillText(
  'Hello  Canvas',
  canvas.clientWidth / 2 - 150,
  canvas.clientHeight / 2 + 15
);

context.strokeText(
  'Hello  Canvas',
  canvas.clientWidth / 2 - 150,
  canvas.clientHeight / 2 + 15
);
