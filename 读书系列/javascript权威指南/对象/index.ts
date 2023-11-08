() => {
  const o = {
    data_prop: 12,

    get accessor_prop() {
      return this.data_prop;
    },

    set accessor_prop(value) {
      this.data_prop = value;
    },
  };
};

() => {
  const p = {
    x: 1.0,
    y: 1.0,

    get r() {
      return Math.sqrt(this.x * this.x + this.y + this.y);
    },

    set r(newvalue) {},
  };
};
