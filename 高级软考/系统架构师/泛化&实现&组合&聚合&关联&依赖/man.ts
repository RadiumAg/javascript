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

// 组合
() => {
  class Dog {
    private tinyDog = [new Dog(), new Dog()];
  }
};

// 聚合
() => {
  class Dog {
    private tinyDog = [];

    constructor(dog?: Dog) {
      this.tinyDog.push(dog);
    }
  }

  const tinyDog = new Dog();
  new Dog(tinyDog);
};

// 关联
() => {
  class Dog {
    private tinyDog: Dog | undefined;
    run() {}

    constructor(dog?: Dog) {
      this.tinyDog = dog;
      this.tinyDog?.run();
    }
  }
};

// 依赖
() => {
  class Dog {
    run() {}

    constructor() {
      new Dog().run();
    }
  }
};
