function getComponent() {
  return import('lodash')
    .then(({ default: _ }) => {
      const element = document.createElement('div');
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    })
    .catch((error) => 'An error occurred while loading the component');
}

document.body.append(getComponent());
