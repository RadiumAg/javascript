(() => {
  function Bird() {
    this.wing = 2;
    this.tweet = function () {};
    this.fly = function () {
      console.log('I can fly');
    };
  }

  funciton asBird(x){
    
  }

  function isBird(instance) {
    return instance instanceof Bird;
  }

  function doFlay(me) {
    if (!isBird(me)) {
      throw new Error('对象不是Bird或其子类的实例.');
    }

    me.fly();
  }

  doFlay(new Bird());

  doFlay
})();
