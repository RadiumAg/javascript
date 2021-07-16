
function Cat () {
  this.name = '猫';
}

function Animal () {
  this.type = '哺乳动物';
}

Animal.constroctor = Cat;

Cat.prototype = new Animal();

const cat = new Cat();

console.log(cat.type); // 哺乳动物
