const checkedType = target =>
  Object.prototype.toString
    .call(target)
    .replace(/\[object (\w+)]/, '$1')
    .toLocaleLowerCase();

const clone = (target: Record<string, any>, seen = new WeakMap()) => {
  let result: Record<string, any> | null = null;
  const type = checkedType(target);
  if (type === 'object') result = {};
  else if (type === 'array') result = [];
  else return target;
  if (seen.get(target)) return target;

  const copyObj = new target.constructor();
  seen.set(target, copyObj);

  // eslint-disable-next-line no-restricted-syntax
  for (const key in target) {
    if (
      checkedType(
        target[key] === 'object' || checkedType(target[key]) === 'array',
      )
    ) {
      result[key] = clone(target[key], seen);
    } else {
      result[key] = target[key];
    }
  }

  return result;
};

const obj = {
  name: 'Chen',
  detail: {
    age: '18',
    height: '180',
    bodyWeight: '68',
  },
  hobby: ['see a film', 'write the code', 'play basketball', 'tourism'],
};
obj.tempObj = obj;
const obj1 = clone(obj);
console.log('obj1=====>', obj1);
