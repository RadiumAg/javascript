// 泛化
() => {
  class Animal {
    run() {}
  }

  class Dog extends Animal {}
};

// 实现
() => {
  interface Animal {
    run(): void;
  }

  class Dog implements Animal {
    run(): void {
      throw new Error('Method not implemented.');
    }
  }
};

// 组合：部分在整体内部创建，同生共死
() => {
  class Heart {
    beat() {}
  }
  class Dog {
    private heart = new Heart();
  }
};

// 聚合：部分从外部传入，可独立存在
() => {
  class Dog {}

  class DogPark {
    private dogs: Dog[] = [];
    add(dog: Dog) {
      this.dogs.push(dog);
    }
  }
};

// 关联：从外部传入，存为成员变量
() => {
  class Dog {}
  class Person {
    constructor(private pet: Dog) {}
  }
};

// 依赖：临时使用，不持有引用
() => {
  class Toy {}
  class Dog2 {
    play() {
      const toy = new Toy();
    }
  }
};
