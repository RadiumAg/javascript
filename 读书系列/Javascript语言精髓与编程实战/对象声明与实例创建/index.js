(() => {
  const obj = {
    get propName() {
      return 'propName';
    },
  };

  console.log(obj.propName);
})();
