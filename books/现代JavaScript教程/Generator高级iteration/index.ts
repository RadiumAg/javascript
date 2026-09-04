(() => {
  function* generate() {
    yield 1;
    yield 2;
    yield 3;
  }

  const ga = generate();
  console.log(ga.next());
  console.log(ga.next());
  console.log(ga.next());
  console.log(ga.next());
})();
