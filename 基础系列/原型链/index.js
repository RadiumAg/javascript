
function Cat () {
  this.name = '猫';
}

function Animal () {
  this.type = '哺乳动物';
}

Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
