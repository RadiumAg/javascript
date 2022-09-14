/* eslint-disable @typescript-eslint/no-namespace */
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export const suffix = '';
  export const prefix = 'Hello, ';
}
console.log(buildLabel('Sam Smith'));
