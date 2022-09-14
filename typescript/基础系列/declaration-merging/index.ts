/* eslint-disable @typescript-eslint/no-namespace */
namespace Animal {
  const haveMuscles = true;
  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}
namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles; // Error, because haveMuscles is not accessible here
  }
}

Animal.doAnimalsHaveMuscles();

function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export const suffix = '';
  export const prefix = 'Hello, ';
}
console.log(buildLabel('Sam Smith'));
