(() => {
  const mapTag = '[object Map]';
  const setTag = '[object Set]';
  const arrayTag = '[object Array]';
  const objectTag = '[object Object]';
  const argsTag = '[object Arguments]';
  const funcTag = '[object Function]';

  const boolTag = '[object Boolean]';
  const dateTag = '[object Date]';
  const errorTag = '[object Error]';
  const numberTag = '[object Number]';
  const regexpTag = '[object RegExp]';
  const stringTag = '[object String]';
  const symbolTag = '[object Symbol]';

  const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

  function forEach(array: any[] = [], iteratee: (item, index: number) => void) {
    let index = -1;
    const length = array.length;

    while (++index < length) {
      iteratee(array[index], index);
    }

    return array;
  }

  function isSet(tag: unknown, target: unknown): target is Set<any> {
    return tag === setTag;
  }

  function isMap(tag: unknown, target: unknown): target is Map<any, any> {
    return tag === mapTag;
  }

  function isObject(target: unknown): target is object {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
  }

  function getType(target: unknown): string {
    return Object.prototype.toString.call(target);
  }

  function getInit(target: Record<string, any>) {
    const ctor = target.constructor as { new (): any };
    return new ctor();
  }

  function cloneSymbol(target: symbol) {
    return new Object(Symbol.prototype.valueOf.call(target));
  }

  function cloneReg(target: RegExp) {
    const result = new RegExp(target);
    result.lastIndex = target.lastIndex;
    return result;
  }

  function cloneFunction(func: Function) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
      console.log('普通函数');
      const param = paramReg.exec(funcString);
      const body = bodyReg.exec(funcString);
      if (body) {
        console.log('匹配到函数体：', body[0]);
        if (param) {
          const paramArr = param[0].split(',');
          console.log('匹配到参数：', paramArr);
          return new Function(...paramArr, body[0]);
        } else {
          return new Function(body[0]);
        }
      } else {
        return null;
      }
    } else {
      return eval(funcString);
    }
  }

  function cloneOtherType(target, type: string) {
    const ctor = target.constructor as { new (...args): any };
    switch (type) {
      case boolTag:
      case numberTag:
      case stringTag:
      case errorTag:
      case dateTag:
        return new ctor(target);
      case regexpTag:
        return cloneReg(target);
      case symbolTag:
        return cloneSymbol(target);
      case funcTag:
        return cloneFunction(target);
      default:
        return null;
    }
  }

  function clone(target: unknown, map = new WeakMap()) {
    if (!isObject(target)) return target;

    const type = getType(target);

    let cloneTarget;
    if (deepTag.includes(type)) {
      cloneTarget = getInit(target);
    } else {
      return cloneOtherType(target, type);
    }

    if (map.get(target)) {
      return map.get(target);
    }

    map.set(target, cloneTarget);

    // 克隆set
    if (isSet(type, target)) {
      target.forEach((value) => {
        (<Set<any>>cloneTarget).add(clone(value, map));
      });

      return cloneTarget;
    }

    // 克隆map
    if (isMap(type, target)) {
      target.forEach((value, key) => {
        (<Map<any, any>>cloneTarget).set(key, clone(map));
      });

      return cloneTarget;
    }

    // 克隆对象和数组
    const keys = type === arrayTag ? undefined : Object.keys(target);

    forEach(keys || (target as any[]), (value, key) => {
      if (keys) {
        key = value;
      }

      cloneTarget[key] = clone(target[key], map);
    });

    return cloneTarget;
  }

  const map = new Map();
  map.set('key', 'value');
  map.set('ConardLi', 'code秘密花园');

  const set = new Set();
  set.add('ConardLi');
  set.add('code秘密花园');

  const target = {
    field1: 1,
    field2: undefined,
    field3: {
      child: 'child',
    },
    field4: [2, 4, 8],
    empty: null,
    map,
    set,
    bool: new Boolean(true),
    num: new Number(2),
    str: new String(2),
    symbol: new Object(Symbol(1)),
    date: new Date(),
    reg: /\d+/gim,
    error: new Error(),
    func1: () => {
      console.log('code秘密花园');
    },
    // eslint-disable-next-line object-shorthand
    func2: function (a, b) {
      return a + b;
    },
  };

  console.log(clone(target));
})();
