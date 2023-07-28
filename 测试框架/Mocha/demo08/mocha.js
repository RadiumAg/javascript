(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global =
        typeof globalThis !== 'undefined' ? globalThis : global || self),
      (global.mocha = factory()));
})(this, () => {
  'use strict';

  const commonjsGlobal =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : typeof self !== 'undefined'
      ? self
      : {};

  function createCommonjsModule(fn, basedir, module) {
    return (
      (module = {
        path: basedir,
        exports: {},
        require(path, base) {
          return commonjsRequire(
            path,
            base === undefined || base === null ? module.path : base,
          );
        },
      }),
      fn(module, module.exports),
      module.exports
    );
  }

  function getCjsExportFromNamespace(n) {
    return (n && n['default']) || n;
  }

  function commonjsRequire() {
    throw new Error(
      'Dynamic requires are not currently supported by @rollup/plugin-commonjs',
    );
  }

  const check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  const global_1 =
    // eslint-disable-next-line no-undef
    check(typeof globalThis === 'object' && globalThis) ||
    check(typeof window === 'object' && window) ||
    check(typeof self === 'object' && self) ||
    check(typeof commonjsGlobal === 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func
    (function () {
      return this;
    })() ||
    new Function('return this')();

  const fails = function (exec) {
    try {
      return !!exec();
    } catch {
      return true;
    }
  };

  // Detect IE8's incomplete defineProperty implementation
  const descriptors = !fails(() => {
    return (
      Object.defineProperty({}, 1, {
        get () {
          return 7;
        },
      })[1] != 7
    );
  });

  const nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  const NASHORN_BUG =
    getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  const f = NASHORN_BUG
    ? function propertyIsEnumerable(V) {
        const descriptor = getOwnPropertyDescriptor(this, V);
        return !!descriptor && descriptor.enumerable;
      }
    : nativePropertyIsEnumerable;

  const objectPropertyIsEnumerable = {
    f,
  };

  const createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value,
    };
  };

  const toString = {}.toString;

  const classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  const split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  const indexedObject = fails(() => {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !new Object('z').propertyIsEnumerable(0);
  })
    ? function (it) {
        return classofRaw(it) == 'String' ? split.call(it, '') : new Object(it);
      }
    : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  const requireObjectCoercible = function (it) {
    if (it == undefined) throw new TypeError(`Can't call method on ${it}`);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings

  const toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  const isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  const toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject(input)) return input;
    let fn, val;
    if (
      PREFERRED_STRING &&
      typeof (fn = input.toString) === 'function' &&
      !isObject((val = fn.call(input)))
    )
      return val;
    if (
      typeof (fn = input.valueOf) === 'function' &&
      !isObject((val = fn.call(input)))
    )
      return val;
    if (
      !PREFERRED_STRING &&
      typeof (fn = input.toString) === 'function' &&
      !isObject((val = fn.call(input)))
    )
      return val;
    throw new TypeError("Can't convert object to primitive value");
  };

  const hasOwnProperty = {}.hasOwnProperty;

  const has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  const document$1 = global_1.document;
  // typeof document.createElement is 'object' in old IE
  const EXISTS = isObject(document$1) && isObject(document$1.createElement);

  const documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  const ie8DomDefine =
    !descriptors &&
    !fails(() => {
      return (
        Object.defineProperty(documentCreateElement('div'), 'a', {
          get () {
            return 7;
          },
        }).a != 7
      );
    });

  const nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  const f$1 = descriptors
    ? nativeGetOwnPropertyDescriptor
    : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O);
        P = toPrimitive(P, true);
        if (ie8DomDefine)
          try {
            return nativeGetOwnPropertyDescriptor(O, P);
          } catch {
            /* empty */
          }
        if (has(O, P))
          return createPropertyDescriptor(
            !objectPropertyIsEnumerable.f.call(O, P),
            O[P],
          );
      };

  const objectGetOwnPropertyDescriptor = {
    f: f$1,
  };

  const anObject = function (it) {
    if (!isObject(it)) {
      throw new TypeError(`${String(it)} is not an object`);
    }
    return it;
  };

  const nativeDefineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  const f$2 = descriptors
    ? nativeDefineProperty
    : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPrimitive(P, true);
        anObject(Attributes);
        if (ie8DomDefine)
          try {
            return nativeDefineProperty(O, P, Attributes);
          } catch {
            /* empty */
          }
        if ('get' in Attributes || 'set' in Attributes)
          throw new TypeError('Accessors not supported');
        if ('value' in Attributes) O[P] = Attributes.value;
        return O;
      };

  const objectDefineProperty = {
    f: f$2,
  };

  const createNonEnumerableProperty = descriptors
    ? function (object, key, value) {
        return objectDefineProperty.f(
          object,
          key,
          createPropertyDescriptor(1, value),
        );
      }
    : function (object, key, value) {
        object[key] = value;
        return object;
      };

  const setGlobal = function (key, value) {
    try {
      createNonEnumerableProperty(global_1, key, value);
    } catch {
      global_1[key] = value;
    }
    return value;
  };

  const SHARED = '__core-js_shared__';
  const store = global_1[SHARED] || setGlobal(SHARED, {});

  const sharedStore = store;

  const functionToString = Function.toString;

  // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
  if (typeof sharedStore.inspectSource !== 'function') {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  const inspectSource = sharedStore.inspectSource;

  const WeakMap = global_1.WeakMap;

  const nativeWeakMap =
    typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

  const shared = createCommonjsModule(module => {
    (module.exports = function (key, value) {
      return (
        sharedStore[key] ||
        (sharedStore[key] = value !== undefined ? value : {})
      );
    })('versions', []).push({
      version: '3.8.3',
      mode: 'global',
      copyright: '© 2021 Denis Pushkarev (zloirock.ru)',
    });
  });

  let id = 0;
  const postfix = Math.random();

  const uid = function (key) {
    return (
      `Symbol(${ 
      String(key === undefined ? '' : key) 
      })_${ 
      (++id + postfix).toString(36)}`
    );
  };

  const keys = shared('keys');

  const sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  const hiddenKeys = {};

  const WeakMap$1 = global_1.WeakMap;
  let set, get, has$1;

  const enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {});
  };

  const getterFor = function (TYPE) {
    return function (it) {
      let state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw new TypeError(`Incompatible receiver, ${TYPE} required`);
      }
      return state;
    };
  };

  if (nativeWeakMap) {
    const store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
    const wmget = store$1.get;
    const wmhas = store$1.has;
    const wmset = store$1.set;
    set = function (it, metadata) {
      metadata.facade = it;
      wmset.call(store$1, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store$1, it) || {};
    };
    has$1 = function (it) {
      return wmhas.call(store$1, it);
    };
  } else {
    const STATE = sharedKey('state');
    hiddenKeys[STATE] = true;
    set = function (it, metadata) {
      metadata.facade = it;
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return has(it, STATE) ? it[STATE] : {};
    };
    has$1 = function (it) {
      return has(it, STATE);
    };
  }

  const internalState = {
    set,
    get,
    has: has$1,
    enforce,
    getterFor,
  };

  const redefine = createCommonjsModule(module => {
    let getInternalState = internalState.get;
    let enforceInternalState = internalState.enforce;
    let TEMPLATE = String(String).split('String');

    (module.exports = function (O, key, value, options) {
      const unsafe = options ? !!options.unsafe : false;
      let simple = options ? !!options.enumerable : false;
      const noTargetGet = options ? !!options.noTargetGet : false;
      let state;
      if (typeof value === 'function') {
        if (typeof key === 'string' && !has(value, 'name')) {
          createNonEnumerableProperty(value, 'name', key);
        }
        state = enforceInternalState(value);
        if (!state.source) {
          state.source = TEMPLATE.join(typeof key === 'string' ? key : '');
        }
      }
      if (O === global_1) {
        if (simple) O[key] = value;
        else setGlobal(key, value);
        return;
      } else if (!unsafe) {
        delete O[key];
      } else if (!noTargetGet && O[key]) {
        simple = true;
      }
      if (simple) O[key] = value;
      else createNonEnumerableProperty(O, key, value);
      // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, 'toString', function toString() {
      return (
        (typeof this === 'function' && getInternalState(this).source) ||
        inspectSource(this)
      );
    });
  });

  const path = global_1;

  const aFunction = function (variable) {
    return typeof variable === 'function' ? variable : undefined;
  };

  const getBuiltIn = function (namespace, method) {
    return arguments.length < 2
      ? aFunction(path[namespace]) || aFunction(global_1[namespace])
      : (path[namespace] && path[namespace][method]) ||
          (global_1[namespace] && global_1[namespace][method]);
  };

  const ceil = Math.ceil;
  const floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.es/ecma262/#sec-tointeger
  const toInteger = function (argument) {
    return isNaN((argument = +argument))
      ? 0
      : (argument > 0 ? floor : ceil)(argument);
  };

  const min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  const toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  const max = Math.max;
  const min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  const toAbsoluteIndex = function (index, length) {
    const integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  const createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      const O = toIndexedObject($this);
      const length = toLength(O.length);
      let index = toAbsoluteIndex(fromIndex, length);
      let value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el)
        while (length > index) {
          value = O[index++];
          // eslint-disable-next-line no-self-compare
          if (value != value) return true;
          // Array#indexOf ignores holes, Array#includes - not
        }
      else
        for (; length > index; index++) {
          if ((IS_INCLUDES || index in O) && O[index] === el)
            return IS_INCLUDES || index || 0;
        }
      return !IS_INCLUDES && -1;
    };
  };

  const arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false),
  };

  const indexOf = arrayIncludes.indexOf;

  const objectKeysInternal = function (object, names) {
    const O = toIndexedObject(object);
    let i = 0;
    const result = [];
    let key;
    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i)
      if (has(O, (key = names[i++]))) {
        ~indexOf(result, key) || result.push(key);
      }
    return result;
  };

  // IE8- don't enum bug keys
  const enumBugKeys = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf',
  ];

  const hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  const f$3 =
    Object.getOwnPropertyNames ||
    function getOwnPropertyNames(O) {
      return objectKeysInternal(O, hiddenKeys$1);
    };

  const objectGetOwnPropertyNames = {
    f: f$3,
  };

  const f$4 = Object.getOwnPropertySymbols;

  const objectGetOwnPropertySymbols = {
    f: f$4,
  };

  // all object keys, includes non-enumerable and symbols
  const ownKeys =
    getBuiltIn('Reflect', 'ownKeys') ||
    function ownKeys(it) {
      const keys = objectGetOwnPropertyNames.f(anObject(it));
      const getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      return getOwnPropertySymbols
        ? keys.concat(getOwnPropertySymbols(it))
        : keys;
    };

  const copyConstructorProperties = function (target, source) {
    const keys = ownKeys(source);
    const defineProperty = objectDefineProperty.f;
    const getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (let key of keys) {
      if (!has(target, key))
        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  const replacement = /#|\.prototype\./;

  const isForced = function (feature, detection) {
    const value = data[normalize(feature)];
    return value == POLYFILL
      ? true
      : value == NATIVE
      ? false
      : typeof detection === 'function'
      ? fails(detection)
      : !!detection;
  };

  var normalize = (isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  });

  var data = (isForced.data = {});
  var NATIVE = (isForced.NATIVE = 'N');
  var POLYFILL = (isForced.POLYFILL = 'P');

  const isForced_1 = isForced;

  const getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;

  /*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
  const _export = function (options, source) {
    const TARGET = options.target;
    const GLOBAL = options.global;
    const STATIC = options.stat;
    let FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global_1;
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global_1[TARGET] || {}).prototype;
    }
    if (target)
      for (key in source) {
        sourceProperty = source[key];
        if (options.noTargetGet) {
          descriptor = getOwnPropertyDescriptor$1(target, key);
          targetProperty = descriptor && descriptor.value;
        } else targetProperty = target[key];
        FORCED = isForced_1(
          GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key,
          options.forced,
        );
        // contained in target
        if (!FORCED && targetProperty !== undefined) {
          if (typeof sourceProperty === typeof targetProperty) continue;
          copyConstructorProperties(sourceProperty, targetProperty);
        }
        // add a flag to not completely full polyfills
        if (options.sham || (targetProperty && targetProperty.sham)) {
          createNonEnumerableProperty(sourceProperty, 'sham', true);
        }
        // extend global
        redefine(target, key, sourceProperty, options);
      }
  };

  const aFunction$1 = function (it) {
    if (typeof it !== 'function') {
      throw new TypeError(`${String(it)} is not a function`);
    }
    return it;
  };

  // optional / simple context binding
  const functionBindContext = function (fn, that, length) {
    aFunction$1(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0:
        return function () {
          return fn.call(that);
        };
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  const toObject = function (argument) {
    return new Object(requireObjectCoercible(argument));
  };

  // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  const isArray =
    Array.isArray ||
    function isArray(arg) {
      return classofRaw(arg) == 'Array';
    };

  const nativeSymbol =
    !!Object.getOwnPropertySymbols &&
    !fails(() => {
      // Chrome 38 Symbol has incorrect toString conversion
      // eslint-disable-next-line no-undef
      return !String(Symbol());
    });

  const useSymbolAsUid =
    nativeSymbol &&
    // eslint-disable-next-line no-undef
    !Symbol.sham &&
    // eslint-disable-next-line no-undef
    typeof Symbol.iterator === 'symbol';

  const WellKnownSymbolsStore = shared('wks');
  const Symbol$1 = global_1.Symbol;
  const createWellKnownSymbol = useSymbolAsUid
    ? Symbol$1
    : (Symbol$1 && Symbol$1.withoutSetter) || uid;

  const wellKnownSymbol = function (name) {
    if (!has(WellKnownSymbolsStore, name)) {
      if (nativeSymbol && has(Symbol$1, name))
        WellKnownSymbolsStore[name] = Symbol$1[name];
      else
        WellKnownSymbolsStore[name] = createWellKnownSymbol(`Symbol.${name}`);
    }
    return WellKnownSymbolsStore[name];
  };

  const SPECIES = wellKnownSymbol('species');

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  const arraySpeciesCreate = function (originalArray, length) {
    let C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (typeof C === 'function' && (C === Array || isArray(C.prototype)))
        C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES];
        if (C === null) C = undefined;
      }
    }
    return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  const push = [].push;

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
  const createMethod$1 = function (TYPE) {
    const IS_MAP = TYPE == 1;
    const IS_FILTER = TYPE == 2;
    const IS_SOME = TYPE == 3;
    const IS_EVERY = TYPE == 4;
    const IS_FIND_INDEX = TYPE == 6;
    const IS_FILTER_OUT = TYPE == 7;
    const NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      const O = toObject($this);
      const self = indexedObject(O);
      const boundFunction = functionBindContext(callbackfn, that, 3);
      const length = toLength(self.length);
      let index = 0;
      const create = specificCreate || arraySpeciesCreate;
      let target = IS_MAP
        ? create($this, length)
        : IS_FILTER || IS_FILTER_OUT
        ? create($this, 0)
        : undefined;
      let value, result;
      for (; length > index; index++)
        if (NO_HOLES || index in self) {
          value = self[index];
          result = boundFunction(value, index, O);
          if (TYPE) {
            if (IS_MAP) target[index] = result; // map
            else if (result)
              switch (TYPE) {
                case 3:
                  return true; // some
                case 5:
                  return value; // find
                case 6:
                  return index; // findIndex
                case 2:
                  push.call(target, value); // filter
              }
            else
              switch (TYPE) {
                case 4:
                  return false; // every
                case 7:
                  push.call(target, value); // filterOut
              }
          }
        }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  const arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$1(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: createMethod$1(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: createMethod$1(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: createMethod$1(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: createMethod$1(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: createMethod$1(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$1(6),
    // `Array.prototype.filterOut` method
    // https://github.com/tc39/proposal-array-filtering
    filterOut: createMethod$1(7),
  };

  const engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  const process = global_1.process;
  const versions = process && process.versions;
  const v8 = versions && versions.v8;
  let match, version;

  if (v8) {
    match = v8.split('.');
    version = match[0] + match[1];
  } else if (engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = engineUserAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  const engineV8Version = version && +version;

  const SPECIES$1 = wellKnownSymbol('species');

  const arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return (
      engineV8Version >= 51 ||
      !fails(() => {
        const array = [];
        let constructor = (array.constructor = {});
        constructor[SPECIES$1] = function () {
          return { foo: 1 };
        };
        return array[METHOD_NAME](Boolean).foo !== 1;
      })
    );
  };

  const defineProperty = Object.defineProperty;
  const cache = {};

  const thrower = function (it) {
    throw it;
  };

  const arrayMethodUsesToLength = function (METHOD_NAME, options) {
    if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
    if (!options) options = {};
    const method = [][METHOD_NAME];
    const ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
    let argument0 = has(options, 0) ? options[0] : thrower;
    const argument1 = has(options, 1) ? options[1] : undefined;

    return (cache[METHOD_NAME] =
      !!method &&
      !fails(() => {
        if (ACCESSORS && !descriptors) return true;
        const O = { length: -1 };

        if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
        else O[1] = 1;

        method.call(O, argument0, argument1);
      }));
  };

  const $filter = arrayIteration.filter;

  const HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
  // Edge 14- issue
  const USES_TO_LENGTH = arrayMethodUsesToLength('filter');

  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  _export(
    {
      target: 'Array',
      proto: true,
      forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH,
    },
    {
      filter: function filter(callbackfn /* , thisArg */) {
        return $filter(
          this,
          callbackfn,
          arguments.length > 1 ? arguments[1] : undefined,
        );
      },
    },
  );

  const arrayMethodIsStrict = function (METHOD_NAME, argument) {
    const method = [][METHOD_NAME];
    return (
      !!method &&
      fails(() => {
        // eslint-disable-next-line no-useless-call,no-throw-literal
        method.call(
          null,
          argument ||
            (() => {
              throw 1;
            }),
          1,
        );
      })
    );
  };

  const $forEach = arrayIteration.forEach;

  const STRICT_METHOD = arrayMethodIsStrict('forEach');
  const USES_TO_LENGTH$1 = arrayMethodUsesToLength('forEach');

  // `Array.prototype.forEach` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  const arrayForEach =
    !STRICT_METHOD || !USES_TO_LENGTH$1
      ? function forEach(callbackfn /* , thisArg */) {
          return $forEach(
            this,
            callbackfn,
            arguments.length > 1 ? arguments[1] : undefined,
          );
        }
      : [].forEach;

  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  _export(
    { target: 'Array', proto: true, forced: [].forEach != arrayForEach },
    {
      forEach: arrayForEach,
    },
  );

  const $indexOf = arrayIncludes.indexOf;

  const nativeIndexOf = [].indexOf;

  const NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
  const STRICT_METHOD$1 = arrayMethodIsStrict('indexOf');
  const USES_TO_LENGTH$2 = arrayMethodUsesToLength('indexOf', {
    ACCESSORS: true,
    1: 0,
  });

  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  _export(
    {
      target: 'Array',
      proto: true,
      forced: NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$2,
    },
    {
      indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
        return NEGATIVE_ZERO
          ? // convert -0 to +0
            Reflect.apply(nativeIndexOf, this, arguments) || 0
          : $indexOf(
              this,
              searchElement,
              arguments.length > 1 ? arguments[1] : undefined,
            );
      },
    },
  );

  const createProperty = function (object, key, value) {
    const propertyKey = toPrimitive(key);
    if (propertyKey in object)
      objectDefineProperty.f(
        object,
        propertyKey,
        createPropertyDescriptor(0, value),
      );
    else object[propertyKey] = value;
  };

  const HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('splice');
  const USES_TO_LENGTH$3 = arrayMethodUsesToLength('splice', {
    ACCESSORS: true,
    0: 0,
    1: 2,
  });

  const max$1 = Math.max;
  const min$2 = Math.min;
  const MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  const MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

  // `Array.prototype.splice` method
  // https://tc39.es/ecma262/#sec-array.prototype.splice
  // with adding support of @@species
  _export(
    {
      target: 'Array',
      proto: true,
      forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$3,
    },
    {
      splice: function splice(start, deleteCount /* , ...items */) {
        const O = toObject(this);
        const len = toLength(O.length);
        const actualStart = toAbsoluteIndex(start, len);
        const argumentsLength = arguments.length;
        let insertCount, actualDeleteCount, A, k, from, to;
        if (argumentsLength === 0) {
          insertCount = actualDeleteCount = 0;
        } else if (argumentsLength === 1) {
          insertCount = 0;
          actualDeleteCount = len - actualStart;
        } else {
          insertCount = argumentsLength - 2;
          actualDeleteCount = min$2(
            max$1(toInteger(deleteCount), 0),
            len - actualStart,
          );
        }
        if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
          throw new TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
        }
        A = arraySpeciesCreate(O, actualDeleteCount);
        for (k = 0; k < actualDeleteCount; k++) {
          from = actualStart + k;
          if (from in O) createProperty(A, k, O[from]);
        }
        A.length = actualDeleteCount;
        if (insertCount < actualDeleteCount) {
          for (k = actualStart; k < len - actualDeleteCount; k++) {
            from = k + actualDeleteCount;
            to = k + insertCount;
            if (from in O) O[to] = O[from];
            else delete O[to];
          }
          for (k = len; k > len - actualDeleteCount + insertCount; k--)
            delete O[k - 1];
        } else if (insertCount > actualDeleteCount) {
          for (k = len - actualDeleteCount; k > actualStart; k--) {
            from = k + actualDeleteCount - 1;
            to = k + insertCount - 1;
            if (from in O) O[to] = O[from];
            else delete O[to];
          }
        }
        for (k = 0; k < insertCount; k++) {
          O[k + actualStart] = arguments[k + 2];
        }
        O.length = len - actualDeleteCount + insertCount;
        return A;
      },
    },
  );

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  const objectKeys =
    Object.keys ||
    function keys(O) {
      return objectKeysInternal(O, enumBugKeys);
    };

  const nativeAssign = Object.assign;
  const defineProperty$1 = Object.defineProperty;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  const objectAssign =
    !nativeAssign ||
    fails(() => {
      // should have correct order of operations (Edge bug)
      if (
        descriptors &&
        nativeAssign(
          { b: 1 },
          nativeAssign(
            defineProperty$1({}, 'a', {
              enumerable: true,
              get() {
                defineProperty$1(this, 'b', {
                  value: 3,
                  enumerable: false,
                });
              },
            }),
            { b: 2 },
          ),
        ).b !== 1
      )
        return true;
      // should work with symbols and should have deterministic property order (V8 bug)
      const A = {};
      const B = {};
      // eslint-disable-next-line no-undef
      const symbol = Symbol();
      const alphabet = 'abcdefghijklmnopqrst';
      A[symbol] = 7;
      alphabet.split('').forEach((chr) => {
        B[chr] = chr;
      });
      return (
        nativeAssign({}, A)[symbol] != 7 ||
        objectKeys(nativeAssign({}, B)).join('') != alphabet
      );
    })
      ? function assign(target, source) {
          // eslint-disable-line no-unused-vars
          const T = toObject(target);
          const argumentsLength = arguments.length;
          let index = 1;
          const getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
          const propertyIsEnumerable = objectPropertyIsEnumerable.f;
          while (argumentsLength > index) {
            const S = indexedObject(arguments[index++]);
            let keys = getOwnPropertySymbols
              ? objectKeys(S).concat(getOwnPropertySymbols(S))
              : objectKeys(S);
            const length = keys.length;
            let j = 0;
            var key;
            while (length > j) {
              key = keys[j++];
              if (!descriptors || propertyIsEnumerable.call(S, key))
                T[key] = S[key];
            }
          }
          return T;
        }
      : nativeAssign;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  _export(
    { target: 'Object', stat: true, forced: Object.assign !== objectAssign },
    {
      assign: objectAssign,
    },
  );

  const FAILS_ON_PRIMITIVES = fails(() => {
    objectKeys(1);
  });

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  _export(
    { target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES },
    {
      keys: function keys(it) {
        return objectKeys(toObject(it));
      },
    },
  );

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
  const regexpFlags = function () {
    const that = anObject(this);
    let result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.dotAll) result += 's';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
  // so we use an intermediate function.
  function RE(s, f) {
    return new RegExp(s, f);
  }

  const UNSUPPORTED_Y = fails(() => {
    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    const re = RE('a', 'y');
    re.lastIndex = 2;
    return re.exec('abcd') != null;
  });

  const BROKEN_CARET = fails(() => {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    const re = RE('^r', 'gy');
    re.lastIndex = 2;
    return re.exec('str') != null;
  });

  const regexpStickyHelpers = {
    UNSUPPORTED_Y,
    BROKEN_CARET,
  };

  const nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  const nativeReplace = String.prototype.replace;

  let patchedExec = nativeExec;

  const UPDATES_LAST_INDEX_WRONG = (function () {
    const re1 = /a/;
    const re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  })();

  const UNSUPPORTED_Y$1 =
    regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  const NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  const PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

  if (PATCH) {
    patchedExec = function exec(str) {
      const re = this;
      let lastIndex, reCopy, match, i;
      const sticky = UNSUPPORTED_Y$1 && re.sticky;
      let flags = regexpFlags.call(re);
      let source = re.source;
      let charsAdded = 0;
      let strCopy = str;

      if (sticky) {
        flags = flags.replace('y', '');
        if (!flags.includes('g')) {
          flags += 'g';
        }

        strCopy = String(str).slice(re.lastIndex);
        // Support anchored sticky behavior.
        if (
          re.lastIndex > 0 &&
          (!re.multiline || (re.multiline && str[re.lastIndex - 1] !== '\n'))
        ) {
          source = `(?: ${source})`;
          strCopy = ` ${strCopy}`;
          charsAdded++;
        }
        // ^(? + rx + ) is needed, in combination with some str slicing, to
        // simulate the 'y' flag.
        reCopy = new RegExp(`^(?:${source})`, flags);
      }

      if (NPCG_INCLUDED) {
        reCopy = new RegExp(`^${source}$(?!\\s)`, flags);
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

      match = nativeExec.call(sticky ? reCopy : re, strCopy);

      if (sticky) {
        if (match) {
          match.input = match.input.slice(charsAdded);
          match[0] = match[0].slice(charsAdded);
          match.index = re.lastIndex;
          re.lastIndex += match[0].length;
        } else re.lastIndex = 0;
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  const regexpExec = patchedExec;

  // `RegExp.prototype.exec` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.exec
  _export(
    { target: 'RegExp', proto: true, forced: /./.exec !== regexpExec },
    {
      exec: regexpExec,
    },
  );

  // TODO: Remove from `core-js@4` since it's moved to entry points

  const SPECIES$2 = wellKnownSymbol('species');

  const REPLACE_SUPPORTS_NAMED_GROUPS = !fails(() => {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    const re = /./;
    re.exec = function () {
      const result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  // IE <= 11 replaces $0 with the whole match, as if it was $&
  // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
  const REPLACE_KEEPS_$0 = (function () {
    return 'a'.replace(/./, '$0') === '$0';
  })();

  const REPLACE = wellKnownSymbol('replace');
  // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
  const REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
    if (/./[REPLACE]) {
      return /./[REPLACE]('a', '$0') === '';
    }
    return false;
  })();

  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper
  const SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(() => {
    const re = /(?:)/;
    const originalExec = re.exec;
    re.exec = function () {
      return Reflect.apply(originalExec, this, arguments);
    };
    const result = 'ab'.split(re);
    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
  });

  const fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
    const SYMBOL = wellKnownSymbol(KEY);

    const DELEGATES_TO_SYMBOL = !fails(() => {
      // String methods call symbol-named RegEp methods
      let O = {};
      O[SYMBOL] = function () {
        return 7;
      };
      return ''[KEY](O) != 7;
    });

    let DELEGATES_TO_EXEC =
      DELEGATES_TO_SYMBOL &&
      !fails(() => {
        // Symbol-named RegExp methods call .exec
        let execCalled = false;
        let re = /a/;

        if (KEY === 'split') {
          // We can't use real regex here since it causes deoptimization
          // and serious performance degradation in V8
          // https://github.com/zloirock/core-js/issues/306
          re = {};
          // RegExp[@@split] doesn't call the regex's exec method, but first creates
          // a new one. We need to return the patched regex when creating the new one.
          re.constructor = {};
          re.constructor[SPECIES$2] = function () {
            return re;
          };
          re.flags = '';
          re[SYMBOL] = /./[SYMBOL];
        }

        re.exec = function () {
          execCalled = true;
          return null;
        };

        re[SYMBOL]('');
        return !execCalled;
      });

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' &&
        !(
          REPLACE_SUPPORTS_NAMED_GROUPS &&
          REPLACE_KEEPS_$0 &&
          !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
        )) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      let nativeRegExpMethod = /./[SYMBOL];
      let methods = exec(
        SYMBOL,
        ''[KEY],
        (nativeMethod, regexp, str, arg2, forceStringMethod) => {
          if (regexp.exec === regexpExec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return {
                done: true,
                value: nativeRegExpMethod.call(regexp, str, arg2),
              };
            }
            return { done: true, value: nativeMethod.call(str, regexp, arg2) };
          }
          return { done: false };
        },
        {
          REPLACE_KEEPS_$0,
          REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,
        },
      );
      let stringMethod = methods[0];
      const regexMethod = methods[1];

      redefine(String.prototype, KEY, stringMethod);
      redefine(
        RegExp.prototype,
        SYMBOL,
        length == 2
          ? // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
            // 21.2.5.11 RegExp.prototype[@@split](string, limit)
            function (string, arg) {
              return regexMethod.call(string, this, arg);
            }
          : // 21.2.5.6 RegExp.prototype[@@match](string)
            // 21.2.5.9 RegExp.prototype[@@search](string)
            function (string) {
              return regexMethod.call(string, this);
            },
      );
    }

    if (sham)
      createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
  };

  // `SameValue` abstract operation
  // https://tc39.es/ecma262/#sec-samevalue
  const sameValue =
    Object.is ||
    function is(x, y) {
      // eslint-disable-next-line no-self-compare
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    };

  // `RegExpExec` abstract operation
  // https://tc39.es/ecma262/#sec-regexpexec
  const regexpExecAbstract = function (R, S) {
    const exec = R.exec;
    if (typeof exec === 'function') {
      const result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw new TypeError(
          'RegExp exec method returned something other than an Object or null',
        );
      }
      return result;
    }

    if (classofRaw(R) !== 'RegExp') {
      throw new TypeError('RegExp#exec called on incompatible receiver');
    }

    return regexpExec.call(R, S);
  };

  // @@search logic
  fixRegexpWellKnownSymbolLogic(
    'search',
    1,
    (SEARCH, nativeSearch, maybeCallNative) => {
      return [
        // `String.prototype.search` method
        // https://tc39.es/ecma262/#sec-string.prototype.search
        function search(regexp) {
          const O = requireObjectCoercible(this);
          const searcher = regexp == undefined ? undefined : regexp[SEARCH];
          return searcher !== undefined
            ? searcher.call(regexp, O)
            : new RegExp(regexp)[SEARCH](String(O));
        },
        // `RegExp.prototype[@@search]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
        function (regexp) {
          const res = maybeCallNative(nativeSearch, regexp, this);
          if (res.done) return res.value;

          const rx = anObject(regexp);
          const S = String(this);

          const previousLastIndex = rx.lastIndex;
          if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
          const result = regexpExecAbstract(rx, S);
          if (!sameValue(rx.lastIndex, previousLastIndex))
            rx.lastIndex = previousLastIndex;
          return result === null ? -1 : result.index;
        },
      ];
    },
  );

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  const domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0,
  };

  for (const COLLECTION_NAME in domIterables) {
    const Collection = global_1[COLLECTION_NAME];
    const CollectionPrototype = Collection && Collection.prototype;
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach)
      try {
        createNonEnumerableProperty(
          CollectionPrototype,
          'forEach',
          arrayForEach,
        );
      } catch {
        CollectionPrototype.forEach = arrayForEach;
      }
  }

  const IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
  const MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
  const MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679
  const IS_CONCAT_SPREADABLE_SUPPORT =
    engineV8Version >= 51 ||
    !fails(() => {
      const array = [];
      array[IS_CONCAT_SPREADABLE] = false;
      return array.concat()[0] !== array;
    });

  const SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

  const isConcatSpreadable = function (O) {
    if (!isObject(O)) return false;
    let spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray(O);
  };

  const FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

  // `Array.prototype.concat` method
  // https://tc39.es/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  _export(
    { target: 'Array', proto: true, forced: FORCED },
    {
      concat: function concat(arg) {
        // eslint-disable-line no-unused-vars
        const O = toObject(this);
        const A = arraySpeciesCreate(O, 0);
        let n = 0;
        let i, k, length, len, E;
        for (i = -1, length = arguments.length; i < length; i++) {
          E = i === -1 ? O : arguments[i];
          if (isConcatSpreadable(E)) {
            len = toLength(E.length);
            if (n + len > MAX_SAFE_INTEGER$1)
              throw new TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
            for (k = 0; k < len; k++, n++)
              if (k in E) createProperty(A, n, E[k]);
          } else {
            if (n >= MAX_SAFE_INTEGER$1)
              throw new TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
            createProperty(A, n++, E);
          }
        }
        A.length = n;
        return A;
      },
    },
  );

  const global$1 =
    typeof global$2 !== 'undefined'
      ? global$2
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : {};

  var global$2 =
    typeof global$1 !== 'undefined'
      ? global$1
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : {};

  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

  function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
  }

  function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
  }

  let cachedSetTimeout = defaultSetTimout;
  let cachedClearTimeout = defaultClearTimeout;

  if (typeof global$2.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
  }

  if (typeof global$2.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
  }

  function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
      //normal enviroments in sane situations
      return setTimeout(fun, 0);
    } // if setTimeout wasn't available but was latter defined

    if (
      (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
      setTimeout
    ) {
      cachedSetTimeout = setTimeout;
      return setTimeout(fun, 0);
    }

    try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedSetTimeout(fun, 0);
    } catch {
      try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
        return cachedSetTimeout.call(null, fun, 0);
      } catch {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
        return cachedSetTimeout.call(this, fun, 0);
      }
    }
  }

  function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
      //normal enviroments in sane situations
      return clearTimeout(marker);
    } // if clearTimeout wasn't available but was latter defined

    if (
      (cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) &&
      clearTimeout
    ) {
      cachedClearTimeout = clearTimeout;
      return clearTimeout(marker);
    }

    try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedClearTimeout(marker);
    } catch {
      try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
        return cachedClearTimeout.call(null, marker);
      } catch {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
        return cachedClearTimeout.call(this, marker);
      }
    }
  }

  let queue = [];
  let draining = false;
  let currentQueue;
  let queueIndex = -1;

  function cleanUpNextTick() {
    if (!draining || !currentQueue) {
      return;
    }

    draining = false;

    if (currentQueue.length > 0) {
      queue = currentQueue.concat(queue);
    } else {
      queueIndex = -1;
    }

    if (queue.length > 0) {
      drainQueue();
    }
  }

  function drainQueue() {
    if (draining) {
      return;
    }

    const timeout = runTimeout(cleanUpNextTick);
    draining = true;
    let len = queue.length;

    while (len) {
      currentQueue = queue;
      queue = [];

      while (++queueIndex < len) {
        if (currentQueue) {
          currentQueue[queueIndex].run();
        }
      }

      queueIndex = -1;
      len = queue.length;
    }

    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
  }

  function nextTick(fun) {
    const args = Array.from({ length: arguments.length - 1 });

    if (arguments.length > 1) {
      for (let i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
    }

    queue.push(new Item(fun, args));

    if (queue.length === 1 && !draining) {
      runTimeout(drainQueue);
    }
  } // v8 likes predictible objects

  function Item(fun, array) {
    this.fun = fun;
    this.array = array;
  }

  Item.prototype.run = function () {
    this.fun.apply(null, this.array);
  };

  const title = 'browser';
  const platform = 'browser';
  const browser = true;
  const env = {};
  const argv = [];
  const version$1 = ''; // empty string to avoid regexp issues

  const versions$1 = {};
  const release = {};
  const config = {};

  function noop() {}

  const on = noop;
  const addListener = noop;
  const once = noop;
  const off = noop;
  const removeListener = noop;
  const removeAllListeners = noop;
  const emit = noop;
  function binding(name) {
    throw new Error('process.binding is not supported');
  }
  function cwd() {
    return '/';
  }
  function chdir(dir) {
    throw new Error('process.chdir is not supported');
  }
  function umask() {
    return 0;
  } // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js

  const performance = global$2.performance || {};

  const performanceNow =
    performance.now ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    performance.webkitNow ||
    function () {
      return Date.now();
    }; // generate timestamp or delta
  // see http://nodejs.org/api/process.html#process_process_hrtime

  function hrtime(previousTimestamp) {
    const clocktime = performanceNow.call(performance) * 1e-3;
    let seconds = Math.floor(clocktime);
    let nanoseconds = Math.floor((clocktime % 1) * 1e9);

    if (previousTimestamp) {
      seconds = seconds - previousTimestamp[0];
      nanoseconds = nanoseconds - previousTimestamp[1];

      if (nanoseconds < 0) {
        seconds--;
        nanoseconds += 1e9;
      }
    }

    return [seconds, nanoseconds];
  }
  const startTime = new Date();
  function uptime() {
    const currentTime = new Date();
    const dif = currentTime - startTime;
    return dif / 1000;
  }
  const process$1 = {
    nextTick,
    title,
    browser,
    env,
    argv,
    version: version$1,
    versions: versions$1,
    on,
    addListener,
    once,
    off,
    removeListener,
    removeAllListeners,
    emit,
    binding,
    cwd,
    chdir,
    umask,
    hrtime,
    platform,
    release,
    config,
    uptime,
  };

  const TO_STRING_TAG = wellKnownSymbol('toStringTag');
  const test = {};

  test[TO_STRING_TAG] = 'z';

  const toStringTagSupport = String(test) === '[object z]';

  const TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  // ES3 wrong here
  const CORRECT_ARGUMENTS =
    classofRaw(
      (function () {
        return arguments;
      })(),
    ) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  const tryGet = function (it, key) {
    try {
      return it[key];
    } catch {
      /* empty */
    }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  const classof = toStringTagSupport
    ? classofRaw
    : function (it) {
        let O, tag, result;
        return it === undefined
          ? 'Undefined'
          : it === null
          ? 'Null'
          : // @@toStringTag case
          typeof (tag = tryGet((O = new Object(it)), TO_STRING_TAG$1)) === 'string'
          ? tag
          : // builtinTag case
          CORRECT_ARGUMENTS
          ? classofRaw(O)
          : // ES3 arguments fallback
          (result = classofRaw(O)) == 'Object' && typeof O.callee === 'function'
          ? 'Arguments'
          : result;
      };

  // `Object.prototype.toString` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  const objectToString = toStringTagSupport
    ? {}.toString
    : function toString() {
        return `[object ${classof(this)}]`;
      };

  // `Object.prototype.toString` method
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  if (!toStringTagSupport) {
    redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
  }

  const TO_STRING = 'toString';
  const RegExpPrototype = RegExp.prototype;
  const nativeToString = RegExpPrototype[TO_STRING];

  const NOT_GENERIC = fails(() => {
    return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b';
  });
  // FF44- RegExp#toString has a wrong name
  const INCORRECT_NAME = nativeToString.name != TO_STRING;

  // `RegExp.prototype.toString` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.tostring
  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine(
      RegExp.prototype,
      TO_STRING,
      function toString() {
        const R = anObject(this);
        const p = String(R.source);
        const rf = R.flags;
        const f = String(
          rf === undefined &&
            R instanceof RegExp &&
            !('flags' in RegExpPrototype)
            ? regexpFlags.call(R)
            : rf,
        );
        return `/${p}/${f}`;
      },
      { unsafe: true },
    );
  }

  const defineProperty$2 = objectDefineProperty.f;

  const FunctionPrototype = Function.prototype;
  const FunctionPrototypeToString = FunctionPrototype.toString;
  const nameRE = /^\s*function ([^ (]*)/;
  const NAME = 'name';

  // Function instances `.name` property
  // https://tc39.es/ecma262/#sec-function-instances-name
  if (descriptors && !(NAME in FunctionPrototype)) {
    defineProperty$2(FunctionPrototype, NAME, {
      configurable: true,
      get() {
        try {
          return FunctionPrototypeToString.call(this).match(nameRE)[1];
        } catch {
          return '';
        }
      },
    });
  }

  const correctPrototypeGetter = !fails(() => {
    function F() {
      /* empty */
    }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  const IE_PROTO = sharedKey('IE_PROTO');
  const ObjectPrototype = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  const objectGetPrototypeOf = correctPrototypeGetter
    ? Object.getPrototypeOf
    : function (O) {
        O = toObject(O);
        if (has(O, IE_PROTO)) return O[IE_PROTO];
        if (typeof O.constructor === 'function' && O instanceof O.constructor) {
          return O.constructor.prototype;
        }
        return O instanceof Object ? ObjectPrototype : null;
      };

  const FAILS_ON_PRIMITIVES$1 = fails(() => {
    objectGetPrototypeOf(1);
  });

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  _export(
    {
      target: 'Object',
      stat: true,
      forced: FAILS_ON_PRIMITIVES$1,
      sham: !correctPrototypeGetter,
    },
    {
      getPrototypeOf: function getPrototypeOf(it) {
        return objectGetPrototypeOf(toObject(it));
      },
    },
  );

  // `Reflect.ownKeys` method
  // https://tc39.es/ecma262/#sec-reflect.ownkeys
  _export(
    { target: 'Reflect', stat: true },
    {
      ownKeys,
    },
  );

  let domain; // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).

  function EventHandlers() {}

  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  // require('events') === require('events').EventEmitter

  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.usingDomains = false;
  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.

  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function () {
    this.domain = null;

    if (
      EventEmitter.usingDomains && // if there is an active domain, then attach to it.
      domain.active
    );

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  }; // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n))
      throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  }; // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.

  function emitNone(handler, isFn, self) {
    if (isFn) handler.call(self);
    else {
      const len = handler.length;
      const listeners = arrayClone(handler, len);

      for (let i = 0; i < len; ++i) {
        listeners[i].call(self);
      }
    }
  }

  function emitOne(handler, isFn, self, arg1) {
    if (isFn) handler.call(self, arg1);
    else {
      const len = handler.length;
      const listeners = arrayClone(handler, len);

      for (let i = 0; i < len; ++i) {
        listeners[i].call(self, arg1);
      }
    }
  }

  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn) handler.call(self, arg1, arg2);
    else {
      const len = handler.length;
      const listeners = arrayClone(handler, len);

      for (let i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2);
      }
    }
  }

  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn) handler.call(self, arg1, arg2, arg3);
    else {
      const len = handler.length;
      const listeners = arrayClone(handler, len);

      for (let i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2, arg3);
      }
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn) handler.apply(self, args);
    else {
      const len = handler.length;
      const listeners = arrayClone(handler, len);

      for (let i = 0; i < len; ++i) {
        listeners[i].apply(self, args);
      }
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    let er, handler, len, args, i, events, domain;
    let doError = type === 'error';
    events = this._events;
    if (events) doError = doError && events.error == null;
    else if (!doError) return false;
    domain = this.domain; // If there is no 'error' event listener then throw.

    if (doError) {
      er = arguments[1];

      if (domain) {
        if (!er) er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        const err = new Error(
          `Uncaught, unspecified "error" event. (${  er  })`,
        );
        err.context = er;
        throw err;
      }

      return false;
    }

    handler = events[type];
    if (!handler) return false;
    const isFn = typeof handler === 'function';
    len = arguments.length;

    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;

      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;

      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;

      case 4:
        emitThree(
          handler,
          isFn,
          this,
          arguments[1],
          arguments[2],
          arguments[3],
        );
        break;
      // slower

      default:
        args = Array.from({ length: len - 1 });

        for (i = 1; i < len; i++) {
          args[i - 1] = arguments[i];
        }

        emitMany(handler, isFn, this, args);
    }
    return true;
  };

  function _addListener(target, type, listener, prepend) {
    let m;
    let events;
    let existing;
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    events = target._events;

    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit(
          'newListener',
          type,
          listener.listener ? listener.listener : listener,
        ); // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object

        events = target._events;
      }

      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend
          ? [listener, existing]
          : [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      } // Check for listener leak

      if (!existing.warned) {
        m = $getMaxListeners(target);

        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          const w = new Error(
            `Possible EventEmitter memory leak detected. ${ 
              existing.length 
              } ${ 
              type 
              } listeners added. ` +
              `Use emitter.setMaxListeners() to increase limit`,
          );
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }

  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }

  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener = function prependListener(
    type,
    listener,
  ) {
    return _addListener(this, type, listener, true);
  };

  function _onceWrap(target, type, listener) {
    let fired = false;

    function g() {
      target.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }

    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener = function prependOnceListener(
    type,
    listener,
  ) {
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  }; // emits a 'removeListener' event iff the listener was removed

  EventEmitter.prototype.removeListener = function removeListener(
    type,
    listener,
  ) {
    let list, events, position, i, originalListener;
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    events = this._events;
    if (!events) return this;
    list = events[type];
    if (!list) return this;

    if (list === listener || (list.listener && list.listener === listener)) {
      if (--this._eventsCount === 0) this._events = new EventHandlers();
      else {
        delete events[type];
        if (events.removeListener)
          this.emit('removeListener', type, list.listener || listener);
      }
    } else if (typeof list !== 'function') {
      position = -1;

      for (i = list.length; i-- > 0; ) {
        if (
          list[i] === listener ||
          (list[i].listener && list[i].listener === listener)
        ) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }

      if (position < 0) return this;

      if (list.length === 1) {
        list[0] = undefined;

        if (--this._eventsCount === 0) {
          this._events = new EventHandlers();
          return this;
        } else {
          delete events[type];
        }
      } else {
        spliceOne(list, position);
      }

      if (events.removeListener)
        this.emit('removeListener', type, originalListener || listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function removeAllListeners(
    type,
  ) {
    let listeners, events;
    events = this._events;
    if (!events) return this; // not listening for removeListener, no need to emit

    if (!events.removeListener) {
      if (arguments.length === 0) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      } else if (events[type]) {
        if (--this._eventsCount === 0) this._events = new EventHandlers();
        else delete events[type];
      }

      return this;
    } // emit removeListener for all listeners on all events

    if (arguments.length === 0) {
      const keys = Object.keys(events);

      for (var i = 0, key; i < keys.length; ++i) {
        key = keys[i];
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }

      this.removeAllListeners('removeListener');
      this._events = new EventHandlers();
      this._eventsCount = 0;
      return this;
    }

    listeners = events[type];

    if (typeof listeners === 'function') {
      this.removeListener(type, listeners);
    } else if (listeners) {
      // LIFO order
      do {
        this.removeListener(type, listeners[listeners.length - 1]);
      } while (listeners[0]);
    }

    return this;
  };

  EventEmitter.prototype.listeners = function listeners(type) {
    let evlistener;
    let ret;
    const events = this._events;
    if (!events) ret = [];
    else {
      evlistener = events[type];
      if (!evlistener) ret = [];
      else if (typeof evlistener === 'function')
        ret = [evlistener.listener || evlistener];
      else ret = unwrapListeners(evlistener);
    }
    return ret;
  };

  EventEmitter.listenerCount = function (emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;

  function listenerCount(type) {
    const events = this._events;

    if (events) {
      const evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  }; // About 1.5x faster than the two-arg version of Array#splice().

  function spliceOne(list, index) {
    for (let i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
      list[i] = list[k];
    }

    list.pop();
  }

  function arrayClone(arr, i) {
    const copy = new Array(i);

    while (i--) {
      copy[i] = arr[i];
    }

    return copy;
  }

  function unwrapListeners(arr) {
    const ret = Array.from({ length: arr.length });

    for (let i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }

    return ret;
  }

  const nativeJoin = [].join;

  const ES3_STRINGS = indexedObject != Object;
  const STRICT_METHOD$2 = arrayMethodIsStrict('join', ',');

  // `Array.prototype.join` method
  // https://tc39.es/ecma262/#sec-array.prototype.join
  _export(
    { target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$2 },
    {
      join: function join(separator) {
        return nativeJoin.call(
          toIndexedObject(this),
          separator === undefined ? ',' : separator,
        );
      },
    },
  );

  const $map = arrayIteration.map;

  const HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');
  // FF49- issue
  const USES_TO_LENGTH$4 = arrayMethodUsesToLength('map');

  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  _export(
    {
      target: 'Array',
      proto: true,
      forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$4,
    },
    {
      map: function map(callbackfn /* , thisArg */) {
        return $map(
          this,
          callbackfn,
          arguments.length > 1 ? arguments[1] : undefined,
        );
      },
    },
  );

  // `Array.prototype.{ reduce, reduceRight }` methods implementation
  const createMethod$2 = function (IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aFunction$1(callbackfn);
      const O = toObject(that);
      const self = indexedObject(O);
      let length = toLength(O.length);
      let index = IS_RIGHT ? length - 1 : 0;
      const i = IS_RIGHT ? -1 : 1;
      if (argumentsLength < 2)
        while (true) {
          if (index in self) {
            memo = self[index];
            index += i;
            break;
          }
          index += i;
          if (IS_RIGHT ? index < 0 : length <= index) {
            throw new TypeError('Reduce of empty array with no initial value');
          }
        }
      for (; IS_RIGHT ? index >= 0 : length > index; index += i)
        if (index in self) {
          memo = callbackfn(memo, self[index], index, O);
        }
      return memo;
    };
  };

  const arrayReduce = {
    // `Array.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduce
    left: createMethod$2(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduceright
    right: createMethod$2(true),
  };

  const engineIsNode = classofRaw(global_1.process) == 'process';

  const $reduce = arrayReduce.left;

  const STRICT_METHOD$3 = arrayMethodIsStrict('reduce');
  const USES_TO_LENGTH$5 = arrayMethodUsesToLength('reduce', { 1: 0 });
  // Chrome 80-82 has a critical bug
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
  const CHROME_BUG =
    !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  _export(
    {
      target: 'Array',
      proto: true,
      forced: !STRICT_METHOD$3 || !USES_TO_LENGTH$5 || CHROME_BUG,
    },
    {
      reduce: function reduce(callbackfn /* , initialValue */) {
        return $reduce(
          this,
          callbackfn,
          arguments.length,
          arguments.length > 1 ? arguments[1] : undefined,
        );
      },
    },
  );

  const aPossiblePrototype = function (it) {
    if (!isObject(it) && it !== null) {
      throw new TypeError(`Can't set ${String(it)} as a prototype`);
    }
    return it;
  };

  // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */
  const objectSetPrototypeOf =
    Object.setPrototypeOf ||
    ('__proto__' in {}
      ? (function () {
          let CORRECT_SETTER = false;
          const test = {};
          let setter;
          try {
            setter = Object.getOwnPropertyDescriptor(
              Object.prototype,
              '__proto__',
            ).set;
            setter.call(test, []);
            CORRECT_SETTER = Array.isArray(test);
          } catch {
            /* empty */
          }
          return function setPrototypeOf(O, proto) {
            anObject(O);
            aPossiblePrototype(proto);
            if (CORRECT_SETTER) setter.call(O, proto);
            else O.__proto__ = proto;
            return O;
          };
        })()
      : undefined);

  // makes subclassing work correct for wrapped built-ins
  const inheritIfRequired = function ($this, dummy, Wrapper) {
    let NewTarget, NewTargetPrototype;
    if (
      // it can work only with native `setPrototypeOf`
      objectSetPrototypeOf &&
      // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
      typeof (NewTarget = dummy.constructor) === 'function' &&
      NewTarget !== Wrapper &&
      isObject((NewTargetPrototype = NewTarget.prototype)) &&
      NewTargetPrototype !== Wrapper.prototype
    )
      objectSetPrototypeOf($this, NewTargetPrototype);
    return $this;
  };

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  const objectDefineProperties = descriptors
    ? Object.defineProperties
    : function defineProperties(O, Properties) {
        anObject(O);
        const keys = objectKeys(Properties);
        const length = keys.length;
        let index = 0;
        let key;
        while (length > index)
          objectDefineProperty.f(O, (key = keys[index++]), Properties[key]);
        return O;
      };

  const html = getBuiltIn('document', 'documentElement');

  const GT = '>';
  const LT = '<';
  const PROTOTYPE = 'prototype';
  const SCRIPT = 'script';
  const IE_PROTO$1 = sharedKey('IE_PROTO');

  const EmptyConstructor = function () {
    /* empty */
  };

  const scriptTag = function (content) {
    return `${LT + SCRIPT + GT + content + LT}/${SCRIPT}${GT}`;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  const NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    const temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  const NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    const iframe = documentCreateElement('iframe');
    const JS = `java${  SCRIPT  }:`;
    let iframeDocument;
    iframe.style.display = 'none';
    html.append(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  let activeXDocument;
  let NullProtoObject = function () {
    try {
      /* global ActiveXObject */
      activeXDocument = document.domain && new ActiveXObject('htmlfile');
    } catch {
      /* ignore */
    }
    NullProtoObject = activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument)
      : NullProtoObjectViaIFrame();
    let length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys[IE_PROTO$1] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  const objectCreate =
    Object.create ||
    function create(O, Properties) {
      let result;
      if (O !== null) {
        EmptyConstructor[PROTOTYPE] = anObject(O);
        result = new EmptyConstructor();
        EmptyConstructor[PROTOTYPE] = null;
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO$1] = O;
      } else result = NullProtoObject();
      return Properties === undefined
        ? result
        : objectDefineProperties(result, Properties);
    };

  // a string of all valid unicode whitespaces
  // eslint-disable-next-line max-len
  const whitespaces =
    '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

  const whitespace = `[${whitespaces}]`;
  const ltrim = new RegExp(`^${whitespace}${whitespace}*`);
  const rtrim = new RegExp(`${whitespace + whitespace}*$`);

  // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
  const createMethod$3 = function (TYPE) {
    return function ($this) {
      let string = String(requireObjectCoercible($this));
      if (TYPE & 1) string = string.replace(ltrim, '');
      if (TYPE & 2) string = string.replace(rtrim, '');
      return string;
    };
  };

  const stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimstart
    start: createMethod$3(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimend
    end: createMethod$3(2),
    // `String.prototype.trim` method
    // https://tc39.es/ecma262/#sec-string.prototype.trim
    trim: createMethod$3(3),
  };

  const getOwnPropertyNames = objectGetOwnPropertyNames.f;
  const getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
  const defineProperty$3 = objectDefineProperty.f;
  const trim = stringTrim.trim;

  const NUMBER = 'Number';
  const NativeNumber = global_1[NUMBER];
  const NumberPrototype = NativeNumber.prototype;

  // Opera ~12 has broken Object#toString
  const BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

  // `ToNumber` abstract operation
  // https://tc39.es/ecma262/#sec-tonumber
  const toNumber = function (argument) {
    let it = toPrimitive(argument, false);
    let first, third, radix, maxCode, digits, length, index, code;
    if (typeof it === 'string' && it.length > 2) {
      it = trim(it);
      first = it.charCodeAt(0);
      if (first === 43 || first === 45) {
        third = it.charCodeAt(2);
        if (third === 88 || third === 120) return Number.NaN; // Number('+0x1') should be NaN, old V8 fix
      } else if (first === 48) {
        switch (it.charCodeAt(1)) {
          case 66:
          case 98:
            radix = 2;
            maxCode = 49;
            break; // fast equal of /^0b[01]+$/i
          case 79:
          case 111:
            radix = 8;
            maxCode = 55;
            break; // fast equal of /^0o[0-7]+$/i
          default:
            return +it;
        }
        digits = it.slice(2);
        length = digits.length;
        for (index = 0; index < length; index++) {
          code = digits.charCodeAt(index);
          // parseInt parses a string to a first unavailable symbol
          // but ToNumber should return NaN if a string contains unavailable symbols
          if (code < 48 || code > maxCode) return Number.NaN;
        }
        return Number.parseInt(digits, radix);
      }
    }
    return +it;
  };

  // `Number` constructor
  // https://tc39.es/ecma262/#sec-number-constructor
  if (
    isForced_1(
      NUMBER,
      !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'),
    )
  ) {
    const NumberWrapper = function Number(value) {
      const it = arguments.length === 0 ? 0 : value;
      const dummy = this;
      return dummy instanceof NumberWrapper &&
        // check on 1..constructor(foo) case
        (BROKEN_CLASSOF
          ? fails(() => {
              NumberPrototype.valueOf.call(dummy);
            })
          : classofRaw(dummy) != NUMBER)
        ? inheritIfRequired(
            new NativeNumber(toNumber(it)),
            dummy,
            NumberWrapper,
          )
        : toNumber(it);
    };
    for (
      var keys$1 = descriptors
          ? getOwnPropertyNames(NativeNumber)
          : // ES3:
            (
              'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
              // ES2015 (in case, if modules with ES2015 Number statics required before):
              'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
              'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
              // ESNext
              'fromString,range'
            ).split(','),
        j = 0,
        key;
      keys$1.length > j;
      j++
    ) {
      if (has(NativeNumber, (key = keys$1[j])) && !has(NumberWrapper, key)) {
        defineProperty$3(
          NumberWrapper,
          key,
          getOwnPropertyDescriptor$2(NativeNumber, key),
        );
      }
    }
    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    redefine(global_1, NUMBER, NumberWrapper);
  }

  const nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;

  const FAILS_ON_PRIMITIVES$2 = fails(() => {
    nativeGetOwnPropertyDescriptor$1(1);
  });
  const FORCED$1 = !descriptors || FAILS_ON_PRIMITIVES$2;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  _export(
    { target: 'Object', stat: true, forced: FORCED$1, sham: !descriptors },
    {
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
        return nativeGetOwnPropertyDescriptor$1(toIndexedObject(it), key);
      },
    },
  );

  const nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

  const toString$1 = {}.toString;

  const windowNames =
    typeof window === 'object' && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window)
      : [];

  const getWindowNames = function (it) {
    try {
      return nativeGetOwnPropertyNames(it);
    } catch {
      return windowNames.slice();
    }
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
  const f$5 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]'
      ? getWindowNames(it)
      : nativeGetOwnPropertyNames(toIndexedObject(it));
  };

  const objectGetOwnPropertyNamesExternal = {
    f: f$5,
  };

  const nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;

  const FAILS_ON_PRIMITIVES$3 = fails(() => {
    return !Object.getOwnPropertyNames(1);
  });

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  _export(
    { target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3 },
    {
      getOwnPropertyNames: nativeGetOwnPropertyNames$1,
    },
  );

  const MATCH = wellKnownSymbol('match');

  // `IsRegExp` abstract operation
  // https://tc39.es/ecma262/#sec-isregexp
  const isRegexp = function (it) {
    let isRegExp;
    return (
      isObject(it) &&
      ((isRegExp = it[MATCH]) !== undefined
        ? !!isRegExp
        : classofRaw(it) == 'RegExp')
    );
  };

  const SPECIES$3 = wellKnownSymbol('species');

  const setSpecies = function (CONSTRUCTOR_NAME) {
    const Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    const defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES$3]) {
      defineProperty(Constructor, SPECIES$3, {
        configurable: true,
        get () {
          return this;
        },
      });
    }
  };

  const defineProperty$4 = objectDefineProperty.f;
  const getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;

  const setInternalState = internalState.set;

  const MATCH$1 = wellKnownSymbol('match');
  const NativeRegExp = global_1.RegExp;
  const RegExpPrototype$1 = NativeRegExp.prototype;
  const re1 = /a/g;
  const re2 = /a/g;

  // "new" should create a new object, old webkit bug
  const CORRECT_NEW = new NativeRegExp(re1) !== re1;

  const UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;

  const FORCED$2 =
    descriptors &&
    isForced_1(
      'RegExp',
      !CORRECT_NEW ||
        UNSUPPORTED_Y$2 ||
        fails(() => {
          re2[MATCH$1] = false;
          // RegExp constructor can alter flags and IsRegExp works correct with @@match
          return (
            NativeRegExp(re1) != re1 ||
            NativeRegExp(re2) == re2 ||
            NativeRegExp(re1, 'i') != '/a/i'
          );
        }),
    );

  // `RegExp` constructor
  // https://tc39.es/ecma262/#sec-regexp-constructor
  if (FORCED$2) {
    const RegExpWrapper = function RegExp(pattern, flags) {
      const thisIsRegExp = this instanceof RegExpWrapper;
      const patternIsRegExp = isRegexp(pattern);
      const flagsAreUndefined = flags === undefined;
      let sticky;

      if (
        !thisIsRegExp &&
        patternIsRegExp &&
        pattern.constructor === RegExpWrapper &&
        flagsAreUndefined
      ) {
        return pattern;
      }

      if (CORRECT_NEW) {
        if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
      } else if (pattern instanceof RegExpWrapper) {
        if (flagsAreUndefined) flags = regexpFlags.call(pattern);
        pattern = pattern.source;
      }

      if (UNSUPPORTED_Y$2) {
        sticky = !!flags && flags.includes('y');
        if (sticky) flags = flags.replaceAll('y', '');
      }

      let result = inheritIfRequired(
        CORRECT_NEW
          ? new NativeRegExp(pattern, flags)
          : NativeRegExp(pattern, flags),
        thisIsRegExp ? this : RegExpPrototype$1,
        RegExpWrapper,
      );

      if (UNSUPPORTED_Y$2 && sticky) setInternalState(result, { sticky });

      return result;
    };
    const proxy = function (key) {
      key in RegExpWrapper ||
        defineProperty$4(RegExpWrapper, key, {
          configurable: true,
          get () {
            return NativeRegExp[key];
          },
          set (it) {
            NativeRegExp[key] = it;
          },
        });
    };
    const keys$2 = getOwnPropertyNames$1(NativeRegExp);
    let index = 0;
    while (keys$2.length > index) proxy(keys$2[index++]);
    RegExpPrototype$1.constructor = RegExpWrapper;
    RegExpWrapper.prototype = RegExpPrototype$1;
    redefine(global_1, 'RegExp', RegExpWrapper);
  }

  // https://tc39.es/ecma262/#sec-get-regexp-@@species
  setSpecies('RegExp');

  // `String.prototype.{ codePointAt, at }` methods implementation
  const createMethod$4 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      const S = String(requireObjectCoercible($this));
      const position = toInteger(pos);
      const size = S.length;
      let first, second;
      if (position < 0 || position >= size)
        return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 ||
        first > 0xDBFF ||
        position + 1 === size ||
        (second = S.charCodeAt(position + 1)) < 0xDC00 ||
        second > 0xDFFF
        ? CONVERT_TO_STRING
          ? S.charAt(position)
          : first
        : CONVERT_TO_STRING
        ? S.slice(position, position + 2)
        : ((first - 0xD800) << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  const stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$4(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$4(true),
  };

  const charAt = stringMultibyte.charAt;

  // `AdvanceStringIndex` abstract operation
  // https://tc39.es/ecma262/#sec-advancestringindex
  const advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? charAt(S, index).length : 1);
  };

  // @@match logic
  fixRegexpWellKnownSymbolLogic(
    'match',
    1,
    (MATCH, nativeMatch, maybeCallNative) => {
      return [
        // `String.prototype.match` method
        // https://tc39.es/ecma262/#sec-string.prototype.match
        function match(regexp) {
          const O = requireObjectCoercible(this);
          const matcher = regexp == undefined ? undefined : regexp[MATCH];
          return matcher !== undefined
            ? matcher.call(regexp, O)
            : new RegExp(regexp)[MATCH](String(O));
        },
        // `RegExp.prototype[@@match]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
        function (regexp) {
          const res = maybeCallNative(nativeMatch, regexp, this);
          if (res.done) return res.value;

          const rx = anObject(regexp);
          const S = String(this);

          if (!rx.global) return regexpExecAbstract(rx, S);

          const fullUnicode = rx.unicode;
          rx.lastIndex = 0;
          const A = [];
          let n = 0;
          let result;
          while ((result = regexpExecAbstract(rx, S)) !== null) {
            const matchStr = String(result[0]);
            A[n] = matchStr;
            if (matchStr === '')
              rx.lastIndex = advanceStringIndex(
                S,
                toLength(rx.lastIndex),
                fullUnicode,
              );
            n++;
          }
          return n === 0 ? null : A;
        },
      ];
    },
  );

  const floor$1 = Math.floor;
  const replace = ''.replace;
  const SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
  const SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

  // https://tc39.es/ecma262/#sec-getsubstitution
  const getSubstitution = function (
    matched,
    str,
    position,
    captures,
    namedCaptures,
    replacement,
  ) {
    const tailPos = position + matched.length;
    const m = captures.length;
    let symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return replace.call(replacement, symbols, (match, ch) => {
      let capture;
      switch (ch.charAt(0)) {
        case '$':
          return '$';
        case '&':
          return matched;
        case '`':
          return str.slice(0, position);
        case "'":
          return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            const f = floor$1(n / 10);
            if (f === 0) return match;
            if (f <= m)
              return captures[f - 1] === undefined
                ? ch.charAt(1)
                : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  };

  const max$2 = Math.max;
  const min$3 = Math.min;

  const maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // @@replace logic
  fixRegexpWellKnownSymbolLogic(
    'replace',
    2,
    (REPLACE, nativeReplace, maybeCallNative, reason) => {
      const REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE =
        reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
      const REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
      const UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
        ? '$'
        : '$0';

      return [
        // `String.prototype.replace` method
        // https://tc39.es/ecma262/#sec-string.prototype.replace
        function replace(searchValue, replaceValue) {
          const O = requireObjectCoercible(this);
          const replacer =
            searchValue == undefined ? undefined : searchValue[REPLACE];
          return replacer !== undefined
            ? replacer.call(searchValue, O, replaceValue)
            : nativeReplace.call(String(O), searchValue, replaceValue);
        },
        // `RegExp.prototype[@@replace]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
        function (regexp, replaceValue) {
          if (
            (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE &&
              REPLACE_KEEPS_$0) ||
            (typeof replaceValue === 'string' &&
              !replaceValue.includes(UNSAFE_SUBSTITUTE))
          ) {
            const res = maybeCallNative(
              nativeReplace,
              regexp,
              this,
              replaceValue,
            );
            if (res.done) return res.value;
          }

          const rx = anObject(regexp);
          const S = String(this);

          const functionalReplace = typeof replaceValue === 'function';
          if (!functionalReplace) replaceValue = String(replaceValue);

          const global = rx.global;
          if (global) {
            var fullUnicode = rx.unicode;
            rx.lastIndex = 0;
          }
          const results = [];
          while (true) {
            var result = regexpExecAbstract(rx, S);
            if (result === null) break;

            results.push(result);
            if (!global) break;

            const matchStr = String(result[0]);
            if (matchStr === '')
              rx.lastIndex = advanceStringIndex(
                S,
                toLength(rx.lastIndex),
                fullUnicode,
              );
          }

          let accumulatedResult = '';
          let nextSourcePosition = 0;
          for (const result_ of results) {
            result = result_;

            const matched = String(result[0]);
            const position = max$2(min$3(toInteger(result.index), S.length), 0);
            const captures = [];
            // NOTE: This is equivalent to
            //   captures = result.slice(1).map(maybeToString)
            // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
            // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
            // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
            for (let j = 1; j < result.length; j++)
              captures.push(maybeToString(result[j]));
            const namedCaptures = result.groups;
            if (functionalReplace) {
              const replacerArgs = [matched].concat(captures, position, S);
              if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
              var replacement = String(
                replaceValue.apply(undefined, replacerArgs),
              );
            } else {
              replacement = getSubstitution(
                matched,
                S,
                position,
                captures,
                namedCaptures,
                replaceValue,
              );
            }
            if (position >= nextSourcePosition) {
              accumulatedResult +=
                S.slice(nextSourcePosition, position) + replacement;
              nextSourcePosition = position + matched.length;
            }
          }
          return accumulatedResult + S.slice(nextSourcePosition);
        },
      ];
    },
  );

  const SPECIES$4 = wellKnownSymbol('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-speciesconstructor
  const speciesConstructor = function (O, defaultConstructor) {
    const C = anObject(O).constructor;
    let S;
    return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined
      ? defaultConstructor
      : aFunction$1(S);
  };

  const arrayPush = [].push;
  const min$4 = Math.min;
  const MAX_UINT32 = 0xFFFFFFFF;

  // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
  const SUPPORTS_Y = !fails(() => {
    return !new RegExp(MAX_UINT32, 'y');
  });

  // @@split logic
  fixRegexpWellKnownSymbolLogic(
    'split',
    2,
    (SPLIT, nativeSplit, maybeCallNative) => {
      let internalSplit;
      if (
        'abbc'.split(/(b)*/)[1] == 'c' ||
        'test'.split(/(?:)/, -1).length != 4 ||
        'ab'.split(/(?:ab)*/).length != 2 ||
        '.'.split(/(.?)(.?)/).length != 4 ||
        '.'.split(/()()/).length > 1 ||
        ''.split(/.?/).length > 0
      ) {
        // based on es5-shim implementation, need to rework it
        internalSplit = function (separator, limit) {
          const string = String(requireObjectCoercible(this));
          const lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
          if (lim === 0) return [];
          if (separator === undefined) return [string];
          // If `separator` is not a regex, use native split
          if (!isRegexp(separator)) {
            return nativeSplit.call(string, separator, lim);
          }
          const output = [];
          const flags =
            (separator.ignoreCase ? 'i' : '') +
            (separator.multiline ? 'm' : '') +
            (separator.unicode ? 'u' : '') +
            (separator.sticky ? 'y' : '');
          let lastLastIndex = 0;
          // Make `global` and avoid `lastIndex` issues by working with a copy
          const separatorCopy = new RegExp(separator.source, `${flags}g`);
          let match, lastIndex, lastLength;
          while ((match = regexpExec.call(separatorCopy, string))) {
            lastIndex = separatorCopy.lastIndex;
            if (lastIndex > lastLastIndex) {
              output.push(string.slice(lastLastIndex, match.index));
              if (match.length > 1 && match.index < string.length)
                arrayPush.apply(output, match.slice(1));
              lastLength = match[0].length;
              lastLastIndex = lastIndex;
              if (output.length >= lim) break;
            }
            if (separatorCopy.lastIndex === match.index)
              separatorCopy.lastIndex++; // Avoid an infinite loop
          }
          if (lastLastIndex === string.length) {
            if (lastLength || !separatorCopy.test('')) output.push('');
          } else output.push(string.slice(lastLastIndex));
          return output.length > lim ? output.slice(0, lim) : output;
        };
        // Chakra, V8
      } else if ('0'.split(undefined, 0).length > 0) {
        internalSplit = function (separator, limit) {
          return separator === undefined && limit === 0
            ? []
            : nativeSplit.call(this, separator, limit);
        };
      } else internalSplit = nativeSplit;

      return [
        // `String.prototype.split` method
        // https://tc39.es/ecma262/#sec-string.prototype.split
        function split(separator, limit) {
          const O = requireObjectCoercible(this);
          const splitter =
            separator == undefined ? undefined : separator[SPLIT];
          return splitter !== undefined
            ? splitter.call(separator, O, limit)
            : internalSplit.call(String(O), separator, limit);
        },
        // `RegExp.prototype[@@split]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
        //
        // NOTE: This cannot be properly polyfilled in engines that don't support
        // the 'y' flag.
        function (regexp, limit) {
          const res = maybeCallNative(
            internalSplit,
            regexp,
            this,
            limit,
            internalSplit !== nativeSplit,
          );
          if (res.done) return res.value;

          const rx = anObject(regexp);
          const S = String(this);
          const C = speciesConstructor(rx, RegExp);

          const unicodeMatching = rx.unicode;
          const flags =
            (rx.ignoreCase ? 'i' : '') +
            (rx.multiline ? 'm' : '') +
            (rx.unicode ? 'u' : '') +
            (SUPPORTS_Y ? 'y' : 'g');

          // ^(? + rx + ) is needed, in combination with some S slicing, to
          // simulate the 'y' flag.
          const splitter = new C(
            SUPPORTS_Y ? rx : `^(?:${  rx.source  })`,
            flags,
          );
          const lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
          if (lim === 0) return [];
          if (S.length === 0)
            return regexpExecAbstract(splitter, S) === null ? [S] : [];
          let p = 0;
          let q = 0;
          const A = [];
          while (q < S.length) {
            splitter.lastIndex = SUPPORTS_Y ? q : 0;
            const z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
            var e;
            if (
              z === null ||
              (e = min$4(
                toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)),
                S.length,
              )) === p
            ) {
              q = advanceStringIndex(S, q, unicodeMatching);
            } else {
              A.push(S.slice(p, q));
              if (A.length === lim) return A;
              for (let i = 1; i <= z.length - 1; i++) {
                A.push(z[i]);
                if (A.length === lim) return A;
              }
              q = p = e;
            }
          }
          A.push(S.slice(p));
          return A;
        },
      ];
    },
    !SUPPORTS_Y,
  );

  function _typeof(obj) {
    '@babel/helpers - typeof';

    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _asyncIterator(iterable) {
    let method;

    if (typeof Symbol !== 'undefined') {
      if (Symbol.asyncIterator) {
        method = iterable[Symbol.asyncIterator];
        if (method != null) return method.call(iterable);
      }

      if (Symbol.iterator) {
        method = iterable[Symbol.iterator];
        if (method != null) return method.call(iterable);
      }
    }

    throw new TypeError('Object is not async iterable');
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      const self = this,
        args = arguments;
      return new Promise((resolve, reject) => {
        const gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(
            gen,
            resolve,
            reject,
            _next,
            _throw,
            'next',
            value,
          );
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys$1(object, enumerableOnly) {
    const keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      let symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(sym => {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (let i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys$1(new Object(source), true).forEach(key => {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source),
        );
      } else {
        ownKeys$1(new Object(source)).forEach(key => {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key),
          );
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function');
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true,
      },
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf =
      Object.setPrototypeOf ||
      function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === 'function') return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], () => {}));
      return true;
    } catch {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === 'object' || typeof call === 'function')) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    const hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      let Super = _getPrototypeOf(Derived),
        result;

      if (hasNativeReflectConstruct) {
        const NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Reflect.apply(Super, this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _toConsumableArray(arr) {
    return (
      _arrayWithoutHoles(arr) ||
      _iterableToArray(arr) ||
      _unsupportedIterableToArray(arr) ||
      _nonIterableSpread()
    );
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== 'undefined' && Symbol.iterator in new Object(iter))
      return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
    let n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === 'Object' && o.constructor) n = o.constructor.name;
    if (n === 'Map' || n === 'Set') return Array.from(o);
    if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError(
      'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
    );
  }

  const f$6 = wellKnownSymbol;

  const wellKnownSymbolWrapped = {
    f: f$6,
  };

  const defineProperty$5 = objectDefineProperty.f;

  const defineWellKnownSymbol = function (NAME) {
    const Symbol = path.Symbol || (path.Symbol = {});
    if (!has(Symbol, NAME))
      defineProperty$5(Symbol, NAME, {
        value: wellKnownSymbolWrapped.f(NAME),
      });
  };

  const defineProperty$6 = objectDefineProperty.f;

  const TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

  const setToStringTag = function (it, TAG, STATIC) {
    if (it && !has((it = STATIC ? it : it.prototype), TO_STRING_TAG$2)) {
      defineProperty$6(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
    }
  };

  const $forEach$1 = arrayIteration.forEach;

  const HIDDEN = sharedKey('hidden');
  const SYMBOL = 'Symbol';
  const PROTOTYPE$1 = 'prototype';
  const TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
  const setInternalState$1 = internalState.set;
  const getInternalState = internalState.getterFor(SYMBOL);
  const ObjectPrototype$1 = Object[PROTOTYPE$1];
  let $Symbol = global_1.Symbol;
  const $stringify = getBuiltIn('JSON', 'stringify');
  const nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
  const nativeDefineProperty$1 = objectDefineProperty.f;
  const nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;
  const nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
  const AllSymbols = shared('symbols');
  const ObjectPrototypeSymbols = shared('op-symbols');
  const StringToSymbolRegistry = shared('string-to-symbol-registry');
  const SymbolToStringRegistry = shared('symbol-to-string-registry');
  const WellKnownSymbolsStore$1 = shared('wks');
  const QObject = global_1.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  let USE_SETTER =
    !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  const setSymbolDescriptor =
    descriptors &&
    fails(() => {
      return (
        objectCreate(
          nativeDefineProperty$1({}, 'a', {
            get () {
              return nativeDefineProperty$1(this, 'a', { value: 7 }).a;
            },
          }),
        ).a != 7
      );
    })
      ? function (O, P, Attributes) {
          let ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$2(
            ObjectPrototype$1,
            P,
          );
          if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
          nativeDefineProperty$1(O, P, Attributes);
          if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
            nativeDefineProperty$1(
              ObjectPrototype$1,
              P,
              ObjectPrototypeDescriptor,
            );
          }
        }
      : nativeDefineProperty$1;

  const wrap = function (tag, description) {
    let symbol = (AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]));
    setInternalState$1(symbol, {
      type: SYMBOL,
      tag,
      description,
    });
    if (!descriptors) symbol.description = description;
    return symbol;
  };

  const isSymbol = useSymbolAsUid
    ? function (it) {
        return typeof it === 'symbol';
      }
    : function (it) {
        return new Object(it) instanceof $Symbol;
      };

  const $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype$1)
      $defineProperty(ObjectPrototypeSymbols, P, Attributes);
    anObject(O);
    const key = toPrimitive(P, true);
    anObject(Attributes);
    if (has(AllSymbols, key)) {
      if (!Attributes.enumerable) {
        if (!has(O, HIDDEN))
          nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
        O[HIDDEN][key] = true;
      } else {
        if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
        Attributes = objectCreate(Attributes, {
          enumerable: createPropertyDescriptor(0, false),
        });
      }
      return setSymbolDescriptor(O, key, Attributes);
    }
    return nativeDefineProperty$1(O, key, Attributes);
  };

  const $defineProperties = function defineProperties(O, Properties) {
    anObject(O);
    const properties = toIndexedObject(Properties);
    let keys = objectKeys(properties).concat(
      $getOwnPropertySymbols(properties),
    );
    $forEach$1(keys, key => {
      if (!descriptors || $propertyIsEnumerable.call(properties, key))
        $defineProperty(O, key, properties[key]);
    });
    return O;
  };

  const $create = function create(O, Properties) {
    return Properties === undefined
      ? objectCreate(O)
      : $defineProperties(objectCreate(O), Properties);
  };

  var $propertyIsEnumerable = function propertyIsEnumerable(V) {
    const P = toPrimitive(V, true);
    const enumerable = nativePropertyIsEnumerable$1.call(this, P);
    if (
      this === ObjectPrototype$1 &&
      has(AllSymbols, P) &&
      !has(ObjectPrototypeSymbols, P)
    )
      return false;
    return enumerable ||
      !has(this, P) ||
      !has(AllSymbols, P) ||
      (has(this, HIDDEN) && this[HIDDEN][P])
      ? enumerable
      : true;
  };

  const $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    const it = toIndexedObject(O);
    const key = toPrimitive(P, true);
    if (
      it === ObjectPrototype$1 &&
      has(AllSymbols, key) &&
      !has(ObjectPrototypeSymbols, key)
    )
      return;
    const descriptor = nativeGetOwnPropertyDescriptor$2(it, key);
    if (
      descriptor &&
      has(AllSymbols, key) &&
      !(has(it, HIDDEN) && it[HIDDEN][key])
    ) {
      descriptor.enumerable = true;
    }
    return descriptor;
  };

  const $getOwnPropertyNames = function getOwnPropertyNames(O) {
    const names = nativeGetOwnPropertyNames$2(toIndexedObject(O));
    const result = [];
    $forEach$1(names, key => {
      if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
    });
    return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
    const IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
    const names = nativeGetOwnPropertyNames$2(
      IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O),
    );
    const result = [];
    $forEach$1(names, key => {
      if (
        has(AllSymbols, key) &&
        (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))
      ) {
        result.push(AllSymbols[key]);
      }
    });
    return result;
  };

  // `Symbol` constructor
  // https://tc39.es/ecma262/#sec-symbol-constructor
  if (!nativeSymbol) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol)
        throw new TypeError('Symbol is not a constructor');
      const description =
        arguments.length === 0 || arguments[0] === undefined
          ? undefined
          : String(arguments[0]);
      const tag = uid(description);
      const setter = function (value) {
        if (this === ObjectPrototype$1)
          setter.call(ObjectPrototypeSymbols, value);
        if (has(this, HIDDEN) && has(this[HIDDEN], tag))
          this[HIDDEN][tag] = false;
        setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
      };
      if (descriptors && USE_SETTER)
        setSymbolDescriptor(ObjectPrototype$1, tag, {
          configurable: true,
          set: setter,
        });
      return wrap(tag, description);
    };

    redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
      return getInternalState(this).tag;
    });

    redefine($Symbol, 'withoutSetter', description => {
      return wrap(uid(description), description);
    });

    objectPropertyIsEnumerable.f = $propertyIsEnumerable;
    objectDefineProperty.f = $defineProperty;
    objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
    objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f =
      $getOwnPropertyNames;
    objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

    wellKnownSymbolWrapped.f = function (name) {
      return wrap(wellKnownSymbol(name), name);
    };

    if (descriptors) {
      // https://github.com/tc39/proposal-Symbol-description
      nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
        configurable: true,
        get: function description() {
          return getInternalState(this).description;
        },
      });
      {
        redefine(
          ObjectPrototype$1,
          'propertyIsEnumerable',
          $propertyIsEnumerable,
          { unsafe: true },
        );
      }
    }
  }

  _export(
    { global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol },
    {
      Symbol: $Symbol,
    },
  );

  $forEach$1(objectKeys(WellKnownSymbolsStore$1), name => {
    defineWellKnownSymbol(name);
  });

  _export(
    { target: SYMBOL, stat: true, forced: !nativeSymbol },
    {
      // `Symbol.for` method
      // https://tc39.es/ecma262/#sec-symbol.for
      for(key) {
        const string = String(key);
        if (has(StringToSymbolRegistry, string))
          return StringToSymbolRegistry[string];
        const symbol = $Symbol(string);
        StringToSymbolRegistry[string] = symbol;
        SymbolToStringRegistry[symbol] = string;
        return symbol;
      },
      // `Symbol.keyFor` method
      // https://tc39.es/ecma262/#sec-symbol.keyfor
      keyFor: function keyFor(sym) {
        if (!isSymbol(sym)) throw new TypeError(`${sym} is not a symbol`);
        if (has(SymbolToStringRegistry, sym))
          return SymbolToStringRegistry[sym];
      },
      useSetter() {
        USE_SETTER = true;
      },
      useSimple() {
        USE_SETTER = false;
      },
    },
  );

  _export(
    { target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors },
    {
      // `Object.create` method
      // https://tc39.es/ecma262/#sec-object.create
      create: $create,
      // `Object.defineProperty` method
      // https://tc39.es/ecma262/#sec-object.defineproperty
      defineProperty: $defineProperty,
      // `Object.defineProperties` method
      // https://tc39.es/ecma262/#sec-object.defineproperties
      defineProperties: $defineProperties,
      // `Object.getOwnPropertyDescriptor` method
      // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
      getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    },
  );

  _export(
    { target: 'Object', stat: true, forced: !nativeSymbol },
    {
      // `Object.getOwnPropertyNames` method
      // https://tc39.es/ecma262/#sec-object.getownpropertynames
      getOwnPropertyNames: $getOwnPropertyNames,
      // `Object.getOwnPropertySymbols` method
      // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
      getOwnPropertySymbols: $getOwnPropertySymbols,
    },
  );

  // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  _export(
    {
      target: 'Object',
      stat: true,
      forced: fails(() => {
        objectGetOwnPropertySymbols.f(1);
      }),
    },
    {
      getOwnPropertySymbols: function getOwnPropertySymbols(it) {
        return objectGetOwnPropertySymbols.f(toObject(it));
      },
    },
  );

  // `JSON.stringify` method behavior with symbols
  // https://tc39.es/ecma262/#sec-json.stringify
  if ($stringify) {
    const FORCED_JSON_STRINGIFY =
      !nativeSymbol ||
      fails(() => {
        const symbol = $Symbol();
        // MS Edge converts symbol values to JSON as {}
        return (
          $stringify([symbol]) != '[null]' ||
          // WebKit converts symbol values to JSON as null
          $stringify({ a: symbol }) != '{}' ||
          // V8 throws on boxed symbols
          $stringify(new Object(symbol)) != '{}'
        );
      });

    _export(
      { target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY },
      {
        // eslint-disable-next-line no-unused-vars
        stringify: function stringify(it, replacer, space) {
          const args = [it];
          let index = 1;
          let $replacer;
          while (arguments.length > index) args.push(arguments[index++]);
          $replacer = replacer;
          if ((!isObject(replacer) && it === undefined) || isSymbol(it)) return; // IE8 returns string on undefined
          if (!isArray(replacer))
            replacer = function (key, value) {
              if (typeof $replacer === 'function')
                value = $replacer.call(this, key, value);
              if (!isSymbol(value)) return value;
            };
          args[1] = replacer;
          return $stringify.apply(null, args);
        },
      },
    );
  }

  // `Symbol.prototype[@@toPrimitive]` method
  // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
  if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
    createNonEnumerableProperty(
      $Symbol[PROTOTYPE$1],
      TO_PRIMITIVE,
      $Symbol[PROTOTYPE$1].valueOf,
    );
  }
  // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
  setToStringTag($Symbol, SYMBOL);

  hiddenKeys[HIDDEN] = true;

  const defineProperty$7 = objectDefineProperty.f;

  const NativeSymbol = global_1.Symbol;

  if (
    descriptors &&
    typeof NativeSymbol === 'function' &&
    (!('description' in NativeSymbol.prototype) ||
      // Safari 12 bug
      NativeSymbol().description !== undefined)
  ) {
    const EmptyStringDescriptionStore = {};
    // wrap Symbol constructor for correct work with undefined description
    const SymbolWrapper = function Symbol() {
      let description =
        arguments.length === 0 || arguments[0] === undefined
          ? undefined
          : String(arguments[0]);
      let result =
        this instanceof SymbolWrapper
          ? new NativeSymbol(description)
          : // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
          description === undefined
          ? NativeSymbol()
          : NativeSymbol(description);
      if (description === '') EmptyStringDescriptionStore[result] = true;
      return result;
    };
    copyConstructorProperties(SymbolWrapper, NativeSymbol);
    const symbolPrototype = (SymbolWrapper.prototype = NativeSymbol.prototype);
    symbolPrototype.constructor = SymbolWrapper;

    const symbolToString = symbolPrototype.toString;
    const native = String(NativeSymbol('test')) == 'Symbol(test)';
    const regexp = /^Symbol\((.*)\)[^)]+$/;
    defineProperty$7(symbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        const symbol = isObject(this) ? this.valueOf() : this;
        const string = symbolToString.call(symbol);
        if (has(EmptyStringDescriptionStore, symbol)) return '';
        const desc = native
          ? string.slice(7, -1)
          : string.replace(regexp, '$1');
        return desc === '' ? undefined : desc;
      },
    });

    _export(
      { global: true, forced: true },
      {
        Symbol: SymbolWrapper,
      },
    );
  }

  // `Symbol.species` well-known symbol
  // https://tc39.es/ecma262/#sec-symbol.species
  defineWellKnownSymbol('species');

  // `Array.prototype.fill` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.fill
  const arrayFill = function fill(value /* , start = 0, end = @length */) {
    const O = toObject(this);
    const length = toLength(O.length);
    const argumentsLength = arguments.length;
    let index = toAbsoluteIndex(
      argumentsLength > 1 ? arguments[1] : undefined,
      length,
    );
    const end = argumentsLength > 2 ? arguments[2] : undefined;
    const endPos = end === undefined ? length : toAbsoluteIndex(end, length);
    while (endPos > index) O[index++] = value;
    return O;
  };

  const UNSCOPABLES = wellKnownSymbol('unscopables');
  const ArrayPrototype = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype[UNSCOPABLES] == undefined) {
    objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
      configurable: true,
      value: objectCreate(null),
    });
  }

  // add a key to Array.prototype[@@unscopables]
  const addToUnscopables = function (key) {
    ArrayPrototype[UNSCOPABLES][key] = true;
  };

  // `Array.prototype.fill` method
  // https://tc39.es/ecma262/#sec-array.prototype.fill
  _export(
    { target: 'Array', proto: true },
    {
      fill: arrayFill,
    },
  );

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('fill');

  const $includes = arrayIncludes.includes;

  const USES_TO_LENGTH$6 = arrayMethodUsesToLength('indexOf', {
    ACCESSORS: true,
    1: 0,
  });

  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  _export(
    { target: 'Array', proto: true, forced: !USES_TO_LENGTH$6 },
    {
      includes: function includes(el /* , fromIndex = 0 */) {
        return $includes(
          this,
          el,
          arguments.length > 1 ? arguments[1] : undefined,
        );
      },
    },
  );

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('includes');

  const iterators = {};

  const ITERATOR = wellKnownSymbol('iterator');
  let BUGGY_SAFARI_ITERATORS = false;

  const returnThis = function () {
    return this;
  };

  // `%IteratorPrototype%` object
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  let IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(
        objectGetPrototypeOf(arrayIterator),
      );
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
        IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  const NEW_ITERATOR_PROTOTYPE =
    IteratorPrototype == undefined ||
    fails(() => {
      const test = {};
      // FF44- legacy iterators case
      return IteratorPrototype[ITERATOR].call(test) !== test;
    });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if (!has(IteratorPrototype, ITERATOR)) {
    createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
  }

  const iteratorsCore = {
    IteratorPrototype,
    BUGGY_SAFARI_ITERATORS,
  };

  const IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

  const returnThis$1 = function () {
    return this;
  };

  const createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    const TO_STRING_TAG = `${NAME  } Iterator`;
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, {
      next: createPropertyDescriptor(1, next),
    });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  const IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
  const BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  const ITERATOR$1 = wellKnownSymbol('iterator');
  const KEYS = 'keys';
  const VALUES = 'values';
  const ENTRIES = 'entries';

  const returnThis$2 = function () {
    return this;
  };

  const defineIterator = function (
    Iterable,
    NAME,
    IteratorConstructor,
    next,
    DEFAULT,
    IS_SET,
    FORCED,
  ) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    const getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype)
        return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS:
          return function keys() {
            return new IteratorConstructor(this, KIND);
          };
        case VALUES:
          return function values() {
            return new IteratorConstructor(this, KIND);
          };
        case ENTRIES:
          return function entries() {
            return new IteratorConstructor(this, KIND);
          };
      }
      return function () {
        return new IteratorConstructor(this);
      };
    };

    const TO_STRING_TAG = `${NAME  } Iterator`;
    let INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    let nativeIterator =
      IterablePrototype[ITERATOR$1] ||
      IterablePrototype['@@iterator'] ||
      (DEFAULT && IterablePrototype[DEFAULT]);
    var defaultIterator =
      (!BUGGY_SAFARI_ITERATORS$1 && nativeIterator) ||
      getIterationMethod(DEFAULT);
    let anyNativeIterator =
      NAME == 'Array'
        ? IterablePrototype.entries || nativeIterator
        : nativeIterator;
    let CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(
        anyNativeIterator.call(new Iterable()),
      );
      if (
        IteratorPrototype$2 !== Object.prototype &&
        CurrentIteratorPrototype.next
      ) {
        if (
          objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2
        ) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
          } else if (
            typeof CurrentIteratorPrototype[ITERATOR$1] !== 'function'
          ) {
            createNonEnumerableProperty(
              CurrentIteratorPrototype,
              ITERATOR$1,
              returnThis$2,
            );
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() {
        return nativeIterator.call(this);
      };
    }

    // define iterator
    if (IterablePrototype[ITERATOR$1] !== defaultIterator) {
      createNonEnumerableProperty(
        IterablePrototype,
        ITERATOR$1,
        defaultIterator,
      );
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES),
      };
      if (FORCED)
        for (KEY in methods) {
          if (
            BUGGY_SAFARI_ITERATORS$1 ||
            INCORRECT_VALUES_NAME ||
            !(KEY in IterablePrototype)
          ) {
            redefine(IterablePrototype, KEY, methods[KEY]);
          }
        }
      else
        _export(
          {
            target: NAME,
            proto: true,
            forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME,
          },
          methods,
        );
    }

    return methods;
  };

  const ARRAY_ITERATOR = 'Array Iterator';
  const setInternalState$2 = internalState.set;
  const getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.es/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.es/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.es/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.es/ecma262/#sec-createarrayiterator
  const es_array_iterator = defineIterator(
    Array,
    'Array',
    function (iterated, kind) {
      setInternalState$2(this, {
        type: ARRAY_ITERATOR,
        target: toIndexedObject(iterated), // target
        index: 0, // next index
        kind, // kind
      });
      // `%ArrayIteratorPrototype%.next` method
      // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
    },
    function () {
      const state = getInternalState$1(this);
      const target = state.target;
      let kind = state.kind;
      const index = state.index++;
      if (!target || index >= target.length) {
        state.target = undefined;
        return { value: undefined, done: true };
      }
      if (kind == 'keys') return { value: index, done: false };
      if (kind == 'values') return { value: target[index], done: false };
      return { value: [index, target[index]], done: false };
    },
    'values',
  );

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.es/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  const min$5 = Math.min;
  const nativeLastIndexOf = [].lastIndexOf;
  const NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
  const STRICT_METHOD$4 = arrayMethodIsStrict('lastIndexOf');
  // For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
  const USES_TO_LENGTH$7 = arrayMethodUsesToLength('indexOf', {
    ACCESSORS: true,
    1: 0,
  });
  const FORCED$3 = NEGATIVE_ZERO$1 || !STRICT_METHOD$4 || !USES_TO_LENGTH$7;

  // `Array.prototype.lastIndexOf` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.lastindexof
  const arrayLastIndexOf = FORCED$3
    ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
        // convert -0 to +0
        if (NEGATIVE_ZERO$1)
          return Reflect.apply(nativeLastIndexOf, this, arguments) || 0;
        const O = toIndexedObject(this);
        const length = toLength(O.length);
        let index = length - 1;
        if (arguments.length > 1) index = min$5(index, toInteger(arguments[1]));
        if (index < 0) index = length + index;
        for (; index >= 0; index--)
          if (index in O && O[index] === searchElement) return index || 0;
        return -1;
      }
    : nativeLastIndexOf;

  // `Array.prototype.lastIndexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.lastindexof
  _export(
    {
      target: 'Array',
      proto: true,
      forced: arrayLastIndexOf !== [].lastIndexOf,
    },
    {
      lastIndexOf: arrayLastIndexOf,
    },
  );

  const HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('slice');
  const USES_TO_LENGTH$8 = arrayMethodUsesToLength('slice', {
    ACCESSORS: true,
    0: 0,
    1: 2,
  });

  const SPECIES$5 = wellKnownSymbol('species');
  const nativeSlice = [].slice;
  const max$3 = Math.max;

  // `Array.prototype.slice` method
  // https://tc39.es/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  _export(
    {
      target: 'Array',
      proto: true,
      forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$8,
    },
    {
      slice: function slice(start, end) {
        const O = toIndexedObject(this);
        const length = toLength(O.length);
        let k = toAbsoluteIndex(start, length);
        const fin = toAbsoluteIndex(end === undefined ? length : end, length);
        // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
        let Constructor, result, n;
        if (isArray(O)) {
          Constructor = O.constructor;
          // cross-realm fallback
          if (
            typeof Constructor === 'function' &&
            (Constructor === Array || isArray(Constructor.prototype))
          ) {
            Constructor = undefined;
          } else if (isObject(Constructor)) {
            Constructor = Constructor[SPECIES$5];
            if (Constructor === null) Constructor = undefined;
          }
          if (Constructor === Array || Constructor === undefined) {
            return nativeSlice.call(O, k, fin);
          }
        }
        result = new (Constructor === undefined ? Array : Constructor)(
          max$3(fin - k, 0),
        );
        for (n = 0; k < fin; k++, n++)
          if (k in O) createProperty(result, n, O[k]);
        result.length = n;
        return result;
      },
    },
  );

  // `Array[@@species]` getter
  // https://tc39.es/ecma262/#sec-get-array-@@species
  setSpecies('Array');

  const arrayBufferNative =
    typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

  const redefineAll = function (target, src, options) {
    for (const key in src) redefine(target, key, src[key], options);
    return target;
  };

  const anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw new TypeError(`Incorrect ${name ? name + ' ' : ''}invocation`);
    }
    return it;
  };

  // `ToIndex` abstract operation
  // https://tc39.es/ecma262/#sec-toindex
  const toIndex = function (it) {
    if (it === undefined) return 0;
    const number = toInteger(it);
    const length = toLength(number);
    if (number !== length) throw new RangeError('Wrong length or index');
    return length;
  };

  // IEEE754 conversions based on https://github.com/feross/ieee754
  // eslint-disable-next-line no-shadow-restricted-names
  const Infinity$1 = 1 / 0;
  const abs = Math.abs;
  const pow = Math.pow;
  const floor$2 = Math.floor;
  const log = Math.log;
  const LN2 = Math.LN2;

  const pack = function (number, mantissaLength, bytes) {
    const buffer = new Array(bytes);
    let exponentLength = bytes * 8 - mantissaLength - 1;
    const eMax = (1 << exponentLength) - 1;
    const eBias = eMax >> 1;
    const rt = mantissaLength === 23 ? 2**-24 - 2**-77 : 0;
    let sign = number < 0 || (number === 0 && 1 / number < 0) ? 1 : 0;
    let index = 0;
    let exponent, mantissa, c;
    number = abs(number);
    // eslint-disable-next-line no-self-compare
    if (number != number || number === Infinity$1) {
      // eslint-disable-next-line no-self-compare
      mantissa = number != number ? 1 : 0;
      exponent = eMax;
    } else {
      exponent = floor$2(log(number) / LN2);
      if (number * (c = 2 ** -exponent) < 1) {
        exponent--;
        c *= 2;
      }
      if (exponent + eBias >= 1) {
        number += rt / c;
      } else {
        number += rt * 2 ** (1 - eBias);
      }
      if (number * c >= 2) {
        exponent++;
        c /= 2;
      }
      if (exponent + eBias >= eMax) {
        mantissa = 0;
        exponent = eMax;
      } else if (exponent + eBias >= 1) {
        mantissa = (number * c - 1) * 2 ** mantissaLength;
        exponent = exponent + eBias;
      } else {
        mantissa = number * 2 ** (eBias - 1) * 2 ** mantissaLength;
        exponent = 0;
      }
    }
    for (
      ;
      mantissaLength >= 8;
      buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8
    );
    exponent = (exponent << mantissaLength) | mantissa;
    exponentLength += mantissaLength;
    for (
      ;
      exponentLength > 0;
      buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8
    );
    buffer[--index] |= sign * 128;
    return buffer;
  };

  const unpack = function (buffer, mantissaLength) {
    const bytes = buffer.length;
    const exponentLength = bytes * 8 - mantissaLength - 1;
    const eMax = (1 << exponentLength) - 1;
    const eBias = eMax >> 1;
    let nBits = exponentLength - 7;
    let index = bytes - 1;
    let sign = buffer[index--];
    let exponent = sign & 127;
    let mantissa;
    sign >>= 7;
    for (
      ;
      nBits > 0;
      exponent = exponent * 256 + buffer[index], index--, nBits -= 8
    );
    mantissa = exponent & ((1 << -nBits) - 1);
    exponent >>= -nBits;
    nBits += mantissaLength;
    for (
      ;
      nBits > 0;
      mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8
    );
    if (exponent === 0) {
      exponent = 1 - eBias;
    } else if (exponent === eMax) {
      return mantissa ? Number.NaN : sign ? -Infinity$1 : Infinity$1;
    } else {
      mantissa = mantissa + 2 ** mantissaLength;
      exponent = exponent - eBias;
    }
    return (sign ? -1 : 1) * mantissa * 2 ** (exponent - mantissaLength);
  };

  const ieee754 = {
    pack,
    unpack,
  };

  const getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
  const defineProperty$8 = objectDefineProperty.f;

  const getInternalState$2 = internalState.get;
  const setInternalState$3 = internalState.set;
  const ARRAY_BUFFER = 'ArrayBuffer';
  const DATA_VIEW = 'DataView';
  const PROTOTYPE$2 = 'prototype';
  const WRONG_LENGTH = 'Wrong length';
  const WRONG_INDEX = 'Wrong index';
  const NativeArrayBuffer = global_1[ARRAY_BUFFER];
  let $ArrayBuffer = NativeArrayBuffer;
  let $DataView = global_1[DATA_VIEW];
  const $DataViewPrototype = $DataView && $DataView[PROTOTYPE$2];
  const ObjectPrototype$2 = Object.prototype;
  const RangeError$1 = global_1.RangeError;

  const packIEEE754 = ieee754.pack;
  const unpackIEEE754 = ieee754.unpack;

  const packInt8 = function (number) {
    return [number & 0xFF];
  };

  const packInt16 = function (number) {
    return [number & 0xFF, (number >> 8) & 0xFF];
  };

  const packInt32 = function (number) {
    return [
      number & 0xFF,
      (number >> 8) & 0xFF,
      (number >> 16) & 0xFF,
      (number >> 24) & 0xFF,
    ];
  };

  const unpackInt32 = function (buffer) {
    return (buffer[3] << 24) | (buffer[2] << 16) | (buffer[1] << 8) | buffer[0];
  };

  const packFloat32 = function (number) {
    return packIEEE754(number, 23, 4);
  };

  const packFloat64 = function (number) {
    return packIEEE754(number, 52, 8);
  };

  const addGetter = function (Constructor, key) {
    defineProperty$8(Constructor[PROTOTYPE$2], key, {
      get () {
        return getInternalState$2(this)[key];
      },
    });
  };

  const get$1 = function (view, count, index, isLittleEndian) {
    const intIndex = toIndex(index);
    const store = getInternalState$2(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    const bytes = getInternalState$2(store.buffer).bytes;
    const start = intIndex + store.byteOffset;
    const pack = bytes.slice(start, start + count);
    return isLittleEndian ? pack : pack.reverse();
  };

  const set$1 = function (view, count, index, conversion, value, isLittleEndian) {
    const intIndex = toIndex(index);
    const store = getInternalState$2(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    const bytes = getInternalState$2(store.buffer).bytes;
    const start = intIndex + store.byteOffset;
    const pack = conversion(+value);
    for (let i = 0; i < count; i++)
      bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
  };

  if (!arrayBufferNative) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
      const byteLength = toIndex(length);
      setInternalState$3(this, {
        bytes: arrayFill.call(new Array(byteLength), 0),
        byteLength,
      });
      if (!descriptors) this.byteLength = byteLength;
    };

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      anInstance(this, $DataView, DATA_VIEW);
      anInstance(buffer, $ArrayBuffer, DATA_VIEW);
      const bufferLength = getInternalState$2(buffer).byteLength;
      const offset = toInteger(byteOffset);
      if (offset < 0 || offset > bufferLength)
        throw RangeError$1('Wrong offset');
      byteLength =
        byteLength === undefined ? bufferLength - offset : toLength(byteLength);
      if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
      setInternalState$3(this, {
        buffer,
        byteLength,
        byteOffset: offset,
      });
      if (!descriptors) {
        this.buffer = buffer;
        this.byteLength = byteLength;
        this.byteOffset = offset;
      }
    };

    if (descriptors) {
      addGetter($ArrayBuffer, 'byteLength');
      addGetter($DataView, 'buffer');
      addGetter($DataView, 'byteLength');
      addGetter($DataView, 'byteOffset');
    }

    redefineAll($DataView[PROTOTYPE$2], {
      getInt8: function getInt8(byteOffset) {
        return (get$1(this, 1, byteOffset)[0] << 24) >> 24;
      },
      getUint8: function getUint8(byteOffset) {
        return get$1(this, 1, byteOffset)[0];
      },
      getInt16: function getInt16(byteOffset /* , littleEndian */) {
        const bytes = get$1(
          this,
          2,
          byteOffset,
          arguments.length > 1 ? arguments[1] : undefined,
        );
        return (((bytes[1] << 8) | bytes[0]) << 16) >> 16;
      },
      getUint16: function getUint16(byteOffset /* , littleEndian */) {
        const bytes = get$1(
          this,
          2,
          byteOffset,
          arguments.length > 1 ? arguments[1] : undefined,
        );
        return (bytes[1] << 8) | bytes[0];
      },
      getInt32: function getInt32(byteOffset /* , littleEndian */) {
        return unpackInt32(
          get$1(
            this,
            4,
            byteOffset,
            arguments.length > 1 ? arguments[1] : undefined,
          ),
        );
      },
      getUint32: function getUint32(byteOffset /* , littleEndian */) {
        return (
          unpackInt32(
            get$1(
              this,
              4,
              byteOffset,
              arguments.length > 1 ? arguments[1] : undefined,
            ),
          ) >>> 0
        );
      },
      getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
        return unpackIEEE754(
          get$1(
            this,
            4,
            byteOffset,
            arguments.length > 1 ? arguments[1] : undefined,
          ),
          23,
        );
      },
      getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
        return unpackIEEE754(
          get$1(
            this,
            8,
            byteOffset,
            arguments.length > 1 ? arguments[1] : undefined,
          ),
          52,
        );
      },
      setInt8: function setInt8(byteOffset, value) {
        set$1(this, 1, byteOffset, packInt8, value);
      },
      setUint8: function setUint8(byteOffset, value) {
        set$1(this, 1, byteOffset, packInt8, value);
      },
      setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          2,
          byteOffset,
          packInt16,
          value,
          arguments.length > 2 ? arguments[2] : undefined,
        );
      },
      setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          2,
          byteOffset,
          packInt16,
          value,
          arguments.length > 2 ? arguments[2] : undefined,
        );
      },
      setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          4,
          byteOffset,
          packInt32,
          value,
          arguments.length > 2 ? arguments[2] : undefined,
        );
      },
      setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          4,
          byteOffset,
          packInt32,
          value,
          arguments.length > 2 ? arguments[2] : undefined,
        );
      },
      setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          4,
          byteOffset,
          packFloat32,
          value,
          arguments.length > 2 ? arguments[2] : undefined,
        );
      },
      setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          8,
          byteOffset,
          packFloat64,
          value,
          arguments.length > 2 ? arguments[2] : undefined,
        );
      },
    });
  } else {
    if (
      !fails(() => {
        NativeArrayBuffer(1);
      }) ||
      !fails(() => {
        new NativeArrayBuffer(-1); // eslint-disable-line no-new
      }) ||
      fails(() => {
        new NativeArrayBuffer(); // eslint-disable-line no-new
        new NativeArrayBuffer(1.5); // eslint-disable-line no-new
        new NativeArrayBuffer(Number.NaN); // eslint-disable-line no-new
        return NativeArrayBuffer.name != ARRAY_BUFFER;
      })
    ) {
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance(this, $ArrayBuffer);
        return new NativeArrayBuffer(toIndex(length));
      };
      const ArrayBufferPrototype = ($ArrayBuffer[PROTOTYPE$2] =
        NativeArrayBuffer[PROTOTYPE$2]);
      for (
        var keys$3 = getOwnPropertyNames$2(NativeArrayBuffer), j$1 = 0, key$1;
        keys$3.length > j$1;

      ) {
        if (!((key$1 = keys$3[j$1++]) in $ArrayBuffer)) {
          createNonEnumerableProperty(
            $ArrayBuffer,
            key$1,
            NativeArrayBuffer[key$1],
          );
        }
      }
      ArrayBufferPrototype.constructor = $ArrayBuffer;
    }

    // WebKit bug - the same parent prototype for typed arrays and data view
    if (
      objectSetPrototypeOf &&
      objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$2
    ) {
      objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$2);
    }

    // iOS Safari 7.x bug
    const testView = new $DataView(new $ArrayBuffer(2));
    const nativeSetInt8 = $DataViewPrototype.setInt8;
    testView.setInt8(0, 2147483648);
    testView.setInt8(1, 2147483649);
    if (testView.getInt8(0) || !testView.getInt8(1))
      redefineAll(
        $DataViewPrototype,
        {
          setInt8: function setInt8(byteOffset, value) {
            nativeSetInt8.call(this, byteOffset, (value << 24) >> 24);
          },
          setUint8: function setUint8(byteOffset, value) {
            nativeSetInt8.call(this, byteOffset, (value << 24) >> 24);
          },
        },
        { unsafe: true },
      );
  }

  setToStringTag($ArrayBuffer, ARRAY_BUFFER);
  setToStringTag($DataView, DATA_VIEW);

  const arrayBuffer = {
    ArrayBuffer: $ArrayBuffer,
    DataView: $DataView,
  };

  const ARRAY_BUFFER$1 = 'ArrayBuffer';
  const ArrayBuffer$1 = arrayBuffer[ARRAY_BUFFER$1];
  const NativeArrayBuffer$1 = global_1[ARRAY_BUFFER$1];

  // `ArrayBuffer` constructor
  // https://tc39.es/ecma262/#sec-arraybuffer-constructor
  _export(
    { global: true, forced: NativeArrayBuffer$1 !== ArrayBuffer$1 },
    {
      ArrayBuffer: ArrayBuffer$1,
    },
  );

  setSpecies(ARRAY_BUFFER$1);

  const notARegexp = function (it) {
    if (isRegexp(it)) {
      throw new TypeError("The method doesn't accept regular expressions");
    }
    return it;
  };

  const MATCH$2 = wellKnownSymbol('match');

  const correctIsRegexpLogic = function (METHOD_NAME) {
    let regexp = /./;
    try {
      '/./'[METHOD_NAME](regexp);
    } catch {
      try {
        regexp[MATCH$2] = false;
        return '/./'[METHOD_NAME](regexp);
      } catch {
        /* empty */
      }
    }
    return false;
  };

  // `String.prototype.includes` method
  // https://tc39.es/ecma262/#sec-string.prototype.includes
  _export(
    {
      target: 'String',
      proto: true,
      forced: !correctIsRegexpLogic('includes'),
    },
    {
      includes: function includes(searchString /* , position = 0 */) {
        return !!~String(requireObjectCoercible(this)).indexOf(
          notARegexp(searchString),
          arguments.length > 1 ? arguments[1] : undefined,
        );
      },
    },
  );

  const non = '\u200B\u0085\u180E';

  // check that a method works with the correct list
  // of whitespaces and has a correct name
  const stringTrimForced = function (METHOD_NAME) {
    return fails(() => {
      return (
        !!whitespaces[METHOD_NAME]() ||
        non[METHOD_NAME]() != non ||
        whitespaces[METHOD_NAME].name !== METHOD_NAME
      );
    });
  };

  const $trim = stringTrim.trim;

  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  _export(
    { target: 'String', proto: true, forced: stringTrimForced('trim') },
    {
      trim: function trim() {
        return $trim(this);
      },
    },
  );

  const ITERATOR$2 = wellKnownSymbol('iterator');
  let SAFE_CLOSING = false;

  try {
    let called = 0;
    const iteratorWithReturn = {
      next() {
        return { done: !!called++ };
      },
      return () {
        SAFE_CLOSING = true;
      },
    };
    iteratorWithReturn[ITERATOR$2] = function () {
      return this;
    };
    // eslint-disable-next-line no-throw-literal
    Array.from(iteratorWithReturn, () => {
      throw 2;
    });
  } catch {
    /* empty */
  }

  const checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    let ITERATION_SUPPORT = false;
    try {
      const object = {};
      object[ITERATOR$2] = function () {
        return {
          next() {
            return { done: (ITERATION_SUPPORT = true) };
          },
        };
      };
      exec(object);
    } catch {
      /* empty */
    }
    return ITERATION_SUPPORT;
  };

  const defineProperty$9 = objectDefineProperty.f;

  const Int8Array$1 = global_1.Int8Array;
  const Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
  const Uint8ClampedArray = global_1.Uint8ClampedArray;
  const Uint8ClampedArrayPrototype =
    Uint8ClampedArray && Uint8ClampedArray.prototype;
  let TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
  let TypedArrayPrototype =
    Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
  const ObjectPrototype$3 = Object.prototype;
  const isPrototypeOf = ObjectPrototype$3.isPrototypeOf;

  const TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
  const TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
  // Fixing native typed arrays in Opera Presto crashes the browser, see #595
  let NATIVE_ARRAY_BUFFER_VIEWS =
    arrayBufferNative &&
    !!objectSetPrototypeOf &&
    classof(global_1.opera) !== 'Opera';
  let TYPED_ARRAY_TAG_REQIRED = false;
  let NAME$1;

  const TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8,
  };

  const BigIntArrayConstructorsList = {
    BigInt64Array: 8,
    BigUint64Array: 8,
  };

  const isView = function isView(it) {
    if (!isObject(it)) return false;
    const klass = classof(it);
    return (
      klass === 'DataView' ||
      has(TypedArrayConstructorsList, klass) ||
      has(BigIntArrayConstructorsList, klass)
    );
  };

  const isTypedArray = function (it) {
    if (!isObject(it)) return false;
    const klass = classof(it);
    return (
      has(TypedArrayConstructorsList, klass) ||
      has(BigIntArrayConstructorsList, klass)
    );
  };

  const aTypedArray = function (it) {
    if (isTypedArray(it)) return it;
    throw new TypeError('Target is not a typed array');
  };

  const aTypedArrayConstructor = function (C) {
    if (objectSetPrototypeOf) {
      if (isPrototypeOf.call(TypedArray, C)) return C;
    } else
      for (let ARRAY in TypedArrayConstructorsList)
        if (has(TypedArrayConstructorsList, NAME$1)) {
          const TypedArrayConstructor = global_1[ARRAY];
          if (
            TypedArrayConstructor &&
            (C === TypedArrayConstructor ||
              isPrototypeOf.call(TypedArrayConstructor, C))
          ) {
            return C;
          }
        }
    throw new TypeError('Target is not a typed array constructor');
  };

  const exportTypedArrayMethod = function (KEY, property, forced) {
    if (!descriptors) return;
    if (forced)
      for (const ARRAY in TypedArrayConstructorsList) {
        const TypedArrayConstructor = global_1[ARRAY];
        if (
          TypedArrayConstructor &&
          has(TypedArrayConstructor.prototype, KEY)
        ) {
          delete TypedArrayConstructor.prototype[KEY];
        }
      }
    if (!TypedArrayPrototype[KEY] || forced) {
      redefine(
        TypedArrayPrototype,
        KEY,
        forced
          ? property
          : (NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY]) || property,
      );
    }
  };

  const exportTypedArrayStaticMethod = function (KEY, property, forced) {
    let ARRAY, TypedArrayConstructor;
    if (!descriptors) return;
    if (objectSetPrototypeOf) {
      if (forced)
        for (ARRAY in TypedArrayConstructorsList) {
          TypedArrayConstructor = global_1[ARRAY];
          if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
            delete TypedArrayConstructor[KEY];
          }
        }
      if (!TypedArray[KEY] || forced) {
        // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
          return redefine(
            TypedArray,
            KEY,
            forced
              ? property
              : (NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY]) || property,
          );
        } catch {
          /* empty */
        }
      } else return;
    }
    for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
        redefine(TypedArrayConstructor, KEY, property);
      }
    }
  };

  for (NAME$1 in TypedArrayConstructorsList) {
    if (!global_1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
  }

  // WebKit bug - typed arrays constructors prototype is Object.prototype
  if (
    !NATIVE_ARRAY_BUFFER_VIEWS ||
    typeof TypedArray !== 'function' ||
    TypedArray === Function.prototype
  ) {
    // eslint-disable-next-line no-shadow
    TypedArray = function TypedArray() {
      throw new TypeError('Incorrect invocation');
    };
    if (NATIVE_ARRAY_BUFFER_VIEWS)
      for (NAME$1 in TypedArrayConstructorsList) {
        if (global_1[NAME$1])
          objectSetPrototypeOf(global_1[NAME$1], TypedArray);
      }
  }

  if (
    !NATIVE_ARRAY_BUFFER_VIEWS ||
    !TypedArrayPrototype ||
    TypedArrayPrototype === ObjectPrototype$3
  ) {
    TypedArrayPrototype = TypedArray.prototype;
    if (NATIVE_ARRAY_BUFFER_VIEWS)
      for (NAME$1 in TypedArrayConstructorsList) {
        if (global_1[NAME$1])
          objectSetPrototypeOf(global_1[NAME$1].prototype, TypedArrayPrototype);
      }
  }

  // WebKit bug - one more object in Uint8ClampedArray prototype chain
  if (
    NATIVE_ARRAY_BUFFER_VIEWS &&
    objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype
  ) {
    objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
  }

  if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$3)) {
    TYPED_ARRAY_TAG_REQIRED = true;
    defineProperty$9(TypedArrayPrototype, TO_STRING_TAG$3, {
      get() {
        return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
      },
    });
    for (NAME$1 in TypedArrayConstructorsList)
      if (global_1[NAME$1]) {
        createNonEnumerableProperty(global_1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
      }
  }

  const arrayBufferViewCore = {
    NATIVE_ARRAY_BUFFER_VIEWS,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
    aTypedArray,
    aTypedArrayConstructor,
    exportTypedArrayMethod,
    exportTypedArrayStaticMethod,
    isView,
    isTypedArray,
    TypedArray,
    TypedArrayPrototype,
  };

  /* eslint-disable no-new */

  const NATIVE_ARRAY_BUFFER_VIEWS$1 =
    arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

  const ArrayBuffer$2 = global_1.ArrayBuffer;
  const Int8Array$2 = global_1.Int8Array;

  const typedArrayConstructorsRequireWrappers =
    !NATIVE_ARRAY_BUFFER_VIEWS$1 ||
    !fails(() => {
      Int8Array$2(1);
    }) ||
    !fails(() => {
      new Int8Array$2(-1);
    }) ||
    !checkCorrectnessOfIteration(iterable => {
      new Int8Array$2();
      new Int8Array$2(null);
      new Int8Array$2(1.5);
      new Int8Array$2(iterable);
    }, true) ||
    fails(() => {
      // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
      return new Int8Array$2(new ArrayBuffer$2(2), 1, undefined).length !== 1;
    });

  const toPositiveInteger = function (it) {
    const result = toInteger(it);
    if (result < 0) throw new RangeError("The argument can't be less than 0");
    return result;
  };

  const toOffset = function (it, BYTES) {
    const offset = toPositiveInteger(it);
    if (offset % BYTES) throw new RangeError('Wrong offset');
    return offset;
  };

  const ITERATOR$3 = wellKnownSymbol('iterator');

  const getIteratorMethod = function (it) {
    if (it != undefined)
      return it[ITERATOR$3] || it['@@iterator'] || iterators[classof(it)];
  };

  const ITERATOR$4 = wellKnownSymbol('iterator');
  const ArrayPrototype$1 = Array.prototype;

  // check on default Array iterator
  const isArrayIteratorMethod = function (it) {
    return (
      it !== undefined &&
      (iterators.Array === it || ArrayPrototype$1[ITERATOR$4] === it)
    );
  };

  const aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

  const typedArrayFrom = function from(source /* , mapfn, thisArg */) {
    let O = toObject(source);
    const argumentsLength = arguments.length;
    let mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    const mapping = mapfn !== undefined;
    const iteratorMethod = getIteratorMethod(O);
    let i, length, result, step, iterator, next;
    if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      O = [];
      while (!(step = next.call(iterator)).done) {
        O.push(step.value);
      }
    }
    if (mapping && argumentsLength > 2) {
      mapfn = functionBindContext(mapfn, arguments[2], 2);
    }
    length = toLength(O.length);
    result = new (aTypedArrayConstructor$1(this))(length);
    for (i = 0; length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  const typedArrayConstructor = createCommonjsModule(module => {
    let getOwnPropertyNames = objectGetOwnPropertyNames.f;

    let forEach = arrayIteration.forEach;

    let getInternalState = internalState.get;
    let setInternalState = internalState.set;
    let nativeDefineProperty = objectDefineProperty.f;
    let nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    let round = Math.round;
    let RangeError = global_1.RangeError;
    let ArrayBuffer = arrayBuffer.ArrayBuffer;
    let DataView = arrayBuffer.DataView;
    let NATIVE_ARRAY_BUFFER_VIEWS =
      arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
    let TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
    let TypedArray = arrayBufferViewCore.TypedArray;
    let TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
    let aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
    let isTypedArray = arrayBufferViewCore.isTypedArray;
    let BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
    let WRONG_LENGTH = 'Wrong length';

    let fromList = function (C, list) {
      let index = 0;
      const length = list.length;
      const result = new (aTypedArrayConstructor(C))(length);
      while (length > index) result[index] = list[index++];
      return result;
    };

    let addGetter = function (it, key) {
      nativeDefineProperty(it, key, {
        get() {
          return getInternalState(this)[key];
        },
      });
    };

    let isArrayBuffer = function (it) {
      let klass;
      return (
        it instanceof ArrayBuffer ||
        (klass = classof(it)) == 'ArrayBuffer' ||
        klass == 'SharedArrayBuffer'
      );
    };

    let isTypedArrayIndex = function (target, key) {
      return (
        isTypedArray(target) &&
        typeof key !== 'symbol' &&
        key in target &&
        String(+key) == String(key)
      );
    };

    let wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(
      target,
      key,
    ) {
      return isTypedArrayIndex(target, (key = toPrimitive(key, true)))
        ? createPropertyDescriptor(2, target[key])
        : nativeGetOwnPropertyDescriptor(target, key);
    };

    let wrappedDefineProperty = function defineProperty(
      target,
      key,
      descriptor,
    ) {
      if (
        isTypedArrayIndex(target, (key = toPrimitive(key, true))) &&
        isObject(descriptor) &&
        has(descriptor, 'value') &&
        !has(descriptor, 'get') &&
        !has(descriptor, 'set') &&
        // TODO: add validation descriptor w/o calling accessors
        !descriptor.configurable &&
        (!has(descriptor, 'writable') || descriptor.writable) &&
        (!has(descriptor, 'enumerable') || descriptor.enumerable)
      ) {
        target[key] = descriptor.value;
        return target;
      }
      return nativeDefineProperty(target, key, descriptor);
    };

    if (descriptors) {
      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
        objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
        objectDefineProperty.f = wrappedDefineProperty;
        addGetter(TypedArrayPrototype, 'buffer');
        addGetter(TypedArrayPrototype, 'byteOffset');
        addGetter(TypedArrayPrototype, 'byteLength');
        addGetter(TypedArrayPrototype, 'length');
      }

      _export(
        { target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS },
        {
          getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
          defineProperty: wrappedDefineProperty,
        },
      );

      module.exports = function (TYPE, wrapper, CLAMPED) {
        const BYTES = TYPE.match(/\d+$/)[0] / 8;
        const CONSTRUCTOR_NAME = `${TYPE + (CLAMPED ? 'Clamped' : '')  }Array`;
        const GETTER = `get${  TYPE}`;
        const SETTER = `set${  TYPE}`;
        const NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
        let TypedArrayConstructor = NativeTypedArrayConstructor;
        let TypedArrayConstructorPrototype =
          TypedArrayConstructor && TypedArrayConstructor.prototype;
        const exported = {};

        const getter = function (that, index) {
          let data = getInternalState(that);
          return data.view[GETTER](index * BYTES + data.byteOffset, true);
        };

        const setter = function (that, index, value) {
          let data = getInternalState(that);
          if (CLAMPED)
            value =
              (value = round(value)) < 0
                ? 0
                : value > 0xff
                ? 0xff
                : value & 0xff;
          data.view[SETTER](index * BYTES + data.byteOffset, value, true);
        };

        const addElement = function (that, index) {
          nativeDefineProperty(that, index, {
            get: function () {
              return getter(this, index);
            },
            set (value) {
	          return setter(this, index, value);
	        },
            enumerable: true,
          });
        };

        if (!NATIVE_ARRAY_BUFFER_VIEWS) {
          TypedArrayConstructor = wrapper((
            that,
            data,
            offset,
            $length,
          ) => {
            anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
            let index = 0;
            let byteOffset = 0;
            let buffer, byteLength, length;
            if (!isObject(data)) {
              length = toIndex(data);
              byteLength = length * BYTES;
              buffer = new ArrayBuffer(byteLength);
            } else if (isArrayBuffer(data)) {
              buffer = data;
              byteOffset = toOffset(offset, BYTES);
              const $len = data.byteLength;
              if ($length === undefined) {
                if ($len % BYTES) throw new RangeError(WRONG_LENGTH);
                byteLength = $len - byteOffset;
                if (byteLength < 0) throw new RangeError(WRONG_LENGTH);
              } else {
                byteLength = toLength($length) * BYTES;
                if (byteLength + byteOffset > $len)
                  throw new RangeError(WRONG_LENGTH);
              }
              length = byteLength / BYTES;
            } else if (isTypedArray(data)) {
              return fromList(TypedArrayConstructor, data);
            } else {
              return typedArrayFrom.call(TypedArrayConstructor, data);
            }
            setInternalState(that, {
              buffer,
              byteOffset,
              byteLength,
              length,
              view: new DataView(buffer),
            });
            while (index < length) addElement(that, index++);
          });

          if (objectSetPrototypeOf)
            objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
          TypedArrayConstructorPrototype = TypedArrayConstructor.prototype =
            objectCreate(TypedArrayPrototype);
        } else if (typedArrayConstructorsRequireWrappers) {
          TypedArrayConstructor = wrapper((
            dummy,
            data,
            typedArrayOffset,
            $length,
          ) => {
            anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
            return inheritIfRequired(
              (function () {
                if (!isObject(data))
                  return new NativeTypedArrayConstructor(toIndex(data));
                if (isArrayBuffer(data))
                  return $length !== undefined
                    ? new NativeTypedArrayConstructor(
                        data,
                        toOffset(typedArrayOffset, BYTES),
                        $length,
                      )
                    : typedArrayOffset !== undefined
                    ? new NativeTypedArrayConstructor(
                        data,
                        toOffset(typedArrayOffset, BYTES),
                      )
                    : new NativeTypedArrayConstructor(data);
                if (isTypedArray(data))
                  return fromList(TypedArrayConstructor, data);
                return typedArrayFrom.call(TypedArrayConstructor, data);
              })(),
              dummy,
              TypedArrayConstructor,
            );
          });

          if (objectSetPrototypeOf)
            objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
          forEach(getOwnPropertyNames(NativeTypedArrayConstructor), key => {
            if (!(key in TypedArrayConstructor)) {
              createNonEnumerableProperty(
                TypedArrayConstructor,
                key,
                NativeTypedArrayConstructor[key],
              );
            }
          });
          TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
        }

        if (
          TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor
        ) {
          createNonEnumerableProperty(
            TypedArrayConstructorPrototype,
            'constructor',
            TypedArrayConstructor,
          );
        }

        if (TYPED_ARRAY_TAG) {
          createNonEnumerableProperty(
            TypedArrayConstructorPrototype,
            TYPED_ARRAY_TAG,
            CONSTRUCTOR_NAME,
          );
        }

        exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

        _export(
          {
            global: true,
            forced: TypedArrayConstructor != NativeTypedArrayConstructor,
            sham: !NATIVE_ARRAY_BUFFER_VIEWS,
          },
          exported,
        );

        if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
          createNonEnumerableProperty(
            TypedArrayConstructor,
            BYTES_PER_ELEMENT,
            BYTES,
          );
        }

        if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
          createNonEnumerableProperty(
            TypedArrayConstructorPrototype,
            BYTES_PER_ELEMENT,
            BYTES,
          );
        }

        setSpecies(CONSTRUCTOR_NAME);
      };
    } else
      module.exports = function () {
        /* empty */
      };
  });

  // `Uint8Array` constructor
  // https://tc39.es/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint8', init => {
    return function Uint8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  const min$6 = Math.min;

  // `Array.prototype.copyWithin` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.copywithin
  const arrayCopyWithin =
    [].copyWithin ||
    function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
      const O = toObject(this);
      const len = toLength(O.length);
      let to = toAbsoluteIndex(target, len);
      let from = toAbsoluteIndex(start, len);
      let end = arguments.length > 2 ? arguments[2] : undefined;
      let count = min$6(
        (end === undefined ? len : toAbsoluteIndex(end, len)) - from,
        len - to,
      );
      let inc = 1;
      if (from < to && to < from + count) {
        inc = -1;
        from += count - 1;
        to += count - 1;
      }
      while (count-- > 0) {
        if (from in O) O[to] = O[from];
        else delete O[to];
        to += inc;
        from += inc;
      }
      return O;
    };

  const aTypedArray$1 = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.copyWithin` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
  exportTypedArrayMethod$1(
    'copyWithin',
    function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(
        aTypedArray$1(this),
        target,
        start,
        arguments.length > 2 ? arguments[2] : undefined,
      );
    },
  );

  const $every = arrayIteration.every;

  const aTypedArray$2 = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.every` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
  exportTypedArrayMethod$2('every', function every(callbackfn /* , thisArg */) {
    return $every(
      aTypedArray$2(this),
      callbackfn,
      arguments.length > 1 ? arguments[1] : undefined,
    );
  });

  const aTypedArray$3 = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.fill` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$3('fill', function fill(value /* , start, end */) {
    return arrayFill.apply(aTypedArray$3(this), arguments);
  });

  const $filter$1 = arrayIteration.filter;

  const aTypedArray$4 = arrayBufferViewCore.aTypedArray;
  const aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
  const exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.filter` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
  exportTypedArrayMethod$4(
    'filter',
    function filter(callbackfn /* , thisArg */) {
      const list = $filter$1(
        aTypedArray$4(this),
        callbackfn,
        arguments.length > 1 ? arguments[1] : undefined,
      );
      const C = speciesConstructor(this, this.constructor);
      let index = 0;
      const length = list.length;
      const result = new (aTypedArrayConstructor$2(C))(length);
      while (length > index) result[index] = list[index++];
      return result;
    },
  );

  const $find = arrayIteration.find;

  const aTypedArray$5 = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.find` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
  exportTypedArrayMethod$5('find', function find(predicate /* , thisArg */) {
    return $find(
      aTypedArray$5(this),
      predicate,
      arguments.length > 1 ? arguments[1] : undefined,
    );
  });

  const $findIndex = arrayIteration.findIndex;

  const aTypedArray$6 = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
  exportTypedArrayMethod$6(
    'findIndex',
    function findIndex(predicate /* , thisArg */) {
      return $findIndex(
        aTypedArray$6(this),
        predicate,
        arguments.length > 1 ? arguments[1] : undefined,
      );
    },
  );

  const $forEach$2 = arrayIteration.forEach;

  const aTypedArray$7 = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
  exportTypedArrayMethod$7(
    'forEach',
    function forEach(callbackfn /* , thisArg */) {
      $forEach$2(
        aTypedArray$7(this),
        callbackfn,
        arguments.length > 1 ? arguments[1] : undefined,
      );
    },
  );

  const $includes$1 = arrayIncludes.includes;

  const aTypedArray$8 = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.includes` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
  exportTypedArrayMethod$8(
    'includes',
    function includes(searchElement /* , fromIndex */) {
      return $includes$1(
        aTypedArray$8(this),
        searchElement,
        arguments.length > 1 ? arguments[1] : undefined,
      );
    },
  );

  const $indexOf$1 = arrayIncludes.indexOf;

  const aTypedArray$9 = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
  exportTypedArrayMethod$9(
    'indexOf',
    function indexOf(searchElement /* , fromIndex */) {
      return $indexOf$1(
        aTypedArray$9(this),
        searchElement,
        arguments.length > 1 ? arguments[1] : undefined,
      );
    },
  );

  const ITERATOR$5 = wellKnownSymbol('iterator');
  const Uint8Array$1 = global_1.Uint8Array;
  const arrayValues = es_array_iterator.values;
  const arrayKeys = es_array_iterator.keys;
  const arrayEntries = es_array_iterator.entries;
  const aTypedArray$a = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
  const nativeTypedArrayIterator =
    Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$5];

  const CORRECT_ITER_NAME =
    !!nativeTypedArrayIterator &&
    (nativeTypedArrayIterator.name == 'values' ||
      nativeTypedArrayIterator.name == undefined);

  const typedArrayValues = function values() {
    return arrayValues.call(aTypedArray$a(this));
  };

  // `%TypedArray%.prototype.entries` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
  exportTypedArrayMethod$a('entries', function entries() {
    return arrayEntries.call(aTypedArray$a(this));
  });
  // `%TypedArray%.prototype.keys` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
  exportTypedArrayMethod$a('keys', function keys() {
    return arrayKeys.call(aTypedArray$a(this));
  });
  // `%TypedArray%.prototype.values` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
  exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME);
  // `%TypedArray%.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
  exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

  const aTypedArray$b = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
  const $join = [].join;

  // `%TypedArray%.prototype.join` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$b('join', function join(separator) {
    return $join.apply(aTypedArray$b(this), arguments);
  });

  const aTypedArray$c = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.lastIndexOf` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$c(
    'lastIndexOf',
    function lastIndexOf(searchElement /* , fromIndex */) {
      return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
    },
  );

  const $map$1 = arrayIteration.map;

  const aTypedArray$d = arrayBufferViewCore.aTypedArray;
  const aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
  const exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.map` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
  exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
    return $map$1(
      aTypedArray$d(this),
      mapfn,
      arguments.length > 1 ? arguments[1] : undefined,
      (O, length) => {
        return new (aTypedArrayConstructor$3(
          speciesConstructor(O, O.constructor),
        ))(length);
      },
    );
  });

  const $reduce$1 = arrayReduce.left;

  const aTypedArray$e = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
  exportTypedArrayMethod$e(
    'reduce',
    function reduce(callbackfn /* , initialValue */) {
      return $reduce$1(
        aTypedArray$e(this),
        callbackfn,
        arguments.length,
        arguments.length > 1 ? arguments[1] : undefined,
      );
    },
  );

  const $reduceRight = arrayReduce.right;

  const aTypedArray$f = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduceRicht` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
  exportTypedArrayMethod$f(
    'reduceRight',
    function reduceRight(callbackfn /* , initialValue */) {
      return $reduceRight(
        aTypedArray$f(this),
        callbackfn,
        arguments.length,
        arguments.length > 1 ? arguments[1] : undefined,
      );
    },
  );

  const aTypedArray$g = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
  const floor$3 = Math.floor;

  // `%TypedArray%.prototype.reverse` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
  exportTypedArrayMethod$g('reverse', function reverse() {
    const that = this;
    let length = aTypedArray$g(that).length;
    const middle = floor$3(length / 2);
    let index = 0;
    let value;
    while (index < middle) {
      value = that[index];
      that[index++] = that[--length];
      that[length] = value;
    }
    return that;
  });

  const aTypedArray$h = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

  const FORCED$4 = fails(() => {
    // eslint-disable-next-line no-undef
    new Int8Array(1).set({});
  });

  // `%TypedArray%.prototype.set` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
  exportTypedArrayMethod$h(
    'set',
    function set(arrayLike /* , offset */) {
      aTypedArray$h(this);
      const offset = toOffset(
        arguments.length > 1 ? arguments[1] : undefined,
        1,
      );
      const length = this.length;
      const src = toObject(arrayLike);
      const len = toLength(src.length);
      let index = 0;
      if (len + offset > length) throw new RangeError('Wrong length');
      while (index < len) this[offset + index] = src[index++];
    },
    FORCED$4,
  );

  const aTypedArray$i = arrayBufferViewCore.aTypedArray;
  const aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
  const exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
  const $slice = [].slice;

  const FORCED$5 = fails(() => {
    // eslint-disable-next-line no-undef
    new Int8Array(1).slice();
  });

  // `%TypedArray%.prototype.slice` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
  exportTypedArrayMethod$i(
    'slice',
    function slice(start, end) {
      const list = $slice.call(aTypedArray$i(this), start, end);
      const C = speciesConstructor(this, this.constructor);
      let index = 0;
      const length = list.length;
      const result = new (aTypedArrayConstructor$4(C))(length);
      while (length > index) result[index] = list[index++];
      return result;
    },
    FORCED$5,
  );

  const $some = arrayIteration.some;

  const aTypedArray$j = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.some` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
  exportTypedArrayMethod$j('some', function some(callbackfn /* , thisArg */) {
    return $some(
      aTypedArray$j(this),
      callbackfn,
      arguments.length > 1 ? arguments[1] : undefined,
    );
  });

  const aTypedArray$k = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
  const $sort = [].sort;

  // `%TypedArray%.prototype.sort` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
  exportTypedArrayMethod$k('sort', function sort(comparefn) {
    return $sort.call(aTypedArray$k(this), comparefn);
  });

  const aTypedArray$l = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.subarray` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
  exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
    const O = aTypedArray$l(this);
    const length = O.length;
    const beginIndex = toAbsoluteIndex(begin, length);
    return new (speciesConstructor(O, O.constructor))(
      O.buffer,
      O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
      toLength(
        (end === undefined ? length : toAbsoluteIndex(end, length)) -
          beginIndex,
      ),
    );
  });

  const Int8Array$3 = global_1.Int8Array;
  const aTypedArray$m = arrayBufferViewCore.aTypedArray;
  const exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
  const $toLocaleString = [].toLocaleString;
  const $slice$1 = [].slice;

  // iOS Safari 6.x fails here
  const TO_LOCALE_STRING_BUG =
    !!Int8Array$3 &&
    fails(() => {
      $toLocaleString.call(new Int8Array$3(1));
    });

  const FORCED$6 =
    fails(() => {
      return (
        [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString()
      );
    }) ||
    !fails(() => {
      Int8Array$3.prototype.toLocaleString.call([1, 2]);
    });

  // `%TypedArray%.prototype.toLocaleString` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
  exportTypedArrayMethod$m(
    'toLocaleString',
    function toLocaleString() {
      return $toLocaleString.apply(
        TO_LOCALE_STRING_BUG
          ? $slice$1.call(aTypedArray$m(this))
          : aTypedArray$m(this),
        arguments,
      );
    },
    FORCED$6,
  );

  const exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;

  const Uint8Array$2 = global_1.Uint8Array;
  const Uint8ArrayPrototype = (Uint8Array$2 && Uint8Array$2.prototype) || {};
  let arrayToString = [].toString;
  const arrayJoin = [].join;

  if (
    fails(() => {
      arrayToString.call({});
    })
  ) {
    arrayToString = function toString() {
      return arrayJoin.call(this);
    };
  }

  const IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

  // `%TypedArray%.prototype.toString` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
  exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  _export(
    { target: 'URL', proto: true, enumerable: true },
    {
      toJSON: function toJSON() {
        return URL.prototype.toString.call(this);
      },
    },
  );

  const lookup = [];
  const revLookup = [];
  const Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
  let inited = false;

  function init() {
    inited = true;
    const code =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    for (let i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }

    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;
  }

  function toByteArray(b64) {
    if (!inited) {
      init();
    }

    let i, j, l, tmp, placeHolders, arr;
    const len = b64.length;

    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4');
    } // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice

    placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0; // base64 is 4/3 + up to two characters of the original data

    arr = new Arr((len * 3) / 4 - placeHolders); // if there are placeholders, only get up to the last complete 4 chars

    l = placeHolders > 0 ? len - 4 : len;
    let L = 0;

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 18) |
        (revLookup[b64.charCodeAt(i + 1)] << 12) |
        (revLookup[b64.charCodeAt(i + 2)] << 6) |
        revLookup[b64.charCodeAt(i + 3)];
      arr[L++] = (tmp >> 16) & 0xff;
      arr[L++] = (tmp >> 8) & 0xff;
      arr[L++] = tmp & 0xff;
    }

    if (placeHolders === 2) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 2) |
        (revLookup[b64.charCodeAt(i + 1)] >> 4);
      arr[L++] = tmp & 0xff;
    } else if (placeHolders === 1) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 10) |
        (revLookup[b64.charCodeAt(i + 1)] << 4) |
        (revLookup[b64.charCodeAt(i + 2)] >> 2);
      arr[L++] = (tmp >> 8) & 0xff;
      arr[L++] = tmp & 0xff;
    }

    return arr;
  }

  function tripletToBase64(num) {
    return (
      lookup[(num >> 18) & 0x3f] +
      lookup[(num >> 12) & 0x3f] +
      lookup[(num >> 6) & 0x3f] +
      lookup[num & 0x3f]
    );
  }

  function encodeChunk(uint8, start, end) {
    let tmp;
    const output = [];

    for (let i = start; i < end; i += 3) {
      tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
      output.push(tripletToBase64(tmp));
    }

    return output.join('');
  }

  function fromByteArray(uint8) {
    if (!inited) {
      init();
    }

    let tmp;
    const len = uint8.length;
    const extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

    let output = '';
    const parts = [];
    const maxChunkLength = 16383; // must be multiple of 3
    // go through the array every three bytes, we'll deal with trailing stuff later

    for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(
        encodeChunk(
          uint8,
          i,
          i + maxChunkLength > len2 ? len2 : i + maxChunkLength,
        ),
      );
    } // pad the end with zeros, but make sure to not forget the extra bytes

    if (extraBytes === 1) {
      tmp = uint8[len - 1];
      output += lookup[tmp >> 2];
      output += lookup[(tmp << 4) & 0x3f];
      output += '==';
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1];
      output += lookup[tmp >> 10];
      output += lookup[(tmp >> 4) & 0x3f];
      output += lookup[(tmp << 2) & 0x3f];
      output += '=';
    }

    parts.push(output);
    return parts.join('');
  }

  function read(buffer, offset, isLE, mLen, nBytes) {
    let e, m;
    const eLen = nBytes * 8 - mLen - 1;
    const eMax = (1 << eLen) - 1;
    const eBias = eMax >> 1;
    let nBits = -7;
    let i = isLE ? nBytes - 1 : 0;
    const d = isLE ? -1 : 1;
    let s = buffer[offset + i];
    i += d;
    e = s & ((1 << -nBits) - 1);
    s >>= -nBits;
    nBits += eLen;

    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & ((1 << -nBits) - 1);
    e >>= -nBits;
    nBits += mLen;

    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? Number.NaN : (s ? -1 : 1) * Number.POSITIVE_INFINITY;
    } else {
      m = m + 2 ** mLen;
      e = e - eBias;
    }

    return (s ? -1 : 1) * m * 2 ** (e - mLen);
  }
  function write(buffer, value, offset, isLE, mLen, nBytes) {
    let e, m, c;
    let eLen = nBytes * 8 - mLen - 1;
    const eMax = (1 << eLen) - 1;
    const eBias = eMax >> 1;
    const rt = mLen === 23 ? 2 ** -24 - 2 ** -77 : 0;
    let i = isLE ? 0 : nBytes - 1;
    const d = isLE ? 1 : -1;
    const s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
    value = Math.abs(value);

    if (isNaN(value) || value === Number.POSITIVE_INFINITY) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);

      if (value * (c = 2 ** -e) < 1) {
        e--;
        c *= 2;
      }

      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * 2 ** (1 - eBias);
      }

      if (value * c >= 2) {
        e++;
        c /= 2;
      }

      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * 2 ** mLen;
        e = e + eBias;
      } else {
        m = value * 2 ** (eBias - 1) * 2 ** mLen;
        e = 0;
      }
    }

    for (
      ;
      mLen >= 8;
      buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8
    ) {}

    e = (e << mLen) | m;
    eLen += mLen;

    for (
      ;
      eLen > 0;
      buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8
    ) {}

    buffer[offset + i - d] |= s * 128;
  }

  const toString$2 = {}.toString;
  const isArray$1 =
    Array.isArray ||
    function (arr) {
      return toString$2.call(arr) == '[object Array]';
    };

  const INSPECT_MAX_BYTES = 50;
  /**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */

  Buffer.TYPED_ARRAY_SUPPORT =
    global$2.TYPED_ARRAY_SUPPORT !== undefined
      ? global$2.TYPED_ARRAY_SUPPORT
      : true;

  function kMaxLength() {
    return Buffer.TYPED_ARRAY_SUPPORT ? 0x7FFFFFFF : 0x3FFFFFFF;
  }

  function createBuffer(that, length) {
    if (kMaxLength() < length) {
      throw new RangeError('Invalid typed array length');
    }

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = new Uint8Array(length);
      that.__proto__ = Buffer.prototype;
    } else {
      // Fallback: Return an object instance of the Buffer class
      if (that === null) {
        that = new Buffer(length);
      }

      that.length = length;
    }

    return that;
  }
  /**
   * The Buffer constructor returns instances of `Uint8Array` that have their
   * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
   * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
   * and the `Uint8Array` methods. Square bracket notation works as expected -- it
   * returns a single octet.
   *
   * The `Uint8Array` prototype remains unmodified.
   */

  function Buffer(arg, encodingOrOffset, length) {
    if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
      return Buffer.from(arg, encodingOrOffset, length);
    } // Common case.

    if (typeof arg === 'number') {
      if (typeof encodingOrOffset === 'string') {
        throw new TypeError(
          'If encoding is specified then the first argument must be a string',
        );
      }

      return allocUnsafe(this, arg);
    }

    return from(this, arg, encodingOrOffset, length);
  }
  Buffer.poolSize = 8192; // not used by this implementation
  // TODO: Legacy, not needed anymore. Remove in next major version.

  Buffer._augment = function (arr) {
    arr.__proto__ = Buffer.prototype;
    return arr;
  };

  function from(that, value, encodingOrOffset, length) {
    if (typeof value === 'number') {
      throw new TypeError('"value" argument must not be a number');
    }

    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
      return fromArrayBuffer(that, value, encodingOrOffset, length);
    }

    if (typeof value === 'string') {
      return fromString(that, value, encodingOrOffset);
    }

    return fromObject(that, value);
  }
  /**
   * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
   * if value is a number.
   * Buffer.from(str[, encoding])
   * Buffer.from(array)
   * Buffer.from(buffer)
   * Buffer.from(arrayBuffer[, byteOffset[, length]])
   **/

  Buffer.from = function (value, encodingOrOffset, length) {
    return from(null, value, encodingOrOffset, length);
  };

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    Buffer.prototype.__proto__ = Uint8Array.prototype;
    Buffer.__proto__ = Uint8Array;
  }

  function assertSize(size) {
    if (typeof size !== 'number') {
      throw new TypeError('"size" argument must be a number');
    } else if (size < 0) {
      throw new RangeError('"size" argument must not be negative');
    }
  }

  function alloc(that, size, fill, encoding) {
    assertSize(size);

    if (size <= 0) {
      return createBuffer(that, size);
    }

    if (fill !== undefined) {
      // Only pay attention to encoding if it's a string. This
      // prevents accidentally sending in a number that would
      // be interpretted as a start offset.
      return typeof encoding === 'string'
        ? createBuffer(that, size).fill(fill, encoding)
        : createBuffer(that, size).fill(fill);
    }

    return createBuffer(that, size);
  }
  /**
   * Creates a new filled Buffer instance.
   * alloc(size[, fill[, encoding]])
   **/

  Buffer.alloc = function (size, fill, encoding) {
    return alloc(null, size, fill, encoding);
  };

  function allocUnsafe(that, size) {
    assertSize(size);
    that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);

    if (!Buffer.TYPED_ARRAY_SUPPORT) {
      for (let i = 0; i < size; ++i) {
        that[i] = 0;
      }
    }

    return that;
  }
  /**
   * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
   * */

  Buffer.allocUnsafe = function (size) {
    return allocUnsafe(null, size);
  };
  /**
   * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
   */

  Buffer.allocUnsafeSlow = function (size) {
    return allocUnsafe(null, size);
  };

  function fromString(that, string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
      encoding = 'utf8';
    }

    if (!Buffer.isEncoding(encoding)) {
      throw new TypeError('"encoding" must be a valid string encoding');
    }

    const length = byteLength(string, encoding) | 0;
    that = createBuffer(that, length);
    const actual = that.write(string, encoding);

    if (actual !== length) {
      // Writing a hex string, for example, that contains invalid characters will
      // cause everything after the first invalid character to be ignored. (e.g.
      // 'abxxcd' will be treated as 'ab')
      that = that.slice(0, actual);
    }

    return that;
  }

  function fromArrayLike(that, array) {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    that = createBuffer(that, length);

    for (let i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }

    return that;
  }

  function fromArrayBuffer(that, array, byteOffset, length) {
    array.byteLength; // this throws if `array` is not a valid ArrayBuffer

    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError("'offset' is out of bounds");
    }

    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError("'length' is out of bounds");
    }

    if (byteOffset === undefined && length === undefined) {
      array = new Uint8Array(array);
    } else if (length === undefined) {
      array = new Uint8Array(array, byteOffset);
    } else {
      array = new Uint8Array(array, byteOffset, length);
    }

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = array;
      that.__proto__ = Buffer.prototype;
    } else {
      // Fallback: Return an object instance of the Buffer class
      that = fromArrayLike(that, array);
    }

    return that;
  }

  function fromObject(that, obj) {
    if (internalIsBuffer(obj)) {
      const len = checked(obj.length) | 0;
      that = createBuffer(that, len);

      if (that.length === 0) {
        return that;
      }

      obj.copy(that, 0, 0, len);
      return that;
    }

    if (obj) {
      if (
        (typeof ArrayBuffer !== 'undefined' &&
          obj.buffer instanceof ArrayBuffer) ||
        'length' in obj
      ) {
        if (typeof obj.length !== 'number' || isnan(obj.length)) {
          return createBuffer(that, 0);
        }

        return fromArrayLike(that, obj);
      }

      if (obj.type === 'Buffer' && isArray$1(obj.data)) {
        return fromArrayLike(that, obj.data);
      }
    }

    throw new TypeError(
      'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.',
    );
  }

  function checked(length) {
    // Note: cannot use `length < kMaxLength()` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= kMaxLength()) {
      throw new RangeError(
        `Attempt to allocate Buffer larger than maximum ` +
          `size: 0x${
          kMaxLength().toString(16)
          } bytes`,
      );
    }

    return length | 0;
  }
  Buffer.isBuffer = isBuffer;

  function internalIsBuffer(b) {
    return !!(b != null && b._isBuffer);
  }

  Buffer.compare = function compare(a, b) {
    if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
      throw new TypeError('Arguments must be Buffers');
    }

    if (a === b) return 0;
    let x = a.length;
    let y = b.length;

    for (let i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };

  Buffer.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'latin1':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true;

      default:
        return false;
    }
  };

  Buffer.concat = function concat(list, length) {
    if (!isArray$1(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }

    if (list.length === 0) {
      return Buffer.alloc(0);
    }

    let i;

    if (length === undefined) {
      length = 0;

      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }

    const buffer = Buffer.allocUnsafe(length);
    let pos = 0;

    for (i = 0; i < list.length; ++i) {
      const buf = list[i];

      if (!internalIsBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }

      buf.copy(buffer, pos);
      pos += buf.length;
    }

    return buffer;
  };

  function byteLength(string, encoding) {
    if (internalIsBuffer(string)) {
      return string.length;
    }

    if (
      typeof ArrayBuffer !== 'undefined' &&
      typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)
    ) {
      return string.byteLength;
    }

    if (typeof string !== 'string') {
      string = `${string}`;
    }

    const len = string.length;
    if (len === 0) return 0; // Use a for loop to avoid recursion

    let loweredCase = false;

    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'latin1':
        case 'binary':
          return len;

        case 'utf8':
        case 'utf-8':
        case undefined:
          return utf8ToBytes(string).length;

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return len * 2;

        case 'hex':
          return len >>> 1;

        case 'base64':
          return base64ToBytes(string).length;

        default:
          if (loweredCase) return utf8ToBytes(string).length; // assume utf8

          encoding = `${encoding}`.toLowerCase();
          loweredCase = true;
      }
    }
  }

  Buffer.byteLength = byteLength;

  function slowToString(encoding, start, end) {
    let loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

    if (start === undefined || start < 0) {
      start = 0;
    } // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.

    if (start > this.length) {
      return '';
    }

    if (end === undefined || end > this.length) {
      end = this.length;
    }

    if (end <= 0) {
      return '';
    } // Force coersion to uint32. This will also coerce falsey/NaN values to 0.

    end >>>= 0;
    start >>>= 0;

    if (end <= start) {
      return '';
    }

    if (!encoding) encoding = 'utf8';

    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice(this, start, end);

        case 'utf8':
        case 'utf-8':
          return utf8Slice(this, start, end);

        case 'ascii':
          return asciiSlice(this, start, end);

        case 'latin1':
        case 'binary':
          return latin1Slice(this, start, end);

        case 'base64':
          return base64Slice(this, start, end);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return utf16leSlice(this, start, end);

        default:
          if (loweredCase) throw new TypeError(`Unknown encoding: ${encoding}`);
          encoding = `${encoding}`.toLowerCase();
          loweredCase = true;
      }
    }
  } // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
  // Buffer instances.

  Buffer.prototype._isBuffer = true;

  function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
  }

  Buffer.prototype.swap16 = function swap16() {
    const len = this.length;

    if (len % 2 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 16-bits');
    }

    for (let i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }

    return this;
  };

  Buffer.prototype.swap32 = function swap32() {
    const len = this.length;

    if (len % 4 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 32-bits');
    }

    for (let i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }

    return this;
  };

  Buffer.prototype.swap64 = function swap64() {
    const len = this.length;

    if (len % 8 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 64-bits');
    }

    for (let i = 0; i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }

    return this;
  };

  Buffer.prototype.toString = function toString() {
    const length = this.length | 0;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return Reflect.apply(slowToString, this, arguments);
  };

  Buffer.prototype.equals = function equals(b) {
    if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
  };

  Buffer.prototype.inspect = function inspect() {
    let str = '';
    const max = INSPECT_MAX_BYTES;

    if (this.length > 0) {
      str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
      if (this.length > max) str += ' ... ';
    }

    return `<Buffer ${str}>`;
  };

  Buffer.prototype.compare = function compare(
    target,
    start,
    end,
    thisStart,
    thisEnd,
  ) {
    if (!internalIsBuffer(target)) {
      throw new TypeError('Argument must be a Buffer');
    }

    if (start === undefined) {
      start = 0;
    }

    if (end === undefined) {
      end = target ? target.length : 0;
    }

    if (thisStart === undefined) {
      thisStart = 0;
    }

    if (thisEnd === undefined) {
      thisEnd = this.length;
    }

    if (
      start < 0 ||
      end > target.length ||
      thisStart < 0 ||
      thisEnd > this.length
    ) {
      throw new RangeError('out of range index');
    }

    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }

    if (thisStart >= thisEnd) {
      return -1;
    }

    if (start >= end) {
      return 1;
    }

    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);

    for (let i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
      }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  }; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
  // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
  //
  // Arguments:
  // - buffer - a Buffer to search
  // - val - a string, Buffer, or number
  // - byteOffset - an index into `buffer`; will be clamped to an int32
  // - encoding - an optional encoding, relevant is val is a string
  // - dir - true for indexOf, false for lastIndexOf

  function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1; // Normalize byteOffset

    if (typeof byteOffset === 'string') {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 0x7FFFFFFF) {
      byteOffset = 0x7FFFFFFF;
    } else if (byteOffset < -0x80000000) {
      byteOffset = -0x80000000;
    }

    byteOffset = +byteOffset; // Coerce to Number.

    if (isNaN(byteOffset)) {
      // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
      byteOffset = dir ? 0 : buffer.length - 1;
    } // Normalize byteOffset: negative offsets start from the end of the buffer

    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

    if (byteOffset >= buffer.length) {
      if (dir) return -1;
      else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0;
      else return -1;
    } // Normalize val

    if (typeof val === 'string') {
      val = Buffer.from(val, encoding);
    } // Finally, search either indexOf (if dir is true) or lastIndexOf

    if (internalIsBuffer(val)) {
      // Special case: looking for empty string/buffer always fails
      if (val.length === 0) {
        return -1;
      }

      return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
      val = val & 0xff; // Search for a byte value [0-255]

      if (
        Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function'
      ) {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
      }

      return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
    }

    throw new TypeError('val must be string, number or Buffer');
  }

  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;

    if (encoding !== undefined) {
      encoding = String(encoding).toLowerCase();

      if (
        encoding === 'ucs2' ||
        encoding === 'ucs-2' ||
        encoding === 'utf16le' ||
        encoding === 'utf-16le'
      ) {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }

        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }

    function read(buf, i) {
      if (indexSize === 1) {
        return buf[i];
      } else {
        return buf.readUInt16BE(i * indexSize);
      }
    }

    let i;

    if (dir) {
      let foundIndex = -1;

      for (i = byteOffset; i < arrLength; i++) {
        if (
          read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)
        ) {
          if (foundIndex === -1) foundIndex = i;
          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1) i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength)
        byteOffset = arrLength - valLength;

      for (i = byteOffset; i >= 0; i--) {
        let found = true;

        for (let j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break;
          }
        }

        if (found) return i;
      }
    }

    return -1;
  }

  Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };

  Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };

  Buffer.prototype.lastIndexOf = function lastIndexOf(
    val,
    byteOffset,
    encoding,
  ) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };

  function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    const remaining = buf.length - offset;

    if (!length) {
      length = remaining;
    } else {
      length = Number(length);

      if (length > remaining) {
        length = remaining;
      }
    } // must be an even number of digits

    const strLen = string.length;
    if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

    if (length > strLen / 2) {
      length = strLen / 2;
    }

    for (var i = 0; i < length; ++i) {
      const parsed = Number.parseInt(string.slice(i * 2, i * 2 + 2), 16);
      if (isNaN(parsed)) return i;
      buf[offset + i] = parsed;
    }

    return i;
  }

  function utf8Write(buf, string, offset, length) {
    return blitBuffer(
      utf8ToBytes(string, buf.length - offset),
      buf,
      offset,
      length,
    );
  }

  function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
  }

  function latin1Write(buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length);
  }

  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }

  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(
      utf16leToBytes(string, buf.length - offset),
      buf,
      offset,
      length,
    );
  }

  Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
      encoding = 'utf8';
      length = this.length;
      offset = 0; // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
      encoding = offset;
      length = this.length;
      offset = 0; // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
      offset = offset | 0;

      if (isFinite(length)) {
        length = length | 0;
        if (encoding === undefined) encoding = 'utf8';
      } else {
        encoding = length;
        length = undefined;
      } // legacy write(string, encoding, offset, length) - remove in v0.13
    } else {
      throw new TypeError(
        'Buffer.write(string, encoding, offset[, length]) is no longer supported',
      );
    }

    const remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;

    if (
      (string.length > 0 && (length < 0 || offset < 0)) ||
      offset > this.length
    ) {
      throw new RangeError('Attempt to write outside buffer bounds');
    }

    if (!encoding) encoding = 'utf8';
    let loweredCase = false;

    for (;;) {
      switch (encoding) {
        case 'hex':
          return hexWrite(this, string, offset, length);

        case 'utf8':
        case 'utf-8':
          return utf8Write(this, string, offset, length);

        case 'ascii':
          return asciiWrite(this, string, offset, length);

        case 'latin1':
        case 'binary':
          return latin1Write(this, string, offset, length);

        case 'base64':
          // Warning: maxLength not taken into account in base64Write
          return base64Write(this, string, offset, length);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ucs2Write(this, string, offset, length);

        default:
          if (loweredCase) throw new TypeError(`Unknown encoding: ${encoding}`);
          encoding = `${encoding}`.toLowerCase();
          loweredCase = true;
      }
    }
  };

  Buffer.prototype.toJSON = function toJSON() {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0),
    };
  };

  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return fromByteArray(buf);
    } else {
      return fromByteArray(buf.slice(start, end));
    }
  }

  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;

    while (i < end) {
      const firstByte = buf[i];
      let codePoint = null;
      let bytesPerSequence =
        firstByte > 0xef ? 4 : firstByte > 0xdf ? 3 : firstByte > 0xbf ? 2 : 1;

      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint;

        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 0x80) {
              codePoint = firstByte;
            }

            break;

          case 2:
            secondByte = buf[i + 1];

            if ((secondByte & 0xc0) === 0x80) {
              tempCodePoint = ((firstByte & 0x1f) << 0x6) | (secondByte & 0x3f);

              if (tempCodePoint > 0x7f) {
                codePoint = tempCodePoint;
              }
            }

            break;

          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];

            if ((secondByte & 0xc0) === 0x80 && (thirdByte & 0xc0) === 0x80) {
              tempCodePoint =
                ((firstByte & 0xf) << 0xc) |
                ((secondByte & 0x3f) << 0x6) |
                (thirdByte & 0x3f);

              if (
                tempCodePoint > 0x7ff &&
                (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff)
              ) {
                codePoint = tempCodePoint;
              }
            }

            break;

          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];

            if (
              (secondByte & 0xc0) === 0x80 &&
              (thirdByte & 0xc0) === 0x80 &&
              (fourthByte & 0xc0) === 0x80
            ) {
              tempCodePoint =
                ((firstByte & 0xf) << 0x12) |
                ((secondByte & 0x3f) << 0xc) |
                ((thirdByte & 0x3f) << 0x6) |
                (fourthByte & 0x3f);

              if (tempCodePoint > 0xffff && tempCodePoint < 0x110000) {
                codePoint = tempCodePoint;
              }
            }
        }
      }

      if (codePoint === null) {
        // we did not generate a valid codePoint so insert a
        // replacement char (U+FFFD) and advance only 1 byte
        codePoint = 0xfffd;
        bytesPerSequence = 1;
      } else if (codePoint > 0xffff) {
        // encode to utf16 (surrogate pair dance)
        codePoint -= 0x10000;
        res.push(((codePoint >>> 10) & 0x3ff) | 0xd800);
        codePoint = 0xdc00 | (codePoint & 0x3ff);
      }

      res.push(codePoint);
      i += bytesPerSequence;
    }

    return decodeCodePointsArray(res);
  } // Based on http://stackoverflow.com/a/22747272/680742, the browser with
  // the lowest limit is Chrome, with 0x10000 args.
  // We go 1 magnitude less, for safety

  const MAX_ARGUMENTS_LENGTH = 0x1000;

  function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;

    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
    } // Decode in chunks to avoid "call stack size exceeded".

    let res = '';
    let i = 0;

    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH)),
      );
    }

    return res;
  }

  function asciiSlice(buf, start, end) {
    let ret = '';
    end = Math.min(buf.length, end);

    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 0x7f);
    }

    return ret;
  }

  function latin1Slice(buf, start, end) {
    let ret = '';
    end = Math.min(buf.length, end);

    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }

    return ret;
  }

  function hexSlice(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    let out = '';

    for (let i = start; i < end; ++i) {
      out += toHex(buf[i]);
    }

    return out;
  }

  function utf16leSlice(buf, start, end) {
    const bytes = buf.slice(start, end);
    let res = '';

    for (let i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }

    return res;
  }

  Buffer.prototype.slice = function slice(start, end) {
    const len = this.length;
    start = Math.trunc(start);
    end = end === undefined ? len : Math.trunc(end);

    if (start < 0) {
      start += len;
      if (start < 0) start = 0;
    } else if (start > len) {
      start = len;
    }

    if (end < 0) {
      end += len;
      if (end < 0) end = 0;
    } else if (end > len) {
      end = len;
    }

    if (end < start) end = start;
    let newBuf;

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      newBuf = this.subarray(start, end);
      newBuf.__proto__ = Buffer.prototype;
    } else {
      const sliceLen = end - start;
      newBuf = Buffer.from(sliceLen, undefined);

      for (let i = 0; i < sliceLen; ++i) {
        newBuf[i] = this[i + start];
      }
    }

    return newBuf;
  };
  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */

  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0)
      throw new RangeError('offset is not uint');
    if (offset + ext > length)
      throw new RangeError('Trying to access beyond buffer length');
  }

  Buffer.prototype.readUIntLE = function readUIntLE(
    offset,
    byteLength,
    noAssert,
  ) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;

    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    return val;
  };

  Buffer.prototype.readUIntBE = function readUIntBE(
    offset,
    byteLength,
    noAssert,
  ) {
    offset = offset | 0;
    byteLength = byteLength | 0;

    if (!noAssert) {
      checkOffset(offset, byteLength, this.length);
    }

    let val = this[offset + --byteLength];
    let mul = 1;

    while (byteLength > 0 && (mul *= 0x100)) {
      val += this[offset + --byteLength] * mul;
    }

    return val;
  };

  Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
  };

  Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | (this[offset + 1] << 8);
  };

  Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return (this[offset] << 8) | this[offset + 1];
  };

  Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (
      (this[offset] | (this[offset + 1] << 8) | (this[offset + 2] << 16)) +
      this[offset + 3] * 0x1000000
    );
  };

  Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (
      this[offset] * 0x1000000 +
      ((this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3])
    );
  };

  Buffer.prototype.readIntLE = function readIntLE(
    offset,
    byteLength,
    noAssert,
  ) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;

    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    mul *= 0x80;
    if (val >= mul) val -= 2 ** (8 * byteLength);
    return val;
  };

  Buffer.prototype.readIntBE = function readIntBE(
    offset,
    byteLength,
    noAssert,
  ) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let i = byteLength;
    let mul = 1;
    let val = this[offset + --i];

    while (i > 0 && (mul *= 0x100)) {
      val += this[offset + --i] * mul;
    }

    mul *= 0x80;
    if (val >= mul) val -= 2 ** (8 * byteLength);
    return val;
  };

  Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xFF - this[offset] + 1) * -1;
  };

  Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset] | (this[offset + 1] << 8);
    return val & 0x8000 ? val | 0xffff0000 : val;
  };

  Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | (this[offset] << 8);
    return val & 0x8000 ? val | 0xffff0000 : val;
  };

  Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (
      this[offset] |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
    );
  };

  Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (
      (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3]
    );
  };

  Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return read(this, offset, true, 23, 4);
  };

  Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return read(this, offset, false, 23, 4);
  };

  Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return read(this, offset, true, 52, 8);
  };

  Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return read(this, offset, false, 52, 8);
  };

  function checkInt(buf, value, offset, ext, max, min) {
    if (!internalIsBuffer(buf))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min)
      throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
  }

  Buffer.prototype.writeUIntLE = function writeUIntLE(
    value,
    offset,
    byteLength,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;

    if (!noAssert) {
      const maxBytes = 2 ** (8 * byteLength) - 1;
      checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    let mul = 1;
    let i = 0;
    this[offset] = value & 0xff;

    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xff;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeUIntBE = function writeUIntBE(
    value,
    offset,
    byteLength,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;

    if (!noAssert) {
      const maxBytes = 2 ** (8 * byteLength) - 1;
      checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    let i = byteLength - 1;
    let mul = 1;
    this[offset + i] = value & 0xff;

    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xff;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xFF, 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    this[offset] = value & 0xFF;
    return offset + 1;
  };

  function objectWriteUInt16(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xFFFF + value + 1;

    for (let i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
      buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
        ((littleEndian ? i : 1 - i) * 8);
    }
  }

  Buffer.prototype.writeUInt16LE = function writeUInt16LE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xFFFF, 0);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xFF;
      this[offset + 1] = value >>> 8;
    } else {
      objectWriteUInt16(this, value, offset, true);
    }

    return offset + 2;
  };

  Buffer.prototype.writeUInt16BE = function writeUInt16BE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xFFFF, 0);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xFF;
    } else {
      objectWriteUInt16(this, value, offset, false);
    }

    return offset + 2;
  };

  function objectWriteUInt32(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xFFFFFFFF + value + 1;

    for (let i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
      buf[offset + i] = (value >>> ((littleEndian ? i : 3 - i) * 8)) & 0xFF;
    }
  }

  Buffer.prototype.writeUInt32LE = function writeUInt32LE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xFFFFFFFF, 0);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 0xFF;
    } else {
      objectWriteUInt32(this, value, offset, true);
    }

    return offset + 4;
  };

  Buffer.prototype.writeUInt32BE = function writeUInt32BE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xFFFFFFFF, 0);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xFF;
    } else {
      objectWriteUInt32(this, value, offset, false);
    }

    return offset + 4;
  };

  Buffer.prototype.writeIntLE = function writeIntLE(
    value,
    offset,
    byteLength,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;

    if (!noAssert) {
      const limit = 2 ** (8 * byteLength - 1);
      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 0xff;

    while (++i < byteLength && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }

      this[offset + i] = (Math.trunc(value / mul) - sub) & 0xff;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeIntBE = function writeIntBE(
    value,
    offset,
    byteLength,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;

    if (!noAssert) {
      const limit = 2 ** (8 * byteLength - 1);
      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    let i = byteLength - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 0xff;

    while (--i >= 0 && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }

      this[offset + i] = (Math.trunc(value / mul) - sub) & 0xff;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7F, -0x80);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    if (value < 0) value = 0xFF + value + 1;
    this[offset] = value & 0xFF;
    return offset + 1;
  };

  Buffer.prototype.writeInt16LE = function writeInt16LE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7FFF, -0x8000);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xFF;
      this[offset + 1] = value >>> 8;
    } else {
      objectWriteUInt16(this, value, offset, true);
    }

    return offset + 2;
  };

  Buffer.prototype.writeInt16BE = function writeInt16BE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7FFF, -0x8000);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xFF;
    } else {
      objectWriteUInt16(this, value, offset, false);
    }

    return offset + 2;
  };

  Buffer.prototype.writeInt32LE = function writeInt32LE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7FFFFFFF, -0x80000000);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xFF;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
    } else {
      objectWriteUInt32(this, value, offset, true);
    }

    return offset + 4;
  };

  Buffer.prototype.writeInt32BE = function writeInt32BE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7FFFFFFF, -0x80000000);
    if (value < 0) value = 0xFFFFFFFF + value + 1;

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xFF;
    } else {
      objectWriteUInt32(this, value, offset, false);
    }

    return offset + 4;
  };

  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
    if (offset < 0) throw new RangeError('Index out of range');
  }

  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4);
    }

    write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }

  Buffer.prototype.writeFloatLE = function writeFloatLE(
    value,
    offset,
    noAssert,
  ) {
    return writeFloat(this, value, offset, true, noAssert);
  };

  Buffer.prototype.writeFloatBE = function writeFloatBE(
    value,
    offset,
    noAssert,
  ) {
    return writeFloat(this, value, offset, false, noAssert);
  };

  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8);
    }

    write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }

  Buffer.prototype.writeDoubleLE = function writeDoubleLE(
    value,
    offset,
    noAssert,
  ) {
    return writeDouble(this, value, offset, true, noAssert);
  };

  Buffer.prototype.writeDoubleBE = function writeDoubleBE(
    value,
    offset,
    noAssert,
  ) {
    return writeDouble(this, value, offset, false, noAssert);
  }; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)

  Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

    if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds');
    }

    if (start < 0 || start >= this.length)
      throw new RangeError('sourceStart out of bounds');
    if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

    if (end > this.length) end = this.length;

    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }

    const len = end - start;
    let i;

    if (this === target && start < targetStart && targetStart < end) {
      // descending copy from end
      for (i = len - 1; i >= 0; --i) {
        target[i + targetStart] = this[i + start];
      }
    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
      // ascending copy from start
      for (i = 0; i < len; ++i) {
        target[i + targetStart] = this[i + start];
      }
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, start + len),
        targetStart,
      );
    }

    return len;
  }; // Usage:
  //    buffer.fill(number[, offset[, end]])
  //    buffer.fill(buffer[, offset[, end]])
  //    buffer.fill(string[, offset[, end]][, encoding])

  Buffer.prototype.fill = function fill(val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
      if (typeof start === 'string') {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === 'string') {
        encoding = end;
        end = this.length;
      }

      if (val.length === 1) {
        const code = val.charCodeAt(0);

        if (code < 256) {
          val = code;
        }
      }

      if (encoding !== undefined && typeof encoding !== 'string') {
        throw new TypeError('encoding must be a string');
      }

      if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
        throw new TypeError(`Unknown encoding: ${encoding}`);
      }
    } else if (typeof val === 'number') {
      val = val & 255;
    } // Invalid ranges are not set to a default, so can range check early.

    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError('Out of range index');
    }

    if (end <= start) {
      return this;
    }

    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    let i;

    if (typeof val === 'number') {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      const bytes = internalIsBuffer(val)
        ? val
        : utf8ToBytes(Buffer.from(val, encoding).toString());
      const len = bytes.length;

      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }

    return this;
  }; // HELPER FUNCTIONS
  // ================

  const INVALID_BASE64_RE = /[^\w+/-]/g;

  function base64clean(str) {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = stringtrim(str).replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

    if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

    while (str.length % 4 !== 0) {
      str = `${str}=`;
    }

    return str;
  }

  function stringtrim(str) {
    if (str.trim) return str.trim();
    return str.replace(/^\s+|\s+$/g, '');
  }

  function toHex(n) {
    if (n < 16) return `0${n.toString(16)}`;
    return n.toString(16);
  }

  function utf8ToBytes(string, units) {
    units = units || Number.POSITIVE_INFINITY;
    let codePoint;
    const length = string.length;
    let leadSurrogate = null;
    const bytes = [];

    for (let i = 0; i < length; ++i) {
      codePoint = string.charCodeAt(i); // is surrogate component

      if (codePoint > 0xd7ff && codePoint < 0xe000) {
        // last char was a lead
        if (!leadSurrogate) {
          // no lead yet
          if (codePoint > 0xdbff) {
            // unexpected trail
            if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
            continue;
          } else if (i + 1 === length) {
            // unpaired lead
            if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
            continue;
          } // valid lead

          leadSurrogate = codePoint;
          continue;
        } // 2 leads in a row

        if (codePoint < 0xdc00) {
          if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
          leadSurrogate = codePoint;
          continue;
        } // valid surrogate pair

        codePoint =
          (((leadSurrogate - 0xd800) << 10) | (codePoint - 0xdc00)) + 0x10000;
      } else if (
        leadSurrogate && // valid bmp char, but last char was a lead
        (units -= 3) > -1
      )
        bytes.push(0xEF, 0xBF, 0xBD);

      leadSurrogate = null; // encode utf8

      if (codePoint < 0x80) {
        if ((units -= 1) < 0) break;
        bytes.push(codePoint);
      } else if (codePoint < 0x800) {
        if ((units -= 2) < 0) break;
        bytes.push((codePoint >> 0x6) | 0xc0, (codePoint & 0x3f) | 0x80);
      } else if (codePoint < 0x10000) {
        if ((units -= 3) < 0) break;
        bytes.push(
          (codePoint >> 0xc) | 0xe0,
          ((codePoint >> 0x6) & 0x3f) | 0x80,
          (codePoint & 0x3f) | 0x80,
        );
      } else if (codePoint < 0x110000) {
        if ((units -= 4) < 0) break;
        bytes.push(
          (codePoint >> 0x12) | 0xf0,
          ((codePoint >> 0xc) & 0x3f) | 0x80,
          ((codePoint >> 0x6) & 0x3f) | 0x80,
          (codePoint & 0x3f) | 0x80,
        );
      } else {
        throw new Error('Invalid code point');
      }
    }

    return bytes;
  }

  function asciiToBytes(str) {
    const byteArray = [];

    for (let i = 0; i < str.length; ++i) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xff);
    }

    return byteArray;
  }

  function utf16leToBytes(str, units) {
    let c, hi, lo;
    const byteArray = [];

    for (let i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0) break;
      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo, hi);
    }

    return byteArray;
  }

  function base64ToBytes(str) {
    return toByteArray(base64clean(str));
  }

  function blitBuffer(src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
      if (i + offset >= dst.length || i >= src.length) break;
      dst[i + offset] = src[i];
    }

    return i;
  }

  function isnan(val) {
    return val !== val; // eslint-disable-line no-self-compare
  } // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
  // The _isBuffer check is for Safari 5-7 support, because it's missing
  // Object.prototype.constructor. Remove this eventually

  function isBuffer(obj) {
    return (
      obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
    );
  }

  function isFastBuffer(obj) {
    return (
      !!obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj)
    );
  } // For Node v0.10 support. Remove this eventually.

  function isSlowBuffer(obj) {
    return (
      typeof obj.readFloatLE === 'function' &&
      typeof obj.slice === 'function' &&
      isFastBuffer(obj.slice(0, 0))
    );
  }

  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

  function defaultSetTimout$1() {
    throw new Error('setTimeout has not been defined');
  }

  function defaultClearTimeout$1() {
    throw new Error('clearTimeout has not been defined');
  }

  let cachedSetTimeout$1 = defaultSetTimout$1;
  let cachedClearTimeout$1 = defaultClearTimeout$1;

  if (typeof global$2.setTimeout === 'function') {
    cachedSetTimeout$1 = setTimeout;
  }

  if (typeof global$2.clearTimeout === 'function') {
    cachedClearTimeout$1 = clearTimeout;
  }

  function runTimeout$1(fun) {
    if (cachedSetTimeout$1 === setTimeout) {
      //normal enviroments in sane situations
      return setTimeout(fun, 0);
    } // if setTimeout wasn't available but was latter defined

    if (
      (cachedSetTimeout$1 === defaultSetTimout$1 || !cachedSetTimeout$1) &&
      setTimeout
    ) {
      cachedSetTimeout$1 = setTimeout;
      return setTimeout(fun, 0);
    }

    try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedSetTimeout$1(fun, 0);
    } catch {
      try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
        return cachedSetTimeout$1.call(null, fun, 0);
      } catch {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
        return cachedSetTimeout$1.call(this, fun, 0);
      }
    }
  }

  function runClearTimeout$1(marker) {
    if (cachedClearTimeout$1 === clearTimeout) {
      //normal enviroments in sane situations
      return clearTimeout(marker);
    } // if clearTimeout wasn't available but was latter defined

    if (
      (cachedClearTimeout$1 === defaultClearTimeout$1 ||
        !cachedClearTimeout$1) &&
      clearTimeout
    ) {
      cachedClearTimeout$1 = clearTimeout;
      return clearTimeout(marker);
    }

    try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedClearTimeout$1(marker);
    } catch {
      try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
        return cachedClearTimeout$1.call(null, marker);
      } catch {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
        return cachedClearTimeout$1.call(this, marker);
      }
    }
  }

  let queue$1 = [];
  let draining$1 = false;
  let currentQueue$1;
  let queueIndex$1 = -1;

  function cleanUpNextTick$1() {
    if (!draining$1 || !currentQueue$1) {
      return;
    }

    draining$1 = false;

    if (currentQueue$1.length > 0) {
      queue$1 = currentQueue$1.concat(queue$1);
    } else {
      queueIndex$1 = -1;
    }

    if (queue$1.length > 0) {
      drainQueue$1();
    }
  }

  function drainQueue$1() {
    if (draining$1) {
      return;
    }

    const timeout = runTimeout$1(cleanUpNextTick$1);
    draining$1 = true;
    let len = queue$1.length;

    while (len) {
      currentQueue$1 = queue$1;
      queue$1 = [];

      while (++queueIndex$1 < len) {
        if (currentQueue$1) {
          currentQueue$1[queueIndex$1].run();
        }
      }

      queueIndex$1 = -1;
      len = queue$1.length;
    }

    currentQueue$1 = null;
    draining$1 = false;
    runClearTimeout$1(timeout);
  }

  function nextTick$1(fun) {
    const args = Array.from({ length: arguments.length - 1 });

    if (arguments.length > 1) {
      for (let i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
    }

    queue$1.push(new Item$1(fun, args));

    if (queue$1.length === 1 && !draining$1) {
      runTimeout$1(drainQueue$1);
    }
  } // v8 likes predictible objects

  function Item$1(fun, array) {
    this.fun = fun;
    this.array = array;
  }

  Item$1.prototype.run = function () {
    this.fun.apply(null, this.array);
  };

  const performance$1 = global$2.performance || {};

  performance$1.now ||
    performance$1.mozNow ||
    performance$1.msNow ||
    performance$1.oNow ||
    performance$1.webkitNow ||
    function () {
      return Date.now();
    }; // generate timestamp or delta

  let inherits;

  if (typeof Object.create === 'function') {
    inherits = function inherits(ctor, superCtor) {
      // implementation from standard node.js 'util' module
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true,
        },
      });
    };
  } else {
    inherits = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;

      const TempCtor = function TempCtor() {};

      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }

  const inherits$1 = inherits;

  const formatRegExp = /%[%djs]/g;
  function format(f) {
    if (!isString(f)) {
      const objects = [];

      for (var i = 0; i < arguments.length; i++) {
        objects.push(inspect(arguments[i]));
      }

      return objects.join(' ');
    }

    var i = 1;
    const args = arguments;
    const len = args.length;
    let str = String(f).replace(formatRegExp, x => {
      if (x === '%%') return '%';
      if (i >= len) return x;

      switch (x) {
        case '%s':
          return String(args[i++]);

        case '%d':
          return Number(args[i++]);

        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch {
            return '[Circular]';
          }

        default:
          return x;
      }
    });

    for (let x = args[i]; i < len; x = args[++i]) {
      if (isNull(x) || !isObject$1(x)) {
        str += ` ${x}`;
      } else {
        str += ` ${inspect(x)}`;
      }
    }

    return str;
  }
  // Returns a modified function which warns once by default.
  // If --no-deprecation is set, then it is a no-op.

  function deprecate(fn, msg) {
    // Allow for deprecating things in the process of starting up.
    if (isUndefined(global$2.process)) {
      return function () {
        return Reflect.apply(deprecate(fn, msg), this, arguments);
      };
    }

    let warned = false;

    function deprecated() {
      if (!warned) {
        {
          console.error(msg);
        }

        warned = true;
      }

      return Reflect.apply(fn, this, arguments);
    }

    return deprecated;
  }
  const debugs = {};
  let debugEnviron;
  function debuglog(set) {
    if (isUndefined(debugEnviron)) debugEnviron = '';
    set = set.toUpperCase();

    if (!debugs[set]) {
      if (new RegExp(`\\b${set}\\b`, 'i').test(debugEnviron)) {
        const pid = 0;

        debugs[set] = function () {
          const msg = Reflect.apply(format, null, arguments);
          console.error('%s %d: %s', set, pid, msg);
        };
      } else {
        debugs[set] = function () {};
      }
    }

    return debugs[set];
  }
  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} opts Optional options object that alters the output.
   */

  /* legacy: obj, showHidden, depth, colors*/

  function inspect(obj, opts) {
    // default options
    const ctx = {
      seen: [],
      stylize: stylizeNoColor,
    }; // legacy...

    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];

    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (opts) {
      // got an "options" object
      _extend(ctx, opts);
    } // set default options

    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  } // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

  inspect.colors = {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    white: [37, 39],
    grey: [90, 39],
    black: [30, 39],
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [31, 39],
    yellow: [33, 39],
  }; // Don't use 'blue' not visible on cmd.exe

  inspect.styles = {
    special: 'cyan',
    number: 'yellow',
    boolean: 'yellow',
    undefined: 'grey',
    null: 'bold',
    string: 'green',
    date: 'magenta',
    // "name": intentionally not styling
    regexp: 'red',
  };

  function stylizeWithColor(str, styleType) {
    const style = inspect.styles[styleType];

    if (style) {
      return (
        `\u001B[${ 
        inspect.colors[style][0] 
        }m${ 
        str 
        }\u001B[${ 
        inspect.colors[style][1] 
        }m`
      );
    } else {
      return str;
    }
  }

  function stylizeNoColor(str, styleType) {
    return str;
  }

  function arrayToHash(array) {
    const hash = {};
    array.forEach((val, idx) => {
      hash[val] = true;
    });
    return hash;
  }

  function formatValue(ctx, value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (
      ctx.customInspect &&
      value &&
      isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
      value.inspect !== inspect && // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)
    ) {
      let ret = value.inspect(recurseTimes, ctx);

      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }

      return ret;
    } // Primitive types cannot have properties

    const primitive = formatPrimitive(ctx, value);

    if (primitive) {
      return primitive;
    } // Look up the keys of the object.

    let keys = Object.keys(value);
    const visibleKeys = arrayToHash(keys);

    if (ctx.showHidden) {
      keys = Object.getOwnPropertyNames(value);
    } // IE doesn't make error fields non-enumerable
    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx

    if (
      isError(value) &&
      (keys.includes('message') || keys.includes('description'))
    ) {
      return formatError(value);
    } // Some type of object without properties can be shortcutted.

    if (keys.length === 0) {
      if (isFunction(value)) {
        const name = value.name ? `: ${value.name}` : '';
        return ctx.stylize(`[Function${name}]`, 'special');
      }

      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      }

      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), 'date');
      }

      if (isError(value)) {
        return formatError(value);
      }
    }

    let base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

    if (isArray$2(value)) {
      array = true;
      braces = ['[', ']'];
    } // Make functions say that they are functions

    if (isFunction(value)) {
      const n = value.name ? `: ${value.name}` : '';
      base = ` [Function${n}]`;
    } // Make RegExps say that they are RegExps

    if (isRegExp(value)) {
      base = ` ${RegExp.prototype.toString.call(value)}`;
    } // Make dates with properties first say the date

    if (isDate(value)) {
      base = ` ${Date.prototype.toUTCString.call(value)}`;
    } // Make error with message first say the error

    if (isError(value)) {
      base = ` ${formatError(value)}`;
    }

    if (keys.length === 0 && (!array || value.length === 0)) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }

    ctx.seen.push(value);
    let output;

    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
      output = keys.map(key => {
        return formatProperty(
          ctx,
          value,
          recurseTimes,
          visibleKeys,
          key,
          array,
        );
      });
    }

    ctx.seen.pop();
    return reduceToSingleString(output, base, braces);
  }

  function formatPrimitive(ctx, value) {
    if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

    if (isString(value)) {
      const simple =
        `'${ 
        JSON.stringify(value)
          .replace(/^"|"$/g, '')
          .replace(/'/g, "\\'")
          .replace(/\\"/g, '"') 
        }'`;
      return ctx.stylize(simple, 'string');
    }

    if (isNumber(value)) return ctx.stylize(`${value}`, 'number');
    if (isBoolean(value)) return ctx.stylize(`${value}`, 'boolean'); // For some reason typeof null is "object", so special case here.

    if (isNull(value)) return ctx.stylize('null', 'null');
  }

  function formatError(value) {
    return `[${Error.prototype.toString.call(value)}]`;
  }

  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    const output = [];

    for (let i = 0, l = value.length; i < l; ++i) {
      if (hasOwnProperty$1(value, String(i))) {
        output.push(
          formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            String(i),
            true,
          ),
        );
      } else {
        output.push('');
      }
    }

    keys.forEach(key => {
      if (!key.match(/^\d+$/)) {
        output.push(
          formatProperty(ctx, value, recurseTimes, visibleKeys, key, true),
        );
      }
    });
    return output;
  }

  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    let name, str, desc;
    desc = Object.getOwnPropertyDescriptor(value, key) || {
      value: value[key],
    };

    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }

    if (!hasOwnProperty$1(visibleKeys, key)) {
      name = `[${key}]`;
    }

    if (!str) {
      if (!ctx.seen.includes(desc.value)) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }

        if (str.includes('\n')) {
          if (array) {
            str = str
              .split('\n')
              .map(line => {
                return `  ${line}`;
              })
              .join('\n')
              .slice(2);
          } else {
            str = `\n${str
              .split('\n')
              .map(line => {
                return `   ${line}`;
              })
              .join('\n')}`;
          }
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }

    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }

      name = JSON.stringify(`${key}`);

      if (name.match(/^"([A-Z_a-z]\w*)"$/)) {
        name = name.slice(1, 1 + name.length - 2);
        name = ctx.stylize(name, 'name');
      } else {
        name = name
          .replaceAll("'", "\\'")
          .replaceAll('\\"', '"')
          .replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, 'string');
      }
    }

    return `${name}: ${str}`;
  }

  function reduceToSingleString(output, base, braces) {
    const length = output.reduce((prev, cur) => {
      if (cur.includes('\n'));
      return prev + cur.replace(/\u001B\[\d\d?m/g, '').length + 1;
    }, 0);

    if (length > 60) {
      return `${braces[0] + (base === '' ? '' : base + '\n ')} ${output.join(
        ',\n  ',
      )} ${braces[1]}`;
    }

    return `${braces[0] + base} ${output.join(', ')} ${braces[1]}`;
  } // NOTE: These type checking functions intentionally don't use `instanceof`
  // because it is fragile and can be easily faked with `Object.create()`.

  function isArray$2(ar) {
    return Array.isArray(ar);
  }
  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }
  function isNull(arg) {
    return arg === null;
  }
  function isNullOrUndefined(arg) {
    return arg == null;
  }
  function isNumber(arg) {
    return typeof arg === 'number';
  }
  function isString(arg) {
    return typeof arg === 'string';
  }
  function isSymbol$1(arg) {
    return _typeof(arg) === 'symbol';
  }
  function isUndefined(arg) {
    return arg === void 0;
  }
  function isRegExp(re) {
    return isObject$1(re) && objectToString$1(re) === '[object RegExp]';
  }
  function isObject$1(arg) {
    return _typeof(arg) === 'object' && arg !== null;
  }
  function isDate(d) {
    return isObject$1(d) && objectToString$1(d) === '[object Date]';
  }
  function isError(e) {
    return (
      isObject$1(e) &&
      (objectToString$1(e) === '[object Error]' || e instanceof Error)
    );
  }
  function isFunction(arg) {
    return typeof arg === 'function';
  }
  function isPrimitive(arg) {
    return (
      arg === null ||
      typeof arg === 'boolean' ||
      typeof arg === 'number' ||
      typeof arg === 'string' ||
      _typeof(arg) === 'symbol' || // ES6 symbol
      typeof arg === 'undefined'
    );
  }
  function isBuffer$1(maybeBuf) {
    return isBuffer(maybeBuf);
  }

  function objectToString$1(o) {
    return Object.prototype.toString.call(o);
  }

  function pad(n) {
    return n < 10 ? `0${n.toString(10)}` : n.toString(10);
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]; // 26 Feb 16:19:34

  function timestamp() {
    const d = new Date();
    const time = [
      pad(d.getHours()),
      pad(d.getMinutes()),
      pad(d.getSeconds()),
    ].join(':');
    return [d.getDate(), months[d.getMonth()], time].join(' ');
  } // log is just a thin wrapper to console.log that prepends a timestamp

  function log$1() {
    console.log('%s - %s', timestamp(), Reflect.apply(format, null, arguments));
  }
  function _extend(origin, add) {
    // Don't do anything if add isn't an object
    if (!add || !isObject$1(add)) return origin;
    const keys = Object.keys(add);
    let i = keys.length;

    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }

    return origin;
  }

  function hasOwnProperty$1(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  const util = {
    inherits: inherits$1,
    _extend,
    log: log$1,
    isBuffer: isBuffer$1,
    isPrimitive,
    isFunction,
    isError,
    isDate,
    isObject: isObject$1,
    isRegExp,
    isUndefined,
    isSymbol: isSymbol$1,
    isString,
    isNumber,
    isNullOrUndefined,
    isNull,
    isBoolean,
    isArray: isArray$2,
    inspect,
    deprecate,
    format,
    debuglog,
  };

  const lookup$1 = [];
  const revLookup$1 = [];
  const Arr$1 = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
  let inited$1 = false;

  function init$1() {
    inited$1 = true;
    const code =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    for (let i = 0, len = code.length; i < len; ++i) {
      lookup$1[i] = code[i];
      revLookup$1[code.charCodeAt(i)] = i;
    }

    revLookup$1['-'.charCodeAt(0)] = 62;
    revLookup$1['_'.charCodeAt(0)] = 63;
  }

  function toByteArray$1(b64) {
    if (!inited$1) {
      init$1();
    }

    let i, j, l, tmp, placeHolders, arr;
    const len = b64.length;

    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4');
    } // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice

    placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0; // base64 is 4/3 + up to two characters of the original data

    arr = new Arr$1((len * 3) / 4 - placeHolders); // if there are placeholders, only get up to the last complete 4 chars

    l = placeHolders > 0 ? len - 4 : len;
    let L = 0;

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
      tmp =
        (revLookup$1[b64.charCodeAt(i)] << 18) |
        (revLookup$1[b64.charCodeAt(i + 1)] << 12) |
        (revLookup$1[b64.charCodeAt(i + 2)] << 6) |
        revLookup$1[b64.charCodeAt(i + 3)];
      arr[L++] = (tmp >> 16) & 0xff;
      arr[L++] = (tmp >> 8) & 0xff;
      arr[L++] = tmp & 0xff;
    }

    if (placeHolders === 2) {
      tmp =
        (revLookup$1[b64.charCodeAt(i)] << 2) |
        (revLookup$1[b64.charCodeAt(i + 1)] >> 4);
      arr[L++] = tmp & 0xff;
    } else if (placeHolders === 1) {
      tmp =
        (revLookup$1[b64.charCodeAt(i)] << 10) |
        (revLookup$1[b64.charCodeAt(i + 1)] << 4) |
        (revLookup$1[b64.charCodeAt(i + 2)] >> 2);
      arr[L++] = (tmp >> 8) & 0xff;
      arr[L++] = tmp & 0xff;
    }

    return arr;
  }

  function tripletToBase64$1(num) {
    return (
      lookup$1[(num >> 18) & 0x3f] +
      lookup$1[(num >> 12) & 0x3f] +
      lookup$1[(num >> 6) & 0x3f] +
      lookup$1[num & 0x3f]
    );
  }

  function encodeChunk$1(uint8, start, end) {
    let tmp;
    const output = [];

    for (let i = start; i < end; i += 3) {
      tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
      output.push(tripletToBase64$1(tmp));
    }

    return output.join('');
  }

  function fromByteArray$1(uint8) {
    if (!inited$1) {
      init$1();
    }

    let tmp;
    const len = uint8.length;
    const extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

    let output = '';
    const parts = [];
    const maxChunkLength = 16383; // must be multiple of 3
    // go through the array every three bytes, we'll deal with trailing stuff later

    for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(
        encodeChunk$1(
          uint8,
          i,
          i + maxChunkLength > len2 ? len2 : i + maxChunkLength,
        ),
      );
    } // pad the end with zeros, but make sure to not forget the extra bytes

    if (extraBytes === 1) {
      tmp = uint8[len - 1];
      output += lookup$1[tmp >> 2];
      output += lookup$1[(tmp << 4) & 0x3f];
      output += '==';
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1];
      output += lookup$1[tmp >> 10];
      output += lookup$1[(tmp >> 4) & 0x3f];
      output += lookup$1[(tmp << 2) & 0x3f];
      output += '=';
    }

    parts.push(output);
    return parts.join('');
  }

  function read$1(buffer, offset, isLE, mLen, nBytes) {
    let e, m;
    const eLen = nBytes * 8 - mLen - 1;
    const eMax = (1 << eLen) - 1;
    const eBias = eMax >> 1;
    let nBits = -7;
    let i = isLE ? nBytes - 1 : 0;
    const d = isLE ? -1 : 1;
    let s = buffer[offset + i];
    i += d;
    e = s & ((1 << -nBits) - 1);
    s >>= -nBits;
    nBits += eLen;

    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & ((1 << -nBits) - 1);
    e >>= -nBits;
    nBits += mLen;

    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? Number.NaN : (s ? -1 : 1) * Number.POSITIVE_INFINITY;
    } else {
      m = m + 2 ** mLen;
      e = e - eBias;
    }

    return (s ? -1 : 1) * m * 2 ** (e - mLen);
  }

  function write$1(buffer, value, offset, isLE, mLen, nBytes) {
    let e, m, c;
    let eLen = nBytes * 8 - mLen - 1;
    const eMax = (1 << eLen) - 1;
    const eBias = eMax >> 1;
    const rt = mLen === 23 ? 2 ** -24 - 2 ** -77 : 0;
    let i = isLE ? 0 : nBytes - 1;
    const d = isLE ? 1 : -1;
    const s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
    value = Math.abs(value);

    if (isNaN(value) || value === Number.POSITIVE_INFINITY) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);

      if (value * (c = 2 ** -e) < 1) {
        e--;
        c *= 2;
      }

      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * 2 ** (1 - eBias);
      }

      if (value * c >= 2) {
        e++;
        c /= 2;
      }

      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * 2 ** mLen;
        e = e + eBias;
      } else {
        m = value * 2 ** (eBias - 1) * 2 ** mLen;
        e = 0;
      }
    }

    for (
      ;
      mLen >= 8;
      buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8
    ) {}

    e = (e << mLen) | m;
    eLen += mLen;

    for (
      ;
      eLen > 0;
      buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8
    ) {}

    buffer[offset + i - d] |= s * 128;
  }

  const toString$3 = {}.toString;

  const isArray$3 =
    Array.isArray ||
    function (arr) {
      return toString$3.call(arr) == '[object Array]';
    };
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */

  const INSPECT_MAX_BYTES$1 = 50;
  /**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */

  Buffer$1.TYPED_ARRAY_SUPPORT =
    global$2.TYPED_ARRAY_SUPPORT !== undefined
      ? global$2.TYPED_ARRAY_SUPPORT
      : true;

  function kMaxLength$1() {
    return Buffer$1.TYPED_ARRAY_SUPPORT ? 0x7FFFFFFF : 0x3FFFFFFF;
  }

  function createBuffer$1(that, length) {
    if (kMaxLength$1() < length) {
      throw new RangeError('Invalid typed array length');
    }

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = new Uint8Array(length);
      that.__proto__ = Buffer$1.prototype;
    } else {
      // Fallback: Return an object instance of the Buffer class
      if (that === null) {
        that = new Buffer$1(length);
      }

      that.length = length;
    }

    return that;
  }
  /**
   * The Buffer constructor returns instances of `Uint8Array` that have their
   * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
   * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
   * and the `Uint8Array` methods. Square bracket notation works as expected -- it
   * returns a single octet.
   *
   * The `Uint8Array` prototype remains unmodified.
   */

  function Buffer$1(arg, encodingOrOffset, length) {
    if (!Buffer$1.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer$1)) {
      return new Buffer$1(arg, encodingOrOffset, length);
    } // Common case.

    if (typeof arg === 'number') {
      if (typeof encodingOrOffset === 'string') {
        throw new TypeError(
          'If encoding is specified then the first argument must be a string',
        );
      }

      return allocUnsafe$1(this, arg);
    }

    return from$1(this, arg, encodingOrOffset, length);
  }

  Buffer$1.poolSize = 8192; // not used by this implementation
  // TODO: Legacy, not needed anymore. Remove in next major version.

  Buffer$1._augment = function (arr) {
    arr.__proto__ = Buffer$1.prototype;
    return arr;
  };

  function from$1(that, value, encodingOrOffset, length) {
    if (typeof value === 'number') {
      throw new TypeError('"value" argument must not be a number');
    }

    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
      return fromArrayBuffer$1(that, value, encodingOrOffset, length);
    }

    if (typeof value === 'string') {
      return fromString$1(that, value, encodingOrOffset);
    }

    return fromObject$1(that, value);
  }
  /**
   * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
   * if value is a number.
   * Buffer.from(str[, encoding])
   * Buffer.from(array)
   * Buffer.from(buffer)
   * Buffer.from(arrayBuffer[, byteOffset[, length]])
   **/

  Buffer$1.from = function (value, encodingOrOffset, length) {
    return from$1(null, value, encodingOrOffset, length);
  };

  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    Buffer$1.prototype.__proto__ = Uint8Array.prototype;
    Buffer$1.__proto__ = Uint8Array;
  }

  function assertSize$1(size) {
    if (typeof size !== 'number') {
      throw new TypeError('"size" argument must be a number');
    } else if (size < 0) {
      throw new RangeError('"size" argument must not be negative');
    }
  }

  function alloc$1(that, size, fill, encoding) {
    assertSize$1(size);

    if (size <= 0) {
      return createBuffer$1(that, size);
    }

    if (fill !== undefined) {
      // Only pay attention to encoding if it's a string. This
      // prevents accidentally sending in a number that would
      // be interpretted as a start offset.
      return typeof encoding === 'string'
        ? createBuffer$1(that, size).fill(fill, encoding)
        : createBuffer$1(that, size).fill(fill);
    }

    return createBuffer$1(that, size);
  }
  /**
   * Creates a new filled Buffer instance.
   * alloc(size[, fill[, encoding]])
   **/

  Buffer$1.alloc = function (size, fill, encoding) {
    return alloc$1(null, size, fill, encoding);
  };

  function allocUnsafe$1(that, size) {
    assertSize$1(size);
    that = createBuffer$1(that, size < 0 ? 0 : checked$1(size) | 0);

    if (!Buffer$1.TYPED_ARRAY_SUPPORT) {
      for (let i = 0; i < size; ++i) {
        that[i] = 0;
      }
    }

    return that;
  }
  /**
   * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
   * */

  Buffer$1.allocUnsafe = function (size) {
    return allocUnsafe$1(null, size);
  };
  /**
   * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
   */

  Buffer$1.allocUnsafeSlow = function (size) {
    return allocUnsafe$1(null, size);
  };

  function fromString$1(that, string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
      encoding = 'utf8';
    }

    if (!Buffer$1.isEncoding(encoding)) {
      throw new TypeError('"encoding" must be a valid string encoding');
    }

    const length = byteLength$1(string, encoding) | 0;
    that = createBuffer$1(that, length);
    const actual = that.write(string, encoding);

    if (actual !== length) {
      // Writing a hex string, for example, that contains invalid characters will
      // cause everything after the first invalid character to be ignored. (e.g.
      // 'abxxcd' will be treated as 'ab')
      that = that.slice(0, actual);
    }

    return that;
  }

  function fromArrayLike$1(that, array) {
    const length = array.length < 0 ? 0 : checked$1(array.length) | 0;
    that = createBuffer$1(that, length);

    for (let i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }

    return that;
  }

  function fromArrayBuffer$1(that, array, byteOffset, length) {
    array.byteLength; // this throws if `array` is not a valid ArrayBuffer

    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError("'offset' is out of bounds");
    }

    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError("'length' is out of bounds");
    }

    if (byteOffset === undefined && length === undefined) {
      array = new Uint8Array(array);
    } else if (length === undefined) {
      array = new Uint8Array(array, byteOffset);
    } else {
      array = new Uint8Array(array, byteOffset, length);
    }

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = array;
      that.__proto__ = Buffer$1.prototype;
    } else {
      // Fallback: Return an object instance of the Buffer class
      that = fromArrayLike$1(that, array);
    }

    return that;
  }

  function fromObject$1(that, obj) {
    if (internalIsBuffer$1(obj)) {
      const len = checked$1(obj.length) | 0;
      that = createBuffer$1(that, len);

      if (that.length === 0) {
        return that;
      }

      obj.copy(that, 0, 0, len);
      return that;
    }

    if (obj) {
      if (
        (typeof ArrayBuffer !== 'undefined' &&
          obj.buffer instanceof ArrayBuffer) ||
        'length' in obj
      ) {
        if (typeof obj.length !== 'number' || isnan$1(obj.length)) {
          return createBuffer$1(that, 0);
        }

        return fromArrayLike$1(that, obj);
      }

      if (obj.type === 'Buffer' && isArray$3(obj.data)) {
        return fromArrayLike$1(that, obj.data);
      }
    }

    throw new TypeError(
      'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.',
    );
  }

  function checked$1(length) {
    // Note: cannot use `length < kMaxLength()` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= kMaxLength$1()) {
      throw new RangeError(
        `Attempt to allocate Buffer larger than maximum ` +
          `size: 0x${
          kMaxLength$1().toString(16)
          } bytes`,
      );
    }

    return length | 0;
  }

  Buffer$1.isBuffer = isBuffer$2;

  function internalIsBuffer$1(b) {
    return !!(b != null && b._isBuffer);
  }

  Buffer$1.compare = function compare(a, b) {
    if (!internalIsBuffer$1(a) || !internalIsBuffer$1(b)) {
      throw new TypeError('Arguments must be Buffers');
    }

    if (a === b) return 0;
    let x = a.length;
    let y = b.length;

    for (let i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };

  Buffer$1.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'latin1':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true;

      default:
        return false;
    }
  };

  Buffer$1.concat = function concat(list, length) {
    if (!isArray$3(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }

    if (list.length === 0) {
      return Buffer$1.alloc(0);
    }

    let i;

    if (length === undefined) {
      length = 0;

      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }

    const buffer = Buffer$1.allocUnsafe(length);
    let pos = 0;

    for (i = 0; i < list.length; ++i) {
      const buf = list[i];

      if (!internalIsBuffer$1(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }

      buf.copy(buffer, pos);
      pos += buf.length;
    }

    return buffer;
  };

  function byteLength$1(string, encoding) {
    if (internalIsBuffer$1(string)) {
      return string.length;
    }

    if (
      typeof ArrayBuffer !== 'undefined' &&
      typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)
    ) {
      return string.byteLength;
    }

    if (typeof string !== 'string') {
      string = `${string}`;
    }

    const len = string.length;
    if (len === 0) return 0; // Use a for loop to avoid recursion

    let loweredCase = false;

    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'latin1':
        case 'binary':
          return len;

        case 'utf8':
        case 'utf-8':
        case undefined:
          return utf8ToBytes$1(string).length;

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return len * 2;

        case 'hex':
          return len >>> 1;

        case 'base64':
          return base64ToBytes$1(string).length;

        default:
          if (loweredCase) return utf8ToBytes$1(string).length; // assume utf8

          encoding = `${encoding}`.toLowerCase();
          loweredCase = true;
      }
    }
  }

  Buffer$1.byteLength = byteLength$1;

  function slowToString$1(encoding, start, end) {
    let loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

    if (start === undefined || start < 0) {
      start = 0;
    } // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.

    if (start > this.length) {
      return '';
    }

    if (end === undefined || end > this.length) {
      end = this.length;
    }

    if (end <= 0) {
      return '';
    } // Force coersion to uint32. This will also coerce falsey/NaN values to 0.

    end >>>= 0;
    start >>>= 0;

    if (end <= start) {
      return '';
    }

    if (!encoding) encoding = 'utf8';

    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice$1(this, start, end);

        case 'utf8':
        case 'utf-8':
          return utf8Slice$1(this, start, end);

        case 'ascii':
          return asciiSlice$1(this, start, end);

        case 'latin1':
        case 'binary':
          return latin1Slice$1(this, start, end);

        case 'base64':
          return base64Slice$1(this, start, end);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return utf16leSlice$1(this, start, end);

        default:
          if (loweredCase) throw new TypeError(`Unknown encoding: ${encoding}`);
          encoding = `${encoding}`.toLowerCase();
          loweredCase = true;
      }
    }
  } // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
  // Buffer instances.

  Buffer$1.prototype._isBuffer = true;

  function swap$1(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
  }

  Buffer$1.prototype.swap16 = function swap16() {
    const len = this.length;

    if (len % 2 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 16-bits');
    }

    for (let i = 0; i < len; i += 2) {
      swap$1(this, i, i + 1);
    }

    return this;
  };

  Buffer$1.prototype.swap32 = function swap32() {
    const len = this.length;

    if (len % 4 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 32-bits');
    }

    for (let i = 0; i < len; i += 4) {
      swap$1(this, i, i + 3);
      swap$1(this, i + 1, i + 2);
    }

    return this;
  };

  Buffer$1.prototype.swap64 = function swap64() {
    const len = this.length;

    if (len % 8 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 64-bits');
    }

    for (let i = 0; i < len; i += 8) {
      swap$1(this, i, i + 7);
      swap$1(this, i + 1, i + 6);
      swap$1(this, i + 2, i + 5);
      swap$1(this, i + 3, i + 4);
    }

    return this;
  };

  Buffer$1.prototype.toString = function toString() {
    const length = this.length | 0;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice$1(this, 0, length);
    return Reflect.apply(slowToString$1, this, arguments);
  };

  Buffer$1.prototype.equals = function equals(b) {
    if (!internalIsBuffer$1(b))
      throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer$1.compare(this, b) === 0;
  };

  Buffer$1.prototype.inspect = function inspect() {
    let str = '';
    const max = INSPECT_MAX_BYTES$1;

    if (this.length > 0) {
      str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
      if (this.length > max) str += ' ... ';
    }

    return `<Buffer ${str}>`;
  };

  Buffer$1.prototype.compare = function compare(
    target,
    start,
    end,
    thisStart,
    thisEnd,
  ) {
    if (!internalIsBuffer$1(target)) {
      throw new TypeError('Argument must be a Buffer');
    }

    if (start === undefined) {
      start = 0;
    }

    if (end === undefined) {
      end = target ? target.length : 0;
    }

    if (thisStart === undefined) {
      thisStart = 0;
    }

    if (thisEnd === undefined) {
      thisEnd = this.length;
    }

    if (
      start < 0 ||
      end > target.length ||
      thisStart < 0 ||
      thisEnd > this.length
    ) {
      throw new RangeError('out of range index');
    }

    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }

    if (thisStart >= thisEnd) {
      return -1;
    }

    if (start >= end) {
      return 1;
    }

    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);

    for (let i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
      }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  }; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
  // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
  //
  // Arguments:
  // - buffer - a Buffer to search
  // - val - a string, Buffer, or number
  // - byteOffset - an index into `buffer`; will be clamped to an int32
  // - encoding - an optional encoding, relevant is val is a string
  // - dir - true for indexOf, false for lastIndexOf

  function bidirectionalIndexOf$1(buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1; // Normalize byteOffset

    if (typeof byteOffset === 'string') {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 0x7FFFFFFF) {
      byteOffset = 0x7FFFFFFF;
    } else if (byteOffset < -0x80000000) {
      byteOffset = -0x80000000;
    }

    byteOffset = +byteOffset; // Coerce to Number.

    if (isNaN(byteOffset)) {
      // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
      byteOffset = dir ? 0 : buffer.length - 1;
    } // Normalize byteOffset: negative offsets start from the end of the buffer

    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

    if (byteOffset >= buffer.length) {
      if (dir) return -1;
      else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0;
      else return -1;
    } // Normalize val

    if (typeof val === 'string') {
      val = Buffer$1.from(val, encoding);
    } // Finally, search either indexOf (if dir is true) or lastIndexOf

    if (internalIsBuffer$1(val)) {
      // Special case: looking for empty string/buffer always fails
      if (val.length === 0) {
        return -1;
      }

      return arrayIndexOf$1(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
      val = val & 0xff; // Search for a byte value [0-255]

      if (
        Buffer$1.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function'
      ) {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
      }

      return arrayIndexOf$1(buffer, [val], byteOffset, encoding, dir);
    }

    throw new TypeError('val must be string, number or Buffer');
  }

  function arrayIndexOf$1(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;

    if (encoding !== undefined) {
      encoding = String(encoding).toLowerCase();

      if (
        encoding === 'ucs2' ||
        encoding === 'ucs-2' ||
        encoding === 'utf16le' ||
        encoding === 'utf-16le'
      ) {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }

        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }

    function read(buf, i) {
      if (indexSize === 1) {
        return buf[i];
      } else {
        return buf.readUInt16BE(i * indexSize);
      }
    }

    let i;

    if (dir) {
      let foundIndex = -1;

      for (i = byteOffset; i < arrLength; i++) {
        if (
          read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)
        ) {
          if (foundIndex === -1) foundIndex = i;
          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1) i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength)
        byteOffset = arrLength - valLength;

      for (i = byteOffset; i >= 0; i--) {
        let found = true;

        for (let j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break;
          }
        }

        if (found) return i;
      }
    }

    return -1;
  }

  Buffer$1.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };

  Buffer$1.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf$1(this, val, byteOffset, encoding, true);
  };

  Buffer$1.prototype.lastIndexOf = function lastIndexOf(
    val,
    byteOffset,
    encoding,
  ) {
    return bidirectionalIndexOf$1(this, val, byteOffset, encoding, false);
  };

  function hexWrite$1(buf, string, offset, length) {
    offset = Number(offset) || 0;
    const remaining = buf.length - offset;

    if (!length) {
      length = remaining;
    } else {
      length = Number(length);

      if (length > remaining) {
        length = remaining;
      }
    } // must be an even number of digits

    const strLen = string.length;
    if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

    if (length > strLen / 2) {
      length = strLen / 2;
    }

    for (var i = 0; i < length; ++i) {
      const parsed = Number.parseInt(string.slice(i * 2, i * 2 + 2), 16);
      if (isNaN(parsed)) return i;
      buf[offset + i] = parsed;
    }

    return i;
  }

  function utf8Write$1(buf, string, offset, length) {
    return blitBuffer$1(
      utf8ToBytes$1(string, buf.length - offset),
      buf,
      offset,
      length,
    );
  }

  function asciiWrite$1(buf, string, offset, length) {
    return blitBuffer$1(asciiToBytes$1(string), buf, offset, length);
  }

  function latin1Write$1(buf, string, offset, length) {
    return asciiWrite$1(buf, string, offset, length);
  }

  function base64Write$1(buf, string, offset, length) {
    return blitBuffer$1(base64ToBytes$1(string), buf, offset, length);
  }

  function ucs2Write$1(buf, string, offset, length) {
    return blitBuffer$1(
      utf16leToBytes$1(string, buf.length - offset),
      buf,
      offset,
      length,
    );
  }

  Buffer$1.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
      encoding = 'utf8';
      length = this.length;
      offset = 0; // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
      encoding = offset;
      length = this.length;
      offset = 0; // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
      offset = offset | 0;

      if (isFinite(length)) {
        length = length | 0;
        if (encoding === undefined) encoding = 'utf8';
      } else {
        encoding = length;
        length = undefined;
      } // legacy write(string, encoding, offset, length) - remove in v0.13
    } else {
      throw new TypeError(
        'Buffer.write(string, encoding, offset[, length]) is no longer supported',
      );
    }

    const remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;

    if (
      (string.length > 0 && (length < 0 || offset < 0)) ||
      offset > this.length
    ) {
      throw new RangeError('Attempt to write outside buffer bounds');
    }

    if (!encoding) encoding = 'utf8';
    let loweredCase = false;

    for (;;) {
      switch (encoding) {
        case 'hex':
          return hexWrite$1(this, string, offset, length);

        case 'utf8':
        case 'utf-8':
          return utf8Write$1(this, string, offset, length);

        case 'ascii':
          return asciiWrite$1(this, string, offset, length);

        case 'latin1':
        case 'binary':
          return latin1Write$1(this, string, offset, length);

        case 'base64':
          // Warning: maxLength not taken into account in base64Write
          return base64Write$1(this, string, offset, length);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ucs2Write$1(this, string, offset, length);

        default:
          if (loweredCase) throw new TypeError(`Unknown encoding: ${encoding}`);
          encoding = `${encoding}`.toLowerCase();
          loweredCase = true;
      }
    }
  };

  Buffer$1.prototype.toJSON = function toJSON() {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0),
    };
  };

  function base64Slice$1(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return fromByteArray$1(buf);
    } else {
      return fromByteArray$1(buf.slice(start, end));
    }
  }

  function utf8Slice$1(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;

    while (i < end) {
      const firstByte = buf[i];
      let codePoint = null;
      let bytesPerSequence =
        firstByte > 0xef ? 4 : firstByte > 0xdf ? 3 : firstByte > 0xbf ? 2 : 1;

      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint;

        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 0x80) {
              codePoint = firstByte;
            }

            break;

          case 2:
            secondByte = buf[i + 1];

            if ((secondByte & 0xc0) === 0x80) {
              tempCodePoint = ((firstByte & 0x1f) << 0x6) | (secondByte & 0x3f);

              if (tempCodePoint > 0x7f) {
                codePoint = tempCodePoint;
              }
            }

            break;

          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];

            if ((secondByte & 0xc0) === 0x80 && (thirdByte & 0xc0) === 0x80) {
              tempCodePoint =
                ((firstByte & 0xf) << 0xc) |
                ((secondByte & 0x3f) << 0x6) |
                (thirdByte & 0x3f);

              if (
                tempCodePoint > 0x7ff &&
                (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff)
              ) {
                codePoint = tempCodePoint;
              }
            }

            break;

          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];

            if (
              (secondByte & 0xc0) === 0x80 &&
              (thirdByte & 0xc0) === 0x80 &&
              (fourthByte & 0xc0) === 0x80
            ) {
              tempCodePoint =
                ((firstByte & 0xf) << 0x12) |
                ((secondByte & 0x3f) << 0xc) |
                ((thirdByte & 0x3f) << 0x6) |
                (fourthByte & 0x3f);

              if (tempCodePoint > 0xffff && tempCodePoint < 0x110000) {
                codePoint = tempCodePoint;
              }
            }
        }
      }

      if (codePoint === null) {
        // we did not generate a valid codePoint so insert a
        // replacement char (U+FFFD) and advance only 1 byte
        codePoint = 0xfffd;
        bytesPerSequence = 1;
      } else if (codePoint > 0xffff) {
        // encode to utf16 (surrogate pair dance)
        codePoint -= 0x10000;
        res.push(((codePoint >>> 10) & 0x3ff) | 0xd800);
        codePoint = 0xdc00 | (codePoint & 0x3ff);
      }

      res.push(codePoint);
      i += bytesPerSequence;
    }

    return decodeCodePointsArray$1(res);
  } // Based on http://stackoverflow.com/a/22747272/680742, the browser with
  // the lowest limit is Chrome, with 0x10000 args.
  // We go 1 magnitude less, for safety

  const MAX_ARGUMENTS_LENGTH$1 = 0x1000;

  function decodeCodePointsArray$1(codePoints) {
    const len = codePoints.length;

    if (len <= MAX_ARGUMENTS_LENGTH$1) {
      return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
    } // Decode in chunks to avoid "call stack size exceeded".

    let res = '';
    let i = 0;

    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH$1)),
      );
    }

    return res;
  }

  function asciiSlice$1(buf, start, end) {
    let ret = '';
    end = Math.min(buf.length, end);

    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 0x7f);
    }

    return ret;
  }

  function latin1Slice$1(buf, start, end) {
    let ret = '';
    end = Math.min(buf.length, end);

    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }

    return ret;
  }

  function hexSlice$1(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    let out = '';

    for (let i = start; i < end; ++i) {
      out += toHex$1(buf[i]);
    }

    return out;
  }

  function utf16leSlice$1(buf, start, end) {
    const bytes = buf.slice(start, end);
    let res = '';

    for (let i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }

    return res;
  }

  Buffer$1.prototype.slice = function slice(start, end) {
    const len = this.length;
    start = Math.trunc(start);
    end = end === undefined ? len : Math.trunc(end);

    if (start < 0) {
      start += len;
      if (start < 0) start = 0;
    } else if (start > len) {
      start = len;
    }

    if (end < 0) {
      end += len;
      if (end < 0) end = 0;
    } else if (end > len) {
      end = len;
    }

    if (end < start) end = start;
    let newBuf;

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      newBuf = this.subarray(start, end);
      newBuf.__proto__ = Buffer$1.prototype;
    } else {
      const sliceLen = end - start;
      newBuf = new Buffer$1(sliceLen, undefined);

      for (let i = 0; i < sliceLen; ++i) {
        newBuf[i] = this[i + start];
      }
    }

    return newBuf;
  };
  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */

  function checkOffset$1(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0)
      throw new RangeError('offset is not uint');
    if (offset + ext > length)
      throw new RangeError('Trying to access beyond buffer length');
  }

  Buffer$1.prototype.readUIntLE = function readUIntLE(
    offset,
    byteLength,
    noAssert,
  ) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset$1(offset, byteLength, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;

    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    return val;
  };

  Buffer$1.prototype.readUIntBE = function readUIntBE(
    offset,
    byteLength,
    noAssert,
  ) {
    offset = offset | 0;
    byteLength = byteLength | 0;

    if (!noAssert) {
      checkOffset$1(offset, byteLength, this.length);
    }

    let val = this[offset + --byteLength];
    let mul = 1;

    while (byteLength > 0 && (mul *= 0x100)) {
      val += this[offset + --byteLength] * mul;
    }

    return val;
  };

  Buffer$1.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 1, this.length);
    return this[offset];
  };

  Buffer$1.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 2, this.length);
    return this[offset] | (this[offset + 1] << 8);
  };

  Buffer$1.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 2, this.length);
    return (this[offset] << 8) | this[offset + 1];
  };

  Buffer$1.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 4, this.length);
    return (
      (this[offset] | (this[offset + 1] << 8) | (this[offset + 2] << 16)) +
      this[offset + 3] * 0x1000000
    );
  };

  Buffer$1.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 4, this.length);
    return (
      this[offset] * 0x1000000 +
      ((this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3])
    );
  };

  Buffer$1.prototype.readIntLE = function readIntLE(
    offset,
    byteLength,
    noAssert,
  ) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset$1(offset, byteLength, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;

    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    mul *= 0x80;
    if (val >= mul) val -= 2 ** (8 * byteLength);
    return val;
  };

  Buffer$1.prototype.readIntBE = function readIntBE(
    offset,
    byteLength,
    noAssert,
  ) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset$1(offset, byteLength, this.length);
    let i = byteLength;
    let mul = 1;
    let val = this[offset + --i];

    while (i > 0 && (mul *= 0x100)) {
      val += this[offset + --i] * mul;
    }

    mul *= 0x80;
    if (val >= mul) val -= 2 ** (8 * byteLength);
    return val;
  };

  Buffer$1.prototype.readInt8 = function readInt8(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xFF - this[offset] + 1) * -1;
  };

  Buffer$1.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 2, this.length);
    const val = this[offset] | (this[offset + 1] << 8);
    return val & 0x8000 ? val | 0xffff0000 : val;
  };

  Buffer$1.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 2, this.length);
    const val = this[offset + 1] | (this[offset] << 8);
    return val & 0x8000 ? val | 0xffff0000 : val;
  };

  Buffer$1.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 4, this.length);
    return (
      this[offset] |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
    );
  };

  Buffer$1.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 4, this.length);
    return (
      (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3]
    );
  };

  Buffer$1.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 4, this.length);
    return read$1(this, offset, true, 23, 4);
  };

  Buffer$1.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 4, this.length);
    return read$1(this, offset, false, 23, 4);
  };

  Buffer$1.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 8, this.length);
    return read$1(this, offset, true, 52, 8);
  };

  Buffer$1.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    if (!noAssert) checkOffset$1(offset, 8, this.length);
    return read$1(this, offset, false, 52, 8);
  };

  function checkInt$1(buf, value, offset, ext, max, min) {
    if (!internalIsBuffer$1(buf))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min)
      throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
  }

  Buffer$1.prototype.writeUIntLE = function writeUIntLE(
    value,
    offset,
    byteLength,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;

    if (!noAssert) {
      const maxBytes = 2 ** (8 * byteLength) - 1;
      checkInt$1(this, value, offset, byteLength, maxBytes, 0);
    }

    let mul = 1;
    let i = 0;
    this[offset] = value & 0xff;

    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xff;
    }

    return offset + byteLength;
  };

  Buffer$1.prototype.writeUIntBE = function writeUIntBE(
    value,
    offset,
    byteLength,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;

    if (!noAssert) {
      const maxBytes = 2 ** (8 * byteLength) - 1;
      checkInt$1(this, value, offset, byteLength, maxBytes, 0);
    }

    let i = byteLength - 1;
    let mul = 1;
    this[offset + i] = value & 0xff;

    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xff;
    }

    return offset + byteLength;
  };

  Buffer$1.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 1, 0xFF, 0);
    if (!Buffer$1.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    this[offset] = value & 0xFF;
    return offset + 1;
  };

  function objectWriteUInt16$1(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xFFFF + value + 1;

    for (let i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
      buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
        ((littleEndian ? i : 1 - i) * 8);
    }
  }

  Buffer$1.prototype.writeUInt16LE = function writeUInt16LE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 2, 0xFFFF, 0);

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xFF;
      this[offset + 1] = value >>> 8;
    } else {
      objectWriteUInt16$1(this, value, offset, true);
    }

    return offset + 2;
  };

  Buffer$1.prototype.writeUInt16BE = function writeUInt16BE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 2, 0xFFFF, 0);

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xFF;
    } else {
      objectWriteUInt16$1(this, value, offset, false);
    }

    return offset + 2;
  };

  function objectWriteUInt32$1(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xFFFFFFFF + value + 1;

    for (let i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
      buf[offset + i] = (value >>> ((littleEndian ? i : 3 - i) * 8)) & 0xFF;
    }
  }

  Buffer$1.prototype.writeUInt32LE = function writeUInt32LE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 4, 0xFFFFFFFF, 0);

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 0xFF;
    } else {
      objectWriteUInt32$1(this, value, offset, true);
    }

    return offset + 4;
  };

  Buffer$1.prototype.writeUInt32BE = function writeUInt32BE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 4, 0xFFFFFFFF, 0);

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xFF;
    } else {
      objectWriteUInt32$1(this, value, offset, false);
    }

    return offset + 4;
  };

  Buffer$1.prototype.writeIntLE = function writeIntLE(
    value,
    offset,
    byteLength,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;

    if (!noAssert) {
      const limit = 2 ** (8 * byteLength - 1);
      checkInt$1(this, value, offset, byteLength, limit - 1, -limit);
    }

    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 0xff;

    while (++i < byteLength && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }

      this[offset + i] = (Math.trunc(value / mul) - sub) & 0xff;
    }

    return offset + byteLength;
  };

  Buffer$1.prototype.writeIntBE = function writeIntBE(
    value,
    offset,
    byteLength,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;

    if (!noAssert) {
      const limit = 2 ** (8 * byteLength - 1);
      checkInt$1(this, value, offset, byteLength, limit - 1, -limit);
    }

    let i = byteLength - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 0xff;

    while (--i >= 0 && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }

      this[offset + i] = (Math.trunc(value / mul) - sub) & 0xff;
    }

    return offset + byteLength;
  };

  Buffer$1.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 1, 0x7F, -0x80);
    if (!Buffer$1.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    if (value < 0) value = 0xFF + value + 1;
    this[offset] = value & 0xFF;
    return offset + 1;
  };

  Buffer$1.prototype.writeInt16LE = function writeInt16LE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 2, 0x7FFF, -0x8000);

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xFF;
      this[offset + 1] = value >>> 8;
    } else {
      objectWriteUInt16$1(this, value, offset, true);
    }

    return offset + 2;
  };

  Buffer$1.prototype.writeInt16BE = function writeInt16BE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 2, 0x7FFF, -0x8000);

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xFF;
    } else {
      objectWriteUInt16$1(this, value, offset, false);
    }

    return offset + 2;
  };

  Buffer$1.prototype.writeInt32LE = function writeInt32LE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 4, 0x7FFFFFFF, -0x80000000);

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xFF;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
    } else {
      objectWriteUInt32$1(this, value, offset, true);
    }

    return offset + 4;
  };

  Buffer$1.prototype.writeInt32BE = function writeInt32BE(
    value,
    offset,
    noAssert,
  ) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt$1(this, value, offset, 4, 0x7FFFFFFF, -0x80000000);
    if (value < 0) value = 0xFFFFFFFF + value + 1;

    if (Buffer$1.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xFF;
    } else {
      objectWriteUInt32$1(this, value, offset, false);
    }

    return offset + 4;
  };

  function checkIEEE754$1(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
    if (offset < 0) throw new RangeError('Index out of range');
  }

  function writeFloat$1(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754$1(buf, value, offset, 4);
    }

    write$1(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }

  Buffer$1.prototype.writeFloatLE = function writeFloatLE(
    value,
    offset,
    noAssert,
  ) {
    return writeFloat$1(this, value, offset, true, noAssert);
  };

  Buffer$1.prototype.writeFloatBE = function writeFloatBE(
    value,
    offset,
    noAssert,
  ) {
    return writeFloat$1(this, value, offset, false, noAssert);
  };

  function writeDouble$1(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754$1(buf, value, offset, 8);
    }

    write$1(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }

  Buffer$1.prototype.writeDoubleLE = function writeDoubleLE(
    value,
    offset,
    noAssert,
  ) {
    return writeDouble$1(this, value, offset, true, noAssert);
  };

  Buffer$1.prototype.writeDoubleBE = function writeDoubleBE(
    value,
    offset,
    noAssert,
  ) {
    return writeDouble$1(this, value, offset, false, noAssert);
  }; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)

  Buffer$1.prototype.copy = function copy(target, targetStart, start, end) {
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

    if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds');
    }

    if (start < 0 || start >= this.length)
      throw new RangeError('sourceStart out of bounds');
    if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

    if (end > this.length) end = this.length;

    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }

    const len = end - start;
    let i;

    if (this === target && start < targetStart && targetStart < end) {
      // descending copy from end
      for (i = len - 1; i >= 0; --i) {
        target[i + targetStart] = this[i + start];
      }
    } else if (len < 1000 || !Buffer$1.TYPED_ARRAY_SUPPORT) {
      // ascending copy from start
      for (i = 0; i < len; ++i) {
        target[i + targetStart] = this[i + start];
      }
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, start + len),
        targetStart,
      );
    }

    return len;
  }; // Usage:
  //    buffer.fill(number[, offset[, end]])
  //    buffer.fill(buffer[, offset[, end]])
  //    buffer.fill(string[, offset[, end]][, encoding])

  Buffer$1.prototype.fill = function fill(val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
      if (typeof start === 'string') {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === 'string') {
        encoding = end;
        end = this.length;
      }

      if (val.length === 1) {
        const code = val.charCodeAt(0);

        if (code < 256) {
          val = code;
        }
      }

      if (encoding !== undefined && typeof encoding !== 'string') {
        throw new TypeError('encoding must be a string');
      }

      if (typeof encoding === 'string' && !Buffer$1.isEncoding(encoding)) {
        throw new TypeError(`Unknown encoding: ${encoding}`);
      }
    } else if (typeof val === 'number') {
      val = val & 255;
    } // Invalid ranges are not set to a default, so can range check early.

    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError('Out of range index');
    }

    if (end <= start) {
      return this;
    }

    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    let i;

    if (typeof val === 'number') {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      const bytes = internalIsBuffer$1(val)
        ? val
        : utf8ToBytes$1(new Buffer$1(val, encoding).toString());
      const len = bytes.length;

      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }

    return this;
  }; // HELPER FUNCTIONS
  // ================

  const INVALID_BASE64_RE$1 = /[^\w+/-]/g;

  function base64clean$1(str) {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = stringtrim$1(str).replace(INVALID_BASE64_RE$1, ''); // Node converts strings with length < 2 to ''

    if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

    while (str.length % 4 !== 0) {
      str = `${str}=`;
    }

    return str;
  }

  function stringtrim$1(str) {
    if (str.trim) return str.trim();
    return str.replace(/^\s+|\s+$/g, '');
  }

  function toHex$1(n) {
    if (n < 16) return `0${n.toString(16)}`;
    return n.toString(16);
  }

  function utf8ToBytes$1(string, units) {
    units = units || Number.POSITIVE_INFINITY;
    let codePoint;
    const length = string.length;
    let leadSurrogate = null;
    const bytes = [];

    for (let i = 0; i < length; ++i) {
      codePoint = string.charCodeAt(i); // is surrogate component

      if (codePoint > 0xd7ff && codePoint < 0xe000) {
        // last char was a lead
        if (!leadSurrogate) {
          // no lead yet
          if (codePoint > 0xdbff) {
            // unexpected trail
            if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
            continue;
          } else if (i + 1 === length) {
            // unpaired lead
            if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
            continue;
          } // valid lead

          leadSurrogate = codePoint;
          continue;
        } // 2 leads in a row

        if (codePoint < 0xdc00) {
          if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
          leadSurrogate = codePoint;
          continue;
        } // valid surrogate pair

        codePoint =
          (((leadSurrogate - 0xd800) << 10) | (codePoint - 0xdc00)) + 0x10000;
      } else if (
        leadSurrogate && // valid bmp char, but last char was a lead
        (units -= 3) > -1
      )
        bytes.push(0xEF, 0xBF, 0xBD);

      leadSurrogate = null; // encode utf8

      if (codePoint < 0x80) {
        if ((units -= 1) < 0) break;
        bytes.push(codePoint);
      } else if (codePoint < 0x800) {
        if ((units -= 2) < 0) break;
        bytes.push((codePoint >> 0x6) | 0xc0, (codePoint & 0x3f) | 0x80);
      } else if (codePoint < 0x10000) {
        if ((units -= 3) < 0) break;
        bytes.push(
          (codePoint >> 0xc) | 0xe0,
          ((codePoint >> 0x6) & 0x3f) | 0x80,
          (codePoint & 0x3f) | 0x80,
        );
      } else if (codePoint < 0x110000) {
        if ((units -= 4) < 0) break;
        bytes.push(
          (codePoint >> 0x12) | 0xf0,
          ((codePoint >> 0xc) & 0x3f) | 0x80,
          ((codePoint >> 0x6) & 0x3f) | 0x80,
          (codePoint & 0x3f) | 0x80,
        );
      } else {
        throw new Error('Invalid code point');
      }
    }

    return bytes;
  }

  function asciiToBytes$1(str) {
    const byteArray = [];

    for (let i = 0; i < str.length; ++i) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xff);
    }

    return byteArray;
  }

  function utf16leToBytes$1(str, units) {
    let c, hi, lo;
    const byteArray = [];

    for (let i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0) break;
      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo, hi);
    }

    return byteArray;
  }

  function base64ToBytes$1(str) {
    return toByteArray$1(base64clean$1(str));
  }

  function blitBuffer$1(src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
      if (i + offset >= dst.length || i >= src.length) break;
      dst[i + offset] = src[i];
    }

    return i;
  }

  function isnan$1(val) {
    return val !== val; // eslint-disable-line no-self-compare
  } // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
  // The _isBuffer check is for Safari 5-7 support, because it's missing
  // Object.prototype.constructor. Remove this eventually

  function isBuffer$2(obj) {
    return (
      obj != null &&
      (!!obj._isBuffer || isFastBuffer$1(obj) || isSlowBuffer$1(obj))
    );
  }

  function isFastBuffer$1(obj) {
    return (
      !!obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj)
    );
  } // For Node v0.10 support. Remove this eventually.

  function isSlowBuffer$1(obj) {
    return (
      typeof obj.readFloatLE === 'function' &&
      typeof obj.slice === 'function' &&
      isFastBuffer$1(obj.slice(0, 0))
    );
  }

  function BufferList() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function (v) {
    const entry = {
      data: v,
      next: null,
    };
    if (this.length > 0) this.tail.next = entry;
    else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function (v) {
    const entry = {
      data: v,
      next: this.head,
    };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function () {
    if (this.length === 0) return;
    const ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;
    else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function () {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function (s) {
    if (this.length === 0) return '';
    let p = this.head;
    let ret = `${p.data}`;

    while ((p = p.next)) {
      ret += s + p.data;
    }

    return ret;
  };

  BufferList.prototype.concat = function (n) {
    if (this.length === 0) return Buffer$1.alloc(0);
    if (this.length === 1) return this.head.data;
    const ret = Buffer$1.allocUnsafe(n >>> 0);
    let p = this.head;
    let i = 0;

    while (p) {
      p.data.copy(ret, i);
      i += p.data.length;
      p = p.next;
    }

    return ret;
  };

  const isBufferEncoding =
    Buffer$1.isEncoding ||
    function (encoding) {
      switch (encoding && encoding.toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
        case 'raw':
          return true;

        default:
          return false;
      }
    };

  function assertEncoding(encoding) {
    if (encoding && !isBufferEncoding(encoding)) {
      throw new Error(`Unknown encoding: ${encoding}`);
    }
  } // StringDecoder provides an interface for efficiently splitting a series of
  // buffers into a series of JS strings without breaking apart multi-byte
  // characters. CESU-8 is handled as part of the UTF-8 encoding.
  //
  // @TODO Handling all encodings inside a single object makes it very difficult
  // to reason about this code, so it should be split up in the future.
  // @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
  // points as used by CESU-8.

  function StringDecoder(encoding) {
    this.encoding = (encoding || 'utf8').toLowerCase().replace(/[_-]/, '');
    assertEncoding(encoding);

    switch (this.encoding) {
      case 'utf8':
        // CESU-8 represents each of Surrogate Pair by 3-bytes
        this.surrogateSize = 3;
        break;

      case 'ucs2':
      case 'utf16le':
        // UTF-16 represents each of Surrogate Pair by 2-bytes
        this.surrogateSize = 2;
        this.detectIncompleteChar = utf16DetectIncompleteChar;
        break;

      case 'base64':
        // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
        this.surrogateSize = 3;
        this.detectIncompleteChar = base64DetectIncompleteChar;
        break;

      default:
        this.write = passThroughWrite;
        return;
    } // Enough space to store all bytes of a single character. UTF-8 needs 4
    // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).

    this.charBuffer = new Buffer$1(6); // Number of bytes received for the current incomplete multi-byte character.

    this.charReceived = 0; // Number of bytes expected for the current incomplete multi-byte character.

    this.charLength = 0;
  }
  // guaranteed to not contain any partial multi-byte characters. Any partial
  // character found at the end of the buffer is buffered up, and will be
  // returned when calling write again with the remaining bytes.
  //
  // Note: Converting a Buffer containing an orphan surrogate to a String
  // currently works, but converting a String to a Buffer (via `new Buffer`, or
  // Buffer#write) will replace incomplete surrogates with the unicode
  // replacement character. See https://codereview.chromium.org/121173009/ .

  StringDecoder.prototype.write = function (buffer) {
    let charStr = ''; // if our last write ended with an incomplete multibyte character

    while (this.charLength) {
      // determine how many remaining bytes this buffer has to offer for this char
      const available =
        buffer.length >= this.charLength - this.charReceived
          ? this.charLength - this.charReceived
          : buffer.length; // add the new bytes to the char buffer

      buffer.copy(this.charBuffer, this.charReceived, 0, available);
      this.charReceived += available;

      if (this.charReceived < this.charLength) {
        // still not enough chars in this buffer? wait for more ...
        return '';
      } // remove bytes belonging to the current character from the buffer

      buffer = buffer.slice(available, buffer.length); // get the character that was split

      charStr = this.charBuffer
        .slice(0, this.charLength)
        .toString(this.encoding); // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character

      var charCode = charStr.charCodeAt(charStr.length - 1);

      if (charCode >= 0xd800 && charCode <= 0xdbff) {
        this.charLength += this.surrogateSize;
        charStr = '';
        continue;
      }

      this.charReceived = this.charLength = 0; // if there are no more bytes in this buffer, just emit our char

      if (buffer.length === 0) {
        return charStr;
      }

      break;
    } // determine and set charLength / charReceived

    this.detectIncompleteChar(buffer);
    var end = buffer.length;

    if (this.charLength) {
      // buffer the incomplete character bytes we got
      buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
      end -= this.charReceived;
    }

    charStr += buffer.toString(this.encoding, 0, end);
    var end = charStr.length - 1;
    var charCode = charStr.charCodeAt(end); // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character

    if (charCode >= 0xd800 && charCode <= 0xdbff) {
      const size = this.surrogateSize;
      this.charLength += size;
      this.charReceived += size;
      this.charBuffer.copy(this.charBuffer, size, 0, size);
      buffer.copy(this.charBuffer, 0, 0, size);
      return charStr.slice(0, Math.max(0, end));
    } // or just emit the charStr

    return charStr;
  }; // detectIncompleteChar determines if there is an incomplete UTF-8 character at
  // the end of the given buffer. If so, it sets this.charLength to the byte
  // length that character, and sets this.charReceived to the number of bytes
  // that are available for this character.

  StringDecoder.prototype.detectIncompleteChar = function (buffer) {
    // determine how many bytes we have to check at the end of this buffer
    let i = buffer.length >= 3 ? 3 : buffer.length; // Figure out if one of the last i bytes of our buffer announces an
    // incomplete char.

    for (; i > 0; i--) {
      const c = buffer[buffer.length - i]; // See http://en.wikipedia.org/wiki/UTF-8#Description
      // 110XXXXX

      if (i == 1 && c >> 5 == 0x06) {
        this.charLength = 2;
        break;
      } // 1110XXXX

      if (i <= 2 && c >> 4 == 0x0e) {
        this.charLength = 3;
        break;
      } // 11110XXX

      if (i <= 3 && c >> 3 == 0x1e) {
        this.charLength = 4;
        break;
      }
    }

    this.charReceived = i;
  };

  StringDecoder.prototype.end = function (buffer) {
    let res = '';
    if (buffer && buffer.length > 0) res = this.write(buffer);

    if (this.charReceived) {
      const cr = this.charReceived;
      const buf = this.charBuffer;
      const enc = this.encoding;
      res += buf.slice(0, cr).toString(enc);
    }

    return res;
  };

  function passThroughWrite(buffer) {
    return buffer.toString(this.encoding);
  }

  function utf16DetectIncompleteChar(buffer) {
    this.charReceived = buffer.length % 2;
    this.charLength = this.charReceived ? 2 : 0;
  }

  function base64DetectIncompleteChar(buffer) {
    this.charReceived = buffer.length % 3;
    this.charLength = this.charReceived ? 3 : 0;
  }

  Readable.ReadableState = ReadableState;
  const debug = debuglog('stream');
  inherits$1(Readable, EventEmitter);

  function prependListener(emitter, event, fn) {
    // Sadly this is not cacheable as some libraries bundle their own
    // event emitter implementation with them.
    if (typeof emitter.prependListener === 'function') {
      return emitter.prependListener(event, fn);
    } else {
      // This is a hack to make sure that our error handler is attached before any
      // userland ones.  NEVER DO THIS. This is here only because this code needs
      // to continue to work with older versions of Node.js that do not include
      // the prependListener() method. The goal is to eventually remove this hack.
      if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
      else if (Array.isArray(emitter._events[event]))
        emitter._events[event].unshift(fn);
      else emitter._events[event] = [fn, emitter._events[event]];
    }
  }

  function listenerCount$1(emitter, type) {
    return emitter.listeners(type).length;
  }

  function ReadableState(options, stream) {
    options = options || {}; // object stream flag. Used to make read(n) ignore n and to
    // make all the buffer merging and length checks go away

    this.objectMode = !!options.objectMode;
    if (stream instanceof Duplex)
      this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
    // Note: 0 is a valid value, means "don't call _read preemptively ever"

    const hwm = options.highWaterMark;
    const defaultHwm = this.objectMode ? 16 : 16 * 1024;
    this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm; // cast to ints.

    this.highWaterMark = Math.trunc(this.highWaterMark); // A linked list is used to store data chunks instead of an array because the
    // linked list can remove elements from the beginning faster than
    // array.shift()

    this.buffer = new BufferList();
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false; // a flag to be able to tell if the onwrite cb is called immediately,
    // or on a later tick.  We set this to true at first, because any
    // actions that shouldn't happen until "later" should generally also
    // not happen before the first write call.

    this.sync = true; // whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.

    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false; // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.

    this.defaultEncoding = options.defaultEncoding || 'utf8'; // when piping, we only care about 'readable' events that happen
    // after read()ing all the bytes and not getting any pushback.

    this.ranOut = false; // the number of writers that are awaiting a drain event in .pipe()s

    this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

    this.readingMore = false;
    this.decoder = null;
    this.encoding = null;

    if (options.encoding) {
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  }
  function Readable(options) {
    if (!(this instanceof Readable)) return new Readable(options);
    this._readableState = new ReadableState(options, this); // legacy

    this.readable = true;
    if (options && typeof options.read === 'function')
      this._read = options.read;
    EventEmitter.call(this);
  } // Manually shove something into the read() buffer.
  // This returns true if the highWaterMark has not been hit yet,
  // similar to how Writable.write() returns true if you should
  // write() some more.

  Readable.prototype.push = function (chunk, encoding) {
    const state = this._readableState;

    if (!state.objectMode && typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
    }

    return readableAddChunk(this, state, chunk, encoding, false);
  }; // Unshift should *always* be something directly out of read()

  Readable.prototype.unshift = function (chunk) {
    const state = this._readableState;
    return readableAddChunk(this, state, chunk, '', true);
  };

  Readable.prototype.isPaused = function () {
    return this._readableState.flowing === false;
  };

  function readableAddChunk(stream, state, chunk, encoding, addToFront) {
    const er = chunkInvalid(state, chunk);

    if (er) {
      stream.emit('error', er);
    } else if (chunk === null) {
      state.reading = false;
      onEofChunk(stream, state);
    } else if (state.objectMode || (chunk && chunk.length > 0)) {
      if (state.ended && !addToFront) {
        const e = new Error('stream.push() after EOF');
        stream.emit('error', e);
      } else if (state.endEmitted && addToFront) {
        const _e = new Error('stream.unshift() after end event');

        stream.emit('error', _e);
      } else {
        let skipAdd;

        if (state.decoder && !addToFront && !encoding) {
          chunk = state.decoder.write(chunk);
          skipAdd = !state.objectMode && chunk.length === 0;
        }

        if (!addToFront) state.reading = false; // Don't add to the buffer if we've decoded to an empty string chunk and
        // we're not in object mode

        if (!skipAdd) {
          // if we want the data now, just emit it.
          if (state.flowing && state.length === 0 && !state.sync) {
            stream.emit('data', chunk);
            stream.read(0);
          } else {
            // update the buffer info.
            state.length += state.objectMode ? 1 : chunk.length;
            if (addToFront) state.buffer.unshift(chunk);
            else state.buffer.push(chunk);
            if (state.needReadable) emitReadable(stream);
          }
        }

        maybeReadMore(stream, state);
      }
    } else if (!addToFront) {
      state.reading = false;
    }

    return needMoreData(state);
  } // if it's past the high water mark, we can push in some more.
  // Also, if we have no data yet, we can stand some
  // more bytes.  This is to work around cases where hwm=0,
  // such as the repl.  Also, if the push() triggered a
  // readable event, and the user called read(largeNumber) such that
  // needReadable was set, then we ought to push more, so that another
  // 'readable' event will be triggered.

  function needMoreData(state) {
    return (
      !state.ended &&
      (state.needReadable ||
        state.length < state.highWaterMark ||
        state.length === 0)
    );
  } // backwards compatibility.

  Readable.prototype.setEncoding = function (enc) {
    this._readableState.decoder = new StringDecoder(enc);
    this._readableState.encoding = enc;
    return this;
  }; // Don't raise the hwm > 8MB

  const MAX_HWM = 0x800000;

  function computeNewHighWaterMark(n) {
    if (n >= MAX_HWM) {
      n = MAX_HWM;
    } else {
      // Get the next highest power of 2 to prevent increasing hwm excessively in
      // tiny amounts
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }

    return n;
  } // This function is designed to be inlinable, so please take care when making
  // changes to the function body.

  function howMuchToRead(n, state) {
    if (n <= 0 || (state.length === 0 && state.ended)) return 0;
    if (state.objectMode) return 1;

    if (n !== n) {
      // Only flow one buffer at a time
      if (state.flowing && state.length > 0)
        return state.buffer.head.data.length;
      else return state.length;
    } // If we're asking for more than the current hwm, then raise the hwm.

    if (n > state.highWaterMark)
      state.highWaterMark = computeNewHighWaterMark(n);
    if (n <= state.length) return n; // Don't have enough

    if (!state.ended) {
      state.needReadable = true;
      return 0;
    }

    return state.length;
  } // you can override either this method, or the async _read(n) below.

  Readable.prototype.read = function (n) {
    debug('read', n);
    n = Number.parseInt(n, 10);
    const state = this._readableState;
    const nOrig = n;
    if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
    // already have a bunch of data in the buffer, then just trigger
    // the 'readable' event and move on.

    if (
      n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)
    ) {
      debug('read: emitReadable', state.length, state.ended);
      if (state.length === 0 && state.ended) endReadable(this);
      else emitReadable(this);
      return null;
    }

    n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

    if (n === 0 && state.ended) {
      if (state.length === 0) endReadable(this);
      return null;
    } // All the actual chunk generation logic needs to be
    // *below* the call to _read.  The reason is that in certain
    // synthetic stream cases, such as passthrough streams, _read
    // may be a completely synchronous operation which may change
    // the state of the read buffer, providing enough data when
    // before there was *not* enough.
    //
    // So, the steps are:
    // 1. Figure out what the state of things will be after we do
    // a read from the buffer.
    //
    // 2. If that resulting state will trigger a _read, then call _read.
    // Note that this may be asynchronous, or synchronous.  Yes, it is
    // deeply ugly to write APIs this way, but that still doesn't mean
    // that the Readable class should behave improperly, as streams are
    // designed to be sync/async agnostic.
    // Take note if the _read call is sync or async (ie, if the read call
    // has returned yet), so that we know whether or not it's safe to emit
    // 'readable' etc.
    //
    // 3. Actually pull the requested chunks out of the buffer and return.
    // if we need a readable event, then we need to do some reading.

    let doRead = state.needReadable;
    debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

    if (state.length === 0 || state.length - n < state.highWaterMark) {
      doRead = true;
      debug('length less than watermark', doRead);
    } // however, if we've ended, then there's no point, and if we're already
    // reading, then it's unnecessary.

    if (state.ended || state.reading) {
      doRead = false;
      debug('reading or ended', doRead);
    } else if (doRead) {
      debug('do read');
      state.reading = true;
      state.sync = true; // if the length is currently zero, then we *need* a readable event.

      if (state.length === 0) state.needReadable = true; // call internal read method

      this._read(state.highWaterMark);

      state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
      // and we need to re-evaluate how much data we can return to the user.

      if (!state.reading) n = howMuchToRead(nOrig, state);
    }

    let ret;
    if (n > 0) ret = fromList(n, state);
    else ret = null;

    if (ret === null) {
      state.needReadable = true;
      n = 0;
    } else {
      state.length -= n;
    }

    if (state.length === 0) {
      // If we have nothing in the buffer, then we want to know
      // as soon as we *do* get something into the buffer.
      if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

      if (nOrig !== n && state.ended) endReadable(this);
    }

    if (ret !== null) this.emit('data', ret);
    return ret;
  };

  function chunkInvalid(state, chunk) {
    let er = null;

    if (
      !isBuffer(chunk) &&
      typeof chunk !== 'string' &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode
    ) {
      er = new TypeError('Invalid non-string/buffer chunk');
    }

    return er;
  }

  function onEofChunk(stream, state) {
    if (state.ended) return;

    if (state.decoder) {
      const chunk = state.decoder.end();

      if (chunk && chunk.length > 0) {
        state.buffer.push(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
      }
    }

    state.ended = true; // emit 'readable' now to make sure it gets picked up.

    emitReadable(stream);
  } // Don't emit readable right away in sync mode, because this can trigger
  // another read() call => stack overflow.  This way, it might trigger
  // a nextTick recursion warning, but that's not so bad.

  function emitReadable(stream) {
    const state = stream._readableState;
    state.needReadable = false;

    if (!state.emittedReadable) {
      debug('emitReadable', state.flowing);
      state.emittedReadable = true;
      if (state.sync) nextTick$1(emitReadable_, stream);
      else emitReadable_(stream);
    }
  }

  function emitReadable_(stream) {
    debug('emit readable');
    stream.emit('readable');
    flow(stream);
  } // at this point, the user has presumably seen the 'readable' event,
  // and called read() to consume some data.  that may have triggered
  // in turn another _read(n) call, in which case reading = true if
  // it's in progress.
  // However, if we're not ended, or reading, and the length < hwm,
  // then go ahead and try to read some more preemptively.

  function maybeReadMore(stream, state) {
    if (!state.readingMore) {
      state.readingMore = true;
      nextTick$1(maybeReadMore_, stream, state);
    }
  }

  function maybeReadMore_(stream, state) {
    let len = state.length;

    while (
      !state.reading &&
      !state.flowing &&
      !state.ended &&
      state.length < state.highWaterMark
    ) {
      debug('maybeReadMore read 0');
      stream.read(0);
      if (len === state.length)
        // didn't get any data, stop spinning.
        break;
      else len = state.length;
    }

    state.readingMore = false;
  } // abstract method.  to be overridden in specific implementation classes.
  // call cb(er, data) where data is <= n in length.
  // for virtual (non-string, non-buffer) streams, "length" is somewhat
  // arbitrary, and perhaps not very meaningful.

  Readable.prototype._read = function (n) {
    this.emit('error', new Error('not implemented'));
  };

  Readable.prototype.pipe = function (dest, pipeOpts) {
    const src = this;
    const state = this._readableState;

    switch (state.pipesCount) {
      case 0:
        state.pipes = dest;
        break;

      case 1:
        state.pipes = [state.pipes, dest];
        break;

      default:
        state.pipes.push(dest);
        break;
    }

    state.pipesCount += 1;
    debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
    const doEnd = !pipeOpts || pipeOpts.end !== false;
    const endFn = doEnd ? onend : cleanup;
    if (state.endEmitted) nextTick$1(endFn);
    else src.once('end', endFn);
    dest.on('unpipe', onunpipe);

    function onunpipe(readable) {
      debug('onunpipe');

      if (readable === src) {
        cleanup();
      }
    }

    function onend() {
      debug('onend');
      dest.end();
    } // when the dest drains, it reduces the awaitDrain counter
    // on the source.  This would be more elegant with a .once()
    // handler in flow(), but adding and removing repeatedly is
    // too slow.

    const ondrain = pipeOnDrain(src);
    dest.on('drain', ondrain);
    let cleanedUp = false;

    function cleanup() {
      debug('cleanup'); // cleanup event handlers once the pipe is broken

      dest.removeListener('close', onclose);
      dest.removeListener('finish', onfinish);
      dest.removeListener('drain', ondrain);
      dest.removeListener('error', onerror);
      dest.removeListener('unpipe', onunpipe);
      src.removeListener('end', onend);
      src.removeListener('end', cleanup);
      src.removeListener('data', ondata);
      cleanedUp = true; // if the reader is waiting for a drain event from this
      // specific writer, then it would cause it to never start
      // flowing again.
      // So, if this is awaiting a drain, then we just call it now.
      // If we don't know, then assume that we are waiting for one.

      if (
        state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain)
      )
        ondrain();
    } // If the user pushes more data while we're writing to dest then we'll end up
    // in ondata again. However, we only want to increase awaitDrain once because
    // dest will only emit one 'drain' event for the multiple writes.
    // => Introduce a guard on increasing awaitDrain.

    let increasedAwaitDrain = false;
    src.on('data', ondata);

    function ondata(chunk) {
      debug('ondata');
      increasedAwaitDrain = false;
      const ret = dest.write(chunk);

      if (false === ret && !increasedAwaitDrain) {
        // If the user unpiped during `dest.write()`, it is possible
        // to get stuck in a permanently paused state if that write
        // also returned false.
        // => Check whether `dest` is still a piping destination.
        if (
          ((state.pipesCount === 1 && state.pipes === dest) ||
            (state.pipesCount > 1 && indexOf$1(state.pipes, dest) !== -1)) &&
          !cleanedUp
        ) {
          debug('false write response, pause', src._readableState.awaitDrain);
          src._readableState.awaitDrain++;
          increasedAwaitDrain = true;
        }

        src.pause();
      }
    } // if the dest has an error, then stop piping into it.
    // however, don't suppress the throwing behavior for this.

    function onerror(er) {
      debug('onerror', er);
      unpipe();
      dest.removeListener('error', onerror);
      if (listenerCount$1(dest, 'error') === 0) dest.emit('error', er);
    } // Make sure our error handler is attached before userland ones.

    prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

    function onclose() {
      dest.removeListener('finish', onfinish);
      unpipe();
    }

    dest.once('close', onclose);

    function onfinish() {
      debug('onfinish');
      dest.removeListener('close', onclose);
      unpipe();
    }

    dest.once('finish', onfinish);

    function unpipe() {
      debug('unpipe');
      src.unpipe(dest);
    } // tell the dest that it's being piped to

    dest.emit('pipe', src); // start the flow if it hasn't been started already.

    if (!state.flowing) {
      debug('pipe resume');
      src.resume();
    }

    return dest;
  };

  function pipeOnDrain(src) {
    return function () {
      const state = src._readableState;
      debug('pipeOnDrain', state.awaitDrain);
      if (state.awaitDrain) state.awaitDrain--;

      if (state.awaitDrain === 0 && src.listeners('data').length > 0) {
        state.flowing = true;
        flow(src);
      }
    };
  }

  Readable.prototype.unpipe = function (dest) {
    const state = this._readableState; // if we're not piping anywhere, then do nothing.

    if (state.pipesCount === 0) return this; // just one destination.  most common case.

    if (state.pipesCount === 1) {
      // passed in one, but it's not the right one.
      if (dest && dest !== state.pipes) return this;
      if (!dest) dest = state.pipes; // got a match.

      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      if (dest) dest.emit('unpipe', this);
      return this;
    } // slow case. multiple pipe destinations.

    if (!dest) {
      // remove all.
      const dests = state.pipes;
      const len = state.pipesCount;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;

      for (let _i = 0; _i < len; _i++) {
        dests[_i].emit('unpipe', this);
      }

      return this;
    } // try to find the right one.

    const i = indexOf$1(state.pipes, dest);
    if (i === -1) return this;
    state.pipes.splice(i, 1);
    state.pipesCount -= 1;
    if (state.pipesCount === 1) state.pipes = state.pipes[0];
    dest.emit('unpipe', this);
    return this;
  }; // set up data events if they are asked for
  // Ensure readable listeners eventually get something

  Readable.prototype.on = function (ev, fn) {
    const res = EventEmitter.prototype.on.call(this, ev, fn);

    if (ev === 'data') {
      // Start flowing on next tick if stream isn't explicitly paused
      if (this._readableState.flowing !== false) this.resume();
    } else if (ev === 'readable') {
      const state = this._readableState;

      if (!state.endEmitted && !state.readableListening) {
        state.readableListening = state.needReadable = true;
        state.emittedReadable = false;

        if (!state.reading) {
          nextTick$1(nReadingNextTick, this);
        } else if (state.length > 0) {
          emitReadable(this);
        }
      }
    }

    return res;
  };

  Readable.prototype.addListener = Readable.prototype.on;

  function nReadingNextTick(self) {
    debug('readable nexttick read 0');
    self.read(0);
  } // pause() and resume() are remnants of the legacy readable stream API
  // If the user uses them, then switch into old mode.

  Readable.prototype.resume = function () {
    const state = this._readableState;

    if (!state.flowing) {
      debug('resume');
      state.flowing = true;
      resume(this, state);
    }

    return this;
  };

  function resume(stream, state) {
    if (!state.resumeScheduled) {
      state.resumeScheduled = true;
      nextTick$1(resume_, stream, state);
    }
  }

  function resume_(stream, state) {
    if (!state.reading) {
      debug('resume read 0');
      stream.read(0);
    }

    state.resumeScheduled = false;
    state.awaitDrain = 0;
    stream.emit('resume');
    flow(stream);
    if (state.flowing && !state.reading) stream.read(0);
  }

  Readable.prototype.pause = function () {
    debug('call pause flowing=%j', this._readableState.flowing);

    if (false !== this._readableState.flowing) {
      debug('pause');
      this._readableState.flowing = false;
      this.emit('pause');
    }

    return this;
  };

  function flow(stream) {
    const state = stream._readableState;
    debug('flow', state.flowing);

    while (state.flowing && stream.read() !== null) {}
  } // wrap an old-style stream as the async data source.
  // This is *not* part of the readable stream interface.
  // It is an ugly unfortunate mess of history.

  Readable.prototype.wrap = function (stream) {
    const state = this._readableState;
    let paused = false;
    const self = this;
    stream.on('end', () => {
      debug('wrapped end');

      if (state.decoder && !state.ended) {
        const chunk = state.decoder.end();
        if (chunk && chunk.length > 0) self.push(chunk);
      }

      self.push(null);
    });
    stream.on('data', chunk => {
      debug('wrapped data');
      if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

      if (state.objectMode && (chunk === null || chunk === undefined)) return;
      else if (!state.objectMode && (!chunk || chunk.length === 0)) return;
      const ret = self.push(chunk);

      if (!ret) {
        paused = true;
        stream.pause();
      }
    }); // proxy all the other methods.
    // important when wrapping filters and duplexes.

    for (const i in stream) {
      if (this[i] === undefined && typeof stream[i] === 'function') {
        this[i] = (function (method) {
          return function () {
            return stream[method].apply(stream, arguments);
          };
        })(i);
      }
    } // proxy certain important events.

    const events = ['error', 'close', 'destroy', 'pause', 'resume'];
    forEach(events, ev => {
      stream.on(ev, self.emit.bind(self, ev));
    }); // when we try to consume some more bytes, simply unpause the
    // underlying stream.

    self._read = function (n) {
      debug('wrapped _read', n);

      if (paused) {
        paused = false;
        stream.resume();
      }
    };

    return self;
  }; // exposed for testing purposes only.

  Readable._fromList = fromList; // Pluck off n bytes from an array of buffers.
  // Length is the combined lengths of all the buffers in the list.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.

  function fromList(n, state) {
    // nothing buffered
    if (state.length === 0) return null;
    let ret;
    if (state.objectMode) ret = state.buffer.shift();
    else if (!n || n >= state.length) {
      // read it all, truncate the list
      if (state.decoder) ret = state.buffer.join('');
      else if (state.buffer.length === 1) ret = state.buffer.head.data;
      else ret = state.buffer.concat(state.length);
      state.buffer.clear();
    } else {
      // read part of list
      ret = fromListPartial(n, state.buffer, state.decoder);
    }
    return ret;
  } // Extracts only enough buffered data to satisfy the amount requested.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.

  function fromListPartial(n, list, hasStrings) {
    let ret;

    if (n < list.head.data.length) {
      // slice is the same for buffers and strings
      ret = list.head.data.slice(0, n);
      list.head.data = list.head.data.slice(n);
    } else if (n === list.head.data.length) {
      // first chunk is a perfect match
      ret = list.shift();
    } else {
      // result spans more than one buffer
      ret = hasStrings
        ? copyFromBufferString(n, list)
        : copyFromBuffer(n, list);
    }

    return ret;
  } // Copies a specified amount of characters from the list of buffered data
  // chunks.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.

  function copyFromBufferString(n, list) {
    let p = list.head;
    let c = 1;
    let ret = p.data;
    n -= ret.length;

    while ((p = p.next)) {
      const str = p.data;
      const nb = n > str.length ? str.length : n;
      if (nb === str.length) ret += str;
      else ret += str.slice(0, n);
      n -= nb;

      if (n === 0) {
        if (nb === str.length) {
          ++c;
          if (p.next) list.head = p.next;
          else list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = str.slice(nb);
        }

        break;
      }

      ++c;
    }

    list.length -= c;
    return ret;
  } // Copies a specified amount of bytes from the list of buffered data chunks.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.

  function copyFromBuffer(n, list) {
    const ret = Buffer.allocUnsafe(n);
    let p = list.head;
    let c = 1;
    p.data.copy(ret);
    n -= p.data.length;

    while ((p = p.next)) {
      const buf = p.data;
      const nb = n > buf.length ? buf.length : n;
      buf.copy(ret, ret.length - n, 0, nb);
      n -= nb;

      if (n === 0) {
        if (nb === buf.length) {
          ++c;
          if (p.next) list.head = p.next;
          else list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = buf.slice(nb);
        }

        break;
      }

      ++c;
    }

    list.length -= c;
    return ret;
  }

  function endReadable(stream) {
    const state = stream._readableState; // If we get here before consuming all the bytes, then that is a
    // bug in node.  Should never happen.

    if (state.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');

    if (!state.endEmitted) {
      state.ended = true;
      nextTick$1(endReadableNT, state, stream);
    }
  }

  function endReadableNT(state, stream) {
    // Check that we didn't get one last unshift.
    if (!state.endEmitted && state.length === 0) {
      state.endEmitted = true;
      stream.readable = false;
      stream.emit('end');
    }
  }

  function forEach(xs, f) {
    for (let i = 0, l = xs.length; i < l; i++) {
      f(xs[i], i);
    }
  }

  function indexOf$1(xs, x) {
    for (let i = 0, l = xs.length; i < l; i++) {
      if (xs[i] === x) return i;
    }

    return -1;
  }

  Writable.WritableState = WritableState;
  inherits$1(Writable, EventEmitter);

  function nop() {}

  function WriteReq(chunk, encoding, cb) {
    this.chunk = chunk;
    this.encoding = encoding;
    this.callback = cb;
    this.next = null;
  }

  function WritableState(options, stream) {
    Object.defineProperty(this, 'buffer', {
      get: deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' +
        'instead.'),
    });
    options = options || {}; // object stream flag to indicate whether or not this stream
    // contains buffers or objects.

    this.objectMode = !!options.objectMode;
    if (stream instanceof Duplex)
      this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
    // Note: 0 is a valid value, means that we always return false if
    // the entire buffer is not flushed immediately on write()

    const hwm = options.highWaterMark;
    const defaultHwm = this.objectMode ? 16 : 16 * 1024;
    this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm; // cast to ints.

    this.highWaterMark = Math.trunc(this.highWaterMark);
    this.needDrain = false; // at the start of calling end()

    this.ending = false; // when end() has been called, and returned

    this.ended = false; // when 'finish' is emitted

    this.finished = false; // should we decode strings into buffers before passing to _write?
    // this is here so that some node-core streams can optimize string
    // handling at a lower level.

    const noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.

    this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
    // of how much we're waiting to get pushed to some underlying
    // socket or file.

    this.length = 0; // a flag to see when we're in the middle of a write.

    this.writing = false; // when true all writes will be buffered until .uncork() call

    this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
    // or on a later tick.  We set this to true at first, because any
    // actions that shouldn't happen until "later" should generally also
    // not happen before the first write call.

    this.sync = true; // a flag to know if we're processing previously buffered items, which
    // may call the _write() callback in the same tick, so that we don't
    // end up in an overlapped onwrite situation.

    this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

    this.onwrite = function (er) {
      onwrite(stream, er);
    }; // the callback that the user supplies to write(chunk,encoding,cb)

    this.writecb = null; // the amount that is being written when _write is called.

    this.writelen = 0;
    this.bufferedRequest = null;
    this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
    // this must be 0 before 'finish' can be emitted

    this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
    // This is relevant for synchronous Transform streams

    this.prefinished = false; // True if the error was already emitted and should not be thrown again

    this.errorEmitted = false; // count buffered requests

    this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
    // one allocated and free to use, and we maintain at most two

    this.corkedRequestsFree = new CorkedRequest(this);
  }

  WritableState.prototype.getBuffer = function writableStateGetBuffer() {
    let current = this.bufferedRequest;
    const out = [];

    while (current) {
      out.push(current);
      current = current.next;
    }

    return out;
  };
  function Writable(options) {
    // Writable ctor is applied to Duplexes, though they're not
    // instanceof Writable, they're instanceof Readable.
    if (!(this instanceof Writable) && !(this instanceof Duplex))
      return new Writable(options);
    this._writableState = new WritableState(options, this); // legacy.

    this.writable = true;

    if (options) {
      if (typeof options.write === 'function') this._write = options.write;
      if (typeof options.writev === 'function') this._writev = options.writev;
    }

    EventEmitter.call(this);
  } // Otherwise people can pipe Writable streams, which is just wrong.

  Writable.prototype.pipe = function () {
    this.emit('error', new Error('Cannot pipe, not readable'));
  };

  function writeAfterEnd(stream, cb) {
    const er = new Error('write after end'); // TODO: defer error events consistently everywhere, not just the cb

    stream.emit('error', er);
    nextTick$1(cb, er);
  } // If we get something that is not a buffer, string, null, or undefined,
  // and we're not in objectMode, then that's an error.
  // Otherwise stream chunks are all considered to be of length=1, and the
  // watermarks determine how many objects to keep in the buffer, rather than
  // how many bytes or characters.

  function validChunk(stream, state, chunk, cb) {
    let valid = true;
    let er = false; // Always throw error if a null is written
    // if we are not in object mode then throw
    // if it is not a buffer, string, or undefined.

    if (chunk === null) {
      er = new TypeError('May not write null values to stream');
    } else if (
      !Buffer$1.isBuffer(chunk) &&
      typeof chunk !== 'string' &&
      chunk !== undefined &&
      !state.objectMode
    ) {
      er = new TypeError('Invalid non-string/buffer chunk');
    }

    if (er) {
      stream.emit('error', er);
      nextTick$1(cb, er);
      valid = false;
    }

    return valid;
  }

  Writable.prototype.write = function (chunk, encoding, cb) {
    const state = this._writableState;
    let ret = false;

    if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }

    if (Buffer$1.isBuffer(chunk)) encoding = 'buffer';
    else if (!encoding) encoding = state.defaultEncoding;
    if (typeof cb !== 'function') cb = nop;
    if (state.ended) writeAfterEnd(this, cb);
    else if (validChunk(this, state, chunk, cb)) {
      state.pendingcb++;
      ret = writeOrBuffer(this, state, chunk, encoding, cb);
    }
    return ret;
  };

  Writable.prototype.cork = function () {
    const state = this._writableState;
    state.corked++;
  };

  Writable.prototype.uncork = function () {
    const state = this._writableState;

    if (state.corked) {
      state.corked--;
      if (
        !state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.bufferedRequest
      )
        clearBuffer(this, state);
    }
  };

  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(
    encoding,
  ) {
    // node::ParseEncoding() requires lower case.
    if (typeof encoding === 'string') encoding = encoding.toLowerCase();
    if (
      ![
        'hex',
        'utf8',
        'utf-8',
        'ascii',
        'binary',
        'base64',
        'ucs2',
        'ucs-2',
        'utf16le',
        'utf-16le',
        'raw',
      ].includes((encoding + '').toLowerCase())
    )
      throw new TypeError(`Unknown encoding: ${encoding}`);
    this._writableState.defaultEncoding = encoding;
    return this;
  };

  function decodeChunk(state, chunk, encoding) {
    if (
      !state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string'
    ) {
      chunk = Buffer$1.from(chunk, encoding);
    }

    return chunk;
  } // if we're already writing something, then just put this
  // in the queue, and wait our turn.  Otherwise, call _write
  // If we return false, then we need a drain event, so set that flag.

  function writeOrBuffer(stream, state, chunk, encoding, cb) {
    chunk = decodeChunk(state, chunk, encoding);
    if (Buffer$1.isBuffer(chunk)) encoding = 'buffer';
    const len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    const ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

    if (!ret) state.needDrain = true;

    if (state.writing || state.corked) {
      const last = state.lastBufferedRequest;
      state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);

      if (last) {
        last.next = state.lastBufferedRequest;
      } else {
        state.bufferedRequest = state.lastBufferedRequest;
      }

      state.bufferedRequestCount += 1;
    } else {
      doWrite(stream, state, false, len, chunk, encoding, cb);
    }

    return ret;
  }

  function doWrite(stream, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (writev) stream._writev(chunk, state.onwrite);
    else stream._write(chunk, encoding, state.onwrite);
    state.sync = false;
  }

  function onwriteError(stream, state, sync, er, cb) {
    --state.pendingcb;
    if (sync) nextTick$1(cb, er);
    else cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  }

  function onwriteStateUpdate(state) {
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
  }

  function onwrite(stream, er) {
    const state = stream._writableState;
    const sync = state.sync;
    const cb = state.writecb;
    onwriteStateUpdate(state);
    if (er) onwriteError(stream, state, sync, er, cb);
    else {
      // Check if we're actually ready to finish, but don't emit yet
      const finished = needFinish(state);

      if (
        !finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.bufferedRequest
      ) {
        clearBuffer(stream, state);
      }

      if (sync) {
        /*<replacement>*/
        nextTick$1(afterWrite, stream, state, finished, cb);
        /*</replacement>*/
      } else {
        afterWrite(stream, state, finished, cb);
      }
    }
  }

  function afterWrite(stream, state, finished, cb) {
    if (!finished) onwriteDrain(stream, state);
    state.pendingcb--;
    cb();
    finishMaybe(stream, state);
  } // Must force callback to be called on nextTick, so that we don't
  // emit 'drain' before the write() consumer gets the 'false' return
  // value, and has a chance to attach a 'drain' listener.

  function onwriteDrain(stream, state) {
    if (state.length === 0 && state.needDrain) {
      state.needDrain = false;
      stream.emit('drain');
    }
  } // if there's something in the buffer waiting, then process it

  function clearBuffer(stream, state) {
    state.bufferProcessing = true;
    let entry = state.bufferedRequest;

    if (stream._writev && entry && entry.next) {
      // Fast case, write everything using _writev()
      const l = state.bufferedRequestCount;
      const buffer = new Array(l);
      const holder = state.corkedRequestsFree;
      holder.entry = entry;
      let count = 0;

      while (entry) {
        buffer[count] = entry;
        entry = entry.next;
        count += 1;
      }

      doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
      // as the hot path ends with doWrite

      state.pendingcb++;
      state.lastBufferedRequest = null;

      if (holder.next) {
        state.corkedRequestsFree = holder.next;
        holder.next = null;
      } else {
        state.corkedRequestsFree = new CorkedRequest(state);
      }
    } else {
      // Slow case, write chunks one-by-one
      while (entry) {
        const chunk = entry.chunk;
        const encoding = entry.encoding;
        const cb = entry.callback;
        const len = state.objectMode ? 1 : chunk.length;
        doWrite(stream, state, false, len, chunk, encoding, cb);
        entry = entry.next; // if we didn't call the onwrite immediately, then
        // it means that we need to wait until it does.
        // also, that means that the chunk and cb are currently
        // being processed, so move the buffer counter past them.

        if (state.writing) {
          break;
        }
      }

      if (entry === null) state.lastBufferedRequest = null;
    }

    state.bufferedRequestCount = 0;
    state.bufferedRequest = entry;
    state.bufferProcessing = false;
  }

  Writable.prototype._write = function (chunk, encoding, cb) {
    cb(new Error('not implemented'));
  };

  Writable.prototype._writev = null;

  Writable.prototype.end = function (chunk, encoding, cb) {
    const state = this._writableState;

    if (typeof chunk === 'function') {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }

    if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

    if (state.corked) {
      state.corked = 1;
      this.uncork();
    } // ignore unnecessary end() calls.

    if (!state.ending && !state.finished) endWritable(this, state, cb);
  };

  function needFinish(state) {
    return (
      state.ending &&
      state.length === 0 &&
      state.bufferedRequest === null &&
      !state.finished &&
      !state.writing
    );
  }

  function prefinish(stream, state) {
    if (!state.prefinished) {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }

  function finishMaybe(stream, state) {
    const need = needFinish(state);

    if (need) {
      if (state.pendingcb === 0) {
        prefinish(stream, state);
        state.finished = true;
        stream.emit('finish');
      } else {
        prefinish(stream, state);
      }
    }

    return need;
  }

  function endWritable(stream, state, cb) {
    state.ending = true;
    finishMaybe(stream, state);

    if (cb) {
      if (state.finished) nextTick$1(cb);
      else stream.once('finish', cb);
    }

    state.ended = true;
    stream.writable = false;
  } // It seems a linked list but it is not
  // there will be only 2 of these for each stream

  function CorkedRequest(state) {
    const _this = this;

    this.next = null;
    this.entry = null;

    this.finish = function (err) {
      let entry = _this.entry;
      _this.entry = null;

      while (entry) {
        const cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }

      if (state.corkedRequestsFree) {
        state.corkedRequestsFree.next = _this;
      } else {
        state.corkedRequestsFree = _this;
      }
    };
  }

  inherits$1(Duplex, Readable);
  const keys$4 = Object.keys(Writable.prototype);

  for (const method of keys$4) {
    if (!Duplex.prototype[method])
      Duplex.prototype[method] = Writable.prototype[method];
  }
  function Duplex(options) {
    if (!(this instanceof Duplex)) return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    if (options && options.readable === false) this.readable = false;
    if (options && options.writable === false) this.writable = false;
    this.allowHalfOpen = true;
    if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
    this.once('end', onend);
  } // the no-half-open enforcer

  function onend() {
    // if we allow half-open state, or if the writable side ended,
    // then we're ok.
    if (this.allowHalfOpen || this._writableState.ended) return; // no more data can be written.
    // But allow more writes to happen in this tick.

    nextTick$1(onEndNT, this);
  }

  function onEndNT(self) {
    self.end();
  }

  // a transform stream is a readable/writable stream where you do
  inherits$1(Transform, Duplex);

  function TransformState(stream) {
    this.afterTransform = function (er, data) {
      return afterTransform(stream, er, data);
    };

    this.needTransform = false;
    this.transforming = false;
    this.writecb = null;
    this.writechunk = null;
    this.writeencoding = null;
  }

  function afterTransform(stream, er, data) {
    const ts = stream._transformState;
    ts.transforming = false;
    const cb = ts.writecb;
    if (!cb)
      return stream.emit('error', new Error('no writecb in Transform class'));
    ts.writechunk = null;
    ts.writecb = null;
    if (data !== null && data !== undefined) stream.push(data);
    cb(er);
    const rs = stream._readableState;
    rs.reading = false;

    if (rs.needReadable || rs.length < rs.highWaterMark) {
      stream._read(rs.highWaterMark);
    }
  }
  function Transform(options) {
    if (!(this instanceof Transform)) return new Transform(options);
    Duplex.call(this, options);
    this._transformState = new TransformState(this); // when the writable side finishes, then flush out anything remaining.

    const stream = this; // start out asking for a readable event once data is transformed.

    this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
    // that Readable wants before the first _read call, so unset the
    // sync guard flag.

    this._readableState.sync = false;

    if (options) {
      if (typeof options.transform === 'function')
        this._transform = options.transform;
      if (typeof options.flush === 'function') this._flush = options.flush;
    }

    this.once('prefinish', function () {
      if (typeof this._flush === 'function')
        this._flush(er => {
          done(stream, er);
        });
      else done(stream);
    });
  }

  Transform.prototype.push = function (chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
  }; // This is the part where you do stuff!
  // override this function in implementation classes.
  // 'chunk' is an input chunk.
  //
  // Call `push(newChunk)` to pass along transformed output
  // to the readable side.  You may call 'push' zero or more times.
  //
  // Call `cb(err)` when you are done with this chunk.  If you pass
  // an error, then that'll put the hurt on the whole operation.  If you
  // never call cb(), then you'll never get another chunk.

  Transform.prototype._transform = function (chunk, encoding, cb) {
    throw new Error('Not implemented');
  };

  Transform.prototype._write = function (chunk, encoding, cb) {
    const ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;

    if (!ts.transforming) {
      const rs = this._readableState;
      if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
        this._read(rs.highWaterMark);
    }
  }; // Doesn't matter what the args are here.
  // _transform does all the work.
  // That we got here means that the readable side wants more data.

  Transform.prototype._read = function (n) {
    const ts = this._transformState;

    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
      ts.transforming = true;

      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
      // mark that we need a transform, so that any data that comes in
      // will get processed, now that we've asked for it.
      ts.needTransform = true;
    }
  };

  function done(stream, er) {
    if (er) return stream.emit('error', er); // if there's nothing in the write buffer, then that means
    // that nothing more will ever be provided

    const ws = stream._writableState;
    const ts = stream._transformState;
    if (ws.length > 0)
      throw new Error('Calling transform done when ws.length != 0');
    if (ts.transforming)
      throw new Error('Calling transform done when still transforming');
    return stream.push(null);
  }

  inherits$1(PassThrough, Transform);
  function PassThrough(options) {
    if (!(this instanceof PassThrough)) return new PassThrough(options);
    Transform.call(this, options);
  }

  PassThrough.prototype._transform = function (chunk, encoding, cb) {
    cb(null, chunk);
  };

  inherits$1(Stream, EventEmitter);
  Stream.Readable = Readable;
  Stream.Writable = Writable;
  Stream.Duplex = Duplex;
  Stream.Transform = Transform;
  Stream.PassThrough = PassThrough; // Backwards-compat with node 0.4.x

  Stream.Stream = Stream;
  // part of this class) is overridden in the Readable class.

  function Stream() {
    EventEmitter.call(this);
  }

  Stream.prototype.pipe = function (dest, options) {
    const source = this;

    function ondata(chunk) {
      if (dest.writable && false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }

    source.on('data', ondata);

    function ondrain() {
      if (source.readable && source.resume) {
        source.resume();
      }
    }

    dest.on('drain', ondrain); // If the 'end' option is not supplied, dest.end() will be called when
    // source gets the 'end' or 'close' events.  Only dest.end() once.

    if (!dest._isStdio && (!options || options.end !== false)) {
      source.on('end', onend);
      source.on('close', onclose);
    }

    let didOnEnd = false;

    function onend() {
      if (didOnEnd) return;
      didOnEnd = true;
      dest.end();
    }

    function onclose() {
      if (didOnEnd) return;
      didOnEnd = true;
      if (typeof dest.destroy === 'function') dest.destroy();
    } // don't leave dangling pipes when there are errors.

    function onerror(er) {
      cleanup();

      if (EventEmitter.listenerCount(this, 'error') === 0) {
        throw er; // Unhandled stream error in pipe.
      }
    }

    source.on('error', onerror);
    dest.on('error', onerror); // remove all the event listeners that were added.

    function cleanup() {
      source.removeListener('data', ondata);
      dest.removeListener('drain', ondrain);
      source.removeListener('end', onend);
      source.removeListener('close', onclose);
      source.removeListener('error', onerror);
      dest.removeListener('error', onerror);
      source.removeListener('end', cleanup);
      source.removeListener('close', cleanup);
      dest.removeListener('close', cleanup);
    }

    source.on('end', cleanup);
    source.on('close', cleanup);
    dest.on('close', cleanup);
    dest.emit('pipe', source); // Allow for unix-like usage: A.pipe(B).pipe(C)

    return dest;
  };

  const WritableStream = Stream.Writable;
  const inherits$2 = util.inherits;
  const browserStdout = BrowserStdout;
  inherits$2(BrowserStdout, WritableStream);

  function BrowserStdout(opts) {
    if (!(this instanceof BrowserStdout)) return new BrowserStdout(opts);
    opts = opts || {};
    WritableStream.call(this, opts);
    this.label = opts.label !== undefined ? opts.label : 'stdout';
  }

  BrowserStdout.prototype._write = function (chunks, encoding, cb) {
    const output = chunks.toString ? chunks.toString() : chunks;

    if (this.label === false) {
      console.log(output);
    } else {
      console.log(`${this.label}:`, output);
    }

    nextTick(cb);
  };

  const parseQuery = function parseQuery(qs) {
    return qs
      .replace('?', '')
      .split('&')
      .reduce((obj, pair) => {
        let i = pair.indexOf('=');
        let key = pair.slice(0, i);
        const val = pair.slice(++i); // Due to how the URLSearchParams API treats spaces

        obj[key] = decodeURIComponent(val.replaceAll('+', '%20'));
        return obj;
      }, {});
  };

  function highlight(js) {
    return js
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
      .replace(/('.*?')/gm, '<span class="string">$1</span>')
      .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
      .replace(/(\d+)/gm, '<span class="number">$1</span>')
      .replace(
        /\bnew[\t ]+(\w+)/gm,
        '<span class="keyword">new</span> <span class="init">$1</span>',
      )
      .replace(
        /\b(function|new|throw|return|var|if|else)\b/gm,
        '<span class="keyword">$1</span>',
      );
  }
  /**
   * Highlight the contents of tag `name`.
   *
   * @private
   * @param {string} name
   */

  const highlightTags = function highlightTags(name) {
    const code = document.querySelector('#mocha').getElementsByTagName(name);

    for (let i = 0, len = code.length; i < len; ++i) {
      code[i].innerHTML = highlight(code[i].innerHTML);
    }
  };

  const nativePromiseConstructor = global_1.Promise;

  const iteratorClose = function (iterator) {
    const returnMethod = iterator['return'];
    if (returnMethod !== undefined) {
      return anObject(returnMethod.call(iterator)).value;
    }
  };

  const Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  const iterate = function (iterable, unboundFunction, options) {
    const that = options && options.that;
    const AS_ENTRIES = !!(options && options.AS_ENTRIES);
    let IS_ITERATOR = !!(options && options.IS_ITERATOR);
    const INTERRUPTED = !!(options && options.INTERRUPTED);
    let fn = functionBindContext(
      unboundFunction,
      that,
      1 + AS_ENTRIES + INTERRUPTED,
    );
    let iterator, iterFn, index, length, result, next, step;

    const stop = function (condition) {
      if (iterator) iteratorClose(iterator);
      return new Result(true, condition);
    };

    const callFn = function (value) {
      if (AS_ENTRIES) {
        anObject(value);
        return INTERRUPTED
          ? fn(value[0], value[1], stop)
          : fn(value[0], value[1]);
      }
      return INTERRUPTED ? fn(value, stop) : fn(value);
    };

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (typeof iterFn !== 'function')
        throw new TypeError('Target is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (
          index = 0, length = toLength(iterable.length);
          length > index;
          index++
        ) {
          result = callFn(iterable[index]);
          if (result && result instanceof Result) return result;
        }
        return new Result(false);
      }
      iterator = iterFn.call(iterable);
    }

    next = iterator.next;
    while (!(step = next.call(iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose(iterator);
        throw error;
      }
      if (typeof result === 'object' && result && result instanceof Result)
        return result;
    }
    return new Result(false);
  };

  const engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

  const location$1 = global_1.location;
  let set$2 = global_1.setImmediate;
  let clear = global_1.clearImmediate;
  const process$2 = global_1.process;
  const MessageChannel = global_1.MessageChannel;
  const Dispatch = global_1.Dispatch;
  let counter = 0;
  const queue$2 = {};
  const ONREADYSTATECHANGE = 'onreadystatechange';
  let defer, channel, port;

  const run = function (id) {
    // eslint-disable-next-line no-prototype-builtins
    if (queue$2.hasOwnProperty(id)) {
      const fn = queue$2[id];
      delete queue$2[id];
      fn();
    }
  };

  const runner = function (id) {
    return function () {
      run(id);
    };
  };

  const listener = function (event) {
    run(event.data);
  };

  const post = function (id) {
    // old engines have not location.origin
    global_1.postMessage(`${id}`, `${location$1.protocol}//${location$1.host}`);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set$2 || !clear) {
    set$2 = function setImmediate(fn) {
      const args = [];
      let i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue$2[++counter] = function () {
        // eslint-disable-next-line no-new-func
        (typeof fn === 'function' ? fn : new Function(fn)).apply(
          undefined,
          args,
        );
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue$2[id];
    };
    // Node.js 0.8-
    if (engineIsNode) {
      defer = function (id) {
        process$2.nextTick(runner(id));
      };
      // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(runner(id));
      };
      // Browsers with MessageChannel, includes WebWorkers
      // except iOS - https://github.com/zloirock/core-js/issues/624
    } else if (MessageChannel && !engineIsIos) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = functionBindContext(port.postMessage, port, 1);
      // Browsers with postMessage, skip WebWorkers
      // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (
      global_1.addEventListener &&
      typeof postMessage === 'function' &&
      !global_1.importScripts &&
      location$1 &&
      location$1.protocol !== 'file:' &&
      !fails(post)
    ) {
      defer = post;
      global_1.addEventListener('message', listener, false);
      // IE8-
    } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
      defer = function (id) {
        html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] =
          function () {
            this.remove();
            run(id);
          };
      };
      // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(runner(id), 0);
      };
    }
  }

  const task = {
    set: set$2,
    clear,
  };

  const engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

  const getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
  const macrotask = task.set;

  const MutationObserver =
    global_1.MutationObserver || global_1.WebKitMutationObserver;
  const document$2 = global_1.document;
  const process$3 = global_1.process;
  const Promise$1 = global_1.Promise;
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  const queueMicrotaskDescriptor = getOwnPropertyDescriptor$3(
    global_1,
    'queueMicrotask',
  );
  const queueMicrotask =
    queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

  let flush, head, last, notify, toggle, node, promise, then;

  // modern engines have queueMicrotask method
  if (!queueMicrotask) {
    flush = function () {
      let parent, fn;
      if (engineIsNode && (parent = process$3.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (error) {
          if (head) notify();
          else last = undefined;
          throw error;
        }
      }
      last = undefined;
      if (parent) parent.enter();
    };

    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
    if (
      !engineIsIos &&
      !engineIsNode &&
      !engineIsWebosWebkit &&
      MutationObserver &&
      document$2
    ) {
      toggle = true;
      node = document$2.createTextNode('');
      new MutationObserver(flush).observe(node, { characterData: true });
      notify = function () {
        node.data = toggle = !toggle;
      };
      // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise$1.resolve(undefined);
      then = promise.then;
      notify = function () {
        then.call(promise, flush);
      };
      // Node.js without promises
    } else if (engineIsNode) {
      notify = function () {
        process$3.nextTick(flush);
      };
      // for other environments - macrotask based on:
      // - setImmediate
      // - MessageChannel
      // - window.postMessag
      // - onreadystatechange
      // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(global_1, flush);
      };
    }
  }

  const microtask =
    queueMicrotask ||
    function (fn) {
      const task = { fn, next: undefined };
      if (last) last.next = task;
      if (!head) {
        head = task;
        notify();
      }
      last = task;
    };

  const PromiseCapability = function (C) {
    let resolve, reject;
    this.promise = new C(($$resolve, $$reject) => {
      if (resolve !== undefined || reject !== undefined)
        throw new TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aFunction$1(resolve);
    this.reject = aFunction$1(reject);
  };

  // 25.4.1.5 NewPromiseCapability(C)
  const f$7 = function (C) {
    return new PromiseCapability(C);
  };

  const newPromiseCapability = {
    f: f$7,
  };

  const promiseResolve = function (C, x) {
    anObject(C);
    if (isObject(x) && x.constructor === C) return x;
    const promiseCapability = newPromiseCapability.f(C);
    const resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  const hostReportErrors = function (a, b) {
    const console = global_1.console;
    if (console && console.error) {
      arguments.length === 1 ? console.error(a) : console.error(a, b);
    }
  };

  const perform = function (exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };

  const task$1 = task.set;

  const SPECIES$6 = wellKnownSymbol('species');
  const PROMISE = 'Promise';
  const getInternalState$3 = internalState.get;
  const setInternalState$4 = internalState.set;
  const getInternalPromiseState = internalState.getterFor(PROMISE);
  let PromiseConstructor = nativePromiseConstructor;
  const TypeError$1 = global_1.TypeError;
  const document$3 = global_1.document;
  const process$4 = global_1.process;
  const $fetch = getBuiltIn('fetch');
  let newPromiseCapability$1 = newPromiseCapability.f;
  const newGenericPromiseCapability = newPromiseCapability$1;
  const DISPATCH_EVENT = !!(
    document$3 &&
    document$3.createEvent &&
    global_1.dispatchEvent
  );
  const NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent === 'function';
  const UNHANDLED_REJECTION = 'unhandledrejection';
  const REJECTION_HANDLED = 'rejectionhandled';
  const PENDING = 0;
  const FULFILLED = 1;
  const REJECTED = 2;
  const HANDLED = 1;
  const UNHANDLED = 2;
  let Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

  const FORCED$7 = isForced_1(PROMISE, () => {
    let GLOBAL_CORE_JS_PROMISE =
      inspectSource(PromiseConstructor) !== String(PromiseConstructor);
    if (!GLOBAL_CORE_JS_PROMISE) {
      // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // We can't detect it synchronously, so just check versions
      if (engineV8Version === 66) return true;
      // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      if (!engineIsNode && !NATIVE_REJECTION_EVENT) return true;
    }
    // We can't use @@species feature detection in V8 since it causes
    // deoptimization and performance degradation
    // https://github.com/zloirock/core-js/issues/679
    if (engineV8Version >= 51 && /native code/.test(PromiseConstructor))
      return false;
    // Detect correctness of subclassing with @@species support
    const promise = PromiseConstructor.resolve(1);
    const FakePromise = function (exec) {
      exec(
        function () {
          /* empty */
        },
        function () {
          /* empty */
        },
      );
    };
    let constructor = (promise.constructor = {});
    constructor[SPECIES$6] = FakePromise;
    return !(
      promise.then(() => {
        /* empty */
      }) instanceof FakePromise
    );
  });

  const INCORRECT_ITERATION =
    FORCED$7 ||
    !checkCorrectnessOfIteration(iterable => {
      PromiseConstructor.all(iterable)['catch'](() => {
        /* empty */
      });
    });

  // helpers
  const isThenable = function (it) {
    let then;
    return isObject(it) && typeof (then = it.then) === 'function'
      ? then
      : false;
  };

  const notify$1 = function (state, isReject) {
    if (state.notified) return;
    state.notified = true;
    const chain = state.reactions;
    microtask(() => {
      const value = state.value;
      const ok = state.state == FULFILLED;
      let index = 0;
      // variable length - can't use forEach
      while (chain.length > index) {
        const reaction = chain[index++];
        const handler = ok ? reaction.ok : reaction.fail;
        const resolve = reaction.resolve;
        let reject = reaction.reject;
        const domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (state.rejection === UNHANDLED) onHandleUnhandled(state);
              state.rejection = HANDLED;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // can throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if ((then = isThenable(result))) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (error) {
          if (domain && !exited) domain.exit();
          reject(error);
        }
      }
      state.reactions = [];
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(state);
    });
  };

  const dispatchEvent = function (name, promise, reason) {
    let event, handler;
    if (DISPATCH_EVENT) {
      event = document$3.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global_1.dispatchEvent(event);
    } else event = { promise, reason };
    if (!NATIVE_REJECTION_EVENT && (handler = global_1[`on${  name}`]))
      handler(event);
    else if (name === UNHANDLED_REJECTION)
      hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function (state) {
    task$1.call(global_1, () => {
      const promise = state.facade;
      const value = state.value;
      const IS_UNHANDLED = isUnhandled(state);
      let result;
      if (IS_UNHANDLED) {
        result = perform(() => {
          if (engineIsNode) {
            process$4.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection =
          engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function (state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function (state) {
    task$1.call(global_1, () => {
      const promise = state.facade;
      if (engineIsNode) {
        process$4.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  const bind = function (fn, state, unwrap) {
    return function (value) {
      fn(state, value, unwrap);
    };
  };

  const internalReject = function (state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify$1(state, true);
  };

  const internalResolve = function (state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (state.facade === value)
        throw TypeError$1("Promise can't be resolved itself");
      const then = isThenable(value);
      if (then) {
        microtask(() => {
          const wrapper = { done: false };
          try {
            then.call(
              value,
              bind(internalResolve, wrapper, state),
              bind(internalReject, wrapper, state),
            );
          } catch (error) {
            internalReject(wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify$1(state, false);
      }
    } catch (error) {
      internalReject({ done: false }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED$7) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromiseConstructor, PROMISE);
      aFunction$1(executor);
      Internal.call(this);
      const state = getInternalState$3(this);
      try {
        executor(bind(internalResolve, state), bind(internalReject, state));
      } catch (error) {
        internalReject(state, error);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      setInternalState$4(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: [],
        rejection: false,
        state: PENDING,
        value: undefined,
      });
    };
    Internal.prototype = redefineAll(PromiseConstructor.prototype, {
      // `Promise.prototype.then` method
      // https://tc39.es/ecma262/#sec-promise.prototype.then
      then: function then(onFulfilled, onRejected) {
        const state = getInternalPromiseState(this);
        const reaction = newPromiseCapability$1(
          speciesConstructor(this, PromiseConstructor),
        );
        reaction.ok = typeof onFulfilled === 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected === 'function' && onRejected;
        reaction.domain = engineIsNode ? process$4.domain : undefined;
        state.parent = true;
        state.reactions.push(reaction);
        if (state.state != PENDING) notify$1(state, false);
        return reaction.promise;
      },
      // `Promise.prototype.catch` method
      // https://tc39.es/ecma262/#sec-promise.prototype.catch
      catch(onRejected) {
        return this.then(undefined, onRejected);
      },
    });
    OwnPromiseCapability = function () {
      const promise = new Internal();
      const state = getInternalState$3(promise);
      this.promise = promise;
      this.resolve = bind(internalResolve, state);
      this.reject = bind(internalReject, state);
    };
    newPromiseCapability.f = newPromiseCapability$1 = function (C) {
      return C === PromiseConstructor || C === PromiseWrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };

    if (typeof nativePromiseConstructor === 'function') {
      nativeThen = nativePromiseConstructor.prototype.then;

      // wrap native Promise#then for native async functions
      redefine(
        nativePromiseConstructor.prototype,
        'then',
        function then(onFulfilled, onRejected) {
          const that = this;
          return new PromiseConstructor((resolve, reject) => {
            nativeThen.call(that, resolve, reject);
          }).then(onFulfilled, onRejected);
          // https://github.com/zloirock/core-js/issues/640
        },
        { unsafe: true },
      );

      // wrap fetch result
      if (typeof $fetch === 'function')
        _export(
          { global: true, enumerable: true, forced: true },
          {
            // eslint-disable-next-line no-unused-vars
            fetch: function fetch(input /* , init */) {
              return promiseResolve(
                PromiseConstructor,
                $fetch.apply(global_1, arguments),
              );
            },
          },
        );
    }
  }

  _export(
    { global: true, wrap: true, forced: FORCED$7 },
    {
      Promise: PromiseConstructor,
    },
  );

  setToStringTag(PromiseConstructor, PROMISE, false);
  setSpecies(PROMISE);

  PromiseWrapper = getBuiltIn(PROMISE);

  // statics
  _export(
    { target: PROMISE, stat: true, forced: FORCED$7 },
    {
      // `Promise.reject` method
      // https://tc39.es/ecma262/#sec-promise.reject
      reject: function reject(r) {
        const capability = newPromiseCapability$1(this);
        capability.reject.call(undefined, r);
        return capability.promise;
      },
    },
  );

  _export(
    { target: PROMISE, stat: true, forced: FORCED$7 },
    {
      // `Promise.resolve` method
      // https://tc39.es/ecma262/#sec-promise.resolve
      resolve: function resolve(x) {
        return promiseResolve(this, x);
      },
    },
  );

  _export(
    { target: PROMISE, stat: true, forced: INCORRECT_ITERATION },
    {
      // `Promise.all` method
      // https://tc39.es/ecma262/#sec-promise.all
      all: function all(iterable) {
        const C = this;
        const capability = newPromiseCapability$1(C);
        const resolve = capability.resolve;
        const reject = capability.reject;
        const result = perform(() => {
          const $promiseResolve = aFunction$1(C.resolve);
          const values = [];
          let counter = 0;
          let remaining = 1;
          iterate(iterable, promise => {
            const index = counter++;
            let alreadyCalled = false;
            values.push(undefined);
            remaining++;
            $promiseResolve.call(C, promise).then(value => {
              if (alreadyCalled) return;
              alreadyCalled = true;
              values[index] = value;
              --remaining || resolve(values);
            }, reject);
          });
          --remaining || resolve(values);
        });
        if (result.error) reject(result.value);
        return capability.promise;
      },
      // `Promise.race` method
      // https://tc39.es/ecma262/#sec-promise.race
      race: function race(iterable) {
        const C = this;
        const capability = newPromiseCapability$1(C);
        const reject = capability.reject;
        const result = perform(() => {
          const $promiseResolve = aFunction$1(C.resolve);
          iterate(iterable, promise => {
            $promiseResolve.call(C, promise).then(capability.resolve, reject);
          });
        });
        if (result.error) reject(result.value);
        return capability.promise;
      },
    },
  );

  // `Symbol.asyncIterator` well-known symbol
  // https://tc39.es/ecma262/#sec-symbol.asynciterator
  defineWellKnownSymbol('asyncIterator');

  // `Symbol.iterator` well-known symbol
  // https://tc39.es/ecma262/#sec-symbol.iterator
  defineWellKnownSymbol('iterator');

  // `Symbol.toStringTag` well-known symbol
  // https://tc39.es/ecma262/#sec-symbol.tostringtag
  defineWellKnownSymbol('toStringTag');

  // JSON[@@toStringTag] property
  // https://tc39.es/ecma262/#sec-json-@@tostringtag
  setToStringTag(global_1.JSON, 'JSON', true);

  // Math[@@toStringTag] property
  // https://tc39.es/ecma262/#sec-math-@@tostringtag
  setToStringTag(Math, 'Math', true);

  const charAt$1 = stringMultibyte.charAt;

  const STRING_ITERATOR = 'String Iterator';
  const setInternalState$5 = internalState.set;
  const getInternalState$4 = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
  defineIterator(
    String,
    'String',
    function (iterated) {
      setInternalState$5(this, {
        type: STRING_ITERATOR,
        string: String(iterated),
        index: 0,
      });
      // `%StringIteratorPrototype%.next` method
      // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
    },
    function next() {
      const state = getInternalState$4(this);
      const string = state.string;
      const index = state.index;
      let point;
      if (index >= string.length) return { value: undefined, done: true };
      point = charAt$1(string, index);
      state.index += point.length;
      return { value: point, done: false };
    },
  );

  const ITERATOR$6 = wellKnownSymbol('iterator');
  const TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
  const ArrayValues = es_array_iterator.values;

  for (const COLLECTION_NAME$1 in domIterables) {
    const Collection$1 = global_1[COLLECTION_NAME$1];
    const CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
    if (CollectionPrototype$1) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype$1[ITERATOR$6] !== ArrayValues)
        try {
          createNonEnumerableProperty(
            CollectionPrototype$1,
            ITERATOR$6,
            ArrayValues,
          );
        } catch {
          CollectionPrototype$1[ITERATOR$6] = ArrayValues;
        }
      if (!CollectionPrototype$1[TO_STRING_TAG$4]) {
        createNonEnumerableProperty(
          CollectionPrototype$1,
          TO_STRING_TAG$4,
          COLLECTION_NAME$1,
        );
      }
      if (domIterables[COLLECTION_NAME$1])
        for (const METHOD_NAME in es_array_iterator) {
          // some Chrome versions have non-configurable methods on DOMTokenList
          if (
            CollectionPrototype$1[METHOD_NAME] !==
            es_array_iterator[METHOD_NAME]
          )
            try {
              createNonEnumerableProperty(
                CollectionPrototype$1,
                METHOD_NAME,
                es_array_iterator[METHOD_NAME],
              );
            } catch {
              CollectionPrototype$1[METHOD_NAME] =
                es_array_iterator[METHOD_NAME];
            }
        }
    }
  }

  createCommonjsModule(module => {
    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    !(function (global) {
      const Op = Object.prototype;
      const hasOwn = Op.hasOwnProperty;
      let undefined$1; // More compressible than void 0.

      const $Symbol = typeof Symbol === 'function' ? Symbol : {};
      const iteratorSymbol = $Symbol.iterator || '@@iterator';
      const asyncIteratorSymbol = $Symbol.asyncIterator || '@@asyncIterator';
      const toStringTagSymbol = $Symbol.toStringTag || '@@toStringTag';
      let runtime = global.regeneratorRuntime;

      if (runtime) {
        {
          // If regeneratorRuntime is defined globally and we're in a module,
          // make the exports object identical to regeneratorRuntime.
          module.exports = runtime;
        } // Don't bother evaluating the rest of this file if the runtime was
        // already defined globally.

        return;
      } // Define the runtime globally (as expected by generated code) as either
      // module.exports (if we're in a module) or a new, empty object.

      runtime = global.regeneratorRuntime = module.exports;

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        const protoGenerator =
          outerFn && outerFn.prototype instanceof Generator
            ? outerFn
            : Generator;
        const generator = Object.create(protoGenerator.prototype);
        const context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.

        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
      }

      runtime.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.

      function tryCatch(fn, obj, arg) {
        try {
          return {
            type: 'normal',
            arg: fn.call(obj, arg),
          };
        } catch (err) {
          return {
            type: 'throw',
            arg: err,
          };
        }
      }

      const GenStateSuspendedStart = 'suspendedStart';
      const GenStateSuspendedYield = 'suspendedYield';
      const GenStateExecuting = 'executing';
      const GenStateCompleted = 'completed'; // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.

      const ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.

      function Generator() {}

      function GeneratorFunction() {}

      function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.

      let IteratorPrototype = {};

      IteratorPrototype[iteratorSymbol] = function () {
        return this;
      };

      const getProto = Object.getPrototypeOf;
      const NativeIteratorPrototype =
        getProto && getProto(getProto(values([])));

      if (
        NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
      ) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      const Gp =
        (GeneratorFunctionPrototype.prototype =
        Generator.prototype =
          Object.create(IteratorPrototype));
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunctionPrototype[toStringTagSymbol] =
        GeneratorFunction.displayName = 'GeneratorFunction'; // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.

      function defineIteratorMethods(prototype) {
        ['next', 'throw', 'return'].forEach(method => {
          prototype[method] = function (arg) {
            return this._invoke(method, arg);
          };
        });
      }

      runtime.isGeneratorFunction = function (genFun) {
        const ctor = typeof genFun === 'function' && genFun.constructor;
        return ctor
          ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
              // do is to check its .name property.
              (ctor.displayName || ctor.name) === 'GeneratorFunction'
          : false;
      };

      runtime.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;

          if (!(toStringTagSymbol in genFun)) {
            genFun[toStringTagSymbol] = 'GeneratorFunction';
          }
        }

        genFun.prototype = Object.create(Gp);
        return genFun;
      }; // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.

      runtime.awrap = function (arg) {
        return {
          __await: arg,
        };
      };

      function AsyncIterator(generator) {
        function invoke(method, arg, resolve, reject) {
          const record = tryCatch(generator[method], generator, arg);

          if (record.type === 'throw') {
            reject(record.arg);
          } else {
            const result = record.arg;
            const value = result.value;

            if (
              value &&
              _typeof(value) === 'object' &&
              hasOwn.call(value, '__await')
            ) {
              return Promise.resolve(value.__await).then(
                value => {
                  invoke('next', value, resolve, reject);
                },
                err => {
                  invoke('throw', err, resolve, reject);
                },
              );
            }

            return Promise.resolve(value).then(unwrapped => {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration. If the Promise is rejected, however, the
              // result for this iteration will be rejected with the same
              // reason. Note that rejections of yielded Promises are not
              // thrown back into the generator function, as is the case
              // when an awaited Promise is rejected. This difference in
              // behavior between yield and await is important, because it
              // allows the consumer to decide what to do with the yielded
              // rejection (swallow it and continue, manually .throw it back
              // into the generator, abandon iteration, whatever). With
              // await, by contrast, there is no opportunity to examine the
              // rejection reason outside the generator function, so the
              // only option is to throw it from the await expression, and
              // let the generator function handle the exception.
              result.value = unwrapped;
              resolve(result);
            }, reject);
          }
        }

        let previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new Promise((resolve, reject) => {
              invoke(method, arg, resolve, reject);
            });
          }

          return (previousPromise = // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise
              ? previousPromise.then(
                  callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
                  // invocations of the iterator.
                  callInvokeWithMethodAndArg,
                )
              : callInvokeWithMethodAndArg());
        } // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).

        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);

      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this;
      };

      runtime.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.

      runtime.async = function (innerFn, outerFn, self, tryLocsList) {
        const iter = new AsyncIterator(
          wrap(innerFn, outerFn, self, tryLocsList),
        );
        return runtime.isGeneratorFunction(outerFn)
          ? iter // If outerFn is a generator, return the full iterator.
          : iter.next().then(result => {
              return result.done ? result.value : iter.next();
            });
      };

      function makeInvokeMethod(innerFn, self, context) {
        let state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error('Generator is already running');
          }

          if (state === GenStateCompleted) {
            if (method === 'throw') {
              throw arg;
            } // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume

            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            const delegate = context.delegate;

            if (delegate) {
              const delegateResult = maybeInvokeDelegate(delegate, context);

              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === 'next') {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;
            } else if (context.method === 'throw') {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);
            } else if (context.method === 'return') {
              context.abrupt('return', context.arg);
            }

            state = GenStateExecuting;
            const record = tryCatch(innerFn, self, context);

            if (record.type === 'normal') {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done,
              };
            } else if (record.type === 'throw') {
              state = GenStateCompleted; // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.

              context.method = 'throw';
              context.arg = record.arg;
            }
          }
        };
      } // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.

      function maybeInvokeDelegate(delegate, context) {
        const method = delegate.iterator[context.method];

        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === 'throw') {
            if (delegate.iterator['return']) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = 'return';
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === 'throw') {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = 'throw';
            context.arg = new TypeError(
              "The iterator does not provide a 'throw' method",
            );
          }

          return ContinueSentinel;
        }

        const record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === 'throw') {
          context.method = 'throw';
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        const info = record.arg;

        if (!info) {
          context.method = 'throw';
          context.arg = new TypeError('iterator result is not an object');
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

          context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.

          if (context.method !== 'return') {
            context.method = 'next';
            context.arg = undefined$1;
          }
        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        } // The delegate iterator is finished, so forget it and continue with
        // the outer generator.

        context.delegate = null;
        return ContinueSentinel;
      } // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.

      defineIteratorMethods(Gp);
      Gp[toStringTagSymbol] = 'Generator'; // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.

      Gp[iteratorSymbol] = function () {
        return this;
      };

      Gp.toString = function () {
        return '[object Generator]';
      };

      function pushTryEntry(locs) {
        const entry = {
          tryLoc: locs[0],
        };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        const record = entry.completion || {};
        record.type = 'normal';
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [
          {
            tryLoc: 'root',
          },
        ];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      runtime.keys = function (object) {
        const keys = [];

        for (const key in object) {
          keys.push(key);
        }

        keys.reverse(); // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.

        return function next() {
          while (keys.length > 0) {
            const key = keys.pop();

            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          } // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.

          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          const iteratorMethod = iterable[iteratorSymbol];

          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === 'function') {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            let i = -1,
              next = function next() {
                while (++i < iterable.length) {
                  if (hasOwn.call(iterable, i)) {
                    next.value = iterable[i];
                    next.done = false;
                    return next;
                  }
                }

                next.value = undefined$1;
                next.done = true;
                return next;
              };

            return (next.next = next);
          }
        } // Return an iterator with no values.

        return {
          next: doneResult,
        };
      }

      runtime.values = values;

      function doneResult() {
        return {
          value: undefined$1,
          done: true,
        };
      }

      Context.prototype = {
        constructor: Context,
        reset: function reset(skipTempReset) {
          this.prev = 0;
          this.next = 0; // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.

          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;
          this.method = 'next';
          this.arg = undefined$1;
          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (const name in this) {
              // Not sure about the optimal order of these conditions:
              if (
                name.charAt(0) === 't' &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))
              ) {
                this[name] = undefined$1;
              }
            }
          }
        },
        stop: function stop() {
          this.done = true;
          const rootEntry = this.tryEntries[0];
          const rootRecord = rootEntry.completion;

          if (rootRecord.type === 'throw') {
            throw rootRecord.arg;
          }

          return this.rval;
        },
        dispatchException: function dispatchException(exception) {
          if (this.done) {
            throw exception;
          }

          const context = this;

          function handle(loc, caught) {
            record.type = 'throw';
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = 'next';
              context.arg = undefined$1;
            }

            return !!caught;
          }

          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === 'root') {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle('end');
            }

            if (entry.tryLoc <= this.prev) {
              const hasCatch = hasOwn.call(entry, 'catchLoc');
              const hasFinally = hasOwn.call(entry, 'finallyLoc');

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error('try statement without catch or finally');
              }
            }
          }
        },
        abrupt: function abrupt(type, arg) {
          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i];

            if (
              entry.tryLoc <= this.prev &&
              hasOwn.call(entry, 'finallyLoc') &&
              this.prev < entry.finallyLoc
            ) {
              var finallyEntry = entry;
              break;
            }
          }

          if (
            finallyEntry &&
            (type === 'break' || type === 'continue') &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc
          ) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          const record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = 'next';
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },
        complete: function complete(record, afterLoc) {
          if (record.type === 'throw') {
            throw record.arg;
          }

          if (record.type === 'break' || record.type === 'continue') {
            this.next = record.arg;
          } else if (record.type === 'return') {
            this.rval = this.arg = record.arg;
            this.method = 'return';
            this.next = 'end';
          } else if (record.type === 'normal' && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },
        finish: function finish(finallyLoc) {
          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i];

            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        catch: function _catch(tryLoc) {
          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i];

            if (entry.tryLoc === tryLoc) {
              const record = entry.completion;

              if (record.type === 'throw') {
                var thrown = record.arg;
                resetTryEntry(entry);
              }

              return thrown;
            }
          } // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.

          throw new Error('illegal catch attempt');
        },
        delegateYield: function delegateYield(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName,
            nextLoc,
          };

          if (this.method === 'next') {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        },
      };
    })(
      // In sloppy mode, unbound `this` refers to the global object, fallback to
      // Function constructor if we're in global strict mode. That is sadly a form
      // of indirect eval which violates Content Security Policy.
      (function () {
        return this;
      })() || new Function('return this')(),
    );
  });

  const escapeStringRegexp = function escapeStringRegexp(string) {
    if (typeof string !== 'string') {
      throw new TypeError('Expected a string');
    } // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.

    return string
      .replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
      .replaceAll('-', '\\x2d');
  };

  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  // resolves . and .. elements in a path array with directory names there
  // must be no slashes, empty elements, or device names (c:\) in the array
  // (so also no leading and trailing slashes - it does not distinguish
  // relative and absolute paths)
  function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    let up = 0;

    for (let i = parts.length - 1; i >= 0; i--) {
      const last = parts[i];

      if (last === '.') {
        parts.splice(i, 1);
      } else if (last === '..') {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    } // if the path is allowed to go above the root, restore leading ..s

    if (allowAboveRoot) {
      for (; up--; up) {
        parts.unshift('..');
      }
    }

    return parts;
  } // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.

  const splitPathRe = /^(\/?|)([\S\s]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))\/*$/;

  const splitPath = function splitPath(filename) {
    return splitPathRe.exec(filename).slice(1);
  }; // path.resolve([from ...], to)
  // posix version

  function resolve() {
    let resolvedPath = '',
      resolvedAbsolute = false;

    for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      const path = i >= 0 ? arguments[i] : '/'; // Skip empty and invalid entries

      if (typeof path !== 'string') {
        throw new TypeError('Arguments to path.resolve must be strings');
      } else if (!path) {
        continue;
      }

      resolvedPath = `${path}/${resolvedPath}`;
      resolvedAbsolute = path.charAt(0) === '/';
    } // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path

    resolvedPath = normalizeArray(
      filter(resolvedPath.split('/'), p => {
        return !!p;
      }),
      !resolvedAbsolute,
    ).join('/');
    return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
  }
  // posix version

  function normalize$1(path) {
    const isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/'; // Normalize the path

    path = normalizeArray(
      filter(path.split('/'), p => {
        return !!p;
      }),
      !isPathAbsolute,
    ).join('/');

    if (!path && !isPathAbsolute) {
      path = '.';
    }

    if (path && trailingSlash) {
      path += '/';
    }

    return (isPathAbsolute ? '/' : '') + path;
  }

  function isAbsolute(path) {
    return path.charAt(0) === '/';
  } // posix version

  function join() {
    const paths = Array.prototype.slice.call(arguments, 0);
    return normalize$1(
      filter(paths, (p, index) => {
        if (typeof p !== 'string') {
          throw new TypeError('Arguments to path.join must be strings');
        }

        return p;
      }).join('/'),
    );
  } // path.relative(from, to)
  // posix version

  function relative(from, to) {
    from = resolve(from).slice(1);
    to = resolve(to).slice(1);

    function trim(arr) {
      let start = 0;

      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      let end = arr.length - 1;

      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }

    const fromParts = trim(from.split('/'));
    const toParts = trim(to.split('/'));
    const length = Math.min(fromParts.length, toParts.length);
    let samePartsLength = length;

    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    let outputParts = [];

    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join('/');
  }
  const sep = '/';
  const delimiter = ':';
  function dirname(path) {
    let result = splitPath(path),
      root = result[0],
      dir = result[1];

    if (!root && !dir) {
      // No dirname whatsoever
      return '.';
    }

    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.slice(0, Math.max(0, dir.length - 1));
    }

    return root + dir;
  }
  function basename(path, ext) {
    let f = splitPath(path)[2]; // TODO: make this comparison case-insensitive on windows?

    if (ext && f.slice(-1 * ext.length) === ext) {
      f = f.slice(0, Math.max(0, f.length - ext.length));
    }

    return f;
  }
  function extname(path) {
    return splitPath(path)[3];
  }
  const path$1 = {
    extname,
    basename,
    dirname,
    sep,
    delimiter,
    relative,
    join,
    isAbsolute,
    normalize: normalize$1,
    resolve,
  };

  function filter(xs, f) {
    if (xs.filter) return xs.filter(f);
    const res = [];

    for (let i = 0; i < xs.length; i++) {
      if (f(xs[i], i, xs)) res.push(xs[i]);
    }

    return res;
  } // String.prototype.substr - negative index don't work in IE8

  var substr =
    'ab'.slice(-1) === 'b'
      ? function (str, start, len) {
          return str.substr(start, len);
        }
      : function (str, start, len) {
          if (start < 0) start = str.length + start;
          return str.substr(start, len);
        };

  // call something on iterator step with safe closing on error
  const callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
      // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      iteratorClose(iterator);
      throw error;
    }
  };

  // `Array.from` method implementation
  // https://tc39.es/ecma262/#sec-array.from
  const arrayFrom = function from(
    arrayLike /* , mapfn = undefined, thisArg = undefined */,
  ) {
    const O = toObject(arrayLike);
    const C = typeof this === 'function' ? this : Array;
    const argumentsLength = arguments.length;
    let mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    const mapping = mapfn !== undefined;
    const iteratorMethod = getIteratorMethod(O);
    let index = 0;
    let length, result, step, iterator, next, value;
    if (mapping)
      mapfn = functionBindContext(
        mapfn,
        argumentsLength > 2 ? arguments[2] : undefined,
        2,
      );
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (
      iteratorMethod != undefined &&
      !(C == Array && isArrayIteratorMethod(iteratorMethod))
    ) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      result = new C();
      for (; !(step = next.call(iterator)).done; index++) {
        value = mapping
          ? callWithSafeIterationClosing(
              iterator,
              mapfn,
              [step.value, index],
              true,
            )
          : step.value;
        createProperty(result, index, value);
      }
    } else {
      length = toLength(O.length);
      result = new C(length);
      for (; length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty(result, index, value);
      }
    }
    result.length = index;
    return result;
  };

  const INCORRECT_ITERATION$1 = !checkCorrectnessOfIteration(iterable => {
    Array.from(iterable);
  });

  // `Array.from` method
  // https://tc39.es/ecma262/#sec-array.from
  _export(
    { target: 'Array', stat: true, forced: INCORRECT_ITERATION$1 },
    {
      from: arrayFrom,
    },
  );

  const diff = createCommonjsModule((module, exports) => {
    (function (global, factory) {
      factory(exports);
    })(commonjsGlobal, exports => {
      function Diff() {}

      Diff.prototype = {
        diff: function diff(oldString, newString) {
          let options =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : {};
          let callback = options.callback;

          if (typeof options === 'function') {
            callback = options;
            options = {};
          }

          this.options = options;
          const self = this;

          function done(value) {
            if (callback) {
              setTimeout(() => {
                callback(undefined, value);
              }, 0);
              return true;
            } else {
              return value;
            }
          } // Allow subclasses to massage the input prior to running

          oldString = this.castInput(oldString);
          newString = this.castInput(newString);
          oldString = this.removeEmpty(this.tokenize(oldString));
          newString = this.removeEmpty(this.tokenize(newString));
          let newLen = newString.length,
            oldLen = oldString.length;
          let editLength = 1;
          const maxEditLength = newLen + oldLen;
          let bestPath = [
            {
              newPos: -1,
              components: [],
            },
          ]; // Seed editLength = 0, i.e. the content starts with the same values

          const oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);

          if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
            // Identity per the equality and tokenizer
            return done([
              {
                value: this.join(newString),
                count: newString.length,
              },
            ]);
          } // Main worker method. checks all permutations of a given edit length for acceptance.

          function execEditLength() {
            for (
              let diagonalPath = -1 * editLength;
              diagonalPath <= editLength;
              diagonalPath += 2
            ) {
              let basePath = void 0;

              let addPath = bestPath[diagonalPath - 1],
                removePath = bestPath[diagonalPath + 1],
                _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;

              if (addPath) {
                // No one else is going to attempt to use this value, clear it
                bestPath[diagonalPath - 1] = undefined;
              }

              const canAdd = addPath && addPath.newPos + 1 < newLen,
                canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;

              if (!canAdd && !canRemove) {
                // If this path is a terminal then prune
                bestPath[diagonalPath] = undefined;
                continue;
              } // Select the diagonal that we want to branch from. We select the prior
              // path whose position in the new string is the farthest from the origin
              // and does not pass the bounds of the diff graph

              if (
                !canAdd ||
                (canRemove && addPath.newPos < removePath.newPos)
              ) {
                basePath = clonePath(removePath);
                self.pushComponent(basePath.components, undefined, true);
              } else {
                basePath = addPath; // No need to clone, we've pulled it from the list

                basePath.newPos++;
                self.pushComponent(basePath.components, true, undefined);
              }

              _oldPos = self.extractCommon(
                basePath,
                newString,
                oldString,
                diagonalPath,
              ); // If we have hit the end of both strings, then we are done

              if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
                return done(
                  buildValues(
                    self,
                    basePath.components,
                    newString,
                    oldString,
                    self.useLongestToken,
                  ),
                );
              } else {
                // Otherwise track this path as a potential candidate and continue.
                bestPath[diagonalPath] = basePath;
              }
            }

            editLength++;
          } // Performs the length of edit iteration. Is a bit fugly as this has to support the
          // sync and async mode which is never fun. Loops over execEditLength until a value
          // is produced.

          if (callback) {
            (function exec() {
              setTimeout(() => {
                // This should not happen, but we want to be safe.

                /* istanbul ignore next */
                if (editLength > maxEditLength) {
                  return callback();
                }

                if (!execEditLength()) {
                  exec();
                }
              }, 0);
            })();
          } else {
            while (editLength <= maxEditLength) {
              const ret = execEditLength();

              if (ret) {
                return ret;
              }
            }
          }
        },
        pushComponent: function pushComponent(components, added, removed) {
          const last = components[components.length - 1];

          if (last && last.added === added && last.removed === removed) {
            // We need to clone here as the component clone operation is just
            // as shallow array clone
            components[components.length - 1] = {
              count: last.count + 1,
              added,
              removed,
            };
          } else {
            components.push({
              count: 1,
              added,
              removed,
            });
          }
        },
        extractCommon: function extractCommon(
          basePath,
          newString,
          oldString,
          diagonalPath,
        ) {
          let newLen = newString.length,
            oldLen = oldString.length,
            newPos = basePath.newPos,
            oldPos = newPos - diagonalPath,
            commonCount = 0;

          while (
            newPos + 1 < newLen &&
            oldPos + 1 < oldLen &&
            this.equals(newString[newPos + 1], oldString[oldPos + 1])
          ) {
            newPos++;
            oldPos++;
            commonCount++;
          }

          if (commonCount) {
            basePath.components.push({
              count: commonCount,
            });
          }

          basePath.newPos = newPos;
          return oldPos;
        },
        equals: function equals(left, right) {
          if (this.options.comparator) {
            return this.options.comparator(left, right);
          } else {
            return (
              left === right ||
              (this.options.ignoreCase &&
                left.toLowerCase() === right.toLowerCase())
            );
          }
        },
        removeEmpty: function removeEmpty(array) {
          const ret = [];

          for (const element of array) {
            if (element) {
              ret.push(element);
            }
          }

          return ret;
        },
        castInput: function castInput(value) {
          return value;
        },
        tokenize: function tokenize(value) {
          return value.split('');
        },
        join: function join(chars) {
          return chars.join('');
        },
      };

      function buildValues(
        diff,
        components,
        newString,
        oldString,
        useLongestToken,
      ) {
        let componentPos = 0,
          componentLen = components.length,
          newPos = 0,
          oldPos = 0;

        for (; componentPos < componentLen; componentPos++) {
          const component = components[componentPos];

          if (!component.removed) {
            if (!component.added && useLongestToken) {
              let value = newString.slice(newPos, newPos + component.count);
              value = value.map((value, i) => {
                const oldValue = oldString[oldPos + i];
                return oldValue.length > value.length ? oldValue : value;
              });
              component.value = diff.join(value);
            } else {
              component.value = diff.join(
                newString.slice(newPos, newPos + component.count),
              );
            }

            newPos += component.count; // Common case

            if (!component.added) {
              oldPos += component.count;
            }
          } else {
            component.value = diff.join(
              oldString.slice(oldPos, oldPos + component.count),
            );
            oldPos += component.count; // Reverse add and remove so removes are output first to match common convention
            // The diffing algorithm is tied to add then remove output and this is the simplest
            // route to get the desired output with minimal overhead.

            if (componentPos && components[componentPos - 1].added) {
              const tmp = components[componentPos - 1];
              components[componentPos - 1] = components[componentPos];
              components[componentPos] = tmp;
            }
          }
        } // Special case handle for when one terminal is ignored (i.e. whitespace).
        // For this case we merge the terminal into the prior string and drop the change.
        // This is only available for string mode.

        const lastComponent = components[componentLen - 1];

        if (
          componentLen > 1 &&
          typeof lastComponent.value === 'string' &&
          (lastComponent.added || lastComponent.removed) &&
          diff.equals('', lastComponent.value)
        ) {
          components[componentLen - 2].value += lastComponent.value;
          components.pop();
        }

        return components;
      }

      function clonePath(path) {
        return {
          newPos: path.newPos,
          components: path.components.slice(0),
        };
      }

      const characterDiff = new Diff();

      function diffChars(oldStr, newStr, options) {
        return characterDiff.diff(oldStr, newStr, options);
      }

      function generateOptions(options, defaults) {
        if (typeof options === 'function') {
          defaults.callback = options;
        } else if (options) {
          for (const name in options) {
            /* istanbul ignore else */
            if (options.hasOwnProperty(name)) {
              defaults[name] = options[name];
            }
          }
        }

        return defaults;
      } //
      // Ranges and exceptions:
      // Latin-1 Supplement, 0080–00FF
      //  - U+00D7  × Multiplication sign
      //  - U+00F7  ÷ Division sign
      // Latin Extended-A, 0100–017F
      // Latin Extended-B, 0180–024F
      // IPA Extensions, 0250–02AF
      // Spacing Modifier Letters, 02B0–02FF
      //  - U+02C7  ˇ &#711;  Caron
      //  - U+02D8  ˘ &#728;  Breve
      //  - U+02D9  ˙ &#729;  Dot Above
      //  - U+02DA  ˚ &#730;  Ring Above
      //  - U+02DB  ˛ &#731;  Ogonek
      //  - U+02DC  ˜ &#732;  Small Tilde
      //  - U+02DD  ˝ &#733;  Double Acute Accent
      // Latin Extended Additional, 1E00–1EFF

      let extendedWordChars =
        /^[A-Za-z\u00C0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
      const reWhitespace = /\S/;
      const wordDiff = new Diff();

      wordDiff.equals = function (left, right) {
        if (this.options.ignoreCase) {
          left = left.toLowerCase();
          right = right.toLowerCase();
        }

        return (
          left === right ||
          (this.options.ignoreWhitespace &&
            !reWhitespace.test(left) &&
            !reWhitespace.test(right))
        );
      };

      wordDiff.tokenize = function (value) {
        // All whitespace symbols except newline group into one token, each newline - in separate token
        let tokens = value.split(/([^\S\n\r]+|[\n\r"'()[\]{}]|\b)/); // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.

        for (let i = 0; i < tokens.length - 1; i++) {
          // If we have an empty string in the next field and we have only word chars before and after, merge
          if (
            !tokens[i + 1] &&
            tokens[i + 2] &&
            extendedWordChars.test(tokens[i]) &&
            extendedWordChars.test(tokens[i + 2])
          ) {
            tokens[i] += tokens[i + 2];
            tokens.splice(i + 1, 2);
            i--;
          }
        }

        return tokens;
      };

      function diffWords(oldStr, newStr, options) {
        options = generateOptions(options, {
          ignoreWhitespace: true,
        });
        return wordDiff.diff(oldStr, newStr, options);
      }

      function diffWordsWithSpace(oldStr, newStr, options) {
        return wordDiff.diff(oldStr, newStr, options);
      }

      const lineDiff = new Diff();

      lineDiff.tokenize = function (value) {
        const retLines = [],
          linesAndNewlines = value.split(/(\n|\r\n)/); // Ignore the final empty token that occurs if the string ends with a new line

        if (!linesAndNewlines[linesAndNewlines.length - 1]) {
          linesAndNewlines.pop();
        } // Merge the content and line separators into single tokens

        for (let [i, line] of linesAndNewlines.entries()) {

          if (i % 2 && !this.options.newlineIsToken) {
            retLines[retLines.length - 1] += line;
          } else {
            if (this.options.ignoreWhitespace) {
              line = line.trim();
            }

            retLines.push(line);
          }
        }

        return retLines;
      };

      function diffLines(oldStr, newStr, callback) {
        return lineDiff.diff(oldStr, newStr, callback);
      }

      function diffTrimmedLines(oldStr, newStr, callback) {
        const options = generateOptions(callback, {
          ignoreWhitespace: true,
        });
        return lineDiff.diff(oldStr, newStr, options);
      }

      const sentenceDiff = new Diff();

      sentenceDiff.tokenize = function (value) {
        return value.split(/(\S.+?[!.?])(?=\s+|$)/);
      };

      function diffSentences(oldStr, newStr, callback) {
        return sentenceDiff.diff(oldStr, newStr, callback);
      }

      const cssDiff = new Diff();

      cssDiff.tokenize = function (value) {
        return value.split(/([,:;{}]|\s+)/);
      };

      function diffCss(oldStr, newStr, callback) {
        return cssDiff.diff(oldStr, newStr, callback);
      }

      function _typeof(obj) {
        '@babel/helpers - typeof';

        if (
          typeof Symbol === 'function' &&
          typeof Symbol.iterator === 'symbol'
        ) {
          _typeof = function _typeof(obj) {
            return typeof obj;
          };
        } else {
          _typeof = function _typeof(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj;
          };
        }

        return _typeof(obj);
      }

      function _toConsumableArray(arr) {
        return (
          _arrayWithoutHoles(arr) ||
          _iterableToArray(arr) ||
          _unsupportedIterableToArray(arr) ||
          _nonIterableSpread()
        );
      }

      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
      }

      function _iterableToArray(iter) {
        if (typeof Symbol !== 'undefined' && Symbol.iterator in new Object(iter))
          return Array.from(iter);
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
        let n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === 'Object' && o.constructor) n = o.constructor.name;
        if (n === 'Map' || n === 'Set') return Array.from(o);
        if (
          n === 'Arguments' ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return _arrayLikeToArray(o, minLen);
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;

        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }

        return arr2;
      }

      function _nonIterableSpread() {
        throw new TypeError(
          'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }

      const objectPrototypeToString = Object.prototype.toString;
      const jsonDiff = new Diff(); // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
      // dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:

      jsonDiff.useLongestToken = true;
      jsonDiff.tokenize = lineDiff.tokenize;

      jsonDiff.castInput = function (value) {
        const _this$options = this.options,
          undefinedReplacement = _this$options.undefinedReplacement,
          _this$options$stringi = _this$options.stringifyReplacer,
          stringifyReplacer =
            _this$options$stringi === void 0
              ? function (k, v) {
                  return typeof v === 'undefined' ? undefinedReplacement : v;
                }
              : _this$options$stringi;
        return typeof value === 'string'
          ? value
          : JSON.stringify(
              canonicalize(value, null, null, stringifyReplacer),
              stringifyReplacer,
              '  ',
            );
      };

      jsonDiff.equals = function (left, right) {
        return Diff.prototype.equals.call(
          jsonDiff,
          left.replace(/,([\n\r])/g, '$1'),
          right.replace(/,([\n\r])/g, '$1'),
        );
      };

      function diffJson(oldObj, newObj, options) {
        return jsonDiff.diff(oldObj, newObj, options);
      } // This function handles the presence of circular references by bailing out when encountering an
      // object that is already on the "stack" of items being processed. Accepts an optional replacer

      function canonicalize(obj, stack, replacementStack, replacer, key) {
        stack = stack || [];
        replacementStack = replacementStack || [];

        if (replacer) {
          obj = replacer(key, obj);
        }

        let i;

        for (i = 0; i < stack.length; i += 1) {
          if (stack[i] === obj) {
            return replacementStack[i];
          }
        }

        let canonicalizedObj;

        if ('[object Array]' === objectPrototypeToString.call(obj)) {
          stack.push(obj);
          canonicalizedObj = Array.from({ length: obj.length });
          replacementStack.push(canonicalizedObj);

          for (i = 0; i < obj.length; i += 1) {
            canonicalizedObj[i] = canonicalize(
              obj[i],
              stack,
              replacementStack,
              replacer,
              key,
            );
          }

          stack.pop();
          replacementStack.pop();
          return canonicalizedObj;
        }

        if (obj && obj.toJSON) {
          obj = obj.toJSON();
        }

        if (_typeof(obj) === 'object' && obj !== null) {
          stack.push(obj);
          canonicalizedObj = {};
          replacementStack.push(canonicalizedObj);

          let sortedKeys = [],
            _key;

          for (_key in obj) {
            /* istanbul ignore else */
            if (obj.hasOwnProperty(_key)) {
              sortedKeys.push(_key);
            }
          }

          sortedKeys.sort();

          for (i = 0; i < sortedKeys.length; i += 1) {
            _key = sortedKeys[i];
            canonicalizedObj[_key] = canonicalize(
              obj[_key],
              stack,
              replacementStack,
              replacer,
              _key,
            );
          }

          stack.pop();
          replacementStack.pop();
        } else {
          canonicalizedObj = obj;
        }

        return canonicalizedObj;
      }

      const arrayDiff = new Diff();

      arrayDiff.tokenize = function (value) {
        return value.slice();
      };

      arrayDiff.join = arrayDiff.removeEmpty = function (value) {
        return value;
      };

      function diffArrays(oldArr, newArr, callback) {
        return arrayDiff.diff(oldArr, newArr, callback);
      }

      function parsePatch(uniDiff) {
        let options =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};
        let diffstr = uniDiff.split(/\r\n|[\n\v\f\r\u0085]/),
          delimiters = uniDiff.match(/\r\n|[\n\v\f\r\u0085]/g) || [],
          list = [],
          i = 0;

        function parseIndex() {
          const index = {};
          list.push(index); // Parse diff metadata

          while (i < diffstr.length) {
            const line = diffstr[i]; // File header found, end parsing diff metadata

            if (/^(---|\+\+\+|@@)\s/.test(line)) {
              break;
            } // Diff index

            let header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);

            if (header) {
              index.index = header[1];
            }

            i++;
          } // Parse file headers if they are defined. Unified diff requires them, but
          // there's no technical issues to have an isolated hunk without file header

          parseFileHeader(index);
          parseFileHeader(index); // Parse hunks

          index.hunks = [];

          while (i < diffstr.length) {
            let _line = diffstr[i];

            if (/^(Index:|diff|---|\+\+\+)\s/.test(_line)) {
              break;
            } else if (_line.startsWith('@@')) {
              index.hunks.push(parseHunk());
            } else if (_line && options.strict) {
              // Ignore unexpected content unless in strict mode
              throw new Error(
                `Unknown line ${  i + 1  } ${  JSON.stringify(_line)}`,
              );
            } else {
              i++;
            }
          }
        } // Parses the --- and +++ headers, if none are found, no lines
        // are consumed.

        function parseFileHeader(index) {
          const fileHeader = /^(-{3}|\+{3})\s+(.*)$/.exec(diffstr[i]);

          if (fileHeader) {
            const keyPrefix = fileHeader[1] === '---' ? 'old' : 'new';
            const data = fileHeader[2].split('\t', 2);
            let fileName = data[0].replaceAll('\\\\', '\\');

            if (/^".*"$/.test(fileName)) {
              fileName = fileName.slice(1, 1 + fileName.length - 2);
            }

            index[`${keyPrefix}FileName`] = fileName;
            index[`${keyPrefix}Header`] = (data[1] || '').trim();
            i++;
          }
        } // Parses a hunk
        // This assumes that we are at the start of a hunk.

        function parseHunk() {
          const chunkHeaderIndex = i,
            chunkHeaderLine = diffstr[i++],
            chunkHeader = chunkHeaderLine.split(
              /@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/,
            );
          const hunk = {
            oldStart: +chunkHeader[1],
            oldLines:
              typeof chunkHeader[2] === 'undefined' ? 1 : +chunkHeader[2],
            newStart: +chunkHeader[3],
            newLines:
              typeof chunkHeader[4] === 'undefined' ? 1 : +chunkHeader[4],
            lines: [],
            linedelimiters: [],
          }; // Unified Diff Format quirk: If the chunk size is 0,
          // the first number is one lower than one would expect.
          // https://www.artima.com/weblogs/viewpost.jsp?thread=164293

          if (hunk.oldLines === 0) {
            hunk.oldStart += 1;
          }

          if (hunk.newLines === 0) {
            hunk.newStart += 1;
          }

          let addCount = 0,
            removeCount = 0;

          for (; i < diffstr.length; i++) {
            // Lines starting with '---' could be mistaken for the "remove line" operation
            // But they could be the header for the next file. Therefore prune such cases out.
            if (
              diffstr[i].indexOf('--- ') === 0 &&
              i + 2 < diffstr.length &&
              diffstr[i + 1].indexOf('+++ ') === 0 &&
              diffstr[i + 2].indexOf('@@') === 0
            ) {
              break;
            }

            let operation =
              diffstr[i].length === 0 && i != diffstr.length - 1
                ? ' '
                : diffstr[i][0];

            if (
              operation === '+' ||
              operation === '-' ||
              operation === ' ' ||
              operation === '\\'
            ) {
              hunk.lines.push(diffstr[i]);
              hunk.linedelimiters.push(delimiters[i] || '\n');

              if (operation === '+') {
                addCount++;
              } else if (operation === '-') {
                removeCount++;
              } else if (operation === ' ') {
                addCount++;
                removeCount++;
              }
            } else {
              break;
            }
          } // Handle the empty block count case

          if (!addCount && hunk.newLines === 1) {
            hunk.newLines = 0;
          }

          if (!removeCount && hunk.oldLines === 1) {
            hunk.oldLines = 0;
          } // Perform optional sanity checking

          if (options.strict) {
            if (addCount !== hunk.newLines) {
              throw new Error(
                `Added line count did not match for hunk at line ${ 
                  chunkHeaderIndex + 1}`,
              );
            }

            if (removeCount !== hunk.oldLines) {
              throw new Error(
                `Removed line count did not match for hunk at line ${ 
                  chunkHeaderIndex + 1}`,
              );
            }
          }

          return hunk;
        }

        while (i < diffstr.length) {
          parseIndex();
        }

        return list;
      } // Iterator that traverses in the range of [min, max], stepping
      // by distance from a given start position. I.e. for [0, 4], with
      // start of 2, this will iterate 2, 3, 1, 4, 0.

      function distanceIterator(start, minLine, maxLine) {
        let wantForward = true,
          backwardExhausted = false,
          forwardExhausted = false,
          localOffset = 1;
        return function iterator() {
          if (wantForward && !forwardExhausted) {
            if (backwardExhausted) {
              localOffset++;
            } else {
              wantForward = false;
            } // Check if trying to fit beyond text length, and if not, check it fits
            // after offset location (or desired location on first iteration)

            if (start + localOffset <= maxLine) {
              return localOffset;
            }

            forwardExhausted = true;
          }

          if (!backwardExhausted) {
            if (!forwardExhausted) {
              wantForward = true;
            } // Check if trying to fit before text beginning, and if not, check it fits
            // before offset location

            if (minLine <= start - localOffset) {
              return -localOffset++;
            }

            backwardExhausted = true;
            return iterator();
          } // We tried to fit hunk before text beginning and beyond text length, then
          // hunk can't fit on the text. Return undefined
        };
      }

      function applyPatch(source, uniDiff) {
        let options =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {};

        if (typeof uniDiff === 'string') {
          uniDiff = parsePatch(uniDiff);
        }

        if (Array.isArray(uniDiff)) {
          if (uniDiff.length > 1) {
            throw new Error('applyPatch only works with a single input.');
          }

          uniDiff = uniDiff[0];
        } // Apply the diff to the input

        let lines = source.split(/\r\n|[\n\v\f\r\u0085]/),
          delimiters = source.match(/\r\n|[\n\v\f\r\u0085]/g) || [],
          hunks = uniDiff.hunks,
          compareLine =
            options.compareLine ||
            function (lineNumber, line, operation, patchContent) {
              return line === patchContent;
            },
          errorCount = 0,
          fuzzFactor = options.fuzzFactor || 0,
          minLine = 0,
          offset = 0,
          removeEOFNL,
          addEOFNL;
        /**
         * Checks if the hunk exactly fits on the provided location
         */

        function hunkFits(hunk, toPos) {
          for (let j = 0; j < hunk.lines.length; j++) {
            const line = hunk.lines[j],
              operation = line.length > 0 ? line[0] : ' ',
              content = line.length > 0 ? line.slice(1) : line;

            if (operation === ' ' || operation === '-') {
              // Context sanity check
              if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
                errorCount++;

                if (errorCount > fuzzFactor) {
                  return false;
                }
              }

              toPos++;
            }
          }

          return true;
        } // Search best fit offsets for each hunk based on the previous ones

        for (let hunk of hunks) {
          let maxLine = lines.length - hunk.oldLines,
            localOffset = 0,
            toPos = offset + hunk.oldStart - 1;
          const iterator = distanceIterator(toPos, minLine, maxLine);

          for (; localOffset !== undefined; localOffset = iterator()) {
            if (hunkFits(hunk, toPos + localOffset)) {
              hunk.offset = offset += localOffset;
              break;
            }
          }

          if (localOffset === undefined) {
            return false;
          } // Set lower text limit to end of the current hunk, so next ones don't try
          // to fit over already patched text

          minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
        } // Apply patch hunks

        let diffOffset = 0;

        for (let _hunk of hunks) {
          let _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1;

          diffOffset += _hunk.newLines - _hunk.oldLines;

          for (let j = 0; j < _hunk.lines.length; j++) {
            const line = _hunk.lines[j],
              operation = line.length > 0 ? line[0] : ' ',
              content = line.length > 0 ? line.slice(1) : line,
              delimiter = _hunk.linedelimiters[j];

            if (operation === ' ') {
              _toPos++;
            } else if (operation === '-') {
              lines.splice(_toPos, 1);
              delimiters.splice(_toPos, 1);
              /* istanbul ignore else */
            } else if (operation === '+') {
              lines.splice(_toPos, 0, content);
              delimiters.splice(_toPos, 0, delimiter);
              _toPos++;
            } else if (operation === '\\') {
              let previousOperation = _hunk.lines[j - 1]
                ? _hunk.lines[j - 1][0]
                : null;

              if (previousOperation === '+') {
                removeEOFNL = true;
              } else if (previousOperation === '-') {
                addEOFNL = true;
              }
            }
          }
        } // Handle EOFNL insertion/removal

        if (removeEOFNL) {
          while (!lines[lines.length - 1]) {
            lines.pop();
            delimiters.pop();
          }
        } else if (addEOFNL) {
          lines.push('');
          delimiters.push('\n');
        }

        for (let _k = 0; _k < lines.length - 1; _k++) {
          lines[_k] = lines[_k] + delimiters[_k];
        }

        return lines.join('');
      } // Wrapper that supports multiple file patches via callbacks.

      function applyPatches(uniDiff, options) {
        if (typeof uniDiff === 'string') {
          uniDiff = parsePatch(uniDiff);
        }

        let currentIndex = 0;

        function processIndex() {
          const index = uniDiff[currentIndex++];

          if (!index) {
            return options.complete();
          }

          options.loadFile(index, (err, data) => {
            if (err) {
              return options.complete(err);
            }

            const updatedContent = applyPatch(data, index, options);
            options.patched(index, updatedContent, err => {
              if (err) {
                return options.complete(err);
              }

              processIndex();
            });
          });
        }

        processIndex();
      }

      function structuredPatch(
        oldFileName,
        newFileName,
        oldStr,
        newStr,
        oldHeader,
        newHeader,
        options,
      ) {
        if (!options) {
          options = {};
        }

        if (typeof options.context === 'undefined') {
          options.context = 4;
        }

        const diff = diffLines(oldStr, newStr, options);
        diff.push({
          value: '',
          lines: [],
        }); // Append an empty value to make cleanup easier

        function contextLines(lines) {
          return lines.map(entry => {
            return ` ${entry}`;
          });
        }

        const hunks = [];
        let oldRangeStart = 0,
          newRangeStart = 0,
          curRange = [],
          oldLine = 1,
          newLine = 1;

        let _loop = function _loop(i) {
          const current = diff[i],
            lines =
              current.lines || current.value.replace(/\n$/, '').split('\n');
          current.lines = lines;

          if (current.added || current.removed) {
            let _curRange; // If we have previous context, start with that

            if (!oldRangeStart) {
              const prev = diff[i - 1];
              oldRangeStart = oldLine;
              newRangeStart = newLine;

              if (prev) {
                curRange =
                  options.context > 0
                    ? contextLines(prev.lines.slice(-options.context))
                    : [];
                oldRangeStart -= curRange.length;
                newRangeStart -= curRange.length;
              }
            } // Output our changes

            (_curRange = curRange).push.apply(
              _curRange,
              _toConsumableArray(
                lines.map(entry => {
                  return (current.added ? '+' : '-') + entry;
                }),
              ),
            ); // Track the updated file position

            if (current.added) {
              newLine += lines.length;
            } else {
              oldLine += lines.length;
            }
          } else {
            // Identical context lines. Track line changes
            if (oldRangeStart) {
              // Close out any changes that have been output (or join overlapping)
              if (lines.length <= options.context * 2 && i < diff.length - 2) {
                let _curRange2; // Overlapping

                (_curRange2 = curRange).push.apply(
                  _curRange2,
                  _toConsumableArray(contextLines(lines)),
                );
              } else {
                let _curRange3; // end the range and output

                const contextSize = Math.min(lines.length, options.context);

                (_curRange3 = curRange).push.apply(
                  _curRange3,
                  _toConsumableArray(contextLines(lines.slice(0, contextSize))),
                );

                const hunk = {
                  oldStart: oldRangeStart,
                  oldLines: oldLine - oldRangeStart + contextSize,
                  newStart: newRangeStart,
                  newLines: newLine - newRangeStart + contextSize,
                  lines: curRange,
                };

                if (i >= diff.length - 2 && lines.length <= options.context) {
                  // EOF is inside this hunk
                  const oldEOFNewline = /\n$/.test(oldStr);
                  const newEOFNewline = /\n$/.test(newStr);
                  let noNlBeforeAdds =
                    lines.length === 0 && curRange.length > hunk.oldLines;

                  if (!oldEOFNewline && noNlBeforeAdds && oldStr.length > 0) {
                    // special case: old has no eol and no trailing context; no-nl can end up before adds
                    // however, if the old file is empty, do not output the no-nl line
                    curRange.splice(
                      hunk.oldLines,
                      0,
                      '\\ No newline at end of file',
                    );
                  }

                  if ((!oldEOFNewline && !noNlBeforeAdds) || !newEOFNewline) {
                    curRange.push('\\ No newline at end of file');
                  }
                }

                hunks.push(hunk);
                oldRangeStart = 0;
                newRangeStart = 0;
                curRange = [];
              }
            }

            oldLine += lines.length;
            newLine += lines.length;
          }
        };

        for (let i = 0; i < diff.length; i++) {
          _loop(i);
        }

        return {
          oldFileName,
          newFileName,
          oldHeader,
          newHeader,
          hunks,
        };
      }

      function formatPatch(diff) {
        let ret = [];

        if (diff.oldFileName == diff.newFileName) {
          ret.push(`Index: ${diff.oldFileName}`);
        }

        ret.push(
          '===================================================================', 
          '--- ' +
            diff.oldFileName +
            (typeof diff.oldHeader === 'undefined'
              ? ''
              : '\t' + diff.oldHeader),
        
        );
        ret.push(
          `+++ ${ 
            diff.newFileName 
            }${typeof diff.newHeader === 'undefined'
              ? ''
              : '\t' + diff.newHeader}`,
        );

        for (let i = 0; i < diff.hunks.length; i++) {
          const hunk = diff.hunks[i]; // Unified Diff Format quirk: If the chunk size is 0,
          // the first number is one lower than one would expect.
          // https://www.artima.com/weblogs/viewpost.jsp?thread=164293

          if (hunk.oldLines === 0) {
            hunk.oldStart -= 1;
          }

          if (hunk.newLines === 0) {
            hunk.newStart -= 1;
          }

          ret.push(
            `@@ -${ 
              hunk.oldStart 
              },${ 
              hunk.oldLines 
              } +${ 
              hunk.newStart 
              },${ 
              hunk.newLines 
              } @@`,
          );
          ret.push.apply(ret, hunk.lines);
        }

        return `${ret.join('\n')}\n`;
      }

      function createTwoFilesPatch(
        oldFileName,
        newFileName,
        oldStr,
        newStr,
        oldHeader,
        newHeader,
        options,
      ) {
        return formatPatch(
          structuredPatch(
            oldFileName,
            newFileName,
            oldStr,
            newStr,
            oldHeader,
            newHeader,
            options,
          ),
        );
      }

      function createPatch(
        fileName,
        oldStr,
        newStr,
        oldHeader,
        newHeader,
        options,
      ) {
        return createTwoFilesPatch(
          fileName,
          fileName,
          oldStr,
          newStr,
          oldHeader,
          newHeader,
          options,
        );
      }

      function arrayEqual(a, b) {
        if (a.length !== b.length) {
          return false;
        }

        return arrayStartsWith(a, b);
      }

      function arrayStartsWith(array, start) {
        if (start.length > array.length) {
          return false;
        }

        for (const [i, element] of start.entries()) {
          if (element !== array[i]) {
            return false;
          }
        }

        return true;
      }

      function calcLineCount(hunk) {
        const _calcOldNewLineCount = calcOldNewLineCount(hunk.lines),
          oldLines = _calcOldNewLineCount.oldLines,
          newLines = _calcOldNewLineCount.newLines;

        if (oldLines !== undefined) {
          hunk.oldLines = oldLines;
        } else {
          delete hunk.oldLines;
        }

        if (newLines !== undefined) {
          hunk.newLines = newLines;
        } else {
          delete hunk.newLines;
        }
      }

      function merge(mine, theirs, base) {
        mine = loadPatch(mine, base);
        theirs = loadPatch(theirs, base);
        const ret = {}; // For index we just let it pass through as it doesn't have any necessary meaning.
        // Leaving sanity checks on this to the API consumer that may know more about the
        // meaning in their own context.

        if (mine.index || theirs.index) {
          ret.index = mine.index || theirs.index;
        }

        if (mine.newFileName || theirs.newFileName) {
          if (!fileNameChanged(mine)) {
            // No header or no change in ours, use theirs (and ours if theirs does not exist)
            ret.oldFileName = theirs.oldFileName || mine.oldFileName;
            ret.newFileName = theirs.newFileName || mine.newFileName;
            ret.oldHeader = theirs.oldHeader || mine.oldHeader;
            ret.newHeader = theirs.newHeader || mine.newHeader;
          } else if (!fileNameChanged(theirs)) {
            // No header or no change in theirs, use ours
            ret.oldFileName = mine.oldFileName;
            ret.newFileName = mine.newFileName;
            ret.oldHeader = mine.oldHeader;
            ret.newHeader = mine.newHeader;
          } else {
            // Both changed... figure it out
            ret.oldFileName = selectField(
              ret,
              mine.oldFileName,
              theirs.oldFileName,
            );
            ret.newFileName = selectField(
              ret,
              mine.newFileName,
              theirs.newFileName,
            );
            ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
            ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
          }
        }

        ret.hunks = [];
        let mineIndex = 0,
          theirsIndex = 0,
          mineOffset = 0,
          theirsOffset = 0;

        while (
          mineIndex < mine.hunks.length ||
          theirsIndex < theirs.hunks.length
        ) {
          const mineCurrent = mine.hunks[mineIndex] || {
              oldStart: Infinity,
            },
            theirsCurrent = theirs.hunks[theirsIndex] || {
              oldStart: Infinity,
            };

          if (hunkBefore(mineCurrent, theirsCurrent)) {
            // This patch does not overlap with any of the others, yay.
            ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
            mineIndex++;
            theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
          } else if (hunkBefore(theirsCurrent, mineCurrent)) {
            // This patch does not overlap with any of the others, yay.
            ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
            theirsIndex++;
            mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
          } else {
            // Overlap, merge as best we can
            const mergedHunk = {
              oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
              oldLines: 0,
              newStart: Math.min(
                mineCurrent.newStart + mineOffset,
                theirsCurrent.oldStart + theirsOffset,
              ),
              newLines: 0,
              lines: [],
            };
            mergeLines(
              mergedHunk,
              mineCurrent.oldStart,
              mineCurrent.lines,
              theirsCurrent.oldStart,
              theirsCurrent.lines,
            );
            theirsIndex++;
            mineIndex++;
            ret.hunks.push(mergedHunk);
          }
        }

        return ret;
      }

      function loadPatch(param, base) {
        if (typeof param === 'string') {
          if (/^@@/m.test(param) || /^Index:/m.test(param)) {
            return parsePatch(param)[0];
          }

          if (!base) {
            throw new Error('Must provide a base reference or pass in a patch');
          }

          return structuredPatch(undefined, undefined, base, param);
        }

        return param;
      }

      function fileNameChanged(patch) {
        return patch.newFileName && patch.newFileName !== patch.oldFileName;
      }

      function selectField(index, mine, theirs) {
        if (mine === theirs) {
          return mine;
        } else {
          index.conflict = true;
          return {
            mine,
            theirs,
          };
        }
      }

      function hunkBefore(test, check) {
        return (
          test.oldStart < check.oldStart &&
          test.oldStart + test.oldLines < check.oldStart
        );
      }

      function cloneHunk(hunk, offset) {
        return {
          oldStart: hunk.oldStart,
          oldLines: hunk.oldLines,
          newStart: hunk.newStart + offset,
          newLines: hunk.newLines,
          lines: hunk.lines,
        };
      }

      function mergeLines(
        hunk,
        mineOffset,
        mineLines,
        theirOffset,
        theirLines,
      ) {
        // This will generally result in a conflicted hunk, but there are cases where the context
        // is the only overlap where we can successfully merge the content here.
        const mine = {
            offset: mineOffset,
            lines: mineLines,
            index: 0,
          },
          their = {
            offset: theirOffset,
            lines: theirLines,
            index: 0,
          }; // Handle any leading content

        insertLeading(hunk, mine, their);
        insertLeading(hunk, their, mine); // Now in the overlap content. Scan through and select the best changes from each.

        while (
          mine.index < mine.lines.length &&
          their.index < their.lines.length
        ) {
          const mineCurrent = mine.lines[mine.index],
            theirCurrent = their.lines[their.index];

          if (
            (mineCurrent[0] === '-' || mineCurrent[0] === '+') &&
            (theirCurrent[0] === '-' || theirCurrent[0] === '+')
          ) {
            // Both modified ...
            mutualChange(hunk, mine, their);
          } else if (mineCurrent[0] === '+' && theirCurrent[0] === ' ') {
            var _hunk$lines; // Mine inserted

            (_hunk$lines = hunk.lines).push.apply(
              _hunk$lines,
              _toConsumableArray(collectChange(mine)),
            );
          } else if (theirCurrent[0] === '+' && mineCurrent[0] === ' ') {
            var _hunk$lines2; // Theirs inserted

            (_hunk$lines2 = hunk.lines).push.apply(
              _hunk$lines2,
              _toConsumableArray(collectChange(their)),
            );
          } else if (mineCurrent[0] === '-' && theirCurrent[0] === ' ') {
            // Mine removed or edited
            removal(hunk, mine, their);
          } else if (theirCurrent[0] === '-' && mineCurrent[0] === ' ') {
            // Their removed or edited
            removal(hunk, their, mine, true);
          } else if (mineCurrent === theirCurrent) {
            // Context identity
            hunk.lines.push(mineCurrent);
            mine.index++;
            their.index++;
          } else {
            // Context mismatch
            conflict(hunk, collectChange(mine), collectChange(their));
          }
        } // Now push anything that may be remaining

        insertTrailing(hunk, mine);
        insertTrailing(hunk, their);
        calcLineCount(hunk);
      }

      function mutualChange(hunk, mine, their) {
        const myChanges = collectChange(mine),
          theirChanges = collectChange(their);

        if (allRemoves(myChanges) && allRemoves(theirChanges)) {
          // Special case for remove changes that are supersets of one another
          if (
            arrayStartsWith(myChanges, theirChanges) &&
            skipRemoveSuperset(
              their,
              myChanges,
              myChanges.length - theirChanges.length,
            )
          ) {
            let _hunk$lines3;

            (_hunk$lines3 = hunk.lines).push.apply(
              _hunk$lines3,
              _toConsumableArray(myChanges),
            );

            return;
          } else if (
            arrayStartsWith(theirChanges, myChanges) &&
            skipRemoveSuperset(
              mine,
              theirChanges,
              theirChanges.length - myChanges.length,
            )
          ) {
            let _hunk$lines4;

            (_hunk$lines4 = hunk.lines).push.apply(
              _hunk$lines4,
              _toConsumableArray(theirChanges),
            );

            return;
          }
        } else if (arrayEqual(myChanges, theirChanges)) {
          let _hunk$lines5;

          (_hunk$lines5 = hunk.lines).push.apply(
            _hunk$lines5,
            _toConsumableArray(myChanges),
          );

          return;
        }

        conflict(hunk, myChanges, theirChanges);
      }

      function removal(hunk, mine, their, swap) {
        const myChanges = collectChange(mine),
          theirChanges = collectContext(their, myChanges);

        if (theirChanges.merged) {
          let _hunk$lines6;

          (_hunk$lines6 = hunk.lines).push.apply(
            _hunk$lines6,
            _toConsumableArray(theirChanges.merged),
          );
        } else {
          conflict(
            hunk,
            swap ? theirChanges : myChanges,
            swap ? myChanges : theirChanges,
          );
        }
      }

      function conflict(hunk, mine, their) {
        hunk.conflict = true;
        hunk.lines.push({
          conflict: true,
          mine,
          theirs: their,
        });
      }

      function insertLeading(hunk, insert, their) {
        while (
          insert.offset < their.offset &&
          insert.index < insert.lines.length
        ) {
          const line = insert.lines[insert.index++];
          hunk.lines.push(line);
          insert.offset++;
        }
      }

      function insertTrailing(hunk, insert) {
        while (insert.index < insert.lines.length) {
          const line = insert.lines[insert.index++];
          hunk.lines.push(line);
        }
      }

      function collectChange(state) {
        let ret = [],
          operation = state.lines[state.index][0];

        while (state.index < state.lines.length) {
          let line = state.lines[state.index]; // Group additions that are immediately after subtractions and treat them as one "atomic" modify change.

          if (operation === '-' && line[0] === '+') {
            operation = '+';
          }

          if (operation === line[0]) {
            ret.push(line);
            state.index++;
          } else {
            break;
          }
        }

        return ret;
      }

      function collectContext(state, matchChanges) {
        let changes = [],
          merged = [],
          matchIndex = 0,
          contextChanges = false,
          conflicted = false;

        while (
          matchIndex < matchChanges.length &&
          state.index < state.lines.length
        ) {
          let change = state.lines[state.index],
            match = matchChanges[matchIndex]; // Once we've hit our add, then we are done

          if (match[0] === '+') {
            break;
          }

          contextChanges = contextChanges || change[0] !== ' ';
          merged.push(match);
          matchIndex++; // Consume any additions in the other block as a conflict to attempt
          // to pull in the remaining context after this

          if (change[0] === '+') {
            conflicted = true;

            while (change[0] === '+') {
              changes.push(change);
              change = state.lines[++state.index];
            }
          }

          if (match.slice(1) === change.slice(1)) {
            changes.push(change);
            state.index++;
          } else {
            conflicted = true;
          }
        }

        if ((matchChanges[matchIndex] || '')[0] === '+' && contextChanges) {
          conflicted = true;
        }

        if (conflicted) {
          return changes;
        }

        while (matchIndex < matchChanges.length) {
          merged.push(matchChanges[matchIndex++]);
        }

        return {
          merged,
          changes,
        };
      }

      function allRemoves(changes) {
        return changes.reduce((prev, change) => {
          return prev && change[0] === '-';
        }, true);
      }

      function skipRemoveSuperset(state, removeChanges, delta) {
        for (let i = 0; i < delta; i++) {
          let changeContent =
            removeChanges[removeChanges.length - delta + i].slice(1);

          if (state.lines[state.index + i] !== ` ${changeContent}`) {
            return false;
          }
        }

        state.index += delta;
        return true;
      }

      function calcOldNewLineCount(lines) {
        let oldLines = 0;
        let newLines = 0;
        lines.forEach(line => {
          if (typeof line !== 'string') {
            const myCount = calcOldNewLineCount(line.mine);
            const theirCount = calcOldNewLineCount(line.theirs);

            if (oldLines !== undefined) {
              if (myCount.oldLines === theirCount.oldLines) {
                oldLines += myCount.oldLines;
              } else {
                oldLines = undefined;
              }
            }

            if (newLines !== undefined) {
              if (myCount.newLines === theirCount.newLines) {
                newLines += myCount.newLines;
              } else {
                newLines = undefined;
              }
            }
          } else {
            if (
              newLines !== undefined &&
              (line[0] === '+' || line[0] === ' ')
            ) {
              newLines++;
            }

            if (
              oldLines !== undefined &&
              (line[0] === '-' || line[0] === ' ')
            ) {
              oldLines++;
            }
          }
        });
        return {
          oldLines,
          newLines,
        };
      } // See: http://code.google.com/p/google-diff-match-patch/wiki/API

      function convertChangesToDMP(changes) {
        let ret = [],
          change,
          operation;

        for (const change_ of changes) {
          change = change_;

          if (change.added) {
            operation = 1;
          } else if (change.removed) {
            operation = -1;
          } else {
            operation = 0;
          }

          ret.push([operation, change.value]);
        }

        return ret;
      }

      function convertChangesToXML(changes) {
        const ret = [];

        for (let change of changes) {

          if (change.added) {
            ret.push('<ins>');
          } else if (change.removed) {
            ret.push('<del>');
          }

          ret.push(escapeHTML(change.value));

          if (change.added) {
            ret.push('</ins>');
          } else if (change.removed) {
            ret.push('</del>');
          }
        }

        return ret.join('');
      }

      function escapeHTML(s) {
        let n = s;
        n = n.replaceAll('&', '&amp;');
        n = n.replaceAll('<', '&lt;');
        n = n.replaceAll('>', '&gt;');
        n = n.replaceAll('"', '&quot;');
        return n;
      }

      exports.Diff = Diff;
      exports.applyPatch = applyPatch;
      exports.applyPatches = applyPatches;
      exports.canonicalize = canonicalize;
      exports.convertChangesToDMP = convertChangesToDMP;
      exports.convertChangesToXML = convertChangesToXML;
      exports.createPatch = createPatch;
      exports.createTwoFilesPatch = createTwoFilesPatch;
      exports.diffArrays = diffArrays;
      exports.diffChars = diffChars;
      exports.diffCss = diffCss;
      exports.diffJson = diffJson;
      exports.diffLines = diffLines;
      exports.diffSentences = diffSentences;
      exports.diffTrimmedLines = diffTrimmedLines;
      exports.diffWords = diffWords;
      exports.diffWordsWithSpace = diffWordsWithSpace;
      exports.merge = merge;
      exports.parsePatch = parsePatch;
      exports.structuredPatch = structuredPatch;
      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
    });
  });

  /**
   * Helpers.
   */
  const s = 1000;
  const m = s * 60;
  const h = m * 60;
  const d = h * 24;
  const w = d * 7;
  const y = d * 365.25;
  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */

  const ms = function ms(val, options) {
    options = options || {};

    const type = _typeof(val);

    if (type === 'string' && val.length > 0) {
      return parse(val);
    } else if (type === 'number' && isFinite(val)) {
      return options['long'] ? fmtLong(val) : fmtShort(val);
    }

    throw new Error(
      `val is not a non-empty string or a valid number. val=${ 
        JSON.stringify(val)}`,
    );
  };
  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = String(str);

    if (str.length > 100) {
      return;
    }

    const match =
      /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str,
      );

    if (!match) {
      return;
    }

    const n = Number.parseFloat(match[1]);
    const type = (match[2] || 'ms').toLowerCase();

    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;

      case 'weeks':
      case 'week':
      case 'w':
        return n * w;

      case 'days':
      case 'day':
      case 'd':
        return n * d;

      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;

      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;

      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;

      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;

      default:
        return undefined;
    }
  }
  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtShort(ms) {
    const msAbs = Math.abs(ms);

    if (msAbs >= d) {
      return `${Math.round(ms / d)}d`;
    }

    if (msAbs >= h) {
      return `${Math.round(ms / h)}h`;
    }

    if (msAbs >= m) {
      return `${Math.round(ms / m)}m`;
    }

    if (msAbs >= s) {
      return `${Math.round(ms / s)}s`;
    }

    return `${ms}ms`;
  }
  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtLong(ms) {
    const msAbs = Math.abs(ms);

    if (msAbs >= d) {
      return plural(ms, msAbs, d, 'day');
    }

    if (msAbs >= h) {
      return plural(ms, msAbs, h, 'hour');
    }

    if (msAbs >= m) {
      return plural(ms, msAbs, m, 'minute');
    }

    if (msAbs >= s) {
      return plural(ms, msAbs, s, 'second');
    }

    return `${ms} ms`;
  }
  /**
   * Pluralization helper.
   */

  function plural(ms, msAbs, n, name) {
    const isPlural = msAbs >= n * 1.5;
    return `${Math.round(ms / n)} ${name}${isPlural ? 's' : ''}`;
  }

  const freezing = !fails(() => {
    return Object.isExtensible(Object.preventExtensions({}));
  });

  const internalMetadata = createCommonjsModule(module => {
    let defineProperty = objectDefineProperty.f;

    let METADATA = uid('meta');
    let id = 0;

    let isExtensible =
      Object.isExtensible ||
      function () {
        return true;
      };

    let setMetadata = function (it) {
      defineProperty(it, METADATA, {
        value: {
          objectID: `O${++id}`, // object ID
          weakData: {}, // weak collections IDs
        },
      });
    };

    let fastKey = function (it, create) {
      // return a primitive with prefix
      if (!isObject(it))
        return typeof it === 'symbol'
          ? it
          : (typeof it === 'string' ? 'S' : 'P') + it;
      if (!has(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return 'F';
        // not necessary to add metadata
        if (!create) return 'E';
        // add missing metadata
        setMetadata(it);
        // return object ID
      }
      return it[METADATA].objectID;
    };

    let getWeakData = function (it, create) {
      if (!has(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return true;
        // not necessary to add metadata
        if (!create) return false;
        // add missing metadata
        setMetadata(it);
        // return the store of weak collections IDs
      }
      return it[METADATA].weakData;
    };

    // add metadata on freeze-family methods calling
    let onFreeze = function (it) {
      if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA))
        setMetadata(it);
      return it;
    };

    var meta = (module.exports = {
      REQUIRED: false,
      fastKey,
      getWeakData,
      onFreeze,
    });

    hiddenKeys[METADATA] = true;
  });

  const onFreeze = internalMetadata.onFreeze;

  const nativeFreeze = Object.freeze;
  const FAILS_ON_PRIMITIVES$4 = fails(() => {
    nativeFreeze(1);
  });

  // `Object.freeze` method
  // https://tc39.es/ecma262/#sec-object.freeze
  _export(
    {
      target: 'Object',
      stat: true,
      forced: FAILS_ON_PRIMITIVES$4,
      sham: !freezing,
    },
    {
      freeze: function freeze(it) {
        return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
      },
    },
  );

  const collection = function (CONSTRUCTOR_NAME, wrapper, common) {
    const IS_MAP = CONSTRUCTOR_NAME.includes('Map');
    const IS_WEAK = CONSTRUCTOR_NAME.includes('Weak');
    const ADDER = IS_MAP ? 'set' : 'add';
    const NativeConstructor = global_1[CONSTRUCTOR_NAME];
    const NativePrototype = NativeConstructor && NativeConstructor.prototype;
    let Constructor = NativeConstructor;
    const exported = {};

    const fixMethod = function (KEY) {
      let nativeMethod = NativePrototype[KEY];
      redefine(
        NativePrototype,
        KEY,
        KEY == 'add'
          ? function add(value) {
              nativeMethod.call(this, value === 0 ? 0 : value);
              return this;
            }
          : KEY == 'delete'
          ? function (key) {
              return IS_WEAK && !isObject(key)
                ? false
                : nativeMethod.call(this, key === 0 ? 0 : key);
            }
          : KEY == 'get'
          ? function get(key) {
              return IS_WEAK && !isObject(key)
                ? undefined
                : nativeMethod.call(this, key === 0 ? 0 : key);
            }
          : KEY == 'has'
          ? function has(key) {
              return IS_WEAK && !isObject(key)
                ? false
                : nativeMethod.call(this, key === 0 ? 0 : key);
            }
          : function set(key, value) {
              nativeMethod.call(this, key === 0 ? 0 : key, value);
              return this;
            },
      );
    };

    // eslint-disable-next-line max-len
    if (
      isForced_1(
        CONSTRUCTOR_NAME,
        typeof NativeConstructor !== 'function' ||
          !(
            IS_WEAK ||
            (NativePrototype.forEach &&
              !fails(() => {
                new NativeConstructor().entries().next();
              }))
          ),
      )
    ) {
      // create collection constructor
      Constructor = common.getConstructor(
        wrapper,
        CONSTRUCTOR_NAME,
        IS_MAP,
        ADDER,
      );
      internalMetadata.REQUIRED = true;
    } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
      let instance = new Constructor();
      // early implementations not supports chaining
      const HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
      // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
      let THROWS_ON_PRIMITIVES = fails(() => {
        instance.has(1);
      });
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      // eslint-disable-next-line no-new
      let ACCEPT_ITERABLES = checkCorrectnessOfIteration((iterable) => {
        new NativeConstructor(iterable);
      });
      // for early implementations -0 and +0 not the same
      let BUGGY_ZERO =
        !IS_WEAK &&
        fails(() => {
          // V8 ~ Chromium 42- fails only with 5+ elements
          const $instance = new NativeConstructor();
          let index = 5;
          while (index--) $instance[ADDER](index, index);
          return !$instance.has(-0);
        });

      if (!ACCEPT_ITERABLES) {
        Constructor = wrapper((dummy, iterable) => {
          anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
          let that = inheritIfRequired(
            new NativeConstructor(),
            dummy,
            Constructor,
          );
          if (iterable != undefined)
            iterate(iterable, that[ADDER], { that, AS_ENTRIES: IS_MAP });
          return that;
        });
        Constructor.prototype = NativePrototype;
        NativePrototype.constructor = Constructor;
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

      // weak collections should not contains .clear method
      if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
    }

    exported[CONSTRUCTOR_NAME] = Constructor;
    _export(
      { global: true, forced: Constructor != NativeConstructor },
      exported,
    );

    setToStringTag(Constructor, CONSTRUCTOR_NAME);

    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

    return Constructor;
  };

  const defineProperty$a = objectDefineProperty.f;

  const fastKey = internalMetadata.fastKey;

  const setInternalState$6 = internalState.set;
  const internalStateGetterFor = internalState.getterFor;

  const collectionStrong = {
    getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper((that, iterable) => {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$6(that, {
          type: CONSTRUCTOR_NAME,
          index: objectCreate(null),
          first: undefined,
          last: undefined,
          size: 0,
        });
        if (!descriptors) that.size = 0;
        if (iterable != undefined)
          iterate(iterable, that[ADDER], { that, AS_ENTRIES: IS_MAP });
      });

      let getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      let define = function (that, key, value) {
        var state = getInternalState(that);
        let entry = getEntry(that, key);
        let previous, index;
        // change existing entry
        if (entry) {
          entry.value = value;
          // create new entry
        } else {
          state.last = entry = {
            index: (index = fastKey(key, true)),
            key,
            value: value,
            previous: (previous = state.last),
            next: undefined,
            removed: false,
          };
          if (!state.first) state.first = entry;
          if (previous) previous.next = entry;
          if (descriptors) state.size++;
          else that.size++;
          // add to index
          if (index !== 'F') state.index[index] = entry;
        }
        return that;
      };

      var getEntry = function (that, key) {
        let state = getInternalState(that);
        // fast case
        let index = fastKey(key);
        let entry;
        if (index !== 'F') return state.index[index];
        // frozen object case
        for (entry = state.first; entry; entry = entry.next) {
          if (entry.key == key) return entry;
        }
      };

      redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          let that = this;
          let state = getInternalState(that);
          let data = state.index;
          let entry = state.first;
          while (entry) {
            entry.removed = true;
            if (entry.previous)
              entry.previous = entry.previous.next = undefined;
            delete data[entry.index];
            entry = entry.next;
          }
          state.first = state.last = undefined;
          if (descriptors) state.size = 0;
          else that.size = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        delete: function (key) {
          var that = this;
          let state = getInternalState(that);
          let entry = getEntry(that, key);
          if (entry) {
            var next = entry.next;
            let prev = entry.previous;
            delete state.index[entry.index];
            entry.removed = true;
            if (prev) prev.next = next;
            if (next) next.previous = prev;
            if (state.first == entry) state.first = next;
            if (state.last == entry) state.last = prev;
            if (descriptors) state.size--;
            else that.size--;
          }
          return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn /* , that = undefined */) {
          let state = getInternalState(this);
          var boundFunction = functionBindContext(
            callbackfn,
            arguments.length > 1 ? arguments[1] : undefined,
            3,
          );
          let entry;
          while ((entry = entry ? entry.next : state.first)) {
            boundFunction(entry.value, entry.key, this);
            // revert to the last existing entry
            while (entry && entry.removed) entry = entry.previous;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(this, key);
        },
      });

      redefineAll(
        C.prototype,
        IS_MAP
          ? {
              // 23.1.3.6 Map.prototype.get(key)
              get: function get(key) {
                let entry = getEntry(this, key);
                return entry && entry.value;
              },
              // 23.1.3.9 Map.prototype.set(key, value)
              set: function set(key, value) {
                return define(this, key === 0 ? 0 : key, value);
              },
            }
          : {
              // 23.2.3.1 Set.prototype.add(value)
              add: function add(value) {
                return define(this, (value = value === 0 ? 0 : value), value);
              },
            },
      );
      if (descriptors)
        defineProperty$a(C.prototype, 'size', {
          get () {
	        return getInternalState(this).size;
	      }
        });
      return C;
    },
    setStrong(C, CONSTRUCTOR_NAME, IS_MAP) {
      let ITERATOR_NAME = `${CONSTRUCTOR_NAME  } Iterator`;
      let getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
      let getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      defineIterator(
        C,
        CONSTRUCTOR_NAME,
        function (iterated, kind) {
          setInternalState$6(this, {
            type: ITERATOR_NAME,
            target: iterated,
            state: getInternalCollectionState(iterated),
            kind: kind,
            last: undefined,
          });
        },
        function () {
          let state = getInternalIteratorState(this);
          let kind = state.kind;
          let entry = state.last;
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
          // get next entry
          if (
            !state.target ||
            !(state.last = entry = entry ? entry.next : state.state.first)
          ) {
            // or finish the iteration
            state.target = undefined;
            return { value: undefined, done: true };
          }
          // return step by kind
          if (kind == 'keys') return { value: entry.key, done: false };
          if (kind == 'values') return { value: entry.value, done: false };
          return { value: [entry.key, entry.value], done: false };
        },
        IS_MAP ? 'entries' : 'values',
        !IS_MAP,
        true,
      );

      // add [@@species], 23.1.2.2, 23.2.2.2
      setSpecies(CONSTRUCTOR_NAME);
    },
  };

  // `Set` constructor
  // https://tc39.es/ecma262/#sec-set-objects
  collection(
    'Set',
    init => {
      return function Set() {
        return init(this, arguments.length > 0 ? arguments[0] : undefined);
      };
    },
    collectionStrong,
  );

  const browser$1 = true;

  // This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
  // optimize the gzip compression for this alphabet.
  const urlAlphabet =
    'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';

  const customAlphabet = function customAlphabet(alphabet, size) {
    return function () {
      let id = ''; // A compact alternative for `for (var i = 0; i < step; i++)`.

      let i = size;

      while (i--) {
        // `| 0` is more compact and faster than `Math.floor()`.
        id += alphabet[(Math.random() * alphabet.length) | 0];
      }

      return id;
    };
  };

  const nanoid = function nanoid() {
    let size =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 21;
    let id = ''; // A compact alternative for `for (var i = 0; i < step; i++)`.

    let i = size;

    while (i--) {
      // `| 0` is more compact and faster than `Math.floor()`.
      id += urlAlphabet[(Math.random() * 64) | 0];
    }

    return id;
  };

  const nonSecure = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    nanoid,
    customAlphabet,
  });

  const he = createCommonjsModule((module, exports) => {
    (function (root) {
      // Detect free variables `exports`.
      let freeExports = exports; // Detect free variable `module`.

      let freeModule = module && module.exports == freeExports && module; // Detect free variable `global`, from Node.js or Browserified code,
      // and use it as `root`.

      const freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal;

      if (
        freeGlobal.global === freeGlobal ||
        freeGlobal.window === freeGlobal
      ) {
        root = freeGlobal;
      }
      /*--------------------------------------------------------------------------*/
      // All astral symbols.

      const regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g; // All ASCII symbols (not just printable ASCII) except those listed in the
      // first column of the overrides table.
      // https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides

      let regexAsciiWhitelist = /[\u0001-\u007F]/g; // All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
      // code points listed in the first column of the overrides table on
      // https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides.

      let regexBmpWhitelist =
        /[\u0001-\t\u000B\f\u000E-\u001F\u007F\u0081\u008D\u008F\u0090\u009D\u00A0-\uFFFF]/g;
      let regexEncodeNonAscii =
        /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\u00A0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
      const encodeMap = {
        '\xAD': 'shy',
        '\u200C': 'zwnj',
        '\u200D': 'zwj',
        '\u200E': 'lrm',
        '\u2063': 'ic',
        '\u2062': 'it',
        '\u2061': 'af',
        '\u200F': 'rlm',
        '\u200B': 'ZeroWidthSpace',
        '\u2060': 'NoBreak',
        '\u0311': 'DownBreve',
        '\u20DB': 'tdot',
        '\u20DC': 'DotDot',
        '\t': 'Tab',
        '\n': 'NewLine',
        '\u2008': 'puncsp',
        '\u205F': 'MediumSpace',
        '\u2009': 'thinsp',
        '\u200A': 'hairsp',
        '\u2004': 'emsp13',
        '\u2002': 'ensp',
        '\u2005': 'emsp14',
        '\u2003': 'emsp',
        '\u2007': 'numsp',
        '\u00A0': 'nbsp',
        '\u205F\u200A': 'ThickSpace',
        '\u203E': 'oline',
        _: 'lowbar',
        '\u2010': 'dash',
        '\u2013': 'ndash',
        '\u2014': 'mdash',
        '\u2015': 'horbar',
        ',': 'comma',
        ';': 'semi',
        '\u204F': 'bsemi',
        ':': 'colon',
        '\u2A74': 'Colone',
        '!': 'excl',
        '\u00A1': 'iexcl',
        '?': 'quest',
        '\xBF': 'iquest',
        '.': 'period',
        '\u2025': 'nldr',
        '\u2026': 'mldr',
        '\u00B7': 'middot',
        "'": 'apos',
        '\u2018': 'lsquo',
        '\u2019': 'rsquo',
        '\u201A': 'sbquo',
        '\u2039': 'lsaquo',
        '\u203A': 'rsaquo',
        '"': 'quot',
        '\u201C': 'ldquo',
        '\u201D': 'rdquo',
        '\u201E': 'bdquo',
        '\u00AB': 'laquo',
        '\xBB': 'raquo',
        '(': 'lpar',
        ')': 'rpar',
        '[': 'lsqb',
        ']': 'rsqb',
        '{': 'lcub',
        '}': 'rcub',
        '\u2308': 'lceil',
        '\u2309': 'rceil',
        '\u230A': 'lfloor',
        '\u230B': 'rfloor',
        '\u2985': 'lopar',
        '\u2986': 'ropar',
        '\u298B': 'lbrke',
        '\u298C': 'rbrke',
        '\u298D': 'lbrkslu',
        '\u298E': 'rbrksld',
        '\u298F': 'lbrksld',
        '\u2990': 'rbrkslu',
        '\u2991': 'langd',
        '\u2992': 'rangd',
        '\u2993': 'lparlt',
        '\u2994': 'rpargt',
        '\u2995': 'gtlPar',
        '\u2996': 'ltrPar',
        '\u27E6': 'lobrk',
        '\u27E7': 'robrk',
        '\u27E8': 'lang',
        '\u27E9': 'rang',
        '\u27EA': 'Lang',
        '\u27EB': 'Rang',
        '\u27EC': 'loang',
        '\u27ED': 'roang',
        '\u2772': 'lbbrk',
        '\u2773': 'rbbrk',
        '\u2016': 'Vert',
        '\u00A7': 'sect',
        '\u00B6': 'para',
        '@': 'commat',
        '*': 'ast',
        '/': 'sol',
        undefined: null,
        '&': 'amp',
        '#': 'num',
        '%': 'percnt',
        '\u2030': 'permil',
        '\u2031': 'pertenk',
        '\u2020': 'dagger',
        '\u2021': 'Dagger',
        '\u2022': 'bull',
        '\u2043': 'hybull',
        '\u2032': 'prime',
        '\u2033': 'Prime',
        '\u2034': 'tprime',
        '\u2057': 'qprime',
        '\u2035': 'bprime',
        '\u2041': 'caret',
        '`': 'grave',
        '\xB4': 'acute',
        '\u02DC': 'tilde',
        '^': 'Hat',
        '\xAF': 'macr',
        '\u02D8': 'breve',
        '\u02D9': 'dot',
        '\u00A8': 'die',
        '\u02DA': 'ring',
        '\u02DD': 'dblac',
        '\u00B8': 'cedil',
        '\u02DB': 'ogon',
        '\u02C6': 'circ',
        '\u02C7': 'caron',
        '\u00B0': 'deg',
        '\u00A9': 'copy',
        '\u00AE': 'reg',
        '\u2117': 'copysr',
        '\u2118': 'wp',
        '\u211E': 'rx',
        '\u2127': 'mho',
        '\u2129': 'iiota',
        '\u2190': 'larr',
        '\u219A': 'nlarr',
        '\u2192': 'rarr',
        '\u219B': 'nrarr',
        '\u2191': 'uarr',
        '\u2193': 'darr',
        '\u2194': 'harr',
        '\u21AE': 'nharr',
        '\u2195': 'varr',
        '\u2196': 'nwarr',
        '\u2197': 'nearr',
        '\u2198': 'searr',
        '\u2199': 'swarr',
        '\u219D': 'rarrw',
        '\u219D\u0338': 'nrarrw',
        '\u219E': 'Larr',
        '\u219F': 'Uarr',
        '\u21A0': 'Rarr',
        '\u21A1': 'Darr',
        '\u21A2': 'larrtl',
        '\u21A3': 'rarrtl',
        '\u21A4': 'mapstoleft',
        '\u21A5': 'mapstoup',
        '\u21A6': 'map',
        '\u21A7': 'mapstodown',
        '\u21A9': 'larrhk',
        '\u21AA': 'rarrhk',
        '\u21AB': 'larrlp',
        '\u21AC': 'rarrlp',
        '\u21AD': 'harrw',
        '\u21B0': 'lsh',
        '\u21B1': 'rsh',
        '\u21B2': 'ldsh',
        '\u21B3': 'rdsh',
        '\u21B5': 'crarr',
        '\u21B6': 'cularr',
        '\u21B7': 'curarr',
        '\u21BA': 'olarr',
        '\u21BB': 'orarr',
        '\u21BC': 'lharu',
        '\u21BD': 'lhard',
        '\u21BE': 'uharr',
        '\u21BF': 'uharl',
        '\u21C0': 'rharu',
        '\u21C1': 'rhard',
        '\u21C2': 'dharr',
        '\u21C3': 'dharl',
        '\u21C4': 'rlarr',
        '\u21C5': 'udarr',
        '\u21C6': 'lrarr',
        '\u21C7': 'llarr',
        '\u21C8': 'uuarr',
        '\u21C9': 'rrarr',
        '\u21CA': 'ddarr',
        '\u21CB': 'lrhar',
        '\u21CC': 'rlhar',
        '\u21D0': 'lArr',
        '\u21CD': 'nlArr',
        '\u21D1': 'uArr',
        '\u21D2': 'rArr',
        '\u21CF': 'nrArr',
        '\u21D3': 'dArr',
        '\u21D4': 'iff',
        '\u21CE': 'nhArr',
        '\u21D5': 'vArr',
        '\u21D6': 'nwArr',
        '\u21D7': 'neArr',
        '\u21D8': 'seArr',
        '\u21D9': 'swArr',
        '\u21DA': 'lAarr',
        '\u21DB': 'rAarr',
        '\u21DD': 'zigrarr',
        '\u21E4': 'larrb',
        '\u21E5': 'rarrb',
        '\u21F5': 'duarr',
        '\u21FD': 'loarr',
        '\u21FE': 'roarr',
        '\u21FF': 'hoarr',
        '\u2200': 'forall',
        '\u2201': 'comp',
        '\u2202': 'part',
        '\u2202\u0338': 'npart',
        '\u2203': 'exist',
        '\u2204': 'nexist',
        '\u2205': 'empty',
        '\u2207': 'Del',
        '\u2208': 'in',
        '\u2209': 'notin',
        '\u220B': 'ni',
        '\u220C': 'notni',
        '\u03F6': 'bepsi',
        '\u220F': 'prod',
        '\u2210': 'coprod',
        '\u2211': 'sum',
        '+': 'plus',
        '\xB1': 'pm',
        '\u00F7': 'div',
        '\u00D7': 'times',
        '<': 'lt',
        '\u226E': 'nlt',
        '<\u20D2': 'nvlt',
        '=': 'equals',
        '\u2260': 'ne',
        '=\u20E5': 'bne',
        '\u2A75': 'Equal',
        '>': 'gt',
        '\u226F': 'ngt',
        '>\u20D2': 'nvgt',
        '\u00AC': 'not',
        '|': 'vert',
        '\u00A6': 'brvbar',
        '\u2212': 'minus',
        '\u2213': 'mp',
        '\u2214': 'plusdo',
        '\u2044': 'frasl',
        '\u2216': 'setmn',
        '\u2217': 'lowast',
        '\u2218': 'compfn',
        '\u221A': 'Sqrt',
        '\u221D': 'prop',
        '\u221E': 'infin',
        '\u221F': 'angrt',
        '\u2220': 'ang',
        '\u2220\u20D2': 'nang',
        '\u2221': 'angmsd',
        '\u2222': 'angsph',
        '\u2223': 'mid',
        '\u2224': 'nmid',
        '\u2225': 'par',
        '\u2226': 'npar',
        '\u2227': 'and',
        '\u2228': 'or',
        '\u2229': 'cap',
        '\u2229\uFE00': 'caps',
        '\u222A': 'cup',
        '\u222A\uFE00': 'cups',
        '\u222B': 'int',
        '\u222C': 'Int',
        '\u222D': 'tint',
        '\u2A0C': 'qint',
        '\u222E': 'oint',
        '\u222F': 'Conint',
        '\u2230': 'Cconint',
        '\u2231': 'cwint',
        '\u2232': 'cwconint',
        '\u2233': 'awconint',
        '\u2234': 'there4',
        '\u2235': 'becaus',
        '\u2236': 'ratio',
        '\u2237': 'Colon',
        '\u2238': 'minusd',
        '\u223A': 'mDDot',
        '\u223B': 'homtht',
        '\u223C': 'sim',
        '\u2241': 'nsim',
        '\u223C\u20D2': 'nvsim',
        '\u223D': 'bsim',
        '\u223D\u0331': 'race',
        '\u223E': 'ac',
        '\u223E\u0333': 'acE',
        '\u223F': 'acd',
        '\u2240': 'wr',
        '\u2242': 'esim',
        '\u2242\u0338': 'nesim',
        '\u2243': 'sime',
        '\u2244': 'nsime',
        '\u2245': 'cong',
        '\u2247': 'ncong',
        '\u2246': 'simne',
        '\u2248': 'ap',
        '\u2249': 'nap',
        '\u224A': 'ape',
        '\u224B': 'apid',
        '\u224B\u0338': 'napid',
        '\u224C': 'bcong',
        '\u224D': 'CupCap',
        '\u226D': 'NotCupCap',
        '\u224D\u20D2': 'nvap',
        '\u224E': 'bump',
        '\u224E\u0338': 'nbump',
        '\u224F': 'bumpe',
        '\u224F\u0338': 'nbumpe',
        '\u2250': 'doteq',
        '\u2250\u0338': 'nedot',
        '\u2251': 'eDot',
        '\u2252': 'efDot',
        '\u2253': 'erDot',
        '\u2254': 'colone',
        '\u2255': 'ecolon',
        '\u2256': 'ecir',
        '\u2257': 'cire',
        '\u2259': 'wedgeq',
        '\u225A': 'veeeq',
        '\u225C': 'trie',
        '\u225F': 'equest',
        '\u2261': 'equiv',
        '\u2262': 'nequiv',
        '\u2261\u20E5': 'bnequiv',
        '\u2264': 'le',
        '\u2270': 'nle',
        '\u2264\u20D2': 'nvle',
        '\u2265': 'ge',
        '\u2271': 'nge',
        '\u2265\u20D2': 'nvge',
        '\u2266': 'lE',
        '\u2266\u0338': 'nlE',
        '\u2267': 'gE',
        '\u2267\u0338': 'ngE',
        '\u2268\uFE00': 'lvnE',
        '\u2268': 'lnE',
        '\u2269': 'gnE',
        '\u2269\uFE00': 'gvnE',
        '\u226A': 'll',
        '\u226A\u0338': 'nLtv',
        '\u226A\u20D2': 'nLt',
        '\u226B': 'gg',
        '\u226B\u0338': 'nGtv',
        '\u226B\u20D2': 'nGt',
        '\u226C': 'twixt',
        '\u2272': 'lsim',
        '\u2274': 'nlsim',
        '\u2273': 'gsim',
        '\u2275': 'ngsim',
        '\u2276': 'lg',
        '\u2278': 'ntlg',
        '\u2277': 'gl',
        '\u2279': 'ntgl',
        '\u227A': 'pr',
        '\u2280': 'npr',
        '\u227B': 'sc',
        '\u2281': 'nsc',
        '\u227C': 'prcue',
        '\u22E0': 'nprcue',
        '\u227D': 'sccue',
        '\u22E1': 'nsccue',
        '\u227E': 'prsim',
        '\u227F': 'scsim',
        '\u227F\u0338': 'NotSucceedsTilde',
        '\u2282': 'sub',
        '\u2284': 'nsub',
        '\u2282\u20D2': 'vnsub',
        '\u2283': 'sup',
        '\u2285': 'nsup',
        '\u2283\u20D2': 'vnsup',
        '\u2286': 'sube',
        '\u2288': 'nsube',
        '\u2287': 'supe',
        '\u2289': 'nsupe',
        '\u228A\uFE00': 'vsubne',
        '\u228A': 'subne',
        '\u228B\uFE00': 'vsupne',
        '\u228B': 'supne',
        '\u228D': 'cupdot',
        '\u228E': 'uplus',
        '\u228F': 'sqsub',
        '\u228F\u0338': 'NotSquareSubset',
        '\u2290': 'sqsup',
        '\u2290\u0338': 'NotSquareSuperset',
        '\u2291': 'sqsube',
        '\u22E2': 'nsqsube',
        '\u2292': 'sqsupe',
        '\u22E3': 'nsqsupe',
        '\u2293': 'sqcap',
        '\u2293\uFE00': 'sqcaps',
        '\u2294': 'sqcup',
        '\u2294\uFE00': 'sqcups',
        '\u2295': 'oplus',
        '\u2296': 'ominus',
        '\u2297': 'otimes',
        '\u2298': 'osol',
        '\u2299': 'odot',
        '\u229A': 'ocir',
        '\u229B': 'oast',
        '\u229D': 'odash',
        '\u229E': 'plusb',
        '\u229F': 'minusb',
        '\u22A0': 'timesb',
        '\u22A1': 'sdotb',
        '\u22A2': 'vdash',
        '\u22AC': 'nvdash',
        '\u22A3': 'dashv',
        '\u22A4': 'top',
        '\u22A5': 'bot',
        '\u22A7': 'models',
        '\u22A8': 'vDash',
        '\u22AD': 'nvDash',
        '\u22A9': 'Vdash',
        '\u22AE': 'nVdash',
        '\u22AA': 'Vvdash',
        '\u22AB': 'VDash',
        '\u22AF': 'nVDash',
        '\u22B0': 'prurel',
        '\u22B2': 'vltri',
        '\u22EA': 'nltri',
        '\u22B3': 'vrtri',
        '\u22EB': 'nrtri',
        '\u22B4': 'ltrie',
        '\u22EC': 'nltrie',
        '\u22B4\u20D2': 'nvltrie',
        '\u22B5': 'rtrie',
        '\u22ED': 'nrtrie',
        '\u22B5\u20D2': 'nvrtrie',
        '\u22B6': 'origof',
        '\u22B7': 'imof',
        '\u22B8': 'mumap',
        '\u22B9': 'hercon',
        '\u22BA': 'intcal',
        '\u22BB': 'veebar',
        '\u22BD': 'barvee',
        '\u22BE': 'angrtvb',
        '\u22BF': 'lrtri',
        '\u22C0': 'Wedge',
        '\u22C1': 'Vee',
        '\u22C2': 'xcap',
        '\u22C3': 'xcup',
        '\u22C4': 'diam',
        '\u22C5': 'sdot',
        '\u22C6': 'Star',
        '\u22C7': 'divonx',
        '\u22C8': 'bowtie',
        '\u22C9': 'ltimes',
        '\u22CA': 'rtimes',
        '\u22CB': 'lthree',
        '\u22CC': 'rthree',
        '\u22CD': 'bsime',
        '\u22CE': 'cuvee',
        '\u22CF': 'cuwed',
        '\u22D0': 'Sub',
        '\u22D1': 'Sup',
        '\u22D2': 'Cap',
        '\u22D3': 'Cup',
        '\u22D4': 'fork',
        '\u22D5': 'epar',
        '\u22D6': 'ltdot',
        '\u22D7': 'gtdot',
        '\u22D8': 'Ll',
        '\u22D8\u0338': 'nLl',
        '\u22D9': 'Gg',
        '\u22D9\u0338': 'nGg',
        '\u22DA\uFE00': 'lesg',
        '\u22DA': 'leg',
        '\u22DB': 'gel',
        '\u22DB\uFE00': 'gesl',
        '\u22DE': 'cuepr',
        '\u22DF': 'cuesc',
        '\u22E6': 'lnsim',
        '\u22E7': 'gnsim',
        '\u22E8': 'prnsim',
        '\u22E9': 'scnsim',
        '\u22EE': 'vellip',
        '\u22EF': 'ctdot',
        '\u22F0': 'utdot',
        '\u22F1': 'dtdot',
        '\u22F2': 'disin',
        '\u22F3': 'isinsv',
        '\u22F4': 'isins',
        '\u22F5': 'isindot',
        '\u22F5\u0338': 'notindot',
        '\u22F6': 'notinvc',
        '\u22F7': 'notinvb',
        '\u22F9': 'isinE',
        '\u22F9\u0338': 'notinE',
        '\u22FA': 'nisd',
        '\u22FB': 'xnis',
        '\u22FC': 'nis',
        '\u22FD': 'notnivc',
        '\u22FE': 'notnivb',
        '\u2305': 'barwed',
        '\u2306': 'Barwed',
        '\u230C': 'drcrop',
        '\u230D': 'dlcrop',
        '\u230E': 'urcrop',
        '\u230F': 'ulcrop',
        '\u2310': 'bnot',
        '\u2312': 'profline',
        '\u2313': 'profsurf',
        '\u2315': 'telrec',
        '\u2316': 'target',
        '\u231C': 'ulcorn',
        '\u231D': 'urcorn',
        '\u231E': 'dlcorn',
        '\u231F': 'drcorn',
        '\u2322': 'frown',
        '\u2323': 'smile',
        '\u232D': 'cylcty',
        '\u232E': 'profalar',
        '\u2336': 'topbot',
        '\u233D': 'ovbar',
        '\u233F': 'solbar',
        '\u237C': 'angzarr',
        '\u23B0': 'lmoust',
        '\u23B1': 'rmoust',
        '\u23B4': 'tbrk',
        '\u23B5': 'bbrk',
        '\u23B6': 'bbrktbrk',
        '\u23DC': 'OverParenthesis',
        '\u23DD': 'UnderParenthesis',
        '\u23DE': 'OverBrace',
        '\u23DF': 'UnderBrace',
        '\u23E2': 'trpezium',
        '\u23E7': 'elinters',
        '\u2423': 'blank',
        '\u2500': 'boxh',
        '\u2502': 'boxv',
        '\u250C': 'boxdr',
        '\u2510': 'boxdl',
        '\u2514': 'boxur',
        '\u2518': 'boxul',
        '\u251C': 'boxvr',
        '\u2524': 'boxvl',
        '\u252C': 'boxhd',
        '\u2534': 'boxhu',
        '\u253C': 'boxvh',
        '\u2550': 'boxH',
        '\u2551': 'boxV',
        '\u2552': 'boxdR',
        '\u2553': 'boxDr',
        '\u2554': 'boxDR',
        '\u2555': 'boxdL',
        '\u2556': 'boxDl',
        '\u2557': 'boxDL',
        '\u2558': 'boxuR',
        '\u2559': 'boxUr',
        '\u255A': 'boxUR',
        '\u255B': 'boxuL',
        '\u255C': 'boxUl',
        '\u255D': 'boxUL',
        '\u255E': 'boxvR',
        '\u255F': 'boxVr',
        '\u2560': 'boxVR',
        '\u2561': 'boxvL',
        '\u2562': 'boxVl',
        '\u2563': 'boxVL',
        '\u2564': 'boxHd',
        '\u2565': 'boxhD',
        '\u2566': 'boxHD',
        '\u2567': 'boxHu',
        '\u2568': 'boxhU',
        '\u2569': 'boxHU',
        '\u256A': 'boxvH',
        '\u256B': 'boxVh',
        '\u256C': 'boxVH',
        '\u2580': 'uhblk',
        '\u2584': 'lhblk',
        '\u2588': 'block',
        '\u2591': 'blk14',
        '\u2592': 'blk12',
        '\u2593': 'blk34',
        '\u25A1': 'squ',
        '\u25AA': 'squf',
        '\u25AB': 'EmptyVerySmallSquare',
        '\u25AD': 'rect',
        '\u25AE': 'marker',
        '\u25B1': 'fltns',
        '\u25B3': 'xutri',
        '\u25B4': 'utrif',
        '\u25B5': 'utri',
        '\u25B8': 'rtrif',
        '\u25B9': 'rtri',
        '\u25BD': 'xdtri',
        '\u25BE': 'dtrif',
        '\u25BF': 'dtri',
        '\u25C2': 'ltrif',
        '\u25C3': 'ltri',
        '\u25CA': 'loz',
        '\u25CB': 'cir',
        '\u25EC': 'tridot',
        '\u25EF': 'xcirc',
        '\u25F8': 'ultri',
        '\u25F9': 'urtri',
        '\u25FA': 'lltri',
        '\u25FB': 'EmptySmallSquare',
        '\u25FC': 'FilledSmallSquare',
        '\u2605': 'starf',
        '\u2606': 'star',
        '\u260E': 'phone',
        '\u2640': 'female',
        '\u2642': 'male',
        '\u2660': 'spades',
        '\u2663': 'clubs',
        '\u2665': 'hearts',
        '\u2666': 'diams',
        '\u266A': 'sung',
        '\u2713': 'check',
        '\u2717': 'cross',
        '\u2720': 'malt',
        '\u2736': 'sext',
        '\u2758': 'VerticalSeparator',
        '\u27C8': 'bsolhsub',
        '\u27C9': 'suphsol',
        '\u27F5': 'xlarr',
        '\u27F6': 'xrarr',
        '\u27F7': 'xharr',
        '\u27F8': 'xlArr',
        '\u27F9': 'xrArr',
        '\u27FA': 'xhArr',
        '\u27FC': 'xmap',
        '\u27FF': 'dzigrarr',
        '\u2902': 'nvlArr',
        '\u2903': 'nvrArr',
        '\u2904': 'nvHarr',
        '\u2905': 'Map',
        '\u290C': 'lbarr',
        '\u290D': 'rbarr',
        '\u290E': 'lBarr',
        '\u290F': 'rBarr',
        '\u2910': 'RBarr',
        '\u2911': 'DDotrahd',
        '\u2912': 'UpArrowBar',
        '\u2913': 'DownArrowBar',
        '\u2916': 'Rarrtl',
        '\u2919': 'latail',
        '\u291A': 'ratail',
        '\u291B': 'lAtail',
        '\u291C': 'rAtail',
        '\u291D': 'larrfs',
        '\u291E': 'rarrfs',
        '\u291F': 'larrbfs',
        '\u2920': 'rarrbfs',
        '\u2923': 'nwarhk',
        '\u2924': 'nearhk',
        '\u2925': 'searhk',
        '\u2926': 'swarhk',
        '\u2927': 'nwnear',
        '\u2928': 'toea',
        '\u2929': 'tosa',
        '\u292A': 'swnwar',
        '\u2933': 'rarrc',
        '\u2933\u0338': 'nrarrc',
        '\u2935': 'cudarrr',
        '\u2936': 'ldca',
        '\u2937': 'rdca',
        '\u2938': 'cudarrl',
        '\u2939': 'larrpl',
        '\u293C': 'curarrm',
        '\u293D': 'cularrp',
        '\u2945': 'rarrpl',
        '\u2948': 'harrcir',
        '\u2949': 'Uarrocir',
        '\u294A': 'lurdshar',
        '\u294B': 'ldrushar',
        '\u294E': 'LeftRightVector',
        '\u294F': 'RightUpDownVector',
        '\u2950': 'DownLeftRightVector',
        '\u2951': 'LeftUpDownVector',
        '\u2952': 'LeftVectorBar',
        '\u2953': 'RightVectorBar',
        '\u2954': 'RightUpVectorBar',
        '\u2955': 'RightDownVectorBar',
        '\u2956': 'DownLeftVectorBar',
        '\u2957': 'DownRightVectorBar',
        '\u2958': 'LeftUpVectorBar',
        '\u2959': 'LeftDownVectorBar',
        '\u295A': 'LeftTeeVector',
        '\u295B': 'RightTeeVector',
        '\u295C': 'RightUpTeeVector',
        '\u295D': 'RightDownTeeVector',
        '\u295E': 'DownLeftTeeVector',
        '\u295F': 'DownRightTeeVector',
        '\u2960': 'LeftUpTeeVector',
        '\u2961': 'LeftDownTeeVector',
        '\u2962': 'lHar',
        '\u2963': 'uHar',
        '\u2964': 'rHar',
        '\u2965': 'dHar',
        '\u2966': 'luruhar',
        '\u2967': 'ldrdhar',
        '\u2968': 'ruluhar',
        '\u2969': 'rdldhar',
        '\u296A': 'lharul',
        '\u296B': 'llhard',
        '\u296C': 'rharul',
        '\u296D': 'lrhard',
        '\u296E': 'udhar',
        '\u296F': 'duhar',
        '\u2970': 'RoundImplies',
        '\u2971': 'erarr',
        '\u2972': 'simrarr',
        '\u2973': 'larrsim',
        '\u2974': 'rarrsim',
        '\u2975': 'rarrap',
        '\u2976': 'ltlarr',
        '\u2978': 'gtrarr',
        '\u2979': 'subrarr',
        '\u297B': 'suplarr',
        '\u297C': 'lfisht',
        '\u297D': 'rfisht',
        '\u297E': 'ufisht',
        '\u297F': 'dfisht',
        '\u299A': 'vzigzag',
        '\u299C': 'vangrt',
        '\u299D': 'angrtvbd',
        '\u29A4': 'ange',
        '\u29A5': 'range',
        '\u29A6': 'dwangle',
        '\u29A7': 'uwangle',
        '\u29A8': 'angmsdaa',
        '\u29A9': 'angmsdab',
        '\u29AA': 'angmsdac',
        '\u29AB': 'angmsdad',
        '\u29AC': 'angmsdae',
        '\u29AD': 'angmsdaf',
        '\u29AE': 'angmsdag',
        '\u29AF': 'angmsdah',
        '\u29B0': 'bemptyv',
        '\u29B1': 'demptyv',
        '\u29B2': 'cemptyv',
        '\u29B3': 'raemptyv',
        '\u29B4': 'laemptyv',
        '\u29B5': 'ohbar',
        '\u29B6': 'omid',
        '\u29B7': 'opar',
        '\u29B9': 'operp',
        '\u29BB': 'olcross',
        '\u29BC': 'odsold',
        '\u29BE': 'olcir',
        '\u29BF': 'ofcir',
        '\u29C0': 'olt',
        '\u29C1': 'ogt',
        '\u29C2': 'cirscir',
        '\u29C3': 'cirE',
        '\u29C4': 'solb',
        '\u29C5': 'bsolb',
        '\u29C9': 'boxbox',
        '\u29CD': 'trisb',
        '\u29CE': 'rtriltri',
        '\u29CF': 'LeftTriangleBar',
        '\u29CF\u0338': 'NotLeftTriangleBar',
        '\u29D0': 'RightTriangleBar',
        '\u29D0\u0338': 'NotRightTriangleBar',
        '\u29DC': 'iinfin',
        '\u29DD': 'infintie',
        '\u29DE': 'nvinfin',
        '\u29E3': 'eparsl',
        '\u29E4': 'smeparsl',
        '\u29E5': 'eqvparsl',
        '\u29EB': 'lozf',
        '\u29F4': 'RuleDelayed',
        '\u29F6': 'dsol',
        '\u2A00': 'xodot',
        '\u2A01': 'xoplus',
        '\u2A02': 'xotime',
        '\u2A04': 'xuplus',
        '\u2A06': 'xsqcup',
        '\u2A0D': 'fpartint',
        '\u2A10': 'cirfnint',
        '\u2A11': 'awint',
        '\u2A12': 'rppolint',
        '\u2A13': 'scpolint',
        '\u2A14': 'npolint',
        '\u2A15': 'pointint',
        '\u2A16': 'quatint',
        '\u2A17': 'intlarhk',
        '\u2A22': 'pluscir',
        '\u2A23': 'plusacir',
        '\u2A24': 'simplus',
        '\u2A25': 'plusdu',
        '\u2A26': 'plussim',
        '\u2A27': 'plustwo',
        '\u2A29': 'mcomma',
        '\u2A2A': 'minusdu',
        '\u2A2D': 'loplus',
        '\u2A2E': 'roplus',
        '\u2A2F': 'Cross',
        '\u2A30': 'timesd',
        '\u2A31': 'timesbar',
        '\u2A33': 'smashp',
        '\u2A34': 'lotimes',
        '\u2A35': 'rotimes',
        '\u2A36': 'otimesas',
        '\u2A37': 'Otimes',
        '\u2A38': 'odiv',
        '\u2A39': 'triplus',
        '\u2A3A': 'triminus',
        '\u2A3B': 'tritime',
        '\u2A3C': 'iprod',
        '\u2A3F': 'amalg',
        '\u2A40': 'capdot',
        '\u2A42': 'ncup',
        '\u2A43': 'ncap',
        '\u2A44': 'capand',
        '\u2A45': 'cupor',
        '\u2A46': 'cupcap',
        '\u2A47': 'capcup',
        '\u2A48': 'cupbrcap',
        '\u2A49': 'capbrcup',
        '\u2A4A': 'cupcup',
        '\u2A4B': 'capcap',
        '\u2A4C': 'ccups',
        '\u2A4D': 'ccaps',
        '\u2A50': 'ccupssm',
        '\u2A53': 'And',
        '\u2A54': 'Or',
        '\u2A55': 'andand',
        '\u2A56': 'oror',
        '\u2A57': 'orslope',
        '\u2A58': 'andslope',
        '\u2A5A': 'andv',
        '\u2A5B': 'orv',
        '\u2A5C': 'andd',
        '\u2A5D': 'ord',
        '\u2A5F': 'wedbar',
        '\u2A66': 'sdote',
        '\u2A6A': 'simdot',
        '\u2A6D': 'congdot',
        '\u2A6D\u0338': 'ncongdot',
        '\u2A6E': 'easter',
        '\u2A6F': 'apacir',
        '\u2A70': 'apE',
        '\u2A70\u0338': 'napE',
        '\u2A71': 'eplus',
        '\u2A72': 'pluse',
        '\u2A73': 'Esim',
        '\u2A77': 'eDDot',
        '\u2A78': 'equivDD',
        '\u2A79': 'ltcir',
        '\u2A7A': 'gtcir',
        '\u2A7B': 'ltquest',
        '\u2A7C': 'gtquest',
        '\u2A7D': 'les',
        '\u2A7D\u0338': 'nles',
        '\u2A7E': 'ges',
        '\u2A7E\u0338': 'nges',
        '\u2A7F': 'lesdot',
        '\u2A80': 'gesdot',
        '\u2A81': 'lesdoto',
        '\u2A82': 'gesdoto',
        '\u2A83': 'lesdotor',
        '\u2A84': 'gesdotol',
        '\u2A85': 'lap',
        '\u2A86': 'gap',
        '\u2A87': 'lne',
        '\u2A88': 'gne',
        '\u2A89': 'lnap',
        '\u2A8A': 'gnap',
        '\u2A8B': 'lEg',
        '\u2A8C': 'gEl',
        '\u2A8D': 'lsime',
        '\u2A8E': 'gsime',
        '\u2A8F': 'lsimg',
        '\u2A90': 'gsiml',
        '\u2A91': 'lgE',
        '\u2A92': 'glE',
        '\u2A93': 'lesges',
        '\u2A94': 'gesles',
        '\u2A95': 'els',
        '\u2A96': 'egs',
        '\u2A97': 'elsdot',
        '\u2A98': 'egsdot',
        '\u2A99': 'el',
        '\u2A9A': 'eg',
        '\u2A9D': 'siml',
        '\u2A9E': 'simg',
        '\u2A9F': 'simlE',
        '\u2AA0': 'simgE',
        '\u2AA1': 'LessLess',
        '\u2AA1\u0338': 'NotNestedLessLess',
        '\u2AA2': 'GreaterGreater',
        '\u2AA2\u0338': 'NotNestedGreaterGreater',
        '\u2AA4': 'glj',
        '\u2AA5': 'gla',
        '\u2AA6': 'ltcc',
        '\u2AA7': 'gtcc',
        '\u2AA8': 'lescc',
        '\u2AA9': 'gescc',
        '\u2AAA': 'smt',
        '\u2AAB': 'lat',
        '\u2AAC': 'smte',
        '\u2AAC\uFE00': 'smtes',
        '\u2AAD': 'late',
        '\u2AAD\uFE00': 'lates',
        '\u2AAE': 'bumpE',
        '\u2AAF': 'pre',
        '\u2AAF\u0338': 'npre',
        '\u2AB0': 'sce',
        '\u2AB0\u0338': 'nsce',
        '\u2AB3': 'prE',
        '\u2AB4': 'scE',
        '\u2AB5': 'prnE',
        '\u2AB6': 'scnE',
        '\u2AB7': 'prap',
        '\u2AB8': 'scap',
        '\u2AB9': 'prnap',
        '\u2ABA': 'scnap',
        '\u2ABB': 'Pr',
        '\u2ABC': 'Sc',
        '\u2ABD': 'subdot',
        '\u2ABE': 'supdot',
        '\u2ABF': 'subplus',
        '\u2AC0': 'supplus',
        '\u2AC1': 'submult',
        '\u2AC2': 'supmult',
        '\u2AC3': 'subedot',
        '\u2AC4': 'supedot',
        '\u2AC5': 'subE',
        '\u2AC5\u0338': 'nsubE',
        '\u2AC6': 'supE',
        '\u2AC6\u0338': 'nsupE',
        '\u2AC7': 'subsim',
        '\u2AC8': 'supsim',
        '\u2ACB\uFE00': 'vsubnE',
        '\u2ACB': 'subnE',
        '\u2ACC\uFE00': 'vsupnE',
        '\u2ACC': 'supnE',
        '\u2ACF': 'csub',
        '\u2AD0': 'csup',
        '\u2AD1': 'csube',
        '\u2AD2': 'csupe',
        '\u2AD3': 'subsup',
        '\u2AD4': 'supsub',
        '\u2AD5': 'subsub',
        '\u2AD6': 'supsup',
        '\u2AD7': 'suphsub',
        '\u2AD8': 'supdsub',
        '\u2AD9': 'forkv',
        '\u2ADA': 'topfork',
        '\u2ADB': 'mlcp',
        '\u2AE4': 'Dashv',
        '\u2AE6': 'Vdashl',
        '\u2AE7': 'Barv',
        '\u2AE8': 'vBar',
        '\u2AE9': 'vBarv',
        '\u2AEB': 'Vbar',
        '\u2AEC': 'Not',
        '\u2AED': 'bNot',
        '\u2AEE': 'rnmid',
        '\u2AEF': 'cirmid',
        '\u2AF0': 'midcir',
        '\u2AF1': 'topcir',
        '\u2AF2': 'nhpar',
        '\u2AF3': 'parsim',
        '\u2AFD': 'parsl',
        '\u2AFD\u20E5': 'nparsl',
        '\u266D': 'flat',
        '\u266E': 'natur',
        '\u266F': 'sharp',
        '\u00A4': 'curren',
        '\u00A2': 'cent',
        $: 'dollar',
        '\u00A3': 'pound',
        '\u00A5': 'yen',
        '\u20AC': 'euro',
        '\u00B9': 'sup1',
        '\u00BD': 'half',
        '\u2153': 'frac13',
        '\u00BC': 'frac14',
        '\u2155': 'frac15',
        '\u2159': 'frac16',
        '\u215B': 'frac18',
        '\u00B2': 'sup2',
        '\u2154': 'frac23',
        '\u2156': 'frac25',
        '\u00B3': 'sup3',
        '\u00BE': 'frac34',
        '\u2157': 'frac35',
        '\u215C': 'frac38',
        '\u2158': 'frac45',
        '\u215A': 'frac56',
        '\u215D': 'frac58',
        '\u215E': 'frac78',
        '\uD835\uDCB6': 'ascr',
        '\uD835\uDD52': 'aopf',
        '\uD835\uDD1E': 'afr',
        '\uD835\uDD38': 'Aopf',
        '\uD835\uDD04': 'Afr',
        '\uD835\uDC9C': 'Ascr',
        '\u00AA': 'ordf',
        '\xE1': 'aacute',
        '\xC1': 'Aacute',
        '\u00E0': 'agrave',
        '\u00C0': 'Agrave',
        '\u0103': 'abreve',
        '\u0102': 'Abreve',
        '\u00E2': 'acirc',
        '\u00C2': 'Acirc',
        '\u00E5': 'aring',
        '\u00C5': 'angst',
        '\u00E4': 'auml',
        '\u00C4': 'Auml',
        '\u00E3': 'atilde',
        '\u00C3': 'Atilde',
        '\u0105': 'aogon',
        '\u0104': 'Aogon',
        '\u0101': 'amacr',
        '\u0100': 'Amacr',
        '\u00E6': 'aelig',
        '\u00C6': 'AElig',
        '\uD835\uDCB7': 'bscr',
        '\uD835\uDD53': 'bopf',
        '\uD835\uDD1F': 'bfr',
        '\uD835\uDD39': 'Bopf',
        '\u212C': 'Bscr',
        '\uD835\uDD05': 'Bfr',
        '\uD835\uDD20': 'cfr',
        '\uD835\uDCB8': 'cscr',
        '\uD835\uDD54': 'copf',
        '\u212D': 'Cfr',
        '\uD835\uDC9E': 'Cscr',
        '\u2102': 'Copf',
        '\u0107': 'cacute',
        '\u0106': 'Cacute',
        '\u0109': 'ccirc',
        '\u0108': 'Ccirc',
        '\u010D': 'ccaron',
        '\u010C': 'Ccaron',
        '\u010B': 'cdot',
        '\u010A': 'Cdot',
        '\u00E7': 'ccedil',
        '\xC7': 'Ccedil',
        '\u2105': 'incare',
        '\uD835\uDD21': 'dfr',
        '\u2146': 'dd',
        '\uD835\uDD55': 'dopf',
        '\uD835\uDCB9': 'dscr',
        '\uD835\uDC9F': 'Dscr',
        '\uD835\uDD07': 'Dfr',
        '\u2145': 'DD',
        '\uD835\uDD3B': 'Dopf',
        '\u010F': 'dcaron',
        '\u010E': 'Dcaron',
        '\u0111': 'dstrok',
        '\u0110': 'Dstrok',
        '\xF0': 'eth',
        '\xD0': 'ETH',
        '\u2147': 'ee',
        '\u212F': 'escr',
        '\uD835\uDD22': 'efr',
        '\uD835\uDD56': 'eopf',
        '\u2130': 'Escr',
        '\uD835\uDD08': 'Efr',
        '\uD835\uDD3C': 'Eopf',
        '\u00E9': 'eacute',
        '\u00C9': 'Eacute',
        '\u00E8': 'egrave',
        '\u00C8': 'Egrave',
        '\xEA': 'ecirc',
        '\xCA': 'Ecirc',
        '\u011B': 'ecaron',
        '\u011A': 'Ecaron',
        '\xEB': 'euml',
        '\u00CB': 'Euml',
        '\u0117': 'edot',
        '\u0116': 'Edot',
        '\u0119': 'eogon',
        '\u0118': 'Eogon',
        '\u0113': 'emacr',
        '\u0112': 'Emacr',
        '\uD835\uDD23': 'ffr',
        '\uD835\uDD57': 'fopf',
        '\uD835\uDCBB': 'fscr',
        '\uD835\uDD09': 'Ffr',
        '\uD835\uDD3D': 'Fopf',
        '\u2131': 'Fscr',
        '\uFB00': 'fflig',
        '\uFB03': 'ffilig',
        '\uFB04': 'ffllig',
        '\uFB01': 'filig',
        fj: 'fjlig',
        '\uFB02': 'fllig',
        '\u0192': 'fnof',
        '\u210A': 'gscr',
        '\uD835\uDD58': 'gopf',
        '\uD835\uDD24': 'gfr',
        '\uD835\uDCA2': 'Gscr',
        '\uD835\uDD3E': 'Gopf',
        '\uD835\uDD0A': 'Gfr',
        '\u01F5': 'gacute',
        '\u011F': 'gbreve',
        '\u011E': 'Gbreve',
        '\u011D': 'gcirc',
        '\u011C': 'Gcirc',
        '\u0121': 'gdot',
        '\u0120': 'Gdot',
        '\u0122': 'Gcedil',
        '\uD835\uDD25': 'hfr',
        '\u210E': 'planckh',
        '\uD835\uDCBD': 'hscr',
        '\uD835\uDD59': 'hopf',
        '\u210B': 'Hscr',
        '\u210C': 'Hfr',
        '\u210D': 'Hopf',
        '\u0125': 'hcirc',
        '\u0124': 'Hcirc',
        '\u210F': 'hbar',
        '\u0127': 'hstrok',
        '\u0126': 'Hstrok',
        '\uD835\uDD5A': 'iopf',
        '\uD835\uDD26': 'ifr',
        '\uD835\uDCBE': 'iscr',
        '\u2148': 'ii',
        '\uD835\uDD40': 'Iopf',
        '\u2110': 'Iscr',
        '\u2111': 'Im',
        '\u00ED': 'iacute',
        '\u00CD': 'Iacute',
        '\u00EC': 'igrave',
        '\u00CC': 'Igrave',
        '\u00EE': 'icirc',
        '\u00CE': 'Icirc',
        '\xEF': 'iuml',
        '\xCF': 'Iuml',
        '\u0129': 'itilde',
        '\u0128': 'Itilde',
        '\u0130': 'Idot',
        '\u012F': 'iogon',
        '\u012E': 'Iogon',
        '\u012B': 'imacr',
        '\u012A': 'Imacr',
        '\u0133': 'ijlig',
        '\u0132': 'IJlig',
        '\u0131': 'imath',
        '\uD835\uDCBF': 'jscr',
        '\uD835\uDD5B': 'jopf',
        '\uD835\uDD27': 'jfr',
        '\uD835\uDCA5': 'Jscr',
        '\uD835\uDD0D': 'Jfr',
        '\uD835\uDD41': 'Jopf',
        '\u0135': 'jcirc',
        '\u0134': 'Jcirc',
        '\u0237': 'jmath',
        '\uD835\uDD5C': 'kopf',
        '\uD835\uDCC0': 'kscr',
        '\uD835\uDD28': 'kfr',
        '\uD835\uDCA6': 'Kscr',
        '\uD835\uDD42': 'Kopf',
        '\uD835\uDD0E': 'Kfr',
        '\u0137': 'kcedil',
        '\u0136': 'Kcedil',
        '\uD835\uDD29': 'lfr',
        '\uD835\uDCC1': 'lscr',
        '\u2113': 'ell',
        '\uD835\uDD5D': 'lopf',
        '\u2112': 'Lscr',
        '\uD835\uDD0F': 'Lfr',
        '\uD835\uDD43': 'Lopf',
        '\u013A': 'lacute',
        '\u0139': 'Lacute',
        '\u013E': 'lcaron',
        '\u013D': 'Lcaron',
        '\u013C': 'lcedil',
        '\u013B': 'Lcedil',
        '\u0142': 'lstrok',
        '\u0141': 'Lstrok',
        '\u0140': 'lmidot',
        '\u013F': 'Lmidot',
        '\uD835\uDD2A': 'mfr',
        '\uD835\uDD5E': 'mopf',
        '\uD835\uDCC2': 'mscr',
        '\uD835\uDD10': 'Mfr',
        '\uD835\uDD44': 'Mopf',
        '\u2133': 'Mscr',
        '\uD835\uDD2B': 'nfr',
        '\uD835\uDD5F': 'nopf',
        '\uD835\uDCC3': 'nscr',
        '\u2115': 'Nopf',
        '\uD835\uDCA9': 'Nscr',
        '\uD835\uDD11': 'Nfr',
        '\u0144': 'nacute',
        '\u0143': 'Nacute',
        '\u0148': 'ncaron',
        '\u0147': 'Ncaron',
        '\xF1': 'ntilde',
        '\u00D1': 'Ntilde',
        '\u0146': 'ncedil',
        '\u0145': 'Ncedil',
        '\u2116': 'numero',
        '\u014B': 'eng',
        '\u014A': 'ENG',
        '\uD835\uDD60': 'oopf',
        '\uD835\uDD2C': 'ofr',
        '\u2134': 'oscr',
        '\uD835\uDCAA': 'Oscr',
        '\uD835\uDD12': 'Ofr',
        '\uD835\uDD46': 'Oopf',
        '\u00BA': 'ordm',
        '\u00F3': 'oacute',
        '\xD3': 'Oacute',
        '\u00F2': 'ograve',
        '\u00D2': 'Ograve',
        '\xF4': 'ocirc',
        '\xD4': 'Ocirc',
        '\u00F6': 'ouml',
        '\u00D6': 'Ouml',
        '\u0151': 'odblac',
        '\u0150': 'Odblac',
        '\u00F5': 'otilde',
        '\u00D5': 'Otilde',
        '\u00F8': 'oslash',
        '\u00D8': 'Oslash',
        '\u014D': 'omacr',
        '\u014C': 'Omacr',
        '\u0153': 'oelig',
        '\u0152': 'OElig',
        '\uD835\uDD2D': 'pfr',
        '\uD835\uDCC5': 'pscr',
        '\uD835\uDD61': 'popf',
        '\u2119': 'Popf',
        '\uD835\uDD13': 'Pfr',
        '\uD835\uDCAB': 'Pscr',
        '\uD835\uDD62': 'qopf',
        '\uD835\uDD2E': 'qfr',
        '\uD835\uDCC6': 'qscr',
        '\uD835\uDCAC': 'Qscr',
        '\uD835\uDD14': 'Qfr',
        '\u211A': 'Qopf',
        '\u0138': 'kgreen',
        '\uD835\uDD2F': 'rfr',
        '\uD835\uDD63': 'ropf',
        '\uD835\uDCC7': 'rscr',
        '\u211B': 'Rscr',
        '\u211C': 'Re',
        '\u211D': 'Ropf',
        '\u0155': 'racute',
        '\u0154': 'Racute',
        '\u0159': 'rcaron',
        '\u0158': 'Rcaron',
        '\u0157': 'rcedil',
        '\u0156': 'Rcedil',
        '\uD835\uDD64': 'sopf',
        '\uD835\uDCC8': 'sscr',
        '\uD835\uDD30': 'sfr',
        '\uD835\uDD4A': 'Sopf',
        '\uD835\uDD16': 'Sfr',
        '\uD835\uDCAE': 'Sscr',
        '\u24C8': 'oS',
        '\u015B': 'sacute',
        '\u015A': 'Sacute',
        '\u015D': 'scirc',
        '\u015C': 'Scirc',
        '\u0161': 'scaron',
        '\u0160': 'Scaron',
        '\u015F': 'scedil',
        '\u015E': 'Scedil',
        '\u00DF': 'szlig',
        '\uD835\uDD31': 'tfr',
        '\uD835\uDCC9': 'tscr',
        '\uD835\uDD65': 'topf',
        '\uD835\uDCAF': 'Tscr',
        '\uD835\uDD17': 'Tfr',
        '\uD835\uDD4B': 'Topf',
        '\u0165': 'tcaron',
        '\u0164': 'Tcaron',
        '\u0163': 'tcedil',
        '\u0162': 'Tcedil',
        '\u2122': 'trade',
        '\u0167': 'tstrok',
        '\u0166': 'Tstrok',
        '\uD835\uDCCA': 'uscr',
        '\uD835\uDD66': 'uopf',
        '\uD835\uDD32': 'ufr',
        '\uD835\uDD4C': 'Uopf',
        '\uD835\uDD18': 'Ufr',
        '\uD835\uDCB0': 'Uscr',
        '\u00FA': 'uacute',
        '\u00DA': 'Uacute',
        '\u00F9': 'ugrave',
        '\xD9': 'Ugrave',
        '\u016D': 'ubreve',
        '\u016C': 'Ubreve',
        '\u00FB': 'ucirc',
        '\u00DB': 'Ucirc',
        '\u016F': 'uring',
        '\u016E': 'Uring',
        '\u00FC': 'uuml',
        '\u00DC': 'Uuml',
        '\u0171': 'udblac',
        '\u0170': 'Udblac',
        '\u0169': 'utilde',
        '\u0168': 'Utilde',
        '\u0173': 'uogon',
        '\u0172': 'Uogon',
        '\u016B': 'umacr',
        '\u016A': 'Umacr',
        '\uD835\uDD33': 'vfr',
        '\uD835\uDD67': 'vopf',
        '\uD835\uDCCB': 'vscr',
        '\uD835\uDD19': 'Vfr',
        '\uD835\uDD4D': 'Vopf',
        '\uD835\uDCB1': 'Vscr',
        '\uD835\uDD68': 'wopf',
        '\uD835\uDCCC': 'wscr',
        '\uD835\uDD34': 'wfr',
        '\uD835\uDCB2': 'Wscr',
        '\uD835\uDD4E': 'Wopf',
        '\uD835\uDD1A': 'Wfr',
        '\u0175': 'wcirc',
        '\u0174': 'Wcirc',
        '\uD835\uDD35': 'xfr',
        '\uD835\uDCCD': 'xscr',
        '\uD835\uDD69': 'xopf',
        '\uD835\uDD4F': 'Xopf',
        '\uD835\uDD1B': 'Xfr',
        '\uD835\uDCB3': 'Xscr',
        '\uD835\uDD36': 'yfr',
        '\uD835\uDCCE': 'yscr',
        '\uD835\uDD6A': 'yopf',
        '\uD835\uDCB4': 'Yscr',
        '\uD835\uDD1C': 'Yfr',
        '\uD835\uDD50': 'Yopf',
        '\u00FD': 'yacute',
        '\u00DD': 'Yacute',
        '\u0177': 'ycirc',
        '\u0176': 'Ycirc',
        '\u00FF': 'yuml',
        '\u0178': 'Yuml',
        '\uD835\uDCCF': 'zscr',
        '\uD835\uDD37': 'zfr',
        '\uD835\uDD6B': 'zopf',
        '\u2128': 'Zfr',
        '\u2124': 'Zopf',
        '\uD835\uDCB5': 'Zscr',
        '\u017A': 'zacute',
        '\u0179': 'Zacute',
        '\u017E': 'zcaron',
        '\u017D': 'Zcaron',
        '\u017C': 'zdot',
        '\u017B': 'Zdot',
        '\u01B5': 'imped',
        '\u00FE': 'thorn',
        '\xDE': 'THORN',
        '\u0149': 'napos',
        '\u03B1': 'alpha',
        '\u0391': 'Alpha',
        '\u03B2': 'beta',
        '\u0392': 'Beta',
        '\u03B3': 'gamma',
        '\u0393': 'Gamma',
        '\u03B4': 'delta',
        '\u0394': 'Delta',
        '\u03B5': 'epsi',
        '\u03F5': 'epsiv',
        '\u0395': 'Epsilon',
        '\u03DD': 'gammad',
        '\u03DC': 'Gammad',
        '\u03B6': 'zeta',
        '\u0396': 'Zeta',
        '\u03B7': 'eta',
        '\u0397': 'Eta',
        '\u03B8': 'theta',
        '\u03D1': 'thetav',
        '\u0398': 'Theta',
        '\u03B9': 'iota',
        '\u0399': 'Iota',
        '\u03BA': 'kappa',
        '\u03F0': 'kappav',
        '\u039A': 'Kappa',
        '\u03BB': 'lambda',
        '\u039B': 'Lambda',
        '\u03BC': 'mu',
        '\xB5': 'micro',
        '\u039C': 'Mu',
        '\u03BD': 'nu',
        '\u039D': 'Nu',
        '\u03BE': 'xi',
        '\u039E': 'Xi',
        '\u03BF': 'omicron',
        '\u039F': 'Omicron',
        '\u03C0': 'pi',
        '\u03D6': 'piv',
        '\u03A0': 'Pi',
        '\u03C1': 'rho',
        '\u03F1': 'rhov',
        '\u03A1': 'Rho',
        '\u03C3': 'sigma',
        '\u03A3': 'Sigma',
        '\u03C2': 'sigmaf',
        '\u03C4': 'tau',
        '\u03A4': 'Tau',
        '\u03C5': 'upsi',
        '\u03A5': 'Upsilon',
        '\u03D2': 'Upsi',
        '\u03C6': 'phi',
        '\u03D5': 'phiv',
        '\u03A6': 'Phi',
        '\u03C7': 'chi',
        '\u03A7': 'Chi',
        '\u03C8': 'psi',
        '\u03A8': 'Psi',
        '\u03C9': 'omega',
        '\u03A9': 'ohm',
        '\u0430': 'acy',
        '\u0410': 'Acy',
        '\u0431': 'bcy',
        '\u0411': 'Bcy',
        '\u0432': 'vcy',
        '\u0412': 'Vcy',
        '\u0433': 'gcy',
        '\u0413': 'Gcy',
        '\u0453': 'gjcy',
        '\u0403': 'GJcy',
        '\u0434': 'dcy',
        '\u0414': 'Dcy',
        '\u0452': 'djcy',
        '\u0402': 'DJcy',
        '\u0435': 'iecy',
        '\u0415': 'IEcy',
        '\u0451': 'iocy',
        '\u0401': 'IOcy',
        '\u0454': 'jukcy',
        '\u0404': 'Jukcy',
        '\u0436': 'zhcy',
        '\u0416': 'ZHcy',
        '\u0437': 'zcy',
        '\u0417': 'Zcy',
        '\u0455': 'dscy',
        '\u0405': 'DScy',
        '\u0438': 'icy',
        '\u0418': 'Icy',
        '\u0456': 'iukcy',
        '\u0406': 'Iukcy',
        '\u0457': 'yicy',
        '\u0407': 'YIcy',
        '\u0439': 'jcy',
        '\u0419': 'Jcy',
        '\u0458': 'jsercy',
        '\u0408': 'Jsercy',
        '\u043A': 'kcy',
        '\u041A': 'Kcy',
        '\u045C': 'kjcy',
        '\u040C': 'KJcy',
        '\u043B': 'lcy',
        '\u041B': 'Lcy',
        '\u0459': 'ljcy',
        '\u0409': 'LJcy',
        '\u043C': 'mcy',
        '\u041C': 'Mcy',
        '\u043D': 'ncy',
        '\u041D': 'Ncy',
        '\u045A': 'njcy',
        '\u040A': 'NJcy',
        '\u043E': 'ocy',
        '\u041E': 'Ocy',
        '\u043F': 'pcy',
        '\u041F': 'Pcy',
        '\u0440': 'rcy',
        '\u0420': 'Rcy',
        '\u0441': 'scy',
        '\u0421': 'Scy',
        '\u0442': 'tcy',
        '\u0422': 'Tcy',
        '\u045B': 'tshcy',
        '\u040B': 'TSHcy',
        '\u0443': 'ucy',
        '\u0423': 'Ucy',
        '\u045E': 'ubrcy',
        '\u040E': 'Ubrcy',
        '\u0444': 'fcy',
        '\u0424': 'Fcy',
        '\u0445': 'khcy',
        '\u0425': 'KHcy',
        '\u0446': 'tscy',
        '\u0426': 'TScy',
        '\u0447': 'chcy',
        '\u0427': 'CHcy',
        '\u045F': 'dzcy',
        '\u040F': 'DZcy',
        '\u0448': 'shcy',
        '\u0428': 'SHcy',
        '\u0449': 'shchcy',
        '\u0429': 'SHCHcy',
        '\u044A': 'hardcy',
        '\u042A': 'HARDcy',
        '\u044B': 'ycy',
        '\u042B': 'Ycy',
        '\u044C': 'softcy',
        '\u042C': 'SOFTcy',
        '\u044D': 'ecy',
        '\u042D': 'Ecy',
        '\u044E': 'yucy',
        '\u042E': 'YUcy',
        '\u044F': 'yacy',
        '\u042F': 'YAcy',
        '\u2135': 'aleph',
        '\u2136': 'beth',
        '\u2137': 'gimel',
        '\u2138': 'daleth',
      };
      const regexEscape = /["&'<>`]/g;
      const escapeMap = {
        '"': '&quot;',
        '&': '&amp;',
        "'": '&#x27;',
        '<': '&lt;',
        // See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
        // following is not strictly necessary unless it’s part of a tag or an
        // unquoted attribute value. We’re only escaping it to support those
        // situations, and for XML support.
        '>': '&gt;',
        // In Internet Explorer ≤ 8, the backtick character can be used
        // to break out of (un)quoted attribute values or HTML comments.
        // See http://html5sec.org/#102, http://html5sec.org/#108, and
        // http://html5sec.org/#133.
        '`': '&#x60;',
      };
      const regexInvalidEntity = /&#(?:[Xx][^\dA-Fa-f]|[^\dXx])/;
      let regexInvalidRawCodePoint =
        /[\0-\u0008\u000B\u000E-\u001F\u007F-\u009F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      let regexDecode =
        /&(CounterClockwiseContourIntegral|DoubleLongLeftRightArrow|ClockwiseContourIntegral|NotNestedGreaterGreater|NotSquareSupersetEqual|DiacriticalDoubleAcute|NotRightTriangleEqual|NotSucceedsSlantEqual|NotPrecedesSlantEqual|CloseCurlyDoubleQuote|NegativeVeryThinSpace|DoubleContourIntegral|FilledVerySmallSquare|CapitalDifferentialD|OpenCurlyDoubleQuote|EmptyVerySmallSquare|NestedGreaterGreater|DoubleLongRightArrow|NotLeftTriangleEqual|NotGreaterSlantEqual|ReverseUpEquilibrium|DoubleLeftRightArrow|NotSquareSubsetEqual|NotDoubleVerticalBar|RightArrowLeftArrow|NotGreaterFullEqual|NotRightTriangleBar|SquareSupersetEqual|DownLeftRightVector|DoubleLongLeftArrow|leftrightsquigarrow|LeftArrowRightArrow|NegativeMediumSpace|blacktriangleright|RightDownVectorBar|PrecedesSlantEqual|RightDoubleBracket|SucceedsSlantEqual|NotLeftTriangleBar|RightTriangleEqual|SquareIntersection|RightDownTeeVector|ReverseEquilibrium|NegativeThickSpace|longleftrightarrow|Longleftrightarrow|LongLeftRightArrow|DownRightTeeVector|DownRightVectorBar|GreaterSlantEqual|SquareSubsetEqual|LeftDownVectorBar|LeftDoubleBracket|VerticalSeparator|rightleftharpoons|NotGreaterGreater|NotSquareSuperset|blacktriangleleft|blacktriangledown|NegativeThinSpace|LeftDownTeeVector|NotLessSlantEqual|leftrightharpoons|DoubleUpDownArrow|DoubleVerticalBar|LeftTriangleEqual|FilledSmallSquare|twoheadrightarrow|NotNestedLessLess|DownLeftTeeVector|DownLeftVectorBar|RightAngleBracket|NotTildeFullEqual|NotReverseElement|RightUpDownVector|DiacriticalTilde|NotSucceedsTilde|circlearrowright|NotPrecedesEqual|rightharpoondown|DoubleRightArrow|NotSucceedsEqual|NonBreakingSpace|NotRightTriangle|LessEqualGreater|RightUpTeeVector|LeftAngleBracket|GreaterFullEqual|DownArrowUpArrow|RightUpVectorBar|twoheadleftarrow|GreaterEqualLess|downharpoonright|RightTriangleBar|ntrianglerighteq|NotSupersetEqual|LeftUpDownVector|DiacriticalAcute|rightrightarrows|vartriangleright|UpArrowDownArrow|DiacriticalGrave|UnderParenthesis|EmptySmallSquare|LeftUpVectorBar|leftrightarrows|DownRightVector|downharpoonleft|trianglerighteq|ShortRightArrow|OverParenthesis|DoubleLeftArrow|DoubleDownArrow|NotSquareSubset|bigtriangledown|ntrianglelefteq|UpperRightArrow|curvearrowright|vartriangleleft|NotLeftTriangle|nleftrightarrow|LowerRightArrow|NotHumpDownHump|NotGreaterTilde|rightthreetimes|LeftUpTeeVector|NotGreaterEqual|straightepsilon|LeftTriangleBar|rightsquigarrow|ContourIntegral|rightleftarrows|CloseCurlyQuote|RightDownVector|LeftRightVector|nLeftrightarrow|leftharpoondown|circlearrowleft|SquareSuperset|OpenCurlyQuote|hookrightarrow|HorizontalLine|DiacriticalDot|NotLessGreater|ntriangleright|DoubleRightTee|InvisibleComma|InvisibleTimes|LowerLeftArrow|DownLeftVector|NotSubsetEqual|curvearrowleft|trianglelefteq|NotVerticalBar|TildeFullEqual|downdownarrows|NotGreaterLess|RightTeeVector|ZeroWidthSpace|looparrowright|LongRightArrow|doublebarwedge|ShortLeftArrow|ShortDownArrow|RightVectorBar|GreaterGreater|ReverseElement|rightharpoonup|LessSlantEqual|leftthreetimes|upharpoonright|rightarrowtail|LeftDownVector|Longrightarrow|NestedLessLess|UpperLeftArrow|nshortparallel|leftleftarrows|leftrightarrow|Leftrightarrow|LeftRightArrow|longrightarrow|upharpoonleft|RightArrowBar|ApplyFunction|LeftTeeVector|leftarrowtail|NotEqualTilde|varsubsetneqq|varsupsetneqq|RightTeeArrow|SucceedsEqual|SucceedsTilde|LeftVectorBar|SupersetEqual|hookleftarrow|DifferentialD|VerticalTilde|VeryThinSpace|blacktriangle|bigtriangleup|LessFullEqual|divideontimes|leftharpoonup|UpEquilibrium|ntriangleleft|RightTriangle|measuredangle|shortparallel|longleftarrow|Longleftarrow|LongLeftArrow|DoubleLeftTee|Poincareplane|PrecedesEqual|triangleright|DoubleUpArrow|RightUpVector|fallingdotseq|looparrowleft|PrecedesTilde|NotTildeEqual|NotTildeTilde|smallsetminus|Proportional|triangleleft|triangledown|UnderBracket|NotHumpEqual|exponentiale|ExponentialE|NotLessTilde|HilbertSpace|RightCeiling|blacklozenge|varsupsetneq|HumpDownHump|GreaterEqual|VerticalLine|LeftTeeArrow|NotLessEqual|DownTeeArrow|LeftTriangle|varsubsetneq|Intersection|NotCongruent|DownArrowBar|LeftUpVector|LeftArrowBar|risingdotseq|GreaterTilde|RoundImplies|SquareSubset|ShortUpArrow|NotSuperset|quaternions|precnapprox|backepsilon|preccurlyeq|OverBracket|blacksquare|MediumSpace|VerticalBar|circledcirc|circleddash|CircleMinus|CircleTimes|LessGreater|curlyeqprec|curlyeqsucc|diamondsuit|UpDownArrow|Updownarrow|RuleDelayed|Rrightarrow|updownarrow|RightVector|nRightarrow|nrightarrow|eqslantless|LeftCeiling|Equilibrium|SmallCircle|expectation|NotSucceeds|thickapprox|GreaterLess|SquareUnion|NotPrecedes|NotLessLess|straightphi|succnapprox|succcurlyeq|SubsetEqual|sqsupseteq|Proportion|Laplacetrf|ImaginaryI|supsetneqq|NotGreater|gtreqqless|NotElement|ThickSpace|TildeEqual|TildeTilde|Fouriertrf|rmoustache|EqualTilde|eqslantgtr|UnderBrace|LeftVector|UpArrowBar|nLeftarrow|nsubseteqq|subsetneqq|nsupseteqq|nleftarrow|succapprox|lessapprox|UpTeeArrow|upuparrows|curlywedge|lesseqqgtr|varepsilon|varnothing|RightFloor|complement|CirclePlus|sqsubseteq|Lleftarrow|circledast|RightArrow|Rightarrow|rightarrow|lmoustache|Bernoullis|precapprox|mapstoleft|mapstodown|longmapsto|dotsquare|downarrow|DoubleDot|nsubseteq|supsetneq|leftarrow|nsupseteq|subsetneq|ThinSpace|ngeqslant|subseteqq|HumpEqual|NotSubset|triangleq|NotCupCap|lesseqgtr|heartsuit|TripleDot|Leftarrow|Coproduct|Congruent|varpropto|complexes|gvertneqq|LeftArrow|LessTilde|supseteqq|MinusPlus|CircleDot|nleqslant|NotExists|gtreqless|nparallel|UnionPlus|LeftFloor|checkmark|CenterDot|centerdot|Mellintrf|gtrapprox|bigotimes|OverBrace|spadesuit|therefore|pitchfork|rationals|PlusMinus|Backslash|Therefore|DownBreve|backsimeq|backprime|DownArrow|nshortmid|Downarrow|lvertneqq|eqvparsl|imagline|imagpart|infintie|integers|Integral|intercal|LessLess|Uarrocir|intlarhk|sqsupset|angmsdaf|sqsubset|llcorner|vartheta|cupbrcap|lnapprox|Superset|SuchThat|succnsim|succneqq|angmsdag|biguplus|curlyvee|trpezium|Succeeds|NotTilde|bigwedge|angmsdah|angrtvbd|triminus|cwconint|fpartint|lrcorner|smeparsl|subseteq|urcorner|lurdshar|laemptyv|DDotrahd|approxeq|ldrushar|awconint|mapstoup|backcong|shortmid|triangle|geqslant|gesdotol|timesbar|circledR|circledS|setminus|multimap|naturals|scpolint|ncongdot|RightTee|boxminus|gnapprox|boxtimes|andslope|thicksim|angmsdaa|varsigma|cirfnint|rtriltri|angmsdab|rppolint|angmsdac|barwedge|drbkarow|clubsuit|thetasym|bsolhsub|capbrcup|dzigrarr|doteqdot|DotEqual|dotminus|UnderBar|NotEqual|realpart|otimesas|ulcorner|hksearow|hkswarow|parallel|PartialD|elinters|emptyset|plusacir|bbrktbrk|angmsdad|pointint|bigoplus|angmsdae|Precedes|bigsqcup|varkappa|notindot|supseteq|precneqq|precnsim|profalar|profline|profsurf|leqslant|lesdotor|raemptyv|subplus|notnivb|notnivc|subrarr|zigrarr|vzigzag|submult|subedot|Element|between|cirscir|larrbfs|larrsim|lotimes|lbrksld|lbrkslu|lozenge|ldrdhar|dbkarow|bigcirc|epsilon|simrarr|simplus|ltquest|Epsilon|luruhar|gtquest|maltese|npolint|eqcolon|npreceq|bigodot|ddagger|gtrless|bnequiv|harrcir|ddotseq|equivDD|backsim|demptyv|nsqsube|nsqsupe|Upsilon|nsubset|upsilon|minusdu|nsucceq|swarrow|nsupset|coloneq|searrow|boxplus|napprox|natural|asympeq|alefsym|congdot|nearrow|bigstar|diamond|supplus|tritime|LeftTee|nvinfin|triplus|NewLine|nvltrie|nvrtrie|nwarrow|nexists|Diamond|ruluhar|Implies|supmult|angzarr|suplarr|suphsub|questeq|because|digamma|Because|olcross|bemptyv|omicron|Omicron|rotimes|NoBreak|intprod|angrtvb|orderof|uwangle|suphsol|lesdoto|orslope|DownTee|realine|cudarrl|rdldhar|OverBar|supedot|lessdot|supdsub|topfork|succsim|rbrkslu|rbrksld|pertenk|cudarrr|isindot|planckh|lessgtr|pluscir|gesdoto|plussim|plustwo|lesssim|cularrp|rarrsim|Cayleys|notinva|notinvb|notinvc|UpArrow|Uparrow|uparrow|NotLess|dwangle|precsim|Product|curarrm|Cconint|dotplus|rarrbfs|ccupssm|Cedilla|cemptyv|notniva|quatint|frac35|frac38|frac45|frac56|frac58|frac78|tridot|xoplus|gacute|gammad|Gammad|lfisht|lfloor|bigcup|sqsupe|gbreve|Gbreve|lharul|sqsube|sqcups|Gcedil|apacir|llhard|lmidot|Lmidot|lmoust|andand|sqcaps|approx|Abreve|spades|circeq|tprime|divide|topcir|Assign|topbot|gesdot|divonx|xuplus|timesd|gesles|atilde|solbar|SOFTcy|loplus|timesb|lowast|lowbar|dlcorn|dlcrop|softcy|dollar|lparlt|thksim|lrhard|Atilde|lsaquo|smashp|bigvee|thinsp|wreath|bkarow|lsquor|lstrok|Lstrok|lthree|ltimes|ltlarr|DotDot|simdot|ltrPar|weierp|xsqcup|angmsd|sigmav|sigmaf|zeetrf|Zcaron|zcaron|mapsto|vsupne|thetav|cirmid|marker|mcomma|Zacute|vsubnE|there4|gtlPar|vsubne|bottom|gtrarr|SHCHcy|shchcy|midast|midcir|middot|minusb|minusd|gtrdot|bowtie|sfrown|mnplus|models|colone|seswar|Colone|mstpos|searhk|gtrsim|nacute|Nacute|boxbox|telrec|hairsp|Tcedil|nbumpe|scnsim|ncaron|Ncaron|ncedil|Ncedil|hamilt|Scedil|nearhk|hardcy|HARDcy|tcedil|Tcaron|commat|nequiv|nesear|tcaron|target|hearts|nexist|varrho|scedil|Scaron|scaron|hellip|Sacute|sacute|hercon|swnwar|compfn|rtimes|rthree|rsquor|rsaquo|zacute|wedgeq|homtht|barvee|barwed|Barwed|rpargt|horbar|conint|swarhk|roplus|nltrie|hslash|hstrok|Hstrok|rmoust|Conint|bprime|hybull|hyphen|iacute|Iacute|supsup|supsub|supsim|varphi|coprod|brvbar|agrave|Supset|supset|igrave|Igrave|notinE|Agrave|iiiint|iinfin|copysr|wedbar|Verbar|vangrt|becaus|incare|verbar|inodot|bullet|drcorn|intcal|drcrop|cularr|vellip|Utilde|bumpeq|cupcap|dstrok|Dstrok|CupCap|cupcup|cupdot|eacute|Eacute|supdot|iquest|easter|ecaron|Ecaron|ecolon|isinsv|utilde|itilde|Itilde|curarr|succeq|Bumpeq|cacute|ulcrop|nparsl|Cacute|nprcue|egrave|Egrave|nrarrc|nrarrw|subsup|subsub|nrtrie|jsercy|nsccue|Jsercy|kappav|kcedil|Kcedil|subsim|ulcorn|nsimeq|egsdot|veebar|kgreen|capand|elsdot|Subset|subset|curren|aacute|lacute|Lacute|emptyv|ntilde|Ntilde|lagran|lambda|Lambda|capcap|Ugrave|langle|subdot|emsp13|numero|emsp14|nvdash|nvDash|nVdash|nVDash|ugrave|ufisht|nvHarr|larrfs|nvlArr|larrhk|larrlp|larrpl|nvrArr|Udblac|nwarhk|larrtl|nwnear|oacute|Oacute|latail|lAtail|sstarf|lbrace|odblac|Odblac|lbrack|udblac|odsold|eparsl|lcaron|Lcaron|ograve|Ograve|lcedil|Lcedil|Aacute|ssmile|ssetmn|squarf|ldquor|capcup|ominus|cylcty|rharul|eqcirc|dagger|rfloor|rfisht|Dagger|daleth|equals|origof|capdot|equest|dcaron|Dcaron|rdquor|oslash|Oslash|otilde|Otilde|otimes|Otimes|urcrop|Ubreve|ubreve|Yacute|Uacute|uacute|Rcedil|rcedil|urcorn|parsim|Rcaron|Vdashl|rcaron|Tstrok|percnt|period|permil|Exists|yacute|rbrack|rbrace|phmmat|ccaron|Ccaron|planck|ccedil|plankv|tstrok|female|plusdo|plusdu|ffilig|plusmn|ffllig|Ccedil|rAtail|dfisht|bernou|ratail|Rarrtl|rarrtl|angsph|rarrpl|rarrlp|rarrhk|xwedge|xotime|forall|ForAll|Vvdash|vsupnE|preceq|bigcap|frac12|frac13|frac14|primes|rarrfs|prnsim|frac15|Square|frac16|square|lesdot|frac18|frac23|propto|prurel|rarrap|rangle|puncsp|frac25|Racute|qprime|racute|lesges|frac34|abreve|AElig|eqsim|utdot|setmn|urtri|Equal|Uring|seArr|uring|searr|dashv|Dashv|mumap|nabla|iogon|Iogon|sdote|sdotb|scsim|napid|napos|equiv|natur|Acirc|dblac|erarr|nbump|iprod|erDot|ucirc|awint|esdot|angrt|ncong|isinE|scnap|Scirc|scirc|ndash|isins|Ubrcy|nearr|neArr|isinv|nedot|ubrcy|acute|Ycirc|iukcy|Iukcy|xutri|nesim|caret|jcirc|Jcirc|caron|twixt|ddarr|sccue|exist|jmath|sbquo|ngeqq|angst|ccaps|lceil|ngsim|UpTee|delta|Delta|rtrif|nharr|nhArr|nhpar|rtrie|jukcy|Jukcy|kappa|rsquo|Kappa|nlarr|nlArr|TSHcy|rrarr|aogon|Aogon|fflig|xrarr|tshcy|ccirc|nleqq|filig|upsih|nless|dharl|nlsim|fjlig|ropar|nltri|dharr|robrk|roarr|fllig|fltns|roang|rnmid|subnE|subne|lAarr|trisb|Ccirc|acirc|ccups|blank|VDash|forkv|Vdash|langd|cedil|blk12|blk14|laquo|strns|diams|notin|vDash|larrb|blk34|block|disin|uplus|vdash|vBarv|aelig|starf|Wedge|check|xrArr|lates|lbarr|lBarr|notni|lbbrk|bcong|frasl|lbrke|frown|vrtri|vprop|vnsup|gamma|Gamma|wedge|xodot|bdquo|srarr|doteq|ldquo|boxdl|boxdL|gcirc|Gcirc|boxDl|boxDL|boxdr|boxdR|boxDr|TRADE|trade|rlhar|boxDR|vnsub|npart|vltri|rlarr|boxhd|boxhD|nprec|gescc|nrarr|nrArr|boxHd|boxHD|boxhu|boxhU|nrtri|boxHu|clubs|boxHU|times|colon|Colon|gimel|xlArr|Tilde|nsime|tilde|nsmid|nspar|THORN|thorn|xlarr|nsube|nsubE|thkap|xhArr|comma|nsucc|boxul|boxuL|nsupe|nsupE|gneqq|gnsim|boxUl|boxUL|grave|boxur|boxuR|boxUr|boxUR|lescc|angle|bepsi|boxvh|varpi|boxvH|numsp|Theta|gsime|gsiml|theta|boxVh|boxVH|boxvl|gtcir|gtdot|boxvL|boxVl|boxVL|crarr|cross|Cross|nvsim|boxvr|nwarr|nwArr|sqsup|dtdot|Uogon|lhard|lharu|dtrif|ocirc|Ocirc|lhblk|duarr|odash|sqsub|Hacek|sqcup|llarr|duhar|oelig|OElig|ofcir|boxvR|uogon|lltri|boxVr|csube|uuarr|ohbar|csupe|ctdot|olarr|olcir|harrw|oline|sqcap|omacr|Omacr|omega|Omega|boxVR|aleph|lneqq|lnsim|loang|loarr|rharu|lobrk|hcirc|operp|oplus|rhard|Hcirc|orarr|Union|order|ecirc|Ecirc|cuepr|szlig|cuesc|breve|reals|eDDot|Breve|hoarr|lopar|utrif|rdquo|Umacr|umacr|efDot|swArr|ultri|alpha|rceil|ovbar|swarr|Wcirc|wcirc|smtes|smile|bsemi|lrarr|aring|parsl|lrhar|bsime|uhblk|lrtri|cupor|Aring|uharr|uharl|slarr|rbrke|bsolb|lsime|rbbrk|RBarr|lsimg|phone|rBarr|rbarr|icirc|lsquo|Icirc|emacr|Emacr|ratio|simne|plusb|simlE|simgE|simeq|pluse|ltcir|ltdot|empty|xharr|xdtri|iexcl|Alpha|ltrie|rarrw|pound|ltrif|xcirc|bumpe|prcue|bumpE|asymp|amacr|cuvee|Sigma|sigma|iiint|udhar|iiota|ijlig|IJlig|supnE|imacr|Imacr|prime|Prime|image|prnap|eogon|Eogon|rarrc|mdash|mDDot|cuwed|imath|supne|imped|Amacr|udarr|prsim|micro|rarrb|cwint|raquo|infin|eplus|range|rangd|Ucirc|radic|minus|amalg|veeeq|rAarr|epsiv|ycirc|quest|sharp|quot|zwnj|Qscr|race|qscr|Qopf|qopf|qint|rang|Rang|Zscr|zscr|Zopf|zopf|rarr|rArr|Rarr|Pscr|pscr|prop|prod|prnE|prec|ZHcy|zhcy|prap|Zeta|zeta|Popf|popf|Zdot|plus|zdot|Yuml|yuml|phiv|YUcy|yucy|Yscr|yscr|perp|Yopf|yopf|part|para|YIcy|Ouml|rcub|yicy|YAcy|rdca|ouml|osol|Oscr|rdsh|yacy|real|oscr|xvee|andd|rect|andv|Xscr|oror|ordm|ordf|xscr|ange|aopf|Aopf|rHar|Xopf|opar|Oopf|xopf|xnis|rhov|oopf|omid|xmap|oint|apid|apos|ogon|ascr|Ascr|odot|odiv|xcup|xcap|ocir|oast|nvlt|nvle|nvgt|nvge|nvap|Wscr|wscr|auml|ntlg|ntgl|nsup|nsub|nsim|Nscr|nscr|nsce|Wopf|ring|npre|wopf|npar|Auml|Barv|bbrk|Nopf|nopf|nmid|nLtv|beta|ropf|Ropf|Beta|beth|nles|rpar|nleq|bnot|bNot|nldr|NJcy|rscr|Rscr|Vscr|vscr|rsqb|njcy|bopf|nisd|Bopf|rtri|Vopf|nGtv|ngtr|vopf|boxh|boxH|boxv|nges|ngeq|boxV|bscr|scap|Bscr|bsim|Vert|vert|bsol|bull|bump|caps|cdot|ncup|scnE|ncap|nbsp|napE|Cdot|cent|sdot|Vbar|nang|vBar|chcy|Mscr|mscr|sect|semi|CHcy|Mopf|mopf|sext|circ|cire|mldr|mlcp|cirE|comp|shcy|SHcy|vArr|varr|cong|copf|Copf|copy|COPY|malt|male|macr|lvnE|cscr|ltri|sime|ltcc|simg|Cscr|siml|csub|Uuml|lsqb|lsim|uuml|csup|Lscr|lscr|utri|smid|lpar|cups|smte|lozf|darr|Lopf|Uscr|solb|lopf|sopf|Sopf|lneq|uscr|spar|dArr|lnap|Darr|dash|Sqrt|LJcy|ljcy|lHar|dHar|Upsi|upsi|diam|lesg|djcy|DJcy|leqq|dopf|Dopf|dscr|Dscr|dscy|ldsh|ldca|squf|DScy|sscr|Sscr|dsol|lcub|late|star|Star|Uopf|Larr|lArr|larr|uopf|dtri|dzcy|sube|subE|Lang|lang|Kscr|kscr|Kopf|kopf|KJcy|kjcy|KHcy|khcy|DZcy|ecir|edot|eDot|Jscr|jscr|succ|Jopf|jopf|Edot|uHar|emsp|ensp|Iuml|iuml|eopf|isin|Iscr|iscr|Eopf|epar|sung|epsi|escr|sup1|sup2|sup3|Iota|iota|supe|supE|Iopf|iopf|IOcy|iocy|Escr|esim|Esim|imof|Uarr|QUOT|uArr|uarr|euml|IEcy|iecy|Idot|Euml|euro|excl|Hscr|hscr|Hopf|hopf|TScy|tscy|Tscr|hbar|tscr|flat|tbrk|fnof|hArr|harr|half|fopf|Fopf|tdot|gvnE|fork|trie|gtcc|fscr|Fscr|gdot|gsim|Gscr|gscr|Gopf|gopf|gneq|Gdot|tosa|gnap|Topf|topf|geqq|toea|GJcy|gjcy|tint|gesl|mid|Sfr|ggg|top|ges|gla|glE|glj|geq|gne|gEl|gel|gnE|Gcy|gcy|gap|Tfr|tfr|Tcy|tcy|Hat|Tau|Ffr|tau|Tab|hfr|Hfr|ffr|Fcy|fcy|icy|Icy|iff|ETH|eth|ifr|Ifr|Eta|eta|int|Int|Sup|sup|ucy|Ucy|Sum|sum|jcy|ENG|ufr|Ufr|eng|Jcy|jfr|els|ell|egs|Efr|efr|Jfr|uml|kcy|Kcy|Ecy|ecy|kfr|Kfr|lap|Sub|sub|lat|lcy|Lcy|leg|Dot|dot|lEg|leq|les|squ|div|die|lfr|Lfr|lgE|Dfr|dfr|Del|deg|Dcy|dcy|lne|lnE|sol|loz|smt|Cup|lrm|cup|lsh|Lsh|sim|shy|map|Map|mcy|Mcy|mfr|Mfr|mho|gfr|Gfr|sfr|cir|Chi|chi|nap|Cfr|vcy|Vcy|cfr|Scy|scy|ncy|Ncy|vee|Vee|Cap|cap|nfr|scE|sce|Nfr|nge|ngE|nGg|vfr|Vfr|ngt|bot|nGt|nis|niv|Rsh|rsh|nle|nlE|bne|Bfr|bfr|nLl|nlt|nLt|Bcy|bcy|not|Not|rlm|wfr|Wfr|npr|nsc|num|ocy|ast|Ocy|ofr|xfr|Xfr|Ofr|ogt|ohm|apE|olt|Rho|ape|rho|Rfr|rfr|ord|REG|ang|reg|orv|And|and|AMP|Rcy|amp|Afr|ycy|Ycy|yen|yfr|Yfr|rcy|par|pcy|Pcy|pfr|Pfr|phi|Phi|afr|Acy|acy|zcy|Zcy|piv|acE|acd|zfr|Zfr|pre|prE|psi|Psi|qfr|Qfr|zwj|Or|ge|Gg|gt|gg|el|oS|lt|Lt|LT|Re|lg|gl|eg|ne|Im|it|le|DD|wp|wr|nu|Nu|dd|lE|Sc|sc|pi|Pi|ee|af|ll|Ll|rx|gE|xi|pm|Xi|ic|pr|Pr|in|ni|mp|mu|ac|Mu|or|ap|Gt|GT|ii);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
      const decodeMap = {
        aacute: '\u00E1',
        Aacute: '\u00C1',
        abreve: '\u0103',
        Abreve: '\u0102',
        ac: '\u223E',
        acd: '\u223F',
        acE: '\u223E\u0333',
        acirc: '\u00E2',
        Acirc: '\u00C2',
        acute: '\u00B4',
        acy: '\u0430',
        Acy: '\u0410',
        aelig: '\u00E6',
        AElig: '\u00C6',
        af: '\u2061',
        afr: '\uD835\uDD1E',
        Afr: '\uD835\uDD04',
        agrave: '\u00E0',
        Agrave: '\u00C0',
        alefsym: '\u2135',
        aleph: '\u2135',
        alpha: '\u03B1',
        Alpha: '\u0391',
        amacr: '\u0101',
        Amacr: '\u0100',
        amalg: '\u2A3F',
        amp: '&',
        AMP: '&',
        and: '\u2227',
        And: '\u2A53',
        andand: '\u2A55',
        andd: '\u2A5C',
        andslope: '\u2A58',
        andv: '\u2A5A',
        ang: '\u2220',
        ange: '\u29A4',
        angle: '\u2220',
        angmsd: '\u2221',
        angmsdaa: '\u29A8',
        angmsdab: '\u29A9',
        angmsdac: '\u29AA',
        angmsdad: '\u29AB',
        angmsdae: '\u29AC',
        angmsdaf: '\u29AD',
        angmsdag: '\u29AE',
        angmsdah: '\u29AF',
        angrt: '\u221F',
        angrtvb: '\u22BE',
        angrtvbd: '\u299D',
        angsph: '\u2222',
        angst: '\u00C5',
        angzarr: '\u237C',
        aogon: '\u0105',
        Aogon: '\u0104',
        aopf: '\uD835\uDD52',
        Aopf: '\uD835\uDD38',
        ap: '\u2248',
        apacir: '\u2A6F',
        ape: '\u224A',
        apE: '\u2A70',
        apid: '\u224B',
        apos: "'",
        ApplyFunction: '\u2061',
        approx: '\u2248',
        approxeq: '\u224A',
        aring: '\u00E5',
        Aring: '\u00C5',
        ascr: '\uD835\uDCB6',
        Ascr: '\uD835\uDC9C',
        Assign: '\u2254',
        ast: '*',
        asymp: '\u2248',
        asympeq: '\u224D',
        atilde: '\u00E3',
        Atilde: '\u00C3',
        auml: '\u00E4',
        Auml: '\u00C4',
        awconint: '\u2233',
        awint: '\u2A11',
        backcong: '\u224C',
        backepsilon: '\u03F6',
        backprime: '\u2035',
        backsim: '\u223D',
        backsimeq: '\u22CD',
        Backslash: '\u2216',
        Barv: '\u2AE7',
        barvee: '\u22BD',
        barwed: '\u2305',
        Barwed: '\u2306',
        barwedge: '\u2305',
        bbrk: '\u23B5',
        bbrktbrk: '\u23B6',
        bcong: '\u224C',
        bcy: '\u0431',
        Bcy: '\u0411',
        bdquo: '\u201E',
        becaus: '\u2235',
        because: '\u2235',
        Because: '\u2235',
        bemptyv: '\u29B0',
        bepsi: '\u03F6',
        bernou: '\u212C',
        Bernoullis: '\u212C',
        beta: '\u03B2',
        Beta: '\u0392',
        beth: '\u2136',
        between: '\u226C',
        bfr: '\uD835\uDD1F',
        Bfr: '\uD835\uDD05',
        bigcap: '\u22C2',
        bigcirc: '\u25EF',
        bigcup: '\u22C3',
        bigodot: '\u2A00',
        bigoplus: '\u2A01',
        bigotimes: '\u2A02',
        bigsqcup: '\u2A06',
        bigstar: '\u2605',
        bigtriangledown: '\u25BD',
        bigtriangleup: '\u25B3',
        biguplus: '\u2A04',
        bigvee: '\u22C1',
        bigwedge: '\u22C0',
        bkarow: '\u290D',
        blacklozenge: '\u29EB',
        blacksquare: '\u25AA',
        blacktriangle: '\u25B4',
        blacktriangledown: '\u25BE',
        blacktriangleleft: '\u25C2',
        blacktriangleright: '\u25B8',
        blank: '\u2423',
        blk12: '\u2592',
        blk14: '\u2591',
        blk34: '\u2593',
        block: '\u2588',
        bne: '=\u20E5',
        bnequiv: '\u2261\u20E5',
        bnot: '\u2310',
        bNot: '\u2AED',
        bopf: '\uD835\uDD53',
        Bopf: '\uD835\uDD39',
        bot: '\u22A5',
        bottom: '\u22A5',
        bowtie: '\u22C8',
        boxbox: '\u29C9',
        boxdl: '\u2510',
        boxdL: '\u2555',
        boxDl: '\u2556',
        boxDL: '\u2557',
        boxdr: '\u250C',
        boxdR: '\u2552',
        boxDr: '\u2553',
        boxDR: '\u2554',
        boxh: '\u2500',
        boxH: '\u2550',
        boxhd: '\u252C',
        boxhD: '\u2565',
        boxHd: '\u2564',
        boxHD: '\u2566',
        boxhu: '\u2534',
        boxhU: '\u2568',
        boxHu: '\u2567',
        boxHU: '\u2569',
        boxminus: '\u229F',
        boxplus: '\u229E',
        boxtimes: '\u22A0',
        boxul: '\u2518',
        boxuL: '\u255B',
        boxUl: '\u255C',
        boxUL: '\u255D',
        boxur: '\u2514',
        boxuR: '\u2558',
        boxUr: '\u2559',
        boxUR: '\u255A',
        boxv: '\u2502',
        boxV: '\u2551',
        boxvh: '\u253C',
        boxvH: '\u256A',
        boxVh: '\u256B',
        boxVH: '\u256C',
        boxvl: '\u2524',
        boxvL: '\u2561',
        boxVl: '\u2562',
        boxVL: '\u2563',
        boxvr: '\u251C',
        boxvR: '\u255E',
        boxVr: '\u255F',
        boxVR: '\u2560',
        bprime: '\u2035',
        breve: '\u02D8',
        Breve: '\u02D8',
        brvbar: '\u00A6',
        bscr: '\uD835\uDCB7',
        Bscr: '\u212C',
        bsemi: '\u204F',
        bsim: '\u223D',
        bsime: '\u22CD',
        bsol: '\\',
        bsolb: '\u29C5',
        bsolhsub: '\u27C8',
        bull: '\u2022',
        bullet: '\u2022',
        bump: '\u224E',
        bumpe: '\u224F',
        bumpE: '\u2AAE',
        bumpeq: '\u224F',
        Bumpeq: '\u224E',
        cacute: '\u0107',
        Cacute: '\u0106',
        cap: '\u2229',
        Cap: '\u22D2',
        capand: '\u2A44',
        capbrcup: '\u2A49',
        capcap: '\u2A4B',
        capcup: '\u2A47',
        capdot: '\u2A40',
        CapitalDifferentialD: '\u2145',
        caps: '\u2229\uFE00',
        caret: '\u2041',
        caron: '\u02C7',
        Cayleys: '\u212D',
        ccaps: '\u2A4D',
        ccaron: '\u010D',
        Ccaron: '\u010C',
        ccedil: '\u00E7',
        Ccedil: '\u00C7',
        ccirc: '\u0109',
        Ccirc: '\u0108',
        Cconint: '\u2230',
        ccups: '\u2A4C',
        ccupssm: '\u2A50',
        cdot: '\u010B',
        Cdot: '\u010A',
        cedil: '\u00B8',
        Cedilla: '\u00B8',
        cemptyv: '\u29B2',
        cent: '\u00A2',
        centerdot: '\u00B7',
        CenterDot: '\u00B7',
        cfr: '\uD835\uDD20',
        Cfr: '\u212D',
        chcy: '\u0447',
        CHcy: '\u0427',
        check: '\u2713',
        checkmark: '\u2713',
        chi: '\u03C7',
        Chi: '\u03A7',
        cir: '\u25CB',
        circ: '\u02C6',
        circeq: '\u2257',
        circlearrowleft: '\u21BA',
        circlearrowright: '\u21BB',
        circledast: '\u229B',
        circledcirc: '\u229A',
        circleddash: '\u229D',
        CircleDot: '\u2299',
        circledR: '\u00AE',
        circledS: '\u24C8',
        CircleMinus: '\u2296',
        CirclePlus: '\u2295',
        CircleTimes: '\u2297',
        cire: '\u2257',
        cirE: '\u29C3',
        cirfnint: '\u2A10',
        cirmid: '\u2AEF',
        cirscir: '\u29C2',
        ClockwiseContourIntegral: '\u2232',
        CloseCurlyDoubleQuote: '\u201D',
        CloseCurlyQuote: '\u2019',
        clubs: '\u2663',
        clubsuit: '\u2663',
        colon: ':',
        Colon: '\u2237',
        colone: '\u2254',
        Colone: '\u2A74',
        coloneq: '\u2254',
        comma: ',',
        commat: '@',
        comp: '\u2201',
        compfn: '\u2218',
        complement: '\u2201',
        complexes: '\u2102',
        cong: '\u2245',
        congdot: '\u2A6D',
        Congruent: '\u2261',
        conint: '\u222E',
        Conint: '\u222F',
        ContourIntegral: '\u222E',
        copf: '\uD835\uDD54',
        Copf: '\u2102',
        coprod: '\u2210',
        Coproduct: '\u2210',
        copy: '\u00A9',
        COPY: '\u00A9',
        copysr: '\u2117',
        CounterClockwiseContourIntegral: '\u2233',
        crarr: '\u21B5',
        cross: '\u2717',
        Cross: '\u2A2F',
        cscr: '\uD835\uDCB8',
        Cscr: '\uD835\uDC9E',
        csub: '\u2ACF',
        csube: '\u2AD1',
        csup: '\u2AD0',
        csupe: '\u2AD2',
        ctdot: '\u22EF',
        cudarrl: '\u2938',
        cudarrr: '\u2935',
        cuepr: '\u22DE',
        cuesc: '\u22DF',
        cularr: '\u21B6',
        cularrp: '\u293D',
        cup: '\u222A',
        Cup: '\u22D3',
        cupbrcap: '\u2A48',
        cupcap: '\u2A46',
        CupCap: '\u224D',
        cupcup: '\u2A4A',
        cupdot: '\u228D',
        cupor: '\u2A45',
        cups: '\u222A\uFE00',
        curarr: '\u21B7',
        curarrm: '\u293C',
        curlyeqprec: '\u22DE',
        curlyeqsucc: '\u22DF',
        curlyvee: '\u22CE',
        curlywedge: '\u22CF',
        curren: '\u00A4',
        curvearrowleft: '\u21B6',
        curvearrowright: '\u21B7',
        cuvee: '\u22CE',
        cuwed: '\u22CF',
        cwconint: '\u2232',
        cwint: '\u2231',
        cylcty: '\u232D',
        dagger: '\u2020',
        Dagger: '\u2021',
        daleth: '\u2138',
        darr: '\u2193',
        dArr: '\u21D3',
        Darr: '\u21A1',
        dash: '\u2010',
        dashv: '\u22A3',
        Dashv: '\u2AE4',
        dbkarow: '\u290F',
        dblac: '\u02DD',
        dcaron: '\u010F',
        Dcaron: '\u010E',
        dcy: '\u0434',
        Dcy: '\u0414',
        dd: '\u2146',
        DD: '\u2145',
        ddagger: '\u2021',
        ddarr: '\u21CA',
        DDotrahd: '\u2911',
        ddotseq: '\u2A77',
        deg: '\u00B0',
        Del: '\u2207',
        delta: '\u03B4',
        Delta: '\u0394',
        demptyv: '\u29B1',
        dfisht: '\u297F',
        dfr: '\uD835\uDD21',
        Dfr: '\uD835\uDD07',
        dHar: '\u2965',
        dharl: '\u21C3',
        dharr: '\u21C2',
        DiacriticalAcute: '\u00B4',
        DiacriticalDot: '\u02D9',
        DiacriticalDoubleAcute: '\u02DD',
        DiacriticalGrave: '`',
        DiacriticalTilde: '\u02DC',
        diam: '\u22C4',
        diamond: '\u22C4',
        Diamond: '\u22C4',
        diamondsuit: '\u2666',
        diams: '\u2666',
        die: '\u00A8',
        DifferentialD: '\u2146',
        digamma: '\u03DD',
        disin: '\u22F2',
        div: '\u00F7',
        divide: '\u00F7',
        divideontimes: '\u22C7',
        divonx: '\u22C7',
        djcy: '\u0452',
        DJcy: '\u0402',
        dlcorn: '\u231E',
        dlcrop: '\u230D',
        dollar: '$',
        dopf: '\uD835\uDD55',
        Dopf: '\uD835\uDD3B',
        dot: '\u02D9',
        Dot: '\u00A8',
        DotDot: '\u20DC',
        doteq: '\u2250',
        doteqdot: '\u2251',
        DotEqual: '\u2250',
        dotminus: '\u2238',
        dotplus: '\u2214',
        dotsquare: '\u22A1',
        doublebarwedge: '\u2306',
        DoubleContourIntegral: '\u222F',
        DoubleDot: '\u00A8',
        DoubleDownArrow: '\u21D3',
        DoubleLeftArrow: '\u21D0',
        DoubleLeftRightArrow: '\u21D4',
        DoubleLeftTee: '\u2AE4',
        DoubleLongLeftArrow: '\u27F8',
        DoubleLongLeftRightArrow: '\u27FA',
        DoubleLongRightArrow: '\u27F9',
        DoubleRightArrow: '\u21D2',
        DoubleRightTee: '\u22A8',
        DoubleUpArrow: '\u21D1',
        DoubleUpDownArrow: '\u21D5',
        DoubleVerticalBar: '\u2225',
        downarrow: '\u2193',
        Downarrow: '\u21D3',
        DownArrow: '\u2193',
        DownArrowBar: '\u2913',
        DownArrowUpArrow: '\u21F5',
        DownBreve: '\u0311',
        downdownarrows: '\u21CA',
        downharpoonleft: '\u21C3',
        downharpoonright: '\u21C2',
        DownLeftRightVector: '\u2950',
        DownLeftTeeVector: '\u295E',
        DownLeftVector: '\u21BD',
        DownLeftVectorBar: '\u2956',
        DownRightTeeVector: '\u295F',
        DownRightVector: '\u21C1',
        DownRightVectorBar: '\u2957',
        DownTee: '\u22A4',
        DownTeeArrow: '\u21A7',
        drbkarow: '\u2910',
        drcorn: '\u231F',
        drcrop: '\u230C',
        dscr: '\uD835\uDCB9',
        Dscr: '\uD835\uDC9F',
        dscy: '\u0455',
        DScy: '\u0405',
        dsol: '\u29F6',
        dstrok: '\u0111',
        Dstrok: '\u0110',
        dtdot: '\u22F1',
        dtri: '\u25BF',
        dtrif: '\u25BE',
        duarr: '\u21F5',
        duhar: '\u296F',
        dwangle: '\u29A6',
        dzcy: '\u045F',
        DZcy: '\u040F',
        dzigrarr: '\u27FF',
        eacute: '\u00E9',
        Eacute: '\u00C9',
        easter: '\u2A6E',
        ecaron: '\u011B',
        Ecaron: '\u011A',
        ecir: '\u2256',
        ecirc: '\u00EA',
        Ecirc: '\u00CA',
        ecolon: '\u2255',
        ecy: '\u044D',
        Ecy: '\u042D',
        eDDot: '\u2A77',
        edot: '\u0117',
        eDot: '\u2251',
        Edot: '\u0116',
        ee: '\u2147',
        efDot: '\u2252',
        efr: '\uD835\uDD22',
        Efr: '\uD835\uDD08',
        eg: '\u2A9A',
        egrave: '\u00E8',
        Egrave: '\u00C8',
        egs: '\u2A96',
        egsdot: '\u2A98',
        el: '\u2A99',
        Element: '\u2208',
        elinters: '\u23E7',
        ell: '\u2113',
        els: '\u2A95',
        elsdot: '\u2A97',
        emacr: '\u0113',
        Emacr: '\u0112',
        empty: '\u2205',
        emptyset: '\u2205',
        EmptySmallSquare: '\u25FB',
        emptyv: '\u2205',
        EmptyVerySmallSquare: '\u25AB',
        emsp: '\u2003',
        emsp13: '\u2004',
        emsp14: '\u2005',
        eng: '\u014B',
        ENG: '\u014A',
        ensp: '\u2002',
        eogon: '\u0119',
        Eogon: '\u0118',
        eopf: '\uD835\uDD56',
        Eopf: '\uD835\uDD3C',
        epar: '\u22D5',
        eparsl: '\u29E3',
        eplus: '\u2A71',
        epsi: '\u03B5',
        epsilon: '\u03B5',
        Epsilon: '\u0395',
        epsiv: '\u03F5',
        eqcirc: '\u2256',
        eqcolon: '\u2255',
        eqsim: '\u2242',
        eqslantgtr: '\u2A96',
        eqslantless: '\u2A95',
        Equal: '\u2A75',
        equals: '=',
        EqualTilde: '\u2242',
        equest: '\u225F',
        Equilibrium: '\u21CC',
        equiv: '\u2261',
        equivDD: '\u2A78',
        eqvparsl: '\u29E5',
        erarr: '\u2971',
        erDot: '\u2253',
        escr: '\u212F',
        Escr: '\u2130',
        esdot: '\u2250',
        esim: '\u2242',
        Esim: '\u2A73',
        eta: '\u03B7',
        Eta: '\u0397',
        eth: '\u00F0',
        ETH: '\u00D0',
        euml: '\u00EB',
        Euml: '\u00CB',
        euro: '\u20AC',
        excl: '!',
        exist: '\u2203',
        Exists: '\u2203',
        expectation: '\u2130',
        exponentiale: '\u2147',
        ExponentialE: '\u2147',
        fallingdotseq: '\u2252',
        fcy: '\u0444',
        Fcy: '\u0424',
        female: '\u2640',
        ffilig: '\uFB03',
        fflig: '\uFB00',
        ffllig: '\uFB04',
        ffr: '\uD835\uDD23',
        Ffr: '\uD835\uDD09',
        filig: '\uFB01',
        FilledSmallSquare: '\u25FC',
        FilledVerySmallSquare: '\u25AA',
        fjlig: 'fj',
        flat: '\u266D',
        fllig: '\uFB02',
        fltns: '\u25B1',
        fnof: '\u0192',
        fopf: '\uD835\uDD57',
        Fopf: '\uD835\uDD3D',
        forall: '\u2200',
        ForAll: '\u2200',
        fork: '\u22D4',
        forkv: '\u2AD9',
        Fouriertrf: '\u2131',
        fpartint: '\u2A0D',
        frac12: '\u00BD',
        frac13: '\u2153',
        frac14: '\u00BC',
        frac15: '\u2155',
        frac16: '\u2159',
        frac18: '\u215B',
        frac23: '\u2154',
        frac25: '\u2156',
        frac34: '\u00BE',
        frac35: '\u2157',
        frac38: '\u215C',
        frac45: '\u2158',
        frac56: '\u215A',
        frac58: '\u215D',
        frac78: '\u215E',
        frasl: '\u2044',
        frown: '\u2322',
        fscr: '\uD835\uDCBB',
        Fscr: '\u2131',
        gacute: '\u01F5',
        gamma: '\u03B3',
        Gamma: '\u0393',
        gammad: '\u03DD',
        Gammad: '\u03DC',
        gap: '\u2A86',
        gbreve: '\u011F',
        Gbreve: '\u011E',
        Gcedil: '\u0122',
        gcirc: '\u011D',
        Gcirc: '\u011C',
        gcy: '\u0433',
        Gcy: '\u0413',
        gdot: '\u0121',
        Gdot: '\u0120',
        ge: '\u2265',
        gE: '\u2267',
        gel: '\u22DB',
        gEl: '\u2A8C',
        geq: '\u2265',
        geqq: '\u2267',
        geqslant: '\u2A7E',
        ges: '\u2A7E',
        gescc: '\u2AA9',
        gesdot: '\u2A80',
        gesdoto: '\u2A82',
        gesdotol: '\u2A84',
        gesl: '\u22DB\uFE00',
        gesles: '\u2A94',
        gfr: '\uD835\uDD24',
        Gfr: '\uD835\uDD0A',
        gg: '\u226B',
        Gg: '\u22D9',
        ggg: '\u22D9',
        gimel: '\u2137',
        gjcy: '\u0453',
        GJcy: '\u0403',
        gl: '\u2277',
        gla: '\u2AA5',
        glE: '\u2A92',
        glj: '\u2AA4',
        gnap: '\u2A8A',
        gnapprox: '\u2A8A',
        gne: '\u2A88',
        gnE: '\u2269',
        gneq: '\u2A88',
        gneqq: '\u2269',
        gnsim: '\u22E7',
        gopf: '\uD835\uDD58',
        Gopf: '\uD835\uDD3E',
        grave: '`',
        GreaterEqual: '\u2265',
        GreaterEqualLess: '\u22DB',
        GreaterFullEqual: '\u2267',
        GreaterGreater: '\u2AA2',
        GreaterLess: '\u2277',
        GreaterSlantEqual: '\u2A7E',
        GreaterTilde: '\u2273',
        gscr: '\u210A',
        Gscr: '\uD835\uDCA2',
        gsim: '\u2273',
        gsime: '\u2A8E',
        gsiml: '\u2A90',
        gt: '>',
        Gt: '\u226B',
        GT: '>',
        gtcc: '\u2AA7',
        gtcir: '\u2A7A',
        gtdot: '\u22D7',
        gtlPar: '\u2995',
        gtquest: '\u2A7C',
        gtrapprox: '\u2A86',
        gtrarr: '\u2978',
        gtrdot: '\u22D7',
        gtreqless: '\u22DB',
        gtreqqless: '\u2A8C',
        gtrless: '\u2277',
        gtrsim: '\u2273',
        gvertneqq: '\u2269\uFE00',
        gvnE: '\u2269\uFE00',
        Hacek: '\u02C7',
        hairsp: '\u200A',
        half: '\u00BD',
        hamilt: '\u210B',
        hardcy: '\u044A',
        HARDcy: '\u042A',
        harr: '\u2194',
        hArr: '\u21D4',
        harrcir: '\u2948',
        harrw: '\u21AD',
        Hat: '^',
        hbar: '\u210F',
        hcirc: '\u0125',
        Hcirc: '\u0124',
        hearts: '\u2665',
        heartsuit: '\u2665',
        hellip: '\u2026',
        hercon: '\u22B9',
        hfr: '\uD835\uDD25',
        Hfr: '\u210C',
        HilbertSpace: '\u210B',
        hksearow: '\u2925',
        hkswarow: '\u2926',
        hoarr: '\u21FF',
        homtht: '\u223B',
        hookleftarrow: '\u21A9',
        hookrightarrow: '\u21AA',
        hopf: '\uD835\uDD59',
        Hopf: '\u210D',
        horbar: '\u2015',
        HorizontalLine: '\u2500',
        hscr: '\uD835\uDCBD',
        Hscr: '\u210B',
        hslash: '\u210F',
        hstrok: '\u0127',
        Hstrok: '\u0126',
        HumpDownHump: '\u224E',
        HumpEqual: '\u224F',
        hybull: '\u2043',
        hyphen: '\u2010',
        iacute: '\u00ED',
        Iacute: '\u00CD',
        ic: '\u2063',
        icirc: '\u00EE',
        Icirc: '\u00CE',
        icy: '\u0438',
        Icy: '\u0418',
        Idot: '\u0130',
        iecy: '\u0435',
        IEcy: '\u0415',
        iexcl: '\u00A1',
        iff: '\u21D4',
        ifr: '\uD835\uDD26',
        Ifr: '\u2111',
        igrave: '\u00EC',
        Igrave: '\u00CC',
        ii: '\u2148',
        iiiint: '\u2A0C',
        iiint: '\u222D',
        iinfin: '\u29DC',
        iiota: '\u2129',
        ijlig: '\u0133',
        IJlig: '\u0132',
        Im: '\u2111',
        imacr: '\u012B',
        Imacr: '\u012A',
        image: '\u2111',
        ImaginaryI: '\u2148',
        imagline: '\u2110',
        imagpart: '\u2111',
        imath: '\u0131',
        imof: '\u22B7',
        imped: '\u01B5',
        Implies: '\u21D2',
        in: '\u2208',
        incare: '\u2105',
        infin: '\u221E',
        infintie: '\u29DD',
        inodot: '\u0131',
        int: '\u222B',
        Int: '\u222C',
        intcal: '\u22BA',
        integers: '\u2124',
        Integral: '\u222B',
        intercal: '\u22BA',
        Intersection: '\u22C2',
        intlarhk: '\u2A17',
        intprod: '\u2A3C',
        InvisibleComma: '\u2063',
        InvisibleTimes: '\u2062',
        iocy: '\u0451',
        IOcy: '\u0401',
        iogon: '\u012F',
        Iogon: '\u012E',
        iopf: '\uD835\uDD5A',
        Iopf: '\uD835\uDD40',
        iota: '\u03B9',
        Iota: '\u0399',
        iprod: '\u2A3C',
        iquest: '\u00BF',
        iscr: '\uD835\uDCBE',
        Iscr: '\u2110',
        isin: '\u2208',
        isindot: '\u22F5',
        isinE: '\u22F9',
        isins: '\u22F4',
        isinsv: '\u22F3',
        isinv: '\u2208',
        it: '\u2062',
        itilde: '\u0129',
        Itilde: '\u0128',
        iukcy: '\u0456',
        Iukcy: '\u0406',
        iuml: '\u00EF',
        Iuml: '\u00CF',
        jcirc: '\u0135',
        Jcirc: '\u0134',
        jcy: '\u0439',
        Jcy: '\u0419',
        jfr: '\uD835\uDD27',
        Jfr: '\uD835\uDD0D',
        jmath: '\u0237',
        jopf: '\uD835\uDD5B',
        Jopf: '\uD835\uDD41',
        jscr: '\uD835\uDCBF',
        Jscr: '\uD835\uDCA5',
        jsercy: '\u0458',
        Jsercy: '\u0408',
        jukcy: '\u0454',
        Jukcy: '\u0404',
        kappa: '\u03BA',
        Kappa: '\u039A',
        kappav: '\u03F0',
        kcedil: '\u0137',
        Kcedil: '\u0136',
        kcy: '\u043A',
        Kcy: '\u041A',
        kfr: '\uD835\uDD28',
        Kfr: '\uD835\uDD0E',
        kgreen: '\u0138',
        khcy: '\u0445',
        KHcy: '\u0425',
        kjcy: '\u045C',
        KJcy: '\u040C',
        kopf: '\uD835\uDD5C',
        Kopf: '\uD835\uDD42',
        kscr: '\uD835\uDCC0',
        Kscr: '\uD835\uDCA6',
        lAarr: '\u21DA',
        lacute: '\u013A',
        Lacute: '\u0139',
        laemptyv: '\u29B4',
        lagran: '\u2112',
        lambda: '\u03BB',
        Lambda: '\u039B',
        lang: '\u27E8',
        Lang: '\u27EA',
        langd: '\u2991',
        langle: '\u27E8',
        lap: '\u2A85',
        Laplacetrf: '\u2112',
        laquo: '\u00AB',
        larr: '\u2190',
        lArr: '\u21D0',
        Larr: '\u219E',
        larrb: '\u21E4',
        larrbfs: '\u291F',
        larrfs: '\u291D',
        larrhk: '\u21A9',
        larrlp: '\u21AB',
        larrpl: '\u2939',
        larrsim: '\u2973',
        larrtl: '\u21A2',
        lat: '\u2AAB',
        latail: '\u2919',
        lAtail: '\u291B',
        late: '\u2AAD',
        lates: '\u2AAD\uFE00',
        lbarr: '\u290C',
        lBarr: '\u290E',
        lbbrk: '\u2772',
        lbrace: '{',
        lbrack: '[',
        lbrke: '\u298B',
        lbrksld: '\u298F',
        lbrkslu: '\u298D',
        lcaron: '\u013E',
        Lcaron: '\u013D',
        lcedil: '\u013C',
        Lcedil: '\u013B',
        lceil: '\u2308',
        lcub: '{',
        lcy: '\u043B',
        Lcy: '\u041B',
        ldca: '\u2936',
        ldquo: '\u201C',
        ldquor: '\u201E',
        ldrdhar: '\u2967',
        ldrushar: '\u294B',
        ldsh: '\u21B2',
        le: '\u2264',
        lE: '\u2266',
        LeftAngleBracket: '\u27E8',
        leftarrow: '\u2190',
        Leftarrow: '\u21D0',
        LeftArrow: '\u2190',
        LeftArrowBar: '\u21E4',
        LeftArrowRightArrow: '\u21C6',
        leftarrowtail: '\u21A2',
        LeftCeiling: '\u2308',
        LeftDoubleBracket: '\u27E6',
        LeftDownTeeVector: '\u2961',
        LeftDownVector: '\u21C3',
        LeftDownVectorBar: '\u2959',
        LeftFloor: '\u230A',
        leftharpoondown: '\u21BD',
        leftharpoonup: '\u21BC',
        leftleftarrows: '\u21C7',
        leftrightarrow: '\u2194',
        Leftrightarrow: '\u21D4',
        LeftRightArrow: '\u2194',
        leftrightarrows: '\u21C6',
        leftrightharpoons: '\u21CB',
        leftrightsquigarrow: '\u21AD',
        LeftRightVector: '\u294E',
        LeftTee: '\u22A3',
        LeftTeeArrow: '\u21A4',
        LeftTeeVector: '\u295A',
        leftthreetimes: '\u22CB',
        LeftTriangle: '\u22B2',
        LeftTriangleBar: '\u29CF',
        LeftTriangleEqual: '\u22B4',
        LeftUpDownVector: '\u2951',
        LeftUpTeeVector: '\u2960',
        LeftUpVector: '\u21BF',
        LeftUpVectorBar: '\u2958',
        LeftVector: '\u21BC',
        LeftVectorBar: '\u2952',
        leg: '\u22DA',
        lEg: '\u2A8B',
        leq: '\u2264',
        leqq: '\u2266',
        leqslant: '\u2A7D',
        les: '\u2A7D',
        lescc: '\u2AA8',
        lesdot: '\u2A7F',
        lesdoto: '\u2A81',
        lesdotor: '\u2A83',
        lesg: '\u22DA\uFE00',
        lesges: '\u2A93',
        lessapprox: '\u2A85',
        lessdot: '\u22D6',
        lesseqgtr: '\u22DA',
        lesseqqgtr: '\u2A8B',
        LessEqualGreater: '\u22DA',
        LessFullEqual: '\u2266',
        LessGreater: '\u2276',
        lessgtr: '\u2276',
        LessLess: '\u2AA1',
        lesssim: '\u2272',
        LessSlantEqual: '\u2A7D',
        LessTilde: '\u2272',
        lfisht: '\u297C',
        lfloor: '\u230A',
        lfr: '\uD835\uDD29',
        Lfr: '\uD835\uDD0F',
        lg: '\u2276',
        lgE: '\u2A91',
        lHar: '\u2962',
        lhard: '\u21BD',
        lharu: '\u21BC',
        lharul: '\u296A',
        lhblk: '\u2584',
        ljcy: '\u0459',
        LJcy: '\u0409',
        ll: '\u226A',
        Ll: '\u22D8',
        llarr: '\u21C7',
        llcorner: '\u231E',
        Lleftarrow: '\u21DA',
        llhard: '\u296B',
        lltri: '\u25FA',
        lmidot: '\u0140',
        Lmidot: '\u013F',
        lmoust: '\u23B0',
        lmoustache: '\u23B0',
        lnap: '\u2A89',
        lnapprox: '\u2A89',
        lne: '\u2A87',
        lnE: '\u2268',
        lneq: '\u2A87',
        lneqq: '\u2268',
        lnsim: '\u22E6',
        loang: '\u27EC',
        loarr: '\u21FD',
        lobrk: '\u27E6',
        longleftarrow: '\u27F5',
        Longleftarrow: '\u27F8',
        LongLeftArrow: '\u27F5',
        longleftrightarrow: '\u27F7',
        Longleftrightarrow: '\u27FA',
        LongLeftRightArrow: '\u27F7',
        longmapsto: '\u27FC',
        longrightarrow: '\u27F6',
        Longrightarrow: '\u27F9',
        LongRightArrow: '\u27F6',
        looparrowleft: '\u21AB',
        looparrowright: '\u21AC',
        lopar: '\u2985',
        lopf: '\uD835\uDD5D',
        Lopf: '\uD835\uDD43',
        loplus: '\u2A2D',
        lotimes: '\u2A34',
        lowast: '\u2217',
        lowbar: '_',
        LowerLeftArrow: '\u2199',
        LowerRightArrow: '\u2198',
        loz: '\u25CA',
        lozenge: '\u25CA',
        lozf: '\u29EB',
        lpar: '(',
        lparlt: '\u2993',
        lrarr: '\u21C6',
        lrcorner: '\u231F',
        lrhar: '\u21CB',
        lrhard: '\u296D',
        lrm: '\u200E',
        lrtri: '\u22BF',
        lsaquo: '\u2039',
        lscr: '\uD835\uDCC1',
        Lscr: '\u2112',
        lsh: '\u21B0',
        Lsh: '\u21B0',
        lsim: '\u2272',
        lsime: '\u2A8D',
        lsimg: '\u2A8F',
        lsqb: '[',
        lsquo: '\u2018',
        lsquor: '\u201A',
        lstrok: '\u0142',
        Lstrok: '\u0141',
        lt: '<',
        Lt: '\u226A',
        LT: '<',
        ltcc: '\u2AA6',
        ltcir: '\u2A79',
        ltdot: '\u22D6',
        lthree: '\u22CB',
        ltimes: '\u22C9',
        ltlarr: '\u2976',
        ltquest: '\u2A7B',
        ltri: '\u25C3',
        ltrie: '\u22B4',
        ltrif: '\u25C2',
        ltrPar: '\u2996',
        lurdshar: '\u294A',
        luruhar: '\u2966',
        lvertneqq: '\u2268\uFE00',
        lvnE: '\u2268\uFE00',
        macr: '\u00AF',
        male: '\u2642',
        malt: '\u2720',
        maltese: '\u2720',
        map: '\u21A6',
        Map: '\u2905',
        mapsto: '\u21A6',
        mapstodown: '\u21A7',
        mapstoleft: '\u21A4',
        mapstoup: '\u21A5',
        marker: '\u25AE',
        mcomma: '\u2A29',
        mcy: '\u043C',
        Mcy: '\u041C',
        mdash: '\u2014',
        mDDot: '\u223A',
        measuredangle: '\u2221',
        MediumSpace: '\u205F',
        Mellintrf: '\u2133',
        mfr: '\uD835\uDD2A',
        Mfr: '\uD835\uDD10',
        mho: '\u2127',
        micro: '\u00B5',
        mid: '\u2223',
        midast: '*',
        midcir: '\u2AF0',
        middot: '\u00B7',
        minus: '\u2212',
        minusb: '\u229F',
        minusd: '\u2238',
        minusdu: '\u2A2A',
        MinusPlus: '\u2213',
        mlcp: '\u2ADB',
        mldr: '\u2026',
        mnplus: '\u2213',
        models: '\u22A7',
        mopf: '\uD835\uDD5E',
        Mopf: '\uD835\uDD44',
        mp: '\u2213',
        mscr: '\uD835\uDCC2',
        Mscr: '\u2133',
        mstpos: '\u223E',
        mu: '\u03BC',
        Mu: '\u039C',
        multimap: '\u22B8',
        mumap: '\u22B8',
        nabla: '\u2207',
        nacute: '\u0144',
        Nacute: '\u0143',
        nang: '\u2220\u20D2',
        nap: '\u2249',
        napE: '\u2A70\u0338',
        napid: '\u224B\u0338',
        napos: '\u0149',
        napprox: '\u2249',
        natur: '\u266E',
        natural: '\u266E',
        naturals: '\u2115',
        nbsp: '\u00A0',
        nbump: '\u224E\u0338',
        nbumpe: '\u224F\u0338',
        ncap: '\u2A43',
        ncaron: '\u0148',
        Ncaron: '\u0147',
        ncedil: '\u0146',
        Ncedil: '\u0145',
        ncong: '\u2247',
        ncongdot: '\u2A6D\u0338',
        ncup: '\u2A42',
        ncy: '\u043D',
        Ncy: '\u041D',
        ndash: '\u2013',
        ne: '\u2260',
        nearhk: '\u2924',
        nearr: '\u2197',
        neArr: '\u21D7',
        nearrow: '\u2197',
        nedot: '\u2250\u0338',
        NegativeMediumSpace: '\u200B',
        NegativeThickSpace: '\u200B',
        NegativeThinSpace: '\u200B',
        NegativeVeryThinSpace: '\u200B',
        nequiv: '\u2262',
        nesear: '\u2928',
        nesim: '\u2242\u0338',
        NestedGreaterGreater: '\u226B',
        NestedLessLess: '\u226A',
        NewLine: '\n',
        nexist: '\u2204',
        nexists: '\u2204',
        nfr: '\uD835\uDD2B',
        Nfr: '\uD835\uDD11',
        nge: '\u2271',
        ngE: '\u2267\u0338',
        ngeq: '\u2271',
        ngeqq: '\u2267\u0338',
        ngeqslant: '\u2A7E\u0338',
        nges: '\u2A7E\u0338',
        nGg: '\u22D9\u0338',
        ngsim: '\u2275',
        ngt: '\u226F',
        nGt: '\u226B\u20D2',
        ngtr: '\u226F',
        nGtv: '\u226B\u0338',
        nharr: '\u21AE',
        nhArr: '\u21CE',
        nhpar: '\u2AF2',
        ni: '\u220B',
        nis: '\u22FC',
        nisd: '\u22FA',
        niv: '\u220B',
        njcy: '\u045A',
        NJcy: '\u040A',
        nlarr: '\u219A',
        nlArr: '\u21CD',
        nldr: '\u2025',
        nle: '\u2270',
        nlE: '\u2266\u0338',
        nleftarrow: '\u219A',
        nLeftarrow: '\u21CD',
        nleftrightarrow: '\u21AE',
        nLeftrightarrow: '\u21CE',
        nleq: '\u2270',
        nleqq: '\u2266\u0338',
        nleqslant: '\u2A7D\u0338',
        nles: '\u2A7D\u0338',
        nless: '\u226E',
        nLl: '\u22D8\u0338',
        nlsim: '\u2274',
        nlt: '\u226E',
        nLt: '\u226A\u20D2',
        nltri: '\u22EA',
        nltrie: '\u22EC',
        nLtv: '\u226A\u0338',
        nmid: '\u2224',
        NoBreak: '\u2060',
        NonBreakingSpace: '\u00A0',
        nopf: '\uD835\uDD5F',
        Nopf: '\u2115',
        not: '\u00AC',
        Not: '\u2AEC',
        NotCongruent: '\u2262',
        NotCupCap: '\u226D',
        NotDoubleVerticalBar: '\u2226',
        NotElement: '\u2209',
        NotEqual: '\u2260',
        NotEqualTilde: '\u2242\u0338',
        NotExists: '\u2204',
        NotGreater: '\u226F',
        NotGreaterEqual: '\u2271',
        NotGreaterFullEqual: '\u2267\u0338',
        NotGreaterGreater: '\u226B\u0338',
        NotGreaterLess: '\u2279',
        NotGreaterSlantEqual: '\u2A7E\u0338',
        NotGreaterTilde: '\u2275',
        NotHumpDownHump: '\u224E\u0338',
        NotHumpEqual: '\u224F\u0338',
        notin: '\u2209',
        notindot: '\u22F5\u0338',
        notinE: '\u22F9\u0338',
        notinva: '\u2209',
        notinvb: '\u22F7',
        notinvc: '\u22F6',
        NotLeftTriangle: '\u22EA',
        NotLeftTriangleBar: '\u29CF\u0338',
        NotLeftTriangleEqual: '\u22EC',
        NotLess: '\u226E',
        NotLessEqual: '\u2270',
        NotLessGreater: '\u2278',
        NotLessLess: '\u226A\u0338',
        NotLessSlantEqual: '\u2A7D\u0338',
        NotLessTilde: '\u2274',
        NotNestedGreaterGreater: '\u2AA2\u0338',
        NotNestedLessLess: '\u2AA1\u0338',
        notni: '\u220C',
        notniva: '\u220C',
        notnivb: '\u22FE',
        notnivc: '\u22FD',
        NotPrecedes: '\u2280',
        NotPrecedesEqual: '\u2AAF\u0338',
        NotPrecedesSlantEqual: '\u22E0',
        NotReverseElement: '\u220C',
        NotRightTriangle: '\u22EB',
        NotRightTriangleBar: '\u29D0\u0338',
        NotRightTriangleEqual: '\u22ED',
        NotSquareSubset: '\u228F\u0338',
        NotSquareSubsetEqual: '\u22E2',
        NotSquareSuperset: '\u2290\u0338',
        NotSquareSupersetEqual: '\u22E3',
        NotSubset: '\u2282\u20D2',
        NotSubsetEqual: '\u2288',
        NotSucceeds: '\u2281',
        NotSucceedsEqual: '\u2AB0\u0338',
        NotSucceedsSlantEqual: '\u22E1',
        NotSucceedsTilde: '\u227F\u0338',
        NotSuperset: '\u2283\u20D2',
        NotSupersetEqual: '\u2289',
        NotTilde: '\u2241',
        NotTildeEqual: '\u2244',
        NotTildeFullEqual: '\u2247',
        NotTildeTilde: '\u2249',
        NotVerticalBar: '\u2224',
        npar: '\u2226',
        nparallel: '\u2226',
        nparsl: '\u2AFD\u20E5',
        npart: '\u2202\u0338',
        npolint: '\u2A14',
        npr: '\u2280',
        nprcue: '\u22E0',
        npre: '\u2AAF\u0338',
        nprec: '\u2280',
        npreceq: '\u2AAF\u0338',
        nrarr: '\u219B',
        nrArr: '\u21CF',
        nrarrc: '\u2933\u0338',
        nrarrw: '\u219D\u0338',
        nrightarrow: '\u219B',
        nRightarrow: '\u21CF',
        nrtri: '\u22EB',
        nrtrie: '\u22ED',
        nsc: '\u2281',
        nsccue: '\u22E1',
        nsce: '\u2AB0\u0338',
        nscr: '\uD835\uDCC3',
        Nscr: '\uD835\uDCA9',
        nshortmid: '\u2224',
        nshortparallel: '\u2226',
        nsim: '\u2241',
        nsime: '\u2244',
        nsimeq: '\u2244',
        nsmid: '\u2224',
        nspar: '\u2226',
        nsqsube: '\u22E2',
        nsqsupe: '\u22E3',
        nsub: '\u2284',
        nsube: '\u2288',
        nsubE: '\u2AC5\u0338',
        nsubset: '\u2282\u20D2',
        nsubseteq: '\u2288',
        nsubseteqq: '\u2AC5\u0338',
        nsucc: '\u2281',
        nsucceq: '\u2AB0\u0338',
        nsup: '\u2285',
        nsupe: '\u2289',
        nsupE: '\u2AC6\u0338',
        nsupset: '\u2283\u20D2',
        nsupseteq: '\u2289',
        nsupseteqq: '\u2AC6\u0338',
        ntgl: '\u2279',
        ntilde: '\u00F1',
        Ntilde: '\u00D1',
        ntlg: '\u2278',
        ntriangleleft: '\u22EA',
        ntrianglelefteq: '\u22EC',
        ntriangleright: '\u22EB',
        ntrianglerighteq: '\u22ED',
        nu: '\u03BD',
        Nu: '\u039D',
        num: '#',
        numero: '\u2116',
        numsp: '\u2007',
        nvap: '\u224D\u20D2',
        nvdash: '\u22AC',
        nvDash: '\u22AD',
        nVdash: '\u22AE',
        nVDash: '\u22AF',
        nvge: '\u2265\u20D2',
        nvgt: '>\u20D2',
        nvHarr: '\u2904',
        nvinfin: '\u29DE',
        nvlArr: '\u2902',
        nvle: '\u2264\u20D2',
        nvlt: '<\u20D2',
        nvltrie: '\u22B4\u20D2',
        nvrArr: '\u2903',
        nvrtrie: '\u22B5\u20D2',
        nvsim: '\u223C\u20D2',
        nwarhk: '\u2923',
        nwarr: '\u2196',
        nwArr: '\u21D6',
        nwarrow: '\u2196',
        nwnear: '\u2927',
        oacute: '\u00F3',
        Oacute: '\u00D3',
        oast: '\u229B',
        ocir: '\u229A',
        ocirc: '\u00F4',
        Ocirc: '\u00D4',
        ocy: '\u043E',
        Ocy: '\u041E',
        odash: '\u229D',
        odblac: '\u0151',
        Odblac: '\u0150',
        odiv: '\u2A38',
        odot: '\u2299',
        odsold: '\u29BC',
        oelig: '\u0153',
        OElig: '\u0152',
        ofcir: '\u29BF',
        ofr: '\uD835\uDD2C',
        Ofr: '\uD835\uDD12',
        ogon: '\u02DB',
        ograve: '\u00F2',
        Ograve: '\u00D2',
        ogt: '\u29C1',
        ohbar: '\u29B5',
        ohm: '\u03A9',
        oint: '\u222E',
        olarr: '\u21BA',
        olcir: '\u29BE',
        olcross: '\u29BB',
        oline: '\u203E',
        olt: '\u29C0',
        omacr: '\u014D',
        Omacr: '\u014C',
        omega: '\u03C9',
        Omega: '\u03A9',
        omicron: '\u03BF',
        Omicron: '\u039F',
        omid: '\u29B6',
        ominus: '\u2296',
        oopf: '\uD835\uDD60',
        Oopf: '\uD835\uDD46',
        opar: '\u29B7',
        OpenCurlyDoubleQuote: '\u201C',
        OpenCurlyQuote: '\u2018',
        operp: '\u29B9',
        oplus: '\u2295',
        or: '\u2228',
        Or: '\u2A54',
        orarr: '\u21BB',
        ord: '\u2A5D',
        order: '\u2134',
        orderof: '\u2134',
        ordf: '\u00AA',
        ordm: '\u00BA',
        origof: '\u22B6',
        oror: '\u2A56',
        orslope: '\u2A57',
        orv: '\u2A5B',
        oS: '\u24C8',
        oscr: '\u2134',
        Oscr: '\uD835\uDCAA',
        oslash: '\u00F8',
        Oslash: '\u00D8',
        osol: '\u2298',
        otilde: '\u00F5',
        Otilde: '\u00D5',
        otimes: '\u2297',
        Otimes: '\u2A37',
        otimesas: '\u2A36',
        ouml: '\u00F6',
        Ouml: '\u00D6',
        ovbar: '\u233D',
        OverBar: '\u203E',
        OverBrace: '\u23DE',
        OverBracket: '\u23B4',
        OverParenthesis: '\u23DC',
        par: '\u2225',
        para: '\u00B6',
        parallel: '\u2225',
        parsim: '\u2AF3',
        parsl: '\u2AFD',
        part: '\u2202',
        PartialD: '\u2202',
        pcy: '\u043F',
        Pcy: '\u041F',
        percnt: '%',
        period: '.',
        permil: '\u2030',
        perp: '\u22A5',
        pertenk: '\u2031',
        pfr: '\uD835\uDD2D',
        Pfr: '\uD835\uDD13',
        phi: '\u03C6',
        Phi: '\u03A6',
        phiv: '\u03D5',
        phmmat: '\u2133',
        phone: '\u260E',
        pi: '\u03C0',
        Pi: '\u03A0',
        pitchfork: '\u22D4',
        piv: '\u03D6',
        planck: '\u210F',
        planckh: '\u210E',
        plankv: '\u210F',
        plus: '+',
        plusacir: '\u2A23',
        plusb: '\u229E',
        pluscir: '\u2A22',
        plusdo: '\u2214',
        plusdu: '\u2A25',
        pluse: '\u2A72',
        PlusMinus: '\u00B1',
        plusmn: '\u00B1',
        plussim: '\u2A26',
        plustwo: '\u2A27',
        pm: '\u00B1',
        Poincareplane: '\u210C',
        pointint: '\u2A15',
        popf: '\uD835\uDD61',
        Popf: '\u2119',
        pound: '\u00A3',
        pr: '\u227A',
        Pr: '\u2ABB',
        prap: '\u2AB7',
        prcue: '\u227C',
        pre: '\u2AAF',
        prE: '\u2AB3',
        prec: '\u227A',
        precapprox: '\u2AB7',
        preccurlyeq: '\u227C',
        Precedes: '\u227A',
        PrecedesEqual: '\u2AAF',
        PrecedesSlantEqual: '\u227C',
        PrecedesTilde: '\u227E',
        preceq: '\u2AAF',
        precnapprox: '\u2AB9',
        precneqq: '\u2AB5',
        precnsim: '\u22E8',
        precsim: '\u227E',
        prime: '\u2032',
        Prime: '\u2033',
        primes: '\u2119',
        prnap: '\u2AB9',
        prnE: '\u2AB5',
        prnsim: '\u22E8',
        prod: '\u220F',
        Product: '\u220F',
        profalar: '\u232E',
        profline: '\u2312',
        profsurf: '\u2313',
        prop: '\u221D',
        Proportion: '\u2237',
        Proportional: '\u221D',
        propto: '\u221D',
        prsim: '\u227E',
        prurel: '\u22B0',
        pscr: '\uD835\uDCC5',
        Pscr: '\uD835\uDCAB',
        psi: '\u03C8',
        Psi: '\u03A8',
        puncsp: '\u2008',
        qfr: '\uD835\uDD2E',
        Qfr: '\uD835\uDD14',
        qint: '\u2A0C',
        qopf: '\uD835\uDD62',
        Qopf: '\u211A',
        qprime: '\u2057',
        qscr: '\uD835\uDCC6',
        Qscr: '\uD835\uDCAC',
        quaternions: '\u210D',
        quatint: '\u2A16',
        quest: '?',
        questeq: '\u225F',
        quot: '"',
        QUOT: '"',
        rAarr: '\u21DB',
        race: '\u223D\u0331',
        racute: '\u0155',
        Racute: '\u0154',
        radic: '\u221A',
        raemptyv: '\u29B3',
        rang: '\u27E9',
        Rang: '\u27EB',
        rangd: '\u2992',
        range: '\u29A5',
        rangle: '\u27E9',
        raquo: '\u00BB',
        rarr: '\u2192',
        rArr: '\u21D2',
        Rarr: '\u21A0',
        rarrap: '\u2975',
        rarrb: '\u21E5',
        rarrbfs: '\u2920',
        rarrc: '\u2933',
        rarrfs: '\u291E',
        rarrhk: '\u21AA',
        rarrlp: '\u21AC',
        rarrpl: '\u2945',
        rarrsim: '\u2974',
        rarrtl: '\u21A3',
        Rarrtl: '\u2916',
        rarrw: '\u219D',
        ratail: '\u291A',
        rAtail: '\u291C',
        ratio: '\u2236',
        rationals: '\u211A',
        rbarr: '\u290D',
        rBarr: '\u290F',
        RBarr: '\u2910',
        rbbrk: '\u2773',
        rbrace: '}',
        rbrack: ']',
        rbrke: '\u298C',
        rbrksld: '\u298E',
        rbrkslu: '\u2990',
        rcaron: '\u0159',
        Rcaron: '\u0158',
        rcedil: '\u0157',
        Rcedil: '\u0156',
        rceil: '\u2309',
        rcub: '}',
        rcy: '\u0440',
        Rcy: '\u0420',
        rdca: '\u2937',
        rdldhar: '\u2969',
        rdquo: '\u201D',
        rdquor: '\u201D',
        rdsh: '\u21B3',
        Re: '\u211C',
        real: '\u211C',
        realine: '\u211B',
        realpart: '\u211C',
        reals: '\u211D',
        rect: '\u25AD',
        reg: '\u00AE',
        REG: '\u00AE',
        ReverseElement: '\u220B',
        ReverseEquilibrium: '\u21CB',
        ReverseUpEquilibrium: '\u296F',
        rfisht: '\u297D',
        rfloor: '\u230B',
        rfr: '\uD835\uDD2F',
        Rfr: '\u211C',
        rHar: '\u2964',
        rhard: '\u21C1',
        rharu: '\u21C0',
        rharul: '\u296C',
        rho: '\u03C1',
        Rho: '\u03A1',
        rhov: '\u03F1',
        RightAngleBracket: '\u27E9',
        rightarrow: '\u2192',
        Rightarrow: '\u21D2',
        RightArrow: '\u2192',
        RightArrowBar: '\u21E5',
        RightArrowLeftArrow: '\u21C4',
        rightarrowtail: '\u21A3',
        RightCeiling: '\u2309',
        RightDoubleBracket: '\u27E7',
        RightDownTeeVector: '\u295D',
        RightDownVector: '\u21C2',
        RightDownVectorBar: '\u2955',
        RightFloor: '\u230B',
        rightharpoondown: '\u21C1',
        rightharpoonup: '\u21C0',
        rightleftarrows: '\u21C4',
        rightleftharpoons: '\u21CC',
        rightrightarrows: '\u21C9',
        rightsquigarrow: '\u219D',
        RightTee: '\u22A2',
        RightTeeArrow: '\u21A6',
        RightTeeVector: '\u295B',
        rightthreetimes: '\u22CC',
        RightTriangle: '\u22B3',
        RightTriangleBar: '\u29D0',
        RightTriangleEqual: '\u22B5',
        RightUpDownVector: '\u294F',
        RightUpTeeVector: '\u295C',
        RightUpVector: '\u21BE',
        RightUpVectorBar: '\u2954',
        RightVector: '\u21C0',
        RightVectorBar: '\u2953',
        ring: '\u02DA',
        risingdotseq: '\u2253',
        rlarr: '\u21C4',
        rlhar: '\u21CC',
        rlm: '\u200F',
        rmoust: '\u23B1',
        rmoustache: '\u23B1',
        rnmid: '\u2AEE',
        roang: '\u27ED',
        roarr: '\u21FE',
        robrk: '\u27E7',
        ropar: '\u2986',
        ropf: '\uD835\uDD63',
        Ropf: '\u211D',
        roplus: '\u2A2E',
        rotimes: '\u2A35',
        RoundImplies: '\u2970',
        rpar: ')',
        rpargt: '\u2994',
        rppolint: '\u2A12',
        rrarr: '\u21C9',
        Rrightarrow: '\u21DB',
        rsaquo: '\u203A',
        rscr: '\uD835\uDCC7',
        Rscr: '\u211B',
        rsh: '\u21B1',
        Rsh: '\u21B1',
        rsqb: ']',
        rsquo: '\u2019',
        rsquor: '\u2019',
        rthree: '\u22CC',
        rtimes: '\u22CA',
        rtri: '\u25B9',
        rtrie: '\u22B5',
        rtrif: '\u25B8',
        rtriltri: '\u29CE',
        RuleDelayed: '\u29F4',
        ruluhar: '\u2968',
        rx: '\u211E',
        sacute: '\u015B',
        Sacute: '\u015A',
        sbquo: '\u201A',
        sc: '\u227B',
        Sc: '\u2ABC',
        scap: '\u2AB8',
        scaron: '\u0161',
        Scaron: '\u0160',
        sccue: '\u227D',
        sce: '\u2AB0',
        scE: '\u2AB4',
        scedil: '\u015F',
        Scedil: '\u015E',
        scirc: '\u015D',
        Scirc: '\u015C',
        scnap: '\u2ABA',
        scnE: '\u2AB6',
        scnsim: '\u22E9',
        scpolint: '\u2A13',
        scsim: '\u227F',
        scy: '\u0441',
        Scy: '\u0421',
        sdot: '\u22C5',
        sdotb: '\u22A1',
        sdote: '\u2A66',
        searhk: '\u2925',
        searr: '\u2198',
        seArr: '\u21D8',
        searrow: '\u2198',
        sect: '\u00A7',
        semi: ';',
        seswar: '\u2929',
        setminus: '\u2216',
        setmn: '\u2216',
        sext: '\u2736',
        sfr: '\uD835\uDD30',
        Sfr: '\uD835\uDD16',
        sfrown: '\u2322',
        sharp: '\u266F',
        shchcy: '\u0449',
        SHCHcy: '\u0429',
        shcy: '\u0448',
        SHcy: '\u0428',
        ShortDownArrow: '\u2193',
        ShortLeftArrow: '\u2190',
        shortmid: '\u2223',
        shortparallel: '\u2225',
        ShortRightArrow: '\u2192',
        ShortUpArrow: '\u2191',
        shy: '\u00AD',
        sigma: '\u03C3',
        Sigma: '\u03A3',
        sigmaf: '\u03C2',
        sigmav: '\u03C2',
        sim: '\u223C',
        simdot: '\u2A6A',
        sime: '\u2243',
        simeq: '\u2243',
        simg: '\u2A9E',
        simgE: '\u2AA0',
        siml: '\u2A9D',
        simlE: '\u2A9F',
        simne: '\u2246',
        simplus: '\u2A24',
        simrarr: '\u2972',
        slarr: '\u2190',
        SmallCircle: '\u2218',
        smallsetminus: '\u2216',
        smashp: '\u2A33',
        smeparsl: '\u29E4',
        smid: '\u2223',
        smile: '\u2323',
        smt: '\u2AAA',
        smte: '\u2AAC',
        smtes: '\u2AAC\uFE00',
        softcy: '\u044C',
        SOFTcy: '\u042C',
        sol: '/',
        solb: '\u29C4',
        solbar: '\u233F',
        sopf: '\uD835\uDD64',
        Sopf: '\uD835\uDD4A',
        spades: '\u2660',
        spadesuit: '\u2660',
        spar: '\u2225',
        sqcap: '\u2293',
        sqcaps: '\u2293\uFE00',
        sqcup: '\u2294',
        sqcups: '\u2294\uFE00',
        Sqrt: '\u221A',
        sqsub: '\u228F',
        sqsube: '\u2291',
        sqsubset: '\u228F',
        sqsubseteq: '\u2291',
        sqsup: '\u2290',
        sqsupe: '\u2292',
        sqsupset: '\u2290',
        sqsupseteq: '\u2292',
        squ: '\u25A1',
        square: '\u25A1',
        Square: '\u25A1',
        SquareIntersection: '\u2293',
        SquareSubset: '\u228F',
        SquareSubsetEqual: '\u2291',
        SquareSuperset: '\u2290',
        SquareSupersetEqual: '\u2292',
        SquareUnion: '\u2294',
        squarf: '\u25AA',
        squf: '\u25AA',
        srarr: '\u2192',
        sscr: '\uD835\uDCC8',
        Sscr: '\uD835\uDCAE',
        ssetmn: '\u2216',
        ssmile: '\u2323',
        sstarf: '\u22C6',
        star: '\u2606',
        Star: '\u22C6',
        starf: '\u2605',
        straightepsilon: '\u03F5',
        straightphi: '\u03D5',
        strns: '\u00AF',
        sub: '\u2282',
        Sub: '\u22D0',
        subdot: '\u2ABD',
        sube: '\u2286',
        subE: '\u2AC5',
        subedot: '\u2AC3',
        submult: '\u2AC1',
        subne: '\u228A',
        subnE: '\u2ACB',
        subplus: '\u2ABF',
        subrarr: '\u2979',
        subset: '\u2282',
        Subset: '\u22D0',
        subseteq: '\u2286',
        subseteqq: '\u2AC5',
        SubsetEqual: '\u2286',
        subsetneq: '\u228A',
        subsetneqq: '\u2ACB',
        subsim: '\u2AC7',
        subsub: '\u2AD5',
        subsup: '\u2AD3',
        succ: '\u227B',
        succapprox: '\u2AB8',
        succcurlyeq: '\u227D',
        Succeeds: '\u227B',
        SucceedsEqual: '\u2AB0',
        SucceedsSlantEqual: '\u227D',
        SucceedsTilde: '\u227F',
        succeq: '\u2AB0',
        succnapprox: '\u2ABA',
        succneqq: '\u2AB6',
        succnsim: '\u22E9',
        succsim: '\u227F',
        SuchThat: '\u220B',
        sum: '\u2211',
        Sum: '\u2211',
        sung: '\u266A',
        sup: '\u2283',
        Sup: '\u22D1',
        sup1: '\u00B9',
        sup2: '\u00B2',
        sup3: '\u00B3',
        supdot: '\u2ABE',
        supdsub: '\u2AD8',
        supe: '\u2287',
        supE: '\u2AC6',
        supedot: '\u2AC4',
        Superset: '\u2283',
        SupersetEqual: '\u2287',
        suphsol: '\u27C9',
        suphsub: '\u2AD7',
        suplarr: '\u297B',
        supmult: '\u2AC2',
        supne: '\u228B',
        supnE: '\u2ACC',
        supplus: '\u2AC0',
        supset: '\u2283',
        Supset: '\u22D1',
        supseteq: '\u2287',
        supseteqq: '\u2AC6',
        supsetneq: '\u228B',
        supsetneqq: '\u2ACC',
        supsim: '\u2AC8',
        supsub: '\u2AD4',
        supsup: '\u2AD6',
        swarhk: '\u2926',
        swarr: '\u2199',
        swArr: '\u21D9',
        swarrow: '\u2199',
        swnwar: '\u292A',
        szlig: '\u00DF',
        Tab: '\t',
        target: '\u2316',
        tau: '\u03C4',
        Tau: '\u03A4',
        tbrk: '\u23B4',
        tcaron: '\u0165',
        Tcaron: '\u0164',
        tcedil: '\u0163',
        Tcedil: '\u0162',
        tcy: '\u0442',
        Tcy: '\u0422',
        tdot: '\u20DB',
        telrec: '\u2315',
        tfr: '\uD835\uDD31',
        Tfr: '\uD835\uDD17',
        there4: '\u2234',
        therefore: '\u2234',
        Therefore: '\u2234',
        theta: '\u03B8',
        Theta: '\u0398',
        thetasym: '\u03D1',
        thetav: '\u03D1',
        thickapprox: '\u2248',
        thicksim: '\u223C',
        ThickSpace: '\u205F\u200A',
        thinsp: '\u2009',
        ThinSpace: '\u2009',
        thkap: '\u2248',
        thksim: '\u223C',
        thorn: '\u00FE',
        THORN: '\u00DE',
        tilde: '\u02DC',
        Tilde: '\u223C',
        TildeEqual: '\u2243',
        TildeFullEqual: '\u2245',
        TildeTilde: '\u2248',
        times: '\u00D7',
        timesb: '\u22A0',
        timesbar: '\u2A31',
        timesd: '\u2A30',
        tint: '\u222D',
        toea: '\u2928',
        top: '\u22A4',
        topbot: '\u2336',
        topcir: '\u2AF1',
        topf: '\uD835\uDD65',
        Topf: '\uD835\uDD4B',
        topfork: '\u2ADA',
        tosa: '\u2929',
        tprime: '\u2034',
        trade: '\u2122',
        TRADE: '\u2122',
        triangle: '\u25B5',
        triangledown: '\u25BF',
        triangleleft: '\u25C3',
        trianglelefteq: '\u22B4',
        triangleq: '\u225C',
        triangleright: '\u25B9',
        trianglerighteq: '\u22B5',
        tridot: '\u25EC',
        trie: '\u225C',
        triminus: '\u2A3A',
        TripleDot: '\u20DB',
        triplus: '\u2A39',
        trisb: '\u29CD',
        tritime: '\u2A3B',
        trpezium: '\u23E2',
        tscr: '\uD835\uDCC9',
        Tscr: '\uD835\uDCAF',
        tscy: '\u0446',
        TScy: '\u0426',
        tshcy: '\u045B',
        TSHcy: '\u040B',
        tstrok: '\u0167',
        Tstrok: '\u0166',
        twixt: '\u226C',
        twoheadleftarrow: '\u219E',
        twoheadrightarrow: '\u21A0',
        uacute: '\u00FA',
        Uacute: '\u00DA',
        uarr: '\u2191',
        uArr: '\u21D1',
        Uarr: '\u219F',
        Uarrocir: '\u2949',
        ubrcy: '\u045E',
        Ubrcy: '\u040E',
        ubreve: '\u016D',
        Ubreve: '\u016C',
        ucirc: '\u00FB',
        Ucirc: '\u00DB',
        ucy: '\u0443',
        Ucy: '\u0423',
        udarr: '\u21C5',
        udblac: '\u0171',
        Udblac: '\u0170',
        udhar: '\u296E',
        ufisht: '\u297E',
        ufr: '\uD835\uDD32',
        Ufr: '\uD835\uDD18',
        ugrave: '\u00F9',
        Ugrave: '\u00D9',
        uHar: '\u2963',
        uharl: '\u21BF',
        uharr: '\u21BE',
        uhblk: '\u2580',
        ulcorn: '\u231C',
        ulcorner: '\u231C',
        ulcrop: '\u230F',
        ultri: '\u25F8',
        umacr: '\u016B',
        Umacr: '\u016A',
        uml: '\u00A8',
        UnderBar: '_',
        UnderBrace: '\u23DF',
        UnderBracket: '\u23B5',
        UnderParenthesis: '\u23DD',
        Union: '\u22C3',
        UnionPlus: '\u228E',
        uogon: '\u0173',
        Uogon: '\u0172',
        uopf: '\uD835\uDD66',
        Uopf: '\uD835\uDD4C',
        uparrow: '\u2191',
        Uparrow: '\u21D1',
        UpArrow: '\u2191',
        UpArrowBar: '\u2912',
        UpArrowDownArrow: '\u21C5',
        updownarrow: '\u2195',
        Updownarrow: '\u21D5',
        UpDownArrow: '\u2195',
        UpEquilibrium: '\u296E',
        upharpoonleft: '\u21BF',
        upharpoonright: '\u21BE',
        uplus: '\u228E',
        UpperLeftArrow: '\u2196',
        UpperRightArrow: '\u2197',
        upsi: '\u03C5',
        Upsi: '\u03D2',
        upsih: '\u03D2',
        upsilon: '\u03C5',
        Upsilon: '\u03A5',
        UpTee: '\u22A5',
        UpTeeArrow: '\u21A5',
        upuparrows: '\u21C8',
        urcorn: '\u231D',
        urcorner: '\u231D',
        urcrop: '\u230E',
        uring: '\u016F',
        Uring: '\u016E',
        urtri: '\u25F9',
        uscr: '\uD835\uDCCA',
        Uscr: '\uD835\uDCB0',
        utdot: '\u22F0',
        utilde: '\u0169',
        Utilde: '\u0168',
        utri: '\u25B5',
        utrif: '\u25B4',
        uuarr: '\u21C8',
        uuml: '\u00FC',
        Uuml: '\u00DC',
        uwangle: '\u29A7',
        vangrt: '\u299C',
        varepsilon: '\u03F5',
        varkappa: '\u03F0',
        varnothing: '\u2205',
        varphi: '\u03D5',
        varpi: '\u03D6',
        varpropto: '\u221D',
        varr: '\u2195',
        vArr: '\u21D5',
        varrho: '\u03F1',
        varsigma: '\u03C2',
        varsubsetneq: '\u228A\uFE00',
        varsubsetneqq: '\u2ACB\uFE00',
        varsupsetneq: '\u228B\uFE00',
        varsupsetneqq: '\u2ACC\uFE00',
        vartheta: '\u03D1',
        vartriangleleft: '\u22B2',
        vartriangleright: '\u22B3',
        vBar: '\u2AE8',
        Vbar: '\u2AEB',
        vBarv: '\u2AE9',
        vcy: '\u0432',
        Vcy: '\u0412',
        vdash: '\u22A2',
        vDash: '\u22A8',
        Vdash: '\u22A9',
        VDash: '\u22AB',
        Vdashl: '\u2AE6',
        vee: '\u2228',
        Vee: '\u22C1',
        veebar: '\u22BB',
        veeeq: '\u225A',
        vellip: '\u22EE',
        verbar: '|',
        Verbar: '\u2016',
        vert: '|',
        Vert: '\u2016',
        VerticalBar: '\u2223',
        VerticalLine: '|',
        VerticalSeparator: '\u2758',
        VerticalTilde: '\u2240',
        VeryThinSpace: '\u200A',
        vfr: '\uD835\uDD33',
        Vfr: '\uD835\uDD19',
        vltri: '\u22B2',
        vnsub: '\u2282\u20D2',
        vnsup: '\u2283\u20D2',
        vopf: '\uD835\uDD67',
        Vopf: '\uD835\uDD4D',
        vprop: '\u221D',
        vrtri: '\u22B3',
        vscr: '\uD835\uDCCB',
        Vscr: '\uD835\uDCB1',
        vsubne: '\u228A\uFE00',
        vsubnE: '\u2ACB\uFE00',
        vsupne: '\u228B\uFE00',
        vsupnE: '\u2ACC\uFE00',
        Vvdash: '\u22AA',
        vzigzag: '\u299A',
        wcirc: '\u0175',
        Wcirc: '\u0174',
        wedbar: '\u2A5F',
        wedge: '\u2227',
        Wedge: '\u22C0',
        wedgeq: '\u2259',
        weierp: '\u2118',
        wfr: '\uD835\uDD34',
        Wfr: '\uD835\uDD1A',
        wopf: '\uD835\uDD68',
        Wopf: '\uD835\uDD4E',
        wp: '\u2118',
        wr: '\u2240',
        wreath: '\u2240',
        wscr: '\uD835\uDCCC',
        Wscr: '\uD835\uDCB2',
        xcap: '\u22C2',
        xcirc: '\u25EF',
        xcup: '\u22C3',
        xdtri: '\u25BD',
        xfr: '\uD835\uDD35',
        Xfr: '\uD835\uDD1B',
        xharr: '\u27F7',
        xhArr: '\u27FA',
        xi: '\u03BE',
        Xi: '\u039E',
        xlarr: '\u27F5',
        xlArr: '\u27F8',
        xmap: '\u27FC',
        xnis: '\u22FB',
        xodot: '\u2A00',
        xopf: '\uD835\uDD69',
        Xopf: '\uD835\uDD4F',
        xoplus: '\u2A01',
        xotime: '\u2A02',
        xrarr: '\u27F6',
        xrArr: '\u27F9',
        xscr: '\uD835\uDCCD',
        Xscr: '\uD835\uDCB3',
        xsqcup: '\u2A06',
        xuplus: '\u2A04',
        xutri: '\u25B3',
        xvee: '\u22C1',
        xwedge: '\u22C0',
        yacute: '\u00FD',
        Yacute: '\u00DD',
        yacy: '\u044F',
        YAcy: '\u042F',
        ycirc: '\u0177',
        Ycirc: '\u0176',
        ycy: '\u044B',
        Ycy: '\u042B',
        yen: '\u00A5',
        yfr: '\uD835\uDD36',
        Yfr: '\uD835\uDD1C',
        yicy: '\u0457',
        YIcy: '\u0407',
        yopf: '\uD835\uDD6A',
        Yopf: '\uD835\uDD50',
        yscr: '\uD835\uDCCE',
        Yscr: '\uD835\uDCB4',
        yucy: '\u044E',
        YUcy: '\u042E',
        yuml: '\u00FF',
        Yuml: '\u0178',
        zacute: '\u017A',
        Zacute: '\u0179',
        zcaron: '\u017E',
        Zcaron: '\u017D',
        zcy: '\u0437',
        Zcy: '\u0417',
        zdot: '\u017C',
        Zdot: '\u017B',
        zeetrf: '\u2128',
        ZeroWidthSpace: '\u200B',
        zeta: '\u03B6',
        Zeta: '\u0396',
        zfr: '\uD835\uDD37',
        Zfr: '\u2128',
        zhcy: '\u0436',
        ZHcy: '\u0416',
        zigrarr: '\u21DD',
        zopf: '\uD835\uDD6B',
        Zopf: '\u2124',
        zscr: '\uD835\uDCCF',
        Zscr: '\uD835\uDCB5',
        zwj: '\u200D',
        zwnj: '\u200C',
      };
      const decodeMapLegacy = {
        aacute: '\u00E1',
        Aacute: '\u00C1',
        acirc: '\u00E2',
        Acirc: '\u00C2',
        acute: '\u00B4',
        aelig: '\u00E6',
        AElig: '\u00C6',
        agrave: '\u00E0',
        Agrave: '\u00C0',
        amp: '&',
        AMP: '&',
        aring: '\u00E5',
        Aring: '\u00C5',
        atilde: '\u00E3',
        Atilde: '\u00C3',
        auml: '\u00E4',
        Auml: '\u00C4',
        brvbar: '\u00A6',
        ccedil: '\u00E7',
        Ccedil: '\u00C7',
        cedil: '\u00B8',
        cent: '\u00A2',
        copy: '\u00A9',
        COPY: '\u00A9',
        curren: '\u00A4',
        deg: '\u00B0',
        divide: '\u00F7',
        eacute: '\u00E9',
        Eacute: '\u00C9',
        ecirc: '\u00EA',
        Ecirc: '\u00CA',
        egrave: '\u00E8',
        Egrave: '\u00C8',
        eth: '\u00F0',
        ETH: '\u00D0',
        euml: '\u00EB',
        Euml: '\u00CB',
        frac12: '\u00BD',
        frac14: '\u00BC',
        frac34: '\u00BE',
        gt: '>',
        GT: '>',
        iacute: '\u00ED',
        Iacute: '\u00CD',
        icirc: '\u00EE',
        Icirc: '\u00CE',
        iexcl: '\u00A1',
        igrave: '\u00EC',
        Igrave: '\u00CC',
        iquest: '\u00BF',
        iuml: '\u00EF',
        Iuml: '\u00CF',
        laquo: '\u00AB',
        lt: '<',
        LT: '<',
        macr: '\u00AF',
        micro: '\u00B5',
        middot: '\u00B7',
        nbsp: '\u00A0',
        not: '\u00AC',
        ntilde: '\u00F1',
        Ntilde: '\u00D1',
        oacute: '\u00F3',
        Oacute: '\u00D3',
        ocirc: '\u00F4',
        Ocirc: '\u00D4',
        ograve: '\u00F2',
        Ograve: '\u00D2',
        ordf: '\u00AA',
        ordm: '\u00BA',
        oslash: '\u00F8',
        Oslash: '\u00D8',
        otilde: '\u00F5',
        Otilde: '\u00D5',
        ouml: '\u00F6',
        Ouml: '\u00D6',
        para: '\u00B6',
        plusmn: '\u00B1',
        pound: '\u00A3',
        quot: '"',
        QUOT: '"',
        raquo: '\u00BB',
        reg: '\u00AE',
        REG: '\u00AE',
        sect: '\u00A7',
        shy: '\u00AD',
        sup1: '\u00B9',
        sup2: '\u00B2',
        sup3: '\u00B3',
        szlig: '\u00DF',
        thorn: '\u00FE',
        THORN: '\u00DE',
        times: '\u00D7',
        uacute: '\u00FA',
        Uacute: '\u00DA',
        ucirc: '\u00FB',
        Ucirc: '\u00DB',
        ugrave: '\u00F9',
        Ugrave: '\u00D9',
        uml: '\u00A8',
        uuml: '\u00FC',
        Uuml: '\u00DC',
        yacute: '\u00FD',
        Yacute: '\u00DD',
        yen: '\u00A5',
        yuml: '\xFF',
      };
      const decodeMapNumeric = {
        0: '\uFFFD',
        128: '\u20AC',
        130: '\u201A',
        131: '\u0192',
        132: '\u201E',
        133: '\u2026',
        134: '\u2020',
        135: '\u2021',
        136: '\u02C6',
        137: '\u2030',
        138: '\u0160',
        139: '\u2039',
        140: '\u0152',
        142: '\u017D',
        145: '\u2018',
        146: '\u2019',
        147: '\u201C',
        148: '\u201D',
        149: '\u2022',
        150: '\u2013',
        151: '\u2014',
        152: '\u02DC',
        153: '\u2122',
        154: '\u0161',
        155: '\u203A',
        156: '\u0153',
        158: '\u017E',
        159: '\u0178',
      };
      let invalidReferenceCodePoints = [
        1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
        24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134,
        135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148,
        149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977,
        64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987,
        64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997,
        64998, 64999, 65000, 65001, 65002, 65003, 65004, 65005, 65006, 65007,
        65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678,
        327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823,
        655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502,
        917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111,
      ];
      /*--------------------------------------------------------------------------*/

      const stringFromCharCode = String.fromCharCode;
      let object = {};
      const hasOwnProperty = object.hasOwnProperty;

      const has = function has(object, propertyName) {
        return hasOwnProperty.call(object, propertyName);
      };

      const contains = function contains(array, value) {
        let index = -1;
        let length = array.length;

        while (++index < length) {
          if (array[index] == value) {
            return true;
          }
        }

        return false;
      };

      const merge = function merge(options, defaults) {
        if (!options) {
          return defaults;
        }

        let result = {};
        var key;

        for (key in defaults) {
          // A `hasOwnProperty` check is not needed here, since only recognized
          // option names are used anyway. Any others are ignored.
          result[key] = has(options, key) ? options[key] : defaults[key];
        }

        return result;
      }; // Modified version of `ucs2encode`; see https://mths.be/punycode.

      const codePointToSymbol = function codePointToSymbol(codePoint, strict) {
        let output = '';

        if (
          (codePoint >= 0xd800 && codePoint <= 0xdfff) ||
          codePoint > 0x10ffff
        ) {
          // See issue #4:
          // “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
          // greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
          // REPLACEMENT CHARACTER.”
          if (strict) {
            parseError(
              'character reference outside the permissible Unicode range',
            );
          }

          return '\uFFFD';
        }

        if (has(decodeMapNumeric, codePoint)) {
          if (strict) {
            parseError('disallowed character reference');
          }

          return decodeMapNumeric[codePoint];
        }

        if (strict && contains(invalidReferenceCodePoints, codePoint)) {
          parseError('disallowed character reference');
        }

        if (codePoint > 0xffff) {
          codePoint -= 0x10000;
          output += stringFromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
          codePoint = 0xdc00 | (codePoint & 0x3ff);
        }

        output += stringFromCharCode(codePoint);
        return output;
      };

      const hexEscape = function hexEscape(codePoint) {
        return `&#x${  codePoint.toString(16).toUpperCase()  };`;
      };

      const decEscape = function decEscape(codePoint) {
        return `&#${  codePoint  };`;
      };

      var parseError = function parseError(message) {
        throw new Error(`Parse error: ${message}`);
      };
      /*--------------------------------------------------------------------------*/

      const encode = function encode(string, options) {
        options = merge(options, encode.options);
        let strict = options.strict;

        if (strict && regexInvalidRawCodePoint.test(string)) {
          parseError('forbidden code point');
        }

        let encodeEverything = options.encodeEverything;
        var useNamedReferences = options.useNamedReferences;
        let allowUnsafeSymbols = options.allowUnsafeSymbols;
        let escapeCodePoint = options.decimal ? decEscape : hexEscape;

        let escapeBmpSymbol = function escapeBmpSymbol(symbol) {
          return escapeCodePoint(symbol.charCodeAt(0));
        };

        if (encodeEverything) {
          // Encode ASCII symbols.
          string = string.replace(regexAsciiWhitelist, (symbol) => {
            // Use named references if requested & possible.
            if (useNamedReferences && has(encodeMap, symbol)) {
              return `&${  encodeMap[symbol]  };`;
            }

            return escapeBmpSymbol(symbol);
          }); // Shorten a few escapes that represent two symbols, of which at least one
          // is within the ASCII range.

          if (useNamedReferences) {
            string = string
              .replace(/&gt;\u20D2/g, '&nvgt;')
              .replace(/&lt;\u20D2/g, '&nvlt;')
              .replaceAll('&#x66;&#x6A;', '&fjlig;');
          } // Encode non-ASCII symbols.

          if (useNamedReferences) {
            // Encode non-ASCII symbols that can be replaced with a named reference.
            string = string.replace(regexEncodeNonAscii, (string) => {
              // Note: there is no need to check `has(encodeMap, string)` here.
              return `&${  encodeMap[string]  };`;
            });
          } // Note: any remaining non-ASCII symbols are handled outside of the `if`.
        } else if (useNamedReferences) {
          // Apply named character references.
          // Encode `<>"'&` using named character references.
          if (!allowUnsafeSymbols) {
            string = string.replace(regexEscape, (string) => {
              return `&${  encodeMap[string]  };`; // no need to check `has()` here
            });
          } // Shorten escapes that represent two symbols, of which at least one is
          // `<>"'&`.

          string = string
            .replace(/&gt;\u20D2/g, '&nvgt;')
            .replace(/&lt;\u20D2/g, '&nvlt;'); // Encode non-ASCII symbols that can be replaced with a named reference.

          string = string.replace(regexEncodeNonAscii, (string) => {
            // Note: there is no need to check `has(encodeMap, string)` here.
            return `&${  encodeMap[string]  };`;
          });
        } else if (!allowUnsafeSymbols) {
          // Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
          // using named character references.
          string = string.replace(regexEscape, escapeBmpSymbol);
        }

        return (
          string // Encode astral symbols.
            .replace(regexAstralSymbols, ($0) => {
              // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
              let high = $0.charCodeAt(0);
              var low = $0.charCodeAt(1);
              var codePoint = (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;
              return escapeCodePoint(codePoint);
            }) // Encode any remaining BMP symbols that are not printable ASCII symbols
            // using a hexadecimal escape.
            .replace(regexBmpWhitelist, escapeBmpSymbol)
        );
      }; // Expose default options (so they can be overridden globally).

      encode.options = {
        allowUnsafeSymbols: false,
        encodeEverything: false,
        strict: false,
        useNamedReferences: false,
        decimal: false,
      };

      const decode = function decode(html, options) {
        options = merge(options, decode.options);
        let strict = options.strict;

        if (strict && regexInvalidEntity.test(html)) {
          parseError('malformed character reference');
        }

        return html.replace(
          regexDecode,
          ($0, $1, $2, $3, $4, $5, $6, $7, $8) => {
            var codePoint;
            let semicolon;
            let decDigits;
            let hexDigits;
            let reference;
            let next;

            if ($1) {
              reference = $1; // Note: there is no need to check `has(decodeMap, reference)`.

              return decodeMap[reference];
            }

            if ($2) {
              // Decode named character references without trailing `;`, e.g. `&amp`.
              // This is only a parse error if it gets converted to `&`, or if it is
              // followed by `=` in an attribute context.
              reference = $2;
              next = $3;

              if (next && options.isAttributeValue) {
                if (strict && next == '=') {
                  parseError('`&` did not start a character reference');
                }

                return $0;
              } else {
                if (strict) {
                  parseError(
                    'named character reference was not terminated by a semicolon',
                  );
                } // Note: there is no need to check `has(decodeMapLegacy, reference)`.

                return decodeMapLegacy[reference] + (next || '');
              }
            }

            if ($4) {
              // Decode decimal escapes, e.g. `&#119558;`.
              decDigits = $4;
              semicolon = $5;

              if (strict && !semicolon) {
                parseError(
                  'character reference was not terminated by a semicolon',
                );
              }

              codePoint = Number.parseInt(decDigits, 10);
              return codePointToSymbol(codePoint, strict);
            }

            if ($6) {
              // Decode hexadecimal escapes, e.g. `&#x1D306;`.
              hexDigits = $6;
              semicolon = $7;

              if (strict && !semicolon) {
                parseError(
                  'character reference was not terminated by a semicolon',
                );
              }

              codePoint = Number.parseInt(hexDigits, 16);
              return codePointToSymbol(codePoint, strict);
            } // If we’re still here, `if ($7)` is implied; it’s an ambiguous
            // ampersand for sure. https://mths.be/notes/ambiguous-ampersands

            if (strict) {
              parseError(
                'named character reference was not terminated by a semicolon',
              );
            }

            return $0;
          },
        );
      }; // Expose default options (so they can be overridden globally).

      decode.options = {
        isAttributeValue: false,
        strict: false,
      };

      const escape = function escape(string) {
        return string.replace(regexEscape, ($0) => {
          // Note: there is no need to check `has(escapeMap, $0)` here.
          return escapeMap[$0];
        });
      };
      /*--------------------------------------------------------------------------*/

      const he = {
        version: '1.2.0',
        encode: encode,
        decode: decode,
        escape: escape,
        unescape: decode,
      }; // Some AMD build optimizers, like r.js, check for specific condition patterns
      // like the following:

      if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          // in Node.js, io.js, or RingoJS v0.8.0+
          freeModule.exports = he;
        } else {
          // in Narwhal or RingoJS v0.7.0-
          for (const key in he) {
            has(he, key) && (freeExports[key] = he[key]);
          }
        }
      } else {
        // in Rhino or a web browser
        root.he = he;
      }
    })(commonjsGlobal);
  });

  const propertyIsEnumerable = objectPropertyIsEnumerable.f;

  // `Object.{ entries, values }` methods implementation
  const createMethod$5 = function (TO_ENTRIES) {
    return function (it) {
      const O = toIndexedObject(it);
      const keys = objectKeys(O);
      let length = keys.length;
      let i = 0;
      const result = [];
      let key;
      while (length > i) {
        key = keys[i++];
        if (!descriptors || propertyIsEnumerable.call(O, key)) {
          result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
        }
      }
      return result;
    };
  };

  const objectToArray = {
    // `Object.entries` method
    // https://tc39.es/ecma262/#sec-object.entries
    entries: createMethod$5(true),
    // `Object.values` method
    // https://tc39.es/ecma262/#sec-object.values
    values: createMethod$5(false),
  };

  const $values = objectToArray.values;

  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  _export(
    { target: 'Object', stat: true },
    {
      values: function values(O) {
        return $values(O);
      },
    },
  );

  const format$1 = util.format;
  /**
   * Contains error codes, factory functions to create throwable error objects,
   * and warning/deprecation functions.
   * @module
   */

  /**
   * process.emitWarning or a polyfill
   * @see https://nodejs.org/api/process.html#process_process_emitwarning_warning_options
   * @ignore
   */

  const emitWarning$1 = function emitWarning(msg, type) {
    if (process$1.emitWarning) {
      process$1.emitWarning(msg, type);
    } else {
      /* istanbul ignore next */
      nextTick(() => {
        console.warn(`${type}: ${msg}`);
      });
    }
  };
  /**
   * Show a deprecation warning. Each distinct message is only displayed once.
   * Ignores empty messages.
   *
   * @param {string} [msg] - Warning to print
   * @private
   */

  const deprecate$1 = function deprecate(msg) {
    msg = String(msg);

    if (msg && !deprecate.cache[msg]) {
      deprecate.cache[msg] = true;
      emitWarning$1(msg, 'DeprecationWarning');
    }
  };

  deprecate$1.cache = {};
  /**
   * Show a generic warning.
   * Ignores empty messages.
   *
   * @param {string} [msg] - Warning to print
   * @private
   */

  const warn = function warn(msg) {
    if (msg) {
      emitWarning$1(msg);
    }
  };
  /**
   * When Mocha throws exceptions (or rejects `Promise`s), it attempts to assign a `code` property to the `Error` object, for easier handling. These are the potential values of `code`.
   * @public
   * @namespace
   * @memberof module:lib/errors
   */

  const constants = {
    /**
     * An unrecoverable error.
     * @constant
     * @default
     */
    FATAL: 'ERR_MOCHA_FATAL',

    /**
     * The type of an argument to a function call is invalid
     * @constant
     * @default
     */
    INVALID_ARG_TYPE: 'ERR_MOCHA_INVALID_ARG_TYPE',

    /**
     * The value of an argument to a function call is invalid
     * @constant
     * @default
     */
    INVALID_ARG_VALUE: 'ERR_MOCHA_INVALID_ARG_VALUE',

    /**
     * Something was thrown, but it wasn't an `Error`
     * @constant
     * @default
     */
    INVALID_EXCEPTION: 'ERR_MOCHA_INVALID_EXCEPTION',

    /**
     * An interface (e.g., `Mocha.interfaces`) is unknown or invalid
     * @constant
     * @default
     */
    INVALID_INTERFACE: 'ERR_MOCHA_INVALID_INTERFACE',

    /**
     * A reporter (.e.g, `Mocha.reporters`) is unknown or invalid
     * @constant
     * @default
     */
    INVALID_REPORTER: 'ERR_MOCHA_INVALID_REPORTER',

    /**
     * `done()` was called twice in a `Test` or `Hook` callback
     * @constant
     * @default
     */
    MULTIPLE_DONE: 'ERR_MOCHA_MULTIPLE_DONE',

    /**
     * No files matched the pattern provided by the user
     * @constant
     * @default
     */
    NO_FILES_MATCH_PATTERN: 'ERR_MOCHA_NO_FILES_MATCH_PATTERN',

    /**
     * Known, but unsupported behavior of some kind
     * @constant
     * @default
     */
    UNSUPPORTED: 'ERR_MOCHA_UNSUPPORTED',

    /**
     * Invalid state transition occurring in `Mocha` instance
     * @constant
     * @default
     */
    INSTANCE_ALREADY_RUNNING: 'ERR_MOCHA_INSTANCE_ALREADY_RUNNING',

    /**
     * Invalid state transition occurring in `Mocha` instance
     * @constant
     * @default
     */
    INSTANCE_ALREADY_DISPOSED: 'ERR_MOCHA_INSTANCE_ALREADY_DISPOSED',

    /**
     * Use of `only()` w/ `--forbid-only` results in this error.
     * @constant
     * @default
     */
    FORBIDDEN_EXCLUSIVITY: 'ERR_MOCHA_FORBIDDEN_EXCLUSIVITY',

    /**
     * To be thrown when a user-defined plugin implementation (e.g., `mochaHooks`) is invalid
     * @constant
     * @default
     */
    INVALID_PLUGIN_IMPLEMENTATION: 'ERR_MOCHA_INVALID_PLUGIN_IMPLEMENTATION',

    /**
     * To be thrown when a builtin or third-party plugin definition (the _definition_ of `mochaHooks`) is invalid
     * @constant
     * @default
     */
    INVALID_PLUGIN_DEFINITION: 'ERR_MOCHA_INVALID_PLUGIN_DEFINITION',

    /**
     * When a runnable exceeds its allowed run time.
     * @constant
     * @default
     */
    TIMEOUT: 'ERR_MOCHA_TIMEOUT',
  };
  /**
   * A set containing all string values of all Mocha error constants, for use by {@link isMochaError}.
   * @private
   */

  const MOCHA_ERRORS = new Set(Object.values(constants));
  /**
   * Creates an error object to be thrown when no files to be tested could be found using specified pattern.
   *
   * @public
   * @static
   * @param {string} message - Error message to be displayed.
   * @param {string} pattern - User-specified argument value.
   * @returns {Error} instance detailing the error condition
   */

  function createNoFilesMatchPatternError(message, pattern) {
    const err = new Error(message);
    err.code = constants.NO_FILES_MATCH_PATTERN;
    err.pattern = pattern;
    return err;
  }
  /**
   * Creates an error object to be thrown when the reporter specified in the options was not found.
   *
   * @public
   * @param {string} message - Error message to be displayed.
   * @param {string} reporter - User-specified reporter value.
   * @returns {Error} instance detailing the error condition
   */

  function createInvalidReporterError(message, reporter) {
    const err = new TypeError(message);
    err.code = constants.INVALID_REPORTER;
    err.reporter = reporter;
    return err;
  }
  /**
   * Creates an error object to be thrown when the interface specified in the options was not found.
   *
   * @public
   * @static
   * @param {string} message - Error message to be displayed.
   * @param {string} ui - User-specified interface value.
   * @returns {Error} instance detailing the error condition
   */

  function createInvalidInterfaceError(message, ui) {
    const err = new Error(message);
    err.code = constants.INVALID_INTERFACE;
    err['interface'] = ui;
    return err;
  }
  /**
   * Creates an error object to be thrown when a behavior, option, or parameter is unsupported.
   *
   * @public
   * @static
   * @param {string} message - Error message to be displayed.
   * @returns {Error} instance detailing the error condition
   */

  function createUnsupportedError(message) {
    const err = new Error(message);
    err.code = constants.UNSUPPORTED;
    return err;
  }
  /**
   * Creates an error object to be thrown when an argument is missing.
   *
   * @public
   * @static
   * @param {string} message - Error message to be displayed.
   * @param {string} argument - Argument name.
   * @param {string} expected - Expected argument datatype.
   * @returns {Error} instance detailing the error condition
   */

  function createMissingArgumentError(message, argument, expected) {
    return createInvalidArgumentTypeError(message, argument, expected);
  }
  /**
   * Creates an error object to be thrown when an argument did not use the supported type
   *
   * @public
   * @static
   * @param {string} message - Error message to be displayed.
   * @param {string} argument - Argument name.
   * @param {string} expected - Expected argument datatype.
   * @returns {Error} instance detailing the error condition
   */

  function createInvalidArgumentTypeError(message, argument, expected) {
    const err = new TypeError(message);
    err.code = constants.INVALID_ARG_TYPE;
    err.argument = argument;
    err.expected = expected;
    err.actual = _typeof(argument);
    return err;
  }
  /**
   * Creates an error object to be thrown when an argument did not use the supported value
   *
   * @public
   * @static
   * @param {string} message - Error message to be displayed.
   * @param {string} argument - Argument name.
   * @param {string} value - Argument value.
   * @param {string} [reason] - Why value is invalid.
   * @returns {Error} instance detailing the error condition
   */

  function createInvalidArgumentValueError(message, argument, value, reason) {
    const err = new TypeError(message);
    err.code = constants.INVALID_ARG_VALUE;
    err.argument = argument;
    err.value = value;
    err.reason = typeof reason !== 'undefined' ? reason : 'is invalid';
    return err;
  }
  /**
   * Creates an error object to be thrown when an exception was caught, but the `Error` is falsy or undefined.
   *
   * @public
   * @static
   * @param {string} message - Error message to be displayed.
   * @returns {Error} instance detailing the error condition
   */

  function createInvalidExceptionError(message, value) {
    const err = new Error(message);
    err.code = constants.INVALID_EXCEPTION;
    err.valueType = _typeof(value);
    err.value = value;
    return err;
  }
  /**
   * Creates an error object to be thrown when an unrecoverable error occurs.
   *
   * @public
   * @static
   * @param {string} message - Error message to be displayed.
   * @returns {Error} instance detailing the error condition
   */

  function createFatalError(message, value) {
    const err = new Error(message);
    err.code = constants.FATAL;
    err.valueType = _typeof(value);
    err.value = value;
    return err;
  }
  /**
   * Dynamically creates a plugin-type-specific error based on plugin type
   * @param {string} message - Error message
   * @param {"reporter"|"interface"} pluginType - Plugin type. Future: expand as needed
   * @param {string} [pluginId] - Name/path of plugin, if any
   * @throws When `pluginType` is not known
   * @public
   * @static
   * @returns {Error}
   */

  function createInvalidLegacyPluginError(message, pluginType, pluginId) {
    switch (pluginType) {
      case 'reporter':
        return createInvalidReporterError(message, pluginId);

      case 'interface':
        return createInvalidInterfaceError(message, pluginId);

      default:
        throw new Error(`unknown pluginType "${pluginType}"`);
    }
  }
  /**
   * **DEPRECATED**.  Use {@link createInvalidLegacyPluginError} instead  Dynamically creates a plugin-type-specific error based on plugin type
   * @deprecated
   * @param {string} message - Error message
   * @param {"reporter"|"interface"} pluginType - Plugin type. Future: expand as needed
   * @param {string} [pluginId] - Name/path of plugin, if any
   * @throws When `pluginType` is not known
   * @public
   * @static
   * @returns {Error}
   */

  function createInvalidPluginError() {
    deprecate$1('Use createInvalidLegacyPluginError() instead');
    return createInvalidLegacyPluginError.apply(void 0, arguments);
  }
  /**
   * Creates an error object to be thrown when a mocha object's `run` method is executed while it is already disposed.
   * @param {string} message The error message to be displayed.
   * @param {boolean} cleanReferencesAfterRun the value of `cleanReferencesAfterRun`
   * @param {Mocha} instance the mocha instance that throw this error
   * @static
   */

  function createMochaInstanceAlreadyDisposedError(
    message,
    cleanReferencesAfterRun,
    instance,
  ) {
    const err = new Error(message);
    err.code = constants.INSTANCE_ALREADY_DISPOSED;
    err.cleanReferencesAfterRun = cleanReferencesAfterRun;
    err.instance = instance;
    return err;
  }
  /**
   * Creates an error object to be thrown when a mocha object's `run` method is called while a test run is in progress.
   * @param {string} message The error message to be displayed.
   * @static
   * @public
   */

  function createMochaInstanceAlreadyRunningError(message, instance) {
    const err = new Error(message);
    err.code = constants.INSTANCE_ALREADY_RUNNING;
    err.instance = instance;
    return err;
  }
  /**
   * Creates an error object to be thrown when done() is called multiple times in a test
   *
   * @public
   * @param {Runnable} runnable - Original runnable
   * @param {Error} [originalErr] - Original error, if any
   * @returns {Error} instance detailing the error condition
   * @static
   */

  function createMultipleDoneError(runnable, originalErr) {
    let title;

    try {
      title = format$1('<%s>', runnable.fullTitle());

      if (runnable.parent.root) {
        title += ' (of root suite)';
      }
    } catch {
      title = format$1('<%s> (of unknown suite)', runnable.title);
    }

    let message = format$1(
      'done() called multiple times in %s %s',
      runnable.type ? runnable.type : 'unknown runnable',
      title,
    );

    if (runnable.file) {
      message += format$1(' of file %s', runnable.file);
    }

    if (originalErr) {
      message += format$1(
        '; in addition, done() received error: %s',
        originalErr,
      );
    }

    const err = new Error(message);
    err.code = constants.MULTIPLE_DONE;
    err.valueType = _typeof(originalErr);
    err.value = originalErr;
    return err;
  }
  /**
   * Creates an error object to be thrown when `.only()` is used with
   * `--forbid-only`.
   * @static
   * @public
   * @param {Mocha} mocha - Mocha instance
   * @returns {Error} Error with code {@link constants.FORBIDDEN_EXCLUSIVITY}
   */

  function createForbiddenExclusivityError(mocha) {
    const err = new Error(
      mocha.isWorker
        ? '`.only` is not supported in parallel mode'
        : '`.only` forbidden by --forbid-only',
    );
    err.code = constants.FORBIDDEN_EXCLUSIVITY;
    return err;
  }
  /**
   * Creates an error object to be thrown when a plugin definition is invalid
   * @static
   * @param {string} msg - Error message
   * @param {PluginDefinition} [pluginDef] - Problematic plugin definition
   * @public
   * @returns {Error} Error with code {@link constants.INVALID_PLUGIN_DEFINITION}
   */

  function createInvalidPluginDefinitionError(msg, pluginDef) {
    const err = new Error(msg);
    err.code = constants.INVALID_PLUGIN_DEFINITION;
    err.pluginDef = pluginDef;
    return err;
  }
  /**
   * Creates an error object to be thrown when a plugin implementation (user code) is invalid
   * @static
   * @param {string} msg - Error message
   * @param {Object} [opts] - Plugin definition and user-supplied implementation
   * @param {PluginDefinition} [opts.pluginDef] - Plugin Definition
   * @param {*} [opts.pluginImpl] - Plugin Implementation (user-supplied)
   * @public
   * @returns {Error} Error with code {@link constants.INVALID_PLUGIN_DEFINITION}
   */

  function createInvalidPluginImplementationError(msg) {
    const _ref =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      pluginDef = _ref.pluginDef,
      pluginImpl = _ref.pluginImpl;

    const err = new Error(msg);
    err.code = constants.INVALID_PLUGIN_IMPLEMENTATION;
    err.pluginDef = pluginDef;
    err.pluginImpl = pluginImpl;
    return err;
  }
  /**
   * Creates an error object to be thrown when a runnable exceeds its allowed run time.
   * @static
   * @param {string} msg - Error message
   * @param {number} [timeout] - Timeout in ms
   * @param {string} [file] - File, if given
   * @returns {MochaTimeoutError}
   */

  function createTimeoutError(msg, timeout, file) {
    const err = new Error(msg);
    err.code = constants.TIMEOUT;
    err.timeout = timeout;
    err.file = file;
    return err;
  }
  /**
   * Returns `true` if an error came out of Mocha.
   * _Can suffer from false negatives, but not false positives._
   * @static
   * @public
   * @param {*} err - Error, or anything
   * @returns {boolean}
   */

  const isMochaError = function isMochaError(err) {
    return Boolean(
      err && _typeof(err) === 'object' && MOCHA_ERRORS.has(err.code),
    );
  };

  const errors = {
    constants,
    createFatalError,
    createForbiddenExclusivityError,
    createInvalidArgumentTypeError,
    createInvalidArgumentValueError,
    createInvalidExceptionError,
    createInvalidInterfaceError,
    createInvalidLegacyPluginError,
    createInvalidPluginDefinitionError,
    createInvalidPluginError,
    createInvalidPluginImplementationError,
    createInvalidReporterError,
    createMissingArgumentError,
    createMochaInstanceAlreadyDisposedError,
    createMochaInstanceAlreadyRunningError,
    createMultipleDoneError,
    createNoFilesMatchPatternError,
    createTimeoutError,
    createUnsupportedError,
    deprecate: deprecate$1,
    isMochaError,
    warn,
  };

  const _nodeResolve_empty = {};

  const _nodeResolve_empty$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: _nodeResolve_empty,
  });

  const require$$11 = getCjsExportFromNamespace(_nodeResolve_empty$1);

  const utils = createCommonjsModule((module, exports) => {
    /**
     * Various utility functions used throughout Mocha's codebase.
     * @module utils
     */

    /**
     * Module dependencies.
     */

    const nanoid = nonSecure.nanoid;
    const MOCHA_ID_PROP_NAME = '__mocha_id__';
    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * @param {function} ctor - Constructor function which needs to inherit the
     *     prototype.
     * @param {function} superCtor - Constructor function to inherit prototype from.
     * @throws {TypeError} if either constructor is null, or if super constructor
     *     lacks a prototype.
     */

    exports.inherits = util.inherits;
    /**
     * Escape special characters in the given string of html.
     *
     * @private
     * @param  {string} html
     * @return {string}
     */

    exports.escape = function (html) {
      return he.encode(String(html), {
        useNamedReferences: false,
      });
    };
    /**
     * Test if the given obj is type of string.
     *
     * @private
     * @param {Object} obj
     * @return {boolean}
     */

    exports.isString = function (obj) {
      return typeof obj === 'string';
    };
    /**
     * Compute a slug from the given `str`.
     *
     * @private
     * @param {string} str
     * @return {string}
     */

    exports.slug = function (str) {
      return str
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/-{2,}/g, '-');
    };
    /**
     * Strip the function definition from `str`, and re-indent for pre whitespace.
     *
     * @param {string} str
     * @return {string}
     */

    exports.clean = function (str) {
      str = str
        .replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
        .replace(/^\uFEFF/, '') // (traditional)->  space/name     parameters    body     (lambda)-> parameters       body   multi-statement/single          keep body content
        .replace(
          /^function(?:\s*|\s+[^(]*)\([^)]*\)\s*{((?:.|\n)*?)\s*}$|^\([^)]*\)\s*=>\s*(?:{((?:.|\n)*?)\s*}|((?:.|\n)*))$/,
          '$1$2$3',
        );
      const spaces = str.match(/^\n?( *)/)[1].length;
      const tabs = str.match(/^\n?(\t*)/)[1].length;
      let re = new RegExp(
        `^\n?${  tabs ? '\t' : ' '  }{${  tabs || spaces  }}`,
        'gm',
      );
      str = str.replace(re, '');
      return str.trim();
    };
    /**
     * If a value could have properties, and has none, this function is called,
     * which returns a string representation of the empty value.
     *
     * Functions w/ no properties return `'[Function]'`
     * Arrays w/ length === 0 return `'[]'`
     * Objects w/ no properties return `'{}'`
     * All else: return result of `value.toString()`
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} typeHint The type of the value
     * @returns {string}
     */

    function emptyRepresentation(value, typeHint) {
      switch (typeHint) {
        case 'function':
          return '[Function]';

        case 'object':
          return '{}';

        case 'array':
          return '[]';

        default:
          return value.toString();
      }
    }
    /**
     * Takes some variable and asks `Object.prototype.toString()` what it thinks it
     * is.
     *
     * @private
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
     * @param {*} value The value to test.
     * @returns {string} Computed type
     * @example
     * canonicalType({}) // 'object'
     * canonicalType([]) // 'array'
     * canonicalType(1) // 'number'
     * canonicalType(false) // 'boolean'
     * canonicalType(Infinity) // 'number'
     * canonicalType(null) // 'null'
     * canonicalType(new Date()) // 'date'
     * canonicalType(/foo/) // 'regexp'
     * canonicalType('type') // 'string'
     * canonicalType(global) // 'global'
     * canonicalType(new String('foo') // 'object'
     * canonicalType(async function() {}) // 'asyncfunction'
     * canonicalType(await import(name)) // 'module'
     */

    let canonicalType = (exports.canonicalType = function canonicalType(value) {
      if (value === undefined) {
        return 'undefined';
      } else if (value === null) {
        return 'null';
      } else if (isBuffer(value)) {
        return 'buffer';
      }

      return Object.prototype.toString
        .call(value)
        .replace(/^\[.+\s(.+?)]$/, '$1')
        .toLowerCase();
    });
    /**
     *
     * Returns a general type or data structure of a variable
     * @private
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
     * @param {*} value The value to test.
     * @returns {string} One of undefined, boolean, number, string, bigint, symbol, object
     * @example
     * type({}) // 'object'
     * type([]) // 'array'
     * type(1) // 'number'
     * type(false) // 'boolean'
     * type(Infinity) // 'number'
     * type(null) // 'null'
     * type(new Date()) // 'object'
     * type(/foo/) // 'object'
     * type('type') // 'string'
     * type(global) // 'object'
     * type(new String('foo') // 'string'
     */

    exports.type = function type(value) {
      // Null is special
      if (value === null) return 'null';
      let primitives = new Set([
        'undefined',
        'boolean',
        'number',
        'string',
        'bigint',
        'symbol',
      ]);

      const _type = _typeof(value);

      if (_type === 'function') return _type;
      if (primitives.has(_type)) return _type;
      if (value instanceof String) return 'string';
      if (value instanceof Error) return 'error';
      if (Array.isArray(value)) return 'array';
      return _type;
    };
    /**
     * Stringify `value`. Different behavior depending on type of value:
     *
     * - If `value` is undefined or null, return `'[undefined]'` or `'[null]'`, respectively.
     * - If `value` is not an object, function or array, return result of `value.toString()` wrapped in double-quotes.
     * - If `value` is an *empty* object, function, or array, return result of function
     *   {@link emptyRepresentation}.
     * - If `value` has properties, call {@link exports.canonicalize} on it, then return result of
     *   JSON.stringify().
     *
     * @private
     * @see exports.type
     * @param {*} value
     * @return {string}
     */

    exports.stringify = function (value) {
      let typeHint = canonicalType(value);

      if (!~['object', 'array', 'function'].indexOf(typeHint)) {
        if (typeHint === 'buffer') {
          const json = Buffer.prototype.toJSON.call(value); // Based on the toJSON result

          return jsonStringify(
            json.data && json.type ? json.data : json,
            2,
          ).replace(/,(\n|$)/g, '$1');
        } // IE7/IE8 has a bizarre String constructor; needs to be coerced
        // into an array and back to obj.

        if (typeHint === 'string' && _typeof(value) === 'object') {
          value = value.split('').reduce((acc, _char, idx) => {
            acc[idx] = _char;
            return acc;
          }, {});
          typeHint = 'object';
        } else {
          return jsonStringify(value);
        }
      }

      for (const prop in value) {
        if (Object.prototype.hasOwnProperty.call(value, prop)) {
          return jsonStringify(
            exports.canonicalize(value, null, typeHint),
            2,
          ).replace(/,(\n|$)/g, '$1');
        }
      }

      return emptyRepresentation(value, typeHint);
    };
    /**
     * like JSON.stringify but more sense.
     *
     * @private
     * @param {Object}  object
     * @param {number=} spaces
     * @param {number=} depth
     * @returns {*}
     */

    function jsonStringify(object, spaces, depth) {
      if (typeof spaces === 'undefined') {
        // primitive types
        return _stringify(object);
      }

      depth = depth || 1;
      let space = spaces * depth;
      let str = Array.isArray(object) ? '[' : '{';
      let end = Array.isArray(object) ? ']' : '}';
      let length =
        typeof object.length === 'number'
          ? object.length
          : Object.keys(object).length; // `.repeat()` polyfill

      function repeat(s, n) {
        return new Array(n).join(s);
      }

      function _stringify(val) {
        switch (canonicalType(val)) {
          case 'null':
          case 'undefined':
            val = `[${val}]`;
            break;

          case 'array':
          case 'object':
            val = jsonStringify(val, spaces, depth + 1);
            break;

          case 'boolean':
          case 'regexp':
          case 'symbol':
          case 'number':
            val =
              val === 0 && 1 / val === Number.NEGATIVE_INFINITY // `-0`
                ? '-0'
                : val.toString();
            break;

          case 'bigint':
            val = `${val.toString()}n`;
            break;

          case 'date':
            var sDate = isNaN(val.getTime())
              ? val.toString()
              : val.toISOString();
            val = `[Date: ${sDate}]`;
            break;

          case 'buffer':
            var json = val.toJSON(); // Based on the toJSON result

            json = json.data && json.type ? json.data : json;
            val = `[Buffer: ${jsonStringify(json, 2, depth + 1)}]`;
            break;

          default:
            val =
              val === '[Function]' || val === '[Circular]'
                ? val
                : JSON.stringify(val);
          // string
        }

        return val;
      }

      for (const i in object) {
        if (!Object.prototype.hasOwnProperty.call(object, i)) {
          continue; // not my business
        }

        --length;
        str +=
          `\n ${ 
          repeat(' ', space) 
          }${Array.isArray(object) ? '' : `"${  i  }": `  // key
          }${_stringify(object[i])  // value
          }${length ? ',' : ''}`; // comma
      }

      return (
        str + // [], {}
        (str.length !== 1 ? `\n${  repeat(' ', --space)  }${end}` : end)
      );
    }
    /**
     * Return a new Thing that has the keys in sorted order. Recursive.
     *
     * If the Thing...
     * - has already been seen, return string `'[Circular]'`
     * - is `undefined`, return string `'[undefined]'`
     * - is `null`, return value `null`
     * - is some other primitive, return the value
     * - is not a primitive or an `Array`, `Object`, or `Function`, return the value of the Thing's `toString()` method
     * - is a non-empty `Array`, `Object`, or `Function`, return the result of calling this function again.
     * - is an empty `Array`, `Object`, or `Function`, return the result of calling `emptyRepresentation()`
     *
     * @private
     * @see {@link exports.stringify}
     * @param {*} value Thing to inspect.  May or may not have properties.
     * @param {Array} [stack=[]] Stack of seen values
     * @param {string} [typeHint] Type hint
     * @return {(Object|Array|Function|string|undefined)}
     */

    exports.canonicalize = function canonicalize(value, stack, typeHint) {
      let canonicalizedObj;
      /* eslint-disable no-unused-vars */

      let prop;
      /* eslint-enable no-unused-vars */

      typeHint = typeHint || canonicalType(value);

      function withStack(value, fn) {
        stack.push(value);
        fn();
        stack.pop();
      }

      stack = stack || [];

      if (stack.includes(value)) {
        return '[Circular]';
      }

      switch (typeHint) {
        case 'undefined':
        case 'buffer':
        case 'null':
          canonicalizedObj = value;
          break;

        case 'array':
          withStack(value, () => {
            canonicalizedObj = value.map(item => {
              return exports.canonicalize(item, stack);
            });
          });
          break;

        case 'function':
          /* eslint-disable-next-line no-unused-vars */
          for (prop in value) {
            canonicalizedObj = {};
            break;
          }
          /* eslint-enable guard-for-in */

          if (!canonicalizedObj) {
            canonicalizedObj = emptyRepresentation(value, typeHint);
            break;
          }

        /* falls through */

        case 'object':
          canonicalizedObj = canonicalizedObj || {};
          withStack(value, () => {
            Object.keys(value)
              .sort()
              .forEach(key => {
                canonicalizedObj[key] = exports.canonicalize(value[key], stack);
              });
          });
          break;

        case 'date':
        case 'number':
        case 'regexp':
        case 'boolean':
        case 'symbol':
          canonicalizedObj = value;
          break;

        default:
          canonicalizedObj = `${value}`;
      }

      return canonicalizedObj;
    };
    /**
     * @summary
     * This Filter based on `mocha-clean` module.(see: `github.com/rstacruz/mocha-clean`)
     * @description
     * When invoking this function you get a filter function that get the Error.stack as an input,
     * and return a prettify output.
     * (i.e: strip Mocha and internal node functions from stack trace).
     * @returns {Function}
     */

    exports.stackTraceFilter = function () {
      // TODO: Replace with `process.browser`
      let is =
        typeof document === 'undefined'
          ? {
              node: true,
            }
          : {
              browser: true,
            };
      let slash = path$1.sep;
      let cwd;

      if (is.node) {
        cwd = exports.cwd() + slash;
      } else {
        cwd = (
          typeof location === 'undefined' ? window.location : location
        ).href.replace(/\/[^/]*$/, '/');
        slash = '/';
      }

      function isMochaInternal(line) {
        return (
          ~line.indexOf(`node_modules${  slash  }mocha${  slash}`) ||
          ~line.indexOf(`${slash  }mocha.js`) ||
          ~line.indexOf(`${slash  }mocha.min.js`)
        );
      }

      function isNodeInternal(line) {
        return (
          ~line.indexOf('(timers.js:') ||
          ~line.indexOf('(events.js:') ||
          ~line.indexOf('(node.js:') ||
          ~line.indexOf('(module.js:') ||
          ~line.indexOf('GeneratorFunctionPrototype.next (native)') ||
          false
        );
      }

      return function (stack) {
        stack = stack.split('\n');
        stack = stack.reduce((list, line) => {
          if (isMochaInternal(line)) {
            return list;
          }

          if (is.node && isNodeInternal(line)) {
            return list;
          } // Clean up cwd(absolute)

          if (/:\d+:\d+\)?$/.test(line)) {
            line = line.replace(`(${cwd}`, '(');
          }

          list.push(line);
          return list;
        }, []);
        return stack.join('\n');
      };
    };
    /**
     * Crude, but effective.
     * @public
     * @param {*} value
     * @returns {boolean} Whether or not `value` is a Promise
     */

    exports.isPromise = function isPromise(value) {
      return (
        _typeof(value) === 'object' &&
        value !== null &&
        typeof value.then === 'function'
      );
    };
    /**
     * Clamps a numeric value to an inclusive range.
     *
     * @param {number} value - Value to be clamped.
     * @param {number[]} range - Two element array specifying [min, max] range.
     * @returns {number} clamped value
     */

    exports.clamp = function clamp(value, range) {
      return Math.min(Math.max(value, range[0]), range[1]);
    };
    /**
     * Single quote text by combining with undirectional ASCII quotation marks.
     *
     * @description
     * Provides a simple means of markup for quoting text to be used in output.
     * Use this to quote names of variables, methods, and packages.
     *
     * <samp>package 'foo' cannot be found</samp>
     *
     * @private
     * @param {string} str - Value to be quoted.
     * @returns {string} quoted value
     * @example
     * sQuote('n') // => 'n'
     */

    exports.sQuote = function (str) {
      return `'${str}'`;
    };
    /**
     * Double quote text by combining with undirectional ASCII quotation marks.
     *
     * @description
     * Provides a simple means of markup for quoting text to be used in output.
     * Use this to quote names of datatypes, classes, pathnames, and strings.
     *
     * <samp>argument 'value' must be "string" or "number"</samp>
     *
     * @private
     * @param {string} str - Value to be quoted.
     * @returns {string} quoted value
     * @example
     * dQuote('number') // => "number"
     */

    exports.dQuote = function (str) {
      return `"${str}"`;
    };
    /**
     * It's a noop.
     * @public
     */

    exports.noop = function () {};
    /**
     * Creates a map-like object.
     *
     * @description
     * A "map" is an object with no prototype, for our purposes. In some cases
     * this would be more appropriate than a `Map`, especially if your environment
     * doesn't support it. Recommended for use in Mocha's public APIs.
     *
     * @public
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Custom_and_Null_objects|MDN:Map}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Custom_and_Null_objects|MDN:Object.create - Custom objects}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Custom_and_Null_objects|MDN:Object.assign}
     * @param {...*} [obj] - Arguments to `Object.assign()`.
     * @returns {Object} An object with no prototype, having `...obj` properties
     */

    exports.createMap = function (obj) {
      return Object.assign.apply(
        null,
        [Object.create(null)].concat(Array.prototype.slice.call(arguments)),
      );
    };
    /**
     * Creates a read-only map-like object.
     *
     * @description
     * This differs from {@link module:utils.createMap createMap} only in that
     * the argument must be non-empty, because the result is frozen.
     *
     * @see {@link module:utils.createMap createMap}
     * @param {...*} [obj] - Arguments to `Object.assign()`.
     * @returns {Object} A frozen object with no prototype, having `...obj` properties
     * @throws {TypeError} if argument is not a non-empty object.
     */

    exports.defineConstants = function (obj) {
      if (canonicalType(obj) !== 'object' || Object.keys(obj).length === 0) {
        throw new TypeError('Invalid argument; expected a non-empty object');
      }

      return Object.freeze(exports.createMap(obj));
    };
    /**
     * Whether current version of Node support ES modules
     *
     * @description
     * Versions prior to 10 did not support ES Modules, and version 10 has an old incompatible version of ESM.
     * This function returns whether Node.JS has ES Module supports that is compatible with Mocha's needs,
     * which is version >=12.11.
     *
     * @param {partialSupport} whether the full Node.js ESM support is available (>= 12) or just something that supports the runtime (>= 10)
     *
     * @returns {Boolean} whether the current version of Node.JS supports ES Modules in a way that is compatible with Mocha
     */

    exports.supportsEsModules = function (partialSupport) {
      if (
        !exports.isBrowser() &&
        process$1.versions &&
        process$1.versions.node
      ) {
        const versionFields = process$1.versions.node.split('.');
        const major = +versionFields[0];
        const minor = +versionFields[1];

        if (!partialSupport) {
          return major >= 13 || (major === 12 && minor >= 11);
        } else {
          return major >= 10;
        }
      }
    };
    /**
     * Returns current working directory
     *
     * Wrapper around `process.cwd()` for isolation
     * @private
     */

    exports.cwd = function cwd() {
      return process$1.cwd();
    };
    /**
     * Returns `true` if Mocha is running in a browser.
     * Checks for `process.browser`.
     * @returns {boolean}
     * @private
     */

    exports.isBrowser = function isBrowser() {
      return Boolean(browser$1);
    };
    /**
     * Lookup file names at the given `path`.
     *
     * @description
     * Filenames are returned in _traversal_ order by the OS/filesystem.
     * **Make no assumption that the names will be sorted in any fashion.**
     *
     * @public
     * @alias module:lib/cli.lookupFiles
     * @param {string} filepath - Base path to start searching from.
     * @param {string[]} [extensions=[]] - File extensions to look for.
     * @param {boolean} [recursive=false] - Whether to recurse into subdirectories.
     * @return {string[]} An array of paths.
     * @throws {Error} if no files match pattern.
     * @throws {TypeError} if `filepath` is directory and `extensions` not provided.
     * @deprecated Moved to {@link module:lib/cli.lookupFiles}
     */

    exports.lookupFiles = function () {
      if (exports.isBrowser()) {
        throw errors.createUnsupportedError(
          'lookupFiles() is only supported in Node.js!',
        );
      }

      errors.deprecate(
        '`lookupFiles()` in module `mocha/lib/utils` has moved to module `mocha/lib/cli` and will be removed in the next major revision of Mocha',
      );
      return require$$11.lookupFiles.apply(require$$11, arguments);
    };
    /*
     * Casts `value` to an array; useful for optionally accepting array parameters
     *
     * It follows these rules, depending on `value`.  If `value` is...
     * 1. `undefined`: return an empty Array
     * 2. `null`: return an array with a single `null` element
     * 3. Any other object: return the value of `Array.from()` _if_ the object is iterable
     * 4. otherwise: return an array with a single element, `value`
     * @param {*} value - Something to cast to an Array
     * @returns {Array<*>}
     */

    exports.castArray = function castArray(value) {
      if (value === undefined) {
        return [];
      }

      if (value === null) {
        return [null];
      }

      if (
        _typeof(value) === 'object' &&
        (typeof value[Symbol.iterator] === 'function' ||
          value.length !== undefined)
      ) {
        return Array.from(value);
      }

      return [value];
    };

    exports.constants = exports.defineConstants({
      MOCHA_ID_PROP_NAME,
    });
    /**
     * Creates a new unique identifier
     * @returns {string} Unique identifier
     */

    exports.uniqueID = function () {
      return nanoid();
    };

    exports.assignNewMochaID = function (obj) {
      const id = exports.uniqueID();
      Object.defineProperty(obj, MOCHA_ID_PROP_NAME, {
        get: function get() {
          return id;
        },
      });
      return obj;
    };
    /**
     * Retrieves a Mocha ID from an object, if present.
     * @param {*} [obj] - Object
     * @returns {string|void}
     */

    exports.getMochaID = function (obj) {
      return obj && _typeof(obj) === 'object'
        ? obj[MOCHA_ID_PROP_NAME]
        : undefined;
    };
  });

  // `Map` constructor
  // https://tc39.es/ecma262/#sec-map-objects
  collection(
    'Map',
    init => {
      return function Map() {
        return init(this, arguments.length > 0 ? arguments[0] : undefined);
      };
    },
    collectionStrong,
  );

  /**
	 @module Pending
	*/

  const pending = Pending;
  /**
   * Initialize a new `Pending` error with the given message.
   *
   * @param {string} message
   */

  function Pending(message) {
    this.message = message;
  }

  /**
   * Helpers.
   */
  const s$1 = 1000;
  const m$1 = s$1 * 60;
  const h$1 = m$1 * 60;
  const d$1 = h$1 * 24;
  const w$1 = d$1 * 7;
  const y$1 = d$1 * 365.25;
  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */

  const ms$1 = function ms(val, options) {
    options = options || {};

    let type = _typeof(val);

    if (type === 'string' && val.length > 0) {
      return parse$1(val);
    } else if (type === 'number' && isFinite(val)) {
      return options['long'] ? fmtLong$1(val) : fmtShort$1(val);
    }

    throw new Error(
      `val is not a non-empty string or a valid number. val=${ 
        JSON.stringify(val)}`,
    );
  };
  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse$1(str) {
    str = String(str);

    if (str.length > 100) {
      return;
    }

    const match =
      /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str,
      );

    if (!match) {
      return;
    }

    const n = Number.parseFloat(match[1]);
    const type = (match[2] || 'ms').toLowerCase();

    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y$1;

      case 'weeks':
      case 'week':
      case 'w':
        return n * w$1;

      case 'days':
      case 'day':
      case 'd':
        return n * d$1;

      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h$1;

      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m$1;

      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s$1;

      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;

      default:
        return undefined;
    }
  }
  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtShort$1(ms) {
    const msAbs = Math.abs(ms);

    if (msAbs >= d$1) {
      return `${Math.round(ms / d$1)}d`;
    }

    if (msAbs >= h$1) {
      return `${Math.round(ms / h$1)}h`;
    }

    if (msAbs >= m$1) {
      return `${Math.round(ms / m$1)}m`;
    }

    if (msAbs >= s$1) {
      return `${Math.round(ms / s$1)}s`;
    }

    return `${ms}ms`;
  }
  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtLong$1(ms) {
    const msAbs = Math.abs(ms);

    if (msAbs >= d$1) {
      return plural$1(ms, msAbs, d$1, 'day');
    }

    if (msAbs >= h$1) {
      return plural$1(ms, msAbs, h$1, 'hour');
    }

    if (msAbs >= m$1) {
      return plural$1(ms, msAbs, m$1, 'minute');
    }

    if (msAbs >= s$1) {
      return plural$1(ms, msAbs, s$1, 'second');
    }

    return `${ms} ms`;
  }
  /**
   * Pluralization helper.
   */

  function plural$1(ms, msAbs, n, name) {
    const isPlural = msAbs >= n * 1.5;
    return `${Math.round(ms / n)} ${name}${isPlural ? 's' : ''}`;
  }

  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   */

  function setup(env) {
    createDebug.debug = createDebug;
    createDebug['default'] = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = ms$1;
    createDebug.destroy = destroy;
    Object.keys(env).forEach(key => {
      createDebug[key] = env[key];
    });
    /**
     * The currently active debug mode names, and names to skip.
     */

    createDebug.names = [];
    createDebug.skips = [];
    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
     */

    createDebug.formatters = {};
    /**
     * Selects a color for a debug namespace
     * @param {String} namespace The namespace string for the for the debug instance to be colored
     * @return {Number|String} An ANSI color code for the given namespace
     * @api private
     */

    function selectColor(namespace) {
      let hash = 0;

      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash = Math.trunc(hash); // Convert to 32bit integer
      }

      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }

    createDebug.selectColor = selectColor;
    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;

      function debug() {
        for (
          var _len = arguments.length, args = new Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          args[_key] = arguments[_key];
        }

        // Disabled?
        if (!debug.enabled) {
          return;
        }

        const self = debug; // Set `diff` timestamp

        const curr = Date.now();
        const ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);

        if (typeof args[0] !== 'string') {
          // Anything else let's inspect with %O
          args.unshift('%O');
        } // Apply any `formatters` transformations

        let index = 0;
        args[0] = args[0].replace(/%([%A-Za-z])/g, (match, format) => {
          // If we encounter an escaped % then don't increase the array index
          if (match === '%%') {
            return '%';
          }

          index++;
          const formatter = createDebug.formatters[format];

          if (typeof formatter === 'function') {
            const val = args[index];
            match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

            args.splice(index, 1);
            index--;
          }

          return match;
        }); // Apply env-specific formatting (colors, etc.)

        createDebug.formatArgs.call(self, args);
        const logFn = self.log || createDebug.log;
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.useColors = createDebug.useColors();
      debug.color = createDebug.selectColor(namespace);
      debug.extend = extend;
      debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

      Object.defineProperty(debug, 'enabled', {
        enumerable: true,
        configurable: false,
        get: function get() {
          return enableOverride === null
            ? createDebug.enabled(namespace)
            : enableOverride;
        },
        set: function set(v) {
          enableOverride = v;
        },
      }); // Env-specific initialization logic for debug instances

      if (typeof createDebug.init === 'function') {
        createDebug.init(debug);
      }

      return debug;
    }

    function extend(namespace, delimiter) {
      const newDebug = createDebug(
        this.namespace +
          (typeof delimiter === 'undefined' ? ':' : delimiter) +
          namespace,
      );
      newDebug.log = this.log;
      return newDebug;
    }
    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.names = [];
      createDebug.skips = [];
      let i;
      const split = (typeof namespaces === 'string' ? namespaces : '').split(
        /[\s,]+/,
      );
      const len = split.length;

      for (i = 0; i < len; i++) {
        if (!split[i]) {
          // ignore empty strings
          continue;
        }

        namespaces = split[i].replaceAll('*', '.*?');

        if (namespaces[0] === '-') {
          createDebug.skips.push(new RegExp(`^${namespaces.slice(1)}$`));
        } else {
          createDebug.names.push(new RegExp(`^${namespaces}$`));
        }
      }
    }
    /**
     * Disable debug output.
     *
     * @return {String} namespaces
     * @api public
     */

    function disable() {
      const namespaces = []
        .concat(
          _toConsumableArray(createDebug.names.map(toNamespace)),
          _toConsumableArray(
            createDebug.skips.map(toNamespace).map(namespace => {
              return `-${namespace}`;
            }),
          ),
        )
        .join(',');
      createDebug.enable('');
      return namespaces;
    }
    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      if (name[name.length - 1] === '*') {
        return true;
      }

      let i;
      let len;

      for (i = 0, len = createDebug.skips.length; i < len; i++) {
        if (createDebug.skips[i].test(name)) {
          return false;
        }
      }

      for (i = 0, len = createDebug.names.length; i < len; i++) {
        if (createDebug.names[i].test(name)) {
          return true;
        }
      }

      return false;
    }
    /**
     * Convert regexp to namespace
     *
     * @param {RegExp} regxep
     * @return {String} namespace
     * @api private
     */

    function toNamespace(regexp) {
      return regexp
        .toString()
        .substring(2, regexp.toString().length - 2)
        .replace(/\.\*\?$/, '*');
    }
    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }

      return val;
    }
    /**
     * XXX DO NOT USE. This is a temporary stub function.
     * XXX It WILL be removed in the next major release.
     */

    function destroy() {
      console.warn(
        'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.',
      );
    }

    createDebug.enable(createDebug.load());
    return createDebug;
  }

  const common = setup;

  const browser$2 = createCommonjsModule((module, exports) => {
    /* eslint-env browser */

    /**
     * This is the web browser implementation of `debug()`.
     */
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();

    exports.destroy = (function () {
      let warned = false;
      return function () {
        if (!warned) {
          warned = true;
          console.warn(
            'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.',
          );
        }
      };
    })();
    /**
     * Colors.
     */

    exports.colors = [
      '#0000CC',
      '#0000FF',
      '#0033CC',
      '#0033FF',
      '#0066CC',
      '#0066FF',
      '#0099CC',
      '#0099FF',
      '#00CC00',
      '#00CC33',
      '#00CC66',
      '#00CC99',
      '#00CCCC',
      '#00CCFF',
      '#3300CC',
      '#3300FF',
      '#3333CC',
      '#3333FF',
      '#3366CC',
      '#3366FF',
      '#3399CC',
      '#3399FF',
      '#33CC00',
      '#33CC33',
      '#33CC66',
      '#33CC99',
      '#33CCCC',
      '#33CCFF',
      '#6600CC',
      '#6600FF',
      '#6633CC',
      '#6633FF',
      '#66CC00',
      '#66CC33',
      '#9900CC',
      '#9900FF',
      '#9933CC',
      '#9933FF',
      '#99CC00',
      '#99CC33',
      '#CC0000',
      '#CC0033',
      '#CC0066',
      '#CC0099',
      '#CC00CC',
      '#CC00FF',
      '#CC3300',
      '#CC3333',
      '#CC3366',
      '#CC3399',
      '#CC33CC',
      '#CC33FF',
      '#CC6600',
      '#CC6633',
      '#CC9900',
      '#CC9933',
      '#CCCC00',
      '#CCCC33',
      '#FF0000',
      '#FF0033',
      '#FF0066',
      '#FF0099',
      '#FF00CC',
      '#FF00FF',
      '#FF3300',
      '#FF3333',
      '#FF3366',
      '#FF3399',
      '#FF33CC',
      '#FF33FF',
      '#FF6600',
      '#FF6633',
      '#FF9900',
      '#FF9933',
      '#FFCC00',
      '#FFCC33',
    ];
    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */
    // eslint-disable-next-line complexity

    function useColors() {
      // NB: In an Electron preload script, document will be defined but not fully
      // initialized. Since we know we're in Chrome, we'll just detect this case
      // explicitly
      if (
        typeof window !== 'undefined' &&
        window.process &&
        (window.process.type === 'renderer' || window.process.__nwjs)
      ) {
        return true;
      } // Internet Explorer and Edge do not support colors.

      if (
        typeof navigator !== 'undefined' &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
      ) {
        return false;
      } // Is webkit? http://stackoverflow.com/a/16459606/376773
      // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632

      return (
        (typeof document !== 'undefined' &&
          document.documentElement &&
          document.documentElement.style &&
          document.documentElement.style.WebkitAppearance) || // Is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== 'undefined' &&
          window.console &&
          (window.console.firebug ||
            (window.console.exception && window.console.table))) || // Is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== 'undefined' &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
          Number.parseInt(RegExp.$1, 10) >= 31) || // Double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== 'undefined' &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
      );
    }
    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
      args[0] =
        `${(this.useColors ? '%c' : '') +
        this.namespace +
        (this.useColors ? ' %c' : ' ') +
        args[0] +
        (this.useColors ? '%c ' : ' ') 
        }+${ 
        module.exports.humanize(this.diff)}`;

      if (!this.useColors) {
        return;
      }

      const c = `color: ${  this.color}`;
      args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into

      let index = 0;
      let lastC = 0;
      args[0].replace(/%[%A-Za-z]/g, match => {
        if (match === '%%') {
          return;
        }

        index++;

        if (match === '%c') {
          // We only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    /**
     * Invokes `console.debug()` when available.
     * No-op when `console.debug` is not a "function".
     * If `console.debug` is not available, falls back
     * to `console.log`.
     *
     * @api public
     */

    exports.log = console.debug || console.log || function () {};
    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem('debug', namespaces);
        } else {
          exports.storage.removeItem('debug');
        }
      } catch {
        // Swallow
        // XXX (@Qix-) should we be logging these?
      }
    }
    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      let r;

      try {
        r = exports.storage.getItem('debug');
      } catch {
        // Swallow
        // XXX (@Qix-) should we be logging these?
      } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG

      if (!r && typeof process$1 !== 'undefined' && 'env' in process$1) {
        r = process$1.env.DEBUG;
      }

      return r;
    }
    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
      try {
        // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
        // The Browser also has localStorage in the global context.
        return localStorage;
      } catch {
        // Swallow
        // XXX (@Qix-) should we be logging these?
      }
    }

    module.exports = common(exports);
    const formatters = module.exports.formatters;
    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    formatters.j = function (v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return `[UnexpectedJSONParseError]: ${error.message}`;
      }
    };
  });

  const EventEmitter$1 = EventEmitter.EventEmitter;
  const debug$1 = browser$2('mocha:runnable');
  const createInvalidExceptionError$1 = errors.createInvalidExceptionError,
    createMultipleDoneError$1 = errors.createMultipleDoneError,
    createTimeoutError$1 = errors.createTimeoutError;
  /**
   * Save timer references to avoid Sinon interfering (see GH-237).
   * @private
   */

  const Date$1 = commonjsGlobal.Date;
  const setTimeout$1 = commonjsGlobal.setTimeout;
  const clearTimeout$1 = commonjsGlobal.clearTimeout;
  const toString$4 = Object.prototype.toString;
  const runnable = Runnable;
  /**
   * Initialize a new `Runnable` with the given `title` and callback `fn`.
   *
   * @class
   * @extends external:EventEmitter
   * @public
   * @param {String} title
   * @param {Function} fn
   */

  function Runnable(title, fn) {
    this.title = title;
    this.fn = fn;
    this.body = (fn || '').toString();
    this.async = fn && fn.length;
    this.sync = !this.async;
    this._timeout = 2000;
    this._slow = 75;
    this._retries = -1;
    utils.assignNewMochaID(this);
    Object.defineProperty(this, 'id', {
      get: function get() {
        return utils.getMochaID(this);
      },
    });
    this.reset();
  }
  /**
   * Inherit from `EventEmitter.prototype`.
   */

  utils.inherits(Runnable, EventEmitter$1);
  /**
   * Resets the state initially or for a next run.
   */

  Runnable.prototype.reset = function () {
    this.timedOut = false;
    this._currentRetry = 0;
    this.pending = false;
    delete this.state;
    delete this.err;
  };
  /**
   * Get current timeout value in msecs.
   *
   * @private
   * @returns {number} current timeout threshold value
   */

  /**
   * @summary
   * Set timeout threshold value (msecs).
   *
   * @description
   * A string argument can use shorthand (e.g., "2s") and will be converted.
   * The value will be clamped to range [<code>0</code>, <code>2^<sup>31</sup>-1</code>].
   * If clamped value matches either range endpoint, timeouts will be disabled.
   *
   * @private
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Maximum_delay_value}
   * @param {number|string} ms - Timeout threshold value.
   * @returns {Runnable} this
   * @chainable
   */

  Runnable.prototype.timeout = function (ms$1) {
    if (arguments.length === 0) {
      return this._timeout;
    }

    if (typeof ms$1 === 'string') {
      ms$1 = ms(ms$1);
    } // Clamp to range

    const INT_MAX = 2 ** 31 - 1;
    const range = [0, INT_MAX];
    ms$1 = utils.clamp(ms$1, range); // see #1652 for reasoning

    if (ms$1 === range[0] || ms$1 === range[1]) {
      this._timeout = 0;
    } else {
      this._timeout = ms$1;
    }

    debug$1('timeout %d', this._timeout);

    if (this.timer) {
      this.resetTimeout();
    }

    return this;
  };
  /**
   * Set or get slow `ms`.
   *
   * @private
   * @param {number|string} ms
   * @return {Runnable|number} ms or Runnable instance.
   */

  Runnable.prototype.slow = function (ms$1) {
    if (arguments.length === 0 || typeof ms$1 === 'undefined') {
      return this._slow;
    }

    if (typeof ms$1 === 'string') {
      ms$1 = ms(ms$1);
    }

    debug$1('slow %d', ms$1);
    this._slow = ms$1;
    return this;
  };
  /**
   * Halt and mark as pending.
   *
   * @memberof Mocha.Runnable
   * @public
   */

  Runnable.prototype.skip = function () {
    this.pending = true;
    throw new pending('sync skip; aborting execution');
  };
  /**
   * Check if this runnable or its parent suite is marked as pending.
   *
   * @private
   */

  Runnable.prototype.isPending = function () {
    return this.pending || (this.parent && this.parent.isPending());
  };
  /**
   * Return `true` if this Runnable has failed.
   * @return {boolean}
   * @private
   */

  Runnable.prototype.isFailed = function () {
    return !this.isPending() && this.state === constants$1.STATE_FAILED;
  };
  /**
   * Return `true` if this Runnable has passed.
   * @return {boolean}
   * @private
   */

  Runnable.prototype.isPassed = function () {
    return !this.isPending() && this.state === constants$1.STATE_PASSED;
  };
  /**
   * Set or get number of retries.
   *
   * @private
   */

  Runnable.prototype.retries = function (n) {
    if (arguments.length === 0) {
      return this._retries;
    }

    this._retries = n;
  };
  /**
   * Set or get current retry
   *
   * @private
   */

  Runnable.prototype.currentRetry = function (n) {
    if (arguments.length === 0) {
      return this._currentRetry;
    }

    this._currentRetry = n;
  };
  /**
   * Return the full title generated by recursively concatenating the parent's
   * full title.
   *
   * @memberof Mocha.Runnable
   * @public
   * @return {string}
   */

  Runnable.prototype.fullTitle = function () {
    return this.titlePath().join(' ');
  };
  /**
   * Return the title path generated by concatenating the parent's title path with the title.
   *
   * @memberof Mocha.Runnable
   * @public
   * @return {string}
   */

  Runnable.prototype.titlePath = function () {
    return this.parent.titlePath().concat([this.title]);
  };
  /**
   * Clear the timeout.
   *
   * @private
   */

  Runnable.prototype.clearTimeout = function () {
    clearTimeout$1(this.timer);
  };
  /**
   * Reset the timeout.
   *
   * @private
   */

  Runnable.prototype.resetTimeout = function () {
    const self = this;
    const ms = this.timeout();

    if (ms === 0) {
      return;
    }

    this.clearTimeout();
    this.timer = setTimeout$1(() => {
      if (self.timeout() === 0) {
        return;
      }

      self.callback(self._timeoutError(ms));
      self.timedOut = true;
    }, ms);
  };
  /**
   * Set or get a list of whitelisted globals for this test run.
   *
   * @private
   * @param {string[]} globals
   */

  Runnable.prototype.globals = function (globals) {
    if (arguments.length === 0) {
      return this._allowedGlobals;
    }

    this._allowedGlobals = globals;
  };
  /**
   * Run the test and invoke `fn(err)`.
   *
   * @param {Function} fn
   * @private
   */

  Runnable.prototype.run = function (fn) {
    const self = this;
    const start = new Date$1();
    const ctx = this.ctx;
    let finished;
    let errorWasHandled = false;
    if (this.isPending()) return fn(); // Sometimes the ctx exists, but it is not runnable

    if (ctx && ctx.runnable) {
      ctx.runnable(this);
    } // called multiple times

    function multiple(err) {
      if (errorWasHandled) {
        return;
      }

      errorWasHandled = true;
      self.emit('error', createMultipleDoneError$1(self, err));
    } // finished

    function done(err) {
      const ms = self.timeout();

      if (self.timedOut) {
        return;
      }

      if (finished) {
        return multiple(err);
      }

      self.clearTimeout();
      self.duration = new Date$1() - start;
      finished = true;

      if (!err && self.duration > ms && ms > 0) {
        err = self._timeoutError(ms);
      }

      fn(err);
    } // for .resetTimeout() and Runner#uncaught()

    this.callback = done;

    if (this.fn && typeof this.fn.call !== 'function') {
      done(
        new TypeError(
          'A runnable must be passed a function as its second argument.',
        ),
      );
      return;
    } // explicit async with `done` argument

    if (this.async) {
      this.resetTimeout(); // allows skip() to be used in an explicit async context

      this.skip = function asyncSkip() {
        this.pending = true;
        done(); // halt execution, the uncaught handler will ignore the failure.

        throw new pending('async skip; aborting execution');
      };

      try {
        callFnAsync(this.fn);
      } catch (err) {
        // handles async runnables which actually run synchronously
        errorWasHandled = true;

        if (err instanceof pending) {
          return; // done() is already called in this.skip()
        } else if (this.allowUncaught) {
          throw err;
        }

        done(Runnable.toValueOrError(err));
      }

      return;
    } // sync or promise-returning

    try {
      callFn(this.fn);
    } catch (err) {
      errorWasHandled = true;

      if (err instanceof pending) {
        return done();
      } else if (this.allowUncaught) {
        throw err;
      }

      done(Runnable.toValueOrError(err));
    }

    function callFn(fn) {
      const result = fn.call(ctx);

      if (result && typeof result.then === 'function') {
        self.resetTimeout();
        result.then(
          () => {
            done(); // Return null so libraries like bluebird do not warn about
            // subsequently constructed Promises.

            return null;
          },
          reason => {
            done(
              reason || new Error('Promise rejected with no or falsy reason'),
            );
          },
        );
      } else {
        if (self.asyncOnly) {
          return done(
            new Error(
              '--async-only option in use without declaring `done()` or returning a promise',
            ),
          );
        }

        done();
      }
    }

    function callFnAsync(fn) {
      var result = fn.call(ctx, err => {
        if (err instanceof Error || toString$4.call(err) === '[object Error]') {
          return done(err);
        }

        if (err) {
          if (Object.prototype.toString.call(err) === '[object Object]') {
            return done(
              new Error(
                `done() invoked with non-Error: ${JSON.stringify(err)}`,
              ),
            );
          }

          return done(new Error(`done() invoked with non-Error: ${err}`));
        }

        if (result && utils.isPromise(result)) {
          return done(
            new Error(
              'Resolution method is overspecified. Specify a callback *or* return a Promise; not both.',
            ),
          );
        }

        done();
      });
    }
  };
  /**
   * Instantiates a "timeout" error
   *
   * @param {number} ms - Timeout (in milliseconds)
   * @returns {Error} a "timeout" error
   * @private
   */

  Runnable.prototype._timeoutError = function (ms) {
    let msg = 'Timeout of '.concat(
      ms,
      'ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.',
    );

    if (this.file) {
      msg += ` (${this.file})`;
    }

    return createTimeoutError$1(msg, ms, this.file);
  };

  var constants$1 = utils.defineConstants(
    /**
     * {@link Runnable}-related constants.
     * @public
     * @memberof Runnable
     * @readonly
     * @static
     * @alias constants
     * @enum {string}
     */
    {
      /**
       * Value of `state` prop when a `Runnable` has failed
       */
      STATE_FAILED: 'failed',

      /**
       * Value of `state` prop when a `Runnable` has passed
       */
      STATE_PASSED: 'passed',

      /**
       * Value of `state` prop when a `Runnable` has been skipped by user
       */
      STATE_PENDING: 'pending',
    },
  );
  /**
   * Given `value`, return identity if truthy, otherwise create an "invalid exception" error and return that.
   * @param {*} [value] - Value to return, if present
   * @returns {*|Error} `value`, otherwise an `Error`
   * @private
   */

  Runnable.toValueOrError = function (value) {
    return (
      value ||
      createInvalidExceptionError$1(
        'Runnable failed with falsy or undefined exception. Please throw an Error instead.',
        value,
      )
    );
  };

  Runnable.constants = constants$1;

  const $some$1 = arrayIteration.some;

  const STRICT_METHOD$5 = arrayMethodIsStrict('some');
  const USES_TO_LENGTH$9 = arrayMethodUsesToLength('some');

  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  _export(
    {
      target: 'Array',
      proto: true,
      forced: !STRICT_METHOD$5 || !USES_TO_LENGTH$9,
    },
    {
      some: function some(callbackfn /* , thisArg */) {
        return $some$1(
          this,
          callbackfn,
          arguments.length > 1 ? arguments[1] : undefined,
        );
      },
    },
  );

  const inherits$3 = utils.inherits,
    constants$2 = utils.constants;
  const MOCHA_ID_PROP_NAME = constants$2.MOCHA_ID_PROP_NAME;
  /**
   * Expose `Hook`.
   */

  const hook = Hook;
  /**
   * Initialize a new `Hook` with the given `title` and callback `fn`
   *
   * @class
   * @extends Runnable
   * @param {String} title
   * @param {Function} fn
   */

  function Hook(title, fn) {
    runnable.call(this, title, fn);
    this.type = 'hook';
  }
  /**
   * Inherit from `Runnable.prototype`.
   */

  inherits$3(Hook, runnable);
  /**
   * Resets the state for a next run.
   */

  Hook.prototype.reset = function () {
    runnable.prototype.reset.call(this);
    delete this._error;
  };
  /**
   * Get or set the test `err`.
   *
   * @memberof Hook
   * @public
   * @param {Error} err
   * @return {Error}
   */

  Hook.prototype.error = function (err) {
    if (arguments.length === 0) {
      err = this._error;
      this._error = null;
      return err;
    }

    this._error = err;
  };
  /**
   * Returns an object suitable for IPC.
   * Functions are represented by keys beginning with `$$`.
   * @private
   * @returns {Object}
   */

  Hook.prototype.serialize = function serialize() {
    return _defineProperty(
      {
        $$isPending: this.isPending(),
        $$titlePath: this.titlePath(),
        ctx:
          this.ctx && this.ctx.currentTest
            ? {
                currentTest: _defineProperty(
                  {
                    title: this.ctx.currentTest.title,
                  },
                  MOCHA_ID_PROP_NAME,
                  this.ctx.currentTest.id,
                ),
              }
            : {},
        parent: _defineProperty({}, MOCHA_ID_PROP_NAME, this.parent.id),
        title: this.title,
        type: this.type,
      },
      MOCHA_ID_PROP_NAME,
      this.id,
    );
  };

  const suite = createCommonjsModule((module, exports) => {
    /**
     * Module dependencies.
     * @private
     */

    const EventEmitter$1 = EventEmitter.EventEmitter;
    const assignNewMochaID = utils.assignNewMochaID,
      clamp = utils.clamp,
      utilsConstants = utils.constants,
      createMap = utils.createMap,
      defineConstants = utils.defineConstants,
      getMochaID = utils.getMochaID,
      inherits = utils.inherits,
      isString = utils.isString;
    const debug = browser$2('mocha:suite');
    const MOCHA_ID_PROP_NAME = utilsConstants.MOCHA_ID_PROP_NAME;
    /**
     * Expose `Suite`.
     */

    module.exports = Suite;
    /**
     * Create a new `Suite` with the given `title` and parent `Suite`.
     *
     * @public
     * @param {Suite} parent - Parent suite (required!)
     * @param {string} title - Title
     * @return {Suite}
     */

    Suite.create = function (parent, title) {
      const suite = new Suite(title, parent.ctx);
      suite.parent = parent;
      title = suite.fullTitle();
      parent.addSuite(suite);
      return suite;
    };
    /**
     * Constructs a new `Suite` instance with the given `title`, `ctx`, and `isRoot`.
     *
     * @public
     * @class
     * @extends EventEmitter
     * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter|EventEmitter}
     * @param {string} title - Suite title.
     * @param {Context} parentContext - Parent context instance.
     * @param {boolean} [isRoot=false] - Whether this is the root suite.
     */

    function Suite(title, parentContext, isRoot) {
      if (!isString(title)) {
        throw errors.createInvalidArgumentTypeError(
          `Suite argument "title" must be a string. Received type "${ 
            _typeof(title) 
            }"`,
          'title',
          'string',
        );
      }

      this.title = title;

      function Context() {}

      Context.prototype = parentContext;
      this.ctx = new Context();
      this.suites = [];
      this.tests = [];
      this.root = isRoot === true;
      this.pending = false;
      this._retries = -1;
      this._beforeEach = [];
      this._beforeAll = [];
      this._afterEach = [];
      this._afterAll = [];
      this._timeout = 2000;
      this._slow = 75;
      this._bail = false;
      this._onlyTests = [];
      this._onlySuites = [];
      assignNewMochaID(this);
      Object.defineProperty(this, 'id', {
        get: function get() {
          return getMochaID(this);
        },
      });
      this.reset();
      this.on('newListener', event => {
        if (deprecatedEvents[event]) {
          errors.deprecate(
            `Event "${ 
              event 
              }" is deprecated.  Please let the Mocha team know about your use case: https://git.io/v6Lwm`,
          );
        }
      });
    }
    /**
     * Inherit from `EventEmitter.prototype`.
     */

    inherits(Suite, EventEmitter$1);
    /**
     * Resets the state initially or for a next run.
     */

    Suite.prototype.reset = function () {
      this.delayed = false;

      function doReset(thingToReset) {
        thingToReset.reset();
      }

      this.suites.forEach(doReset);
      this.tests.forEach(doReset);

      this._beforeEach.forEach(doReset);

      this._afterEach.forEach(doReset);

      this._beforeAll.forEach(doReset);

      this._afterAll.forEach(doReset);
    };
    /**
     * Return a clone of this `Suite`.
     *
     * @private
     * @return {Suite}
     */

    Suite.prototype.clone = function () {
      const suite = new Suite(this.title);
      debug('clone');
      suite.ctx = this.ctx;
      suite.root = this.root;
      suite.timeout(this.timeout());
      suite.retries(this.retries());
      suite.slow(this.slow());
      suite.bail(this.bail());
      return suite;
    };
    /**
     * Set or get timeout `ms` or short-hand such as "2s".
     *
     * @private
     * @todo Do not attempt to set value if `ms` is undefined
     * @param {number|string} ms
     * @return {Suite|number} for chaining
     */

    Suite.prototype.timeout = function (ms$1) {
      if (arguments.length === 0) {
        return this._timeout;
      }

      if (typeof ms$1 === 'string') {
        ms$1 = ms(ms$1);
      } // Clamp to range

      const INT_MAX = 2**31 - 1;
      const range = [0, INT_MAX];
      ms$1 = clamp(ms$1, range);
      debug('timeout %d', ms$1);
      this._timeout = Number.parseInt(ms$1, 10);
      return this;
    };
    /**
     * Set or get number of times to retry a failed test.
     *
     * @private
     * @param {number|string} n
     * @return {Suite|number} for chaining
     */

    Suite.prototype.retries = function (n) {
      if (arguments.length === 0) {
        return this._retries;
      }

      debug('retries %d', n);
      this._retries = Number.parseInt(n, 10) || 0;
      return this;
    };
    /**
     * Set or get slow `ms` or short-hand such as "2s".
     *
     * @private
     * @param {number|string} ms
     * @return {Suite|number} for chaining
     */

    Suite.prototype.slow = function (ms$1) {
      if (arguments.length === 0) {
        return this._slow;
      }

      if (typeof ms$1 === 'string') {
        ms$1 = ms(ms$1);
      }

      debug('slow %d', ms$1);
      this._slow = ms$1;
      return this;
    };
    /**
     * Set or get whether to bail after first error.
     *
     * @private
     * @param {boolean} bail
     * @return {Suite|number} for chaining
     */

    Suite.prototype.bail = function (bail) {
      if (arguments.length === 0) {
        return this._bail;
      }

      debug('bail %s', bail);
      this._bail = bail;
      return this;
    };
    /**
     * Check if this suite or its parent suite is marked as pending.
     *
     * @private
     */

    Suite.prototype.isPending = function () {
      return this.pending || (this.parent && this.parent.isPending());
    };
    /**
     * Generic hook-creator.
     * @private
     * @param {string} title - Title of hook
     * @param {Function} fn - Hook callback
     * @returns {Hook} A new hook
     */

    Suite.prototype._createHook = function (title, fn) {
      const hook$1 = new hook(title, fn);
      hook$1.parent = this;
      hook$1.timeout(this.timeout());
      hook$1.retries(this.retries());
      hook$1.slow(this.slow());
      hook$1.ctx = this.ctx;
      hook$1.file = this.file;
      return hook$1;
    };
    /**
     * Run `fn(test[, done])` before running tests.
     *
     * @private
     * @param {string} title
     * @param {Function} fn
     * @return {Suite} for chaining
     */

    Suite.prototype.beforeAll = function (title, fn) {
      if (this.isPending()) {
        return this;
      }

      if (typeof title === 'function') {
        fn = title;
        title = fn.name;
      }

      title = `"before all" hook${title ? `: ${  title}` : ''}`;

      const hook = this._createHook(title, fn);

      this._beforeAll.push(hook);

      this.emit(constants.EVENT_SUITE_ADD_HOOK_BEFORE_ALL, hook);
      return this;
    };
    /**
     * Run `fn(test[, done])` after running tests.
     *
     * @private
     * @param {string} title
     * @param {Function} fn
     * @return {Suite} for chaining
     */

    Suite.prototype.afterAll = function (title, fn) {
      if (this.isPending()) {
        return this;
      }

      if (typeof title === 'function') {
        fn = title;
        title = fn.name;
      }

      title = `"after all" hook${title ? `: ${  title}` : ''}`;

      const hook = this._createHook(title, fn);

      this._afterAll.push(hook);

      this.emit(constants.EVENT_SUITE_ADD_HOOK_AFTER_ALL, hook);
      return this;
    };
    /**
     * Run `fn(test[, done])` before each test case.
     *
     * @private
     * @param {string} title
     * @param {Function} fn
     * @return {Suite} for chaining
     */

    Suite.prototype.beforeEach = function (title, fn) {
      if (this.isPending()) {
        return this;
      }

      if (typeof title === 'function') {
        fn = title;
        title = fn.name;
      }

      title = `"before each" hook${title ? `: ${  title}` : ''}`;

      const hook = this._createHook(title, fn);

      this._beforeEach.push(hook);

      this.emit(constants.EVENT_SUITE_ADD_HOOK_BEFORE_EACH, hook);
      return this;
    };
    /**
     * Run `fn(test[, done])` after each test case.
     *
     * @private
     * @param {string} title
     * @param {Function} fn
     * @return {Suite} for chaining
     */

    Suite.prototype.afterEach = function (title, fn) {
      if (this.isPending()) {
        return this;
      }

      if (typeof title === 'function') {
        fn = title;
        title = fn.name;
      }

      title = `"after each" hook${title ? `: ${  title}` : ''}`;

      const hook = this._createHook(title, fn);

      this._afterEach.push(hook);

      this.emit(constants.EVENT_SUITE_ADD_HOOK_AFTER_EACH, hook);
      return this;
    };
    /**
     * Add a test `suite`.
     *
     * @private
     * @param {Suite} suite
     * @return {Suite} for chaining
     */

    Suite.prototype.addSuite = function (suite) {
      suite.parent = this;
      suite.root = false;
      suite.timeout(this.timeout());
      suite.retries(this.retries());
      suite.slow(this.slow());
      suite.bail(this.bail());
      this.suites.push(suite);
      this.emit(constants.EVENT_SUITE_ADD_SUITE, suite);
      return this;
    };
    /**
     * Add a `test` to this suite.
     *
     * @private
     * @param {Test} test
     * @return {Suite} for chaining
     */

    Suite.prototype.addTest = function (test) {
      test.parent = this;
      test.timeout(this.timeout());
      test.retries(this.retries());
      test.slow(this.slow());
      test.ctx = this.ctx;
      this.tests.push(test);
      this.emit(constants.EVENT_SUITE_ADD_TEST, test);
      return this;
    };
    /**
     * Return the full title generated by recursively concatenating the parent's
     * full title.
     *
     * @memberof Suite
     * @public
     * @return {string}
     */

    Suite.prototype.fullTitle = function () {
      return this.titlePath().join(' ');
    };
    /**
     * Return the title path generated by recursively concatenating the parent's
     * title path.
     *
     * @memberof Suite
     * @public
     * @return {string}
     */

    Suite.prototype.titlePath = function () {
      let result = [];

      if (this.parent) {
        result = result.concat(this.parent.titlePath());
      }

      if (!this.root) {
        result.push(this.title);
      }

      return result;
    };
    /**
     * Return the total number of tests.
     *
     * @memberof Suite
     * @public
     * @return {number}
     */

    Suite.prototype.total = function () {
      return (
        this.suites.reduce((sum, suite) => {
          return sum + suite.total();
        }, 0) + this.tests.length
      );
    };
    /**
     * Iterates through each suite recursively to find all tests. Applies a
     * function in the format `fn(test)`.
     *
     * @private
     * @param {Function} fn
     * @return {Suite}
     */

    Suite.prototype.eachTest = function (fn) {
      this.tests.forEach(fn);
      this.suites.forEach(suite => {
        suite.eachTest(fn);
      });
      return this;
    };
    /**
     * This will run the root suite if we happen to be running in delayed mode.
     * @private
     */

    Suite.prototype.run = function run() {
      if (this.root) {
        this.emit(constants.EVENT_ROOT_SUITE_RUN);
      }
    };
    /**
     * Determines whether a suite has an `only` test or suite as a descendant.
     *
     * @private
     * @returns {Boolean}
     */

    Suite.prototype.hasOnly = function hasOnly() {
      return (
        this._onlyTests.length > 0 ||
        this._onlySuites.length > 0 ||
        this.suites.some(suite => {
          return suite.hasOnly();
        })
      );
    };
    /**
     * Filter suites based on `isOnly` logic.
     *
     * @private
     * @returns {Boolean}
     */

    Suite.prototype.filterOnly = function filterOnly() {
      if (this._onlyTests.length > 0) {
        // If the suite contains `only` tests, run those and ignore any nested suites.
        this.tests = this._onlyTests;
        this.suites = [];
      } else {
        // Otherwise, do not run any of the tests in this suite.
        this.tests = [];

        this._onlySuites.forEach(onlySuite => {
          // If there are other `only` tests/suites nested in the current `only` suite, then filter that `only` suite.
          // Otherwise, all of the tests on this `only` suite should be run, so don't filter it.
          if (onlySuite.hasOnly()) {
            onlySuite.filterOnly();
          }
        }); // Run the `only` suites, as well as any other suites that have `only` tests/suites as descendants.

        const onlySuites = this._onlySuites;
        this.suites = this.suites.filter(childSuite => {
          return (
            onlySuites.includes(childSuite) || childSuite.filterOnly()
          );
        });
      } // Keep the suite only if there is something to run

      return this.tests.length > 0 || this.suites.length > 0;
    };
    /**
     * Adds a suite to the list of subsuites marked `only`.
     *
     * @private
     * @param {Suite} suite
     */

    Suite.prototype.appendOnlySuite = function (suite) {
      this._onlySuites.push(suite);
    };
    /**
     * Marks a suite to be `only`.
     *
     * @private
     */

    Suite.prototype.markOnly = function () {
      this.parent && this.parent.appendOnlySuite(this);
    };
    /**
     * Adds a test to the list of tests marked `only`.
     *
     * @private
     * @param {Test} test
     */

    Suite.prototype.appendOnlyTest = function (test) {
      this._onlyTests.push(test);
    };
    /**
     * Returns the array of hooks by hook name; see `HOOK_TYPE_*` constants.
     * @private
     */

    Suite.prototype.getHooks = function getHooks(name) {
      return this[`_${name}`];
    };
    /**
     * cleans all references from this suite and all child suites.
     */

    Suite.prototype.dispose = function () {
      this.suites.forEach(suite => {
        suite.dispose();
      });
      this.cleanReferences();
    };
    /**
     * Cleans up the references to all the deferred functions
     * (before/after/beforeEach/afterEach) and tests of a Suite.
     * These must be deleted otherwise a memory leak can happen,
     * as those functions may reference variables from closures,
     * thus those variables can never be garbage collected as long
     * as the deferred functions exist.
     *
     * @private
     */

    Suite.prototype.cleanReferences = function cleanReferences() {
      function cleanArrReferences(arr) {
        for (const element of arr) {
          delete element.fn;
        }
      }

      if (Array.isArray(this._beforeAll)) {
        cleanArrReferences(this._beforeAll);
      }

      if (Array.isArray(this._beforeEach)) {
        cleanArrReferences(this._beforeEach);
      }

      if (Array.isArray(this._afterAll)) {
        cleanArrReferences(this._afterAll);
      }

      if (Array.isArray(this._afterEach)) {
        cleanArrReferences(this._afterEach);
      }

      for (let i = 0; i < this.tests.length; i++) {
        delete this.tests[i].fn;
      }
    };
    /**
     * Returns an object suitable for IPC.
     * Functions are represented by keys beginning with `$$`.
     * @private
     * @returns {Object}
     */

    Suite.prototype.serialize = function serialize() {
      return {
        _bail: this._bail,
        $$fullTitle: this.fullTitle(),
        $$isPending: this.isPending(),
        root: this.root,
        title: this.title,
        id: this.id,
        parent: this.parent
          ? _defineProperty({}, MOCHA_ID_PROP_NAME, this.parent.id)
          : null,
      };
    };

    var constants = defineConstants(
      /**
       * {@link Suite}-related constants.
       * @public
       * @memberof Suite
       * @alias constants
       * @readonly
       * @static
       * @enum {string}
       */
      {
        /**
         * Event emitted after a test file has been loaded Not emitted in browser.
         */
        EVENT_FILE_POST_REQUIRE: 'post-require',

        /**
         * Event emitted before a test file has been loaded. In browser, this is emitted once an interface has been selected.
         */
        EVENT_FILE_PRE_REQUIRE: 'pre-require',

        /**
         * Event emitted immediately after a test file has been loaded. Not emitted in browser.
         */
        EVENT_FILE_REQUIRE: 'require',

        /**
         * Event emitted when `global.run()` is called (use with `delay` option)
         */
        EVENT_ROOT_SUITE_RUN: 'run',

        /**
         * Namespace for collection of a `Suite`'s "after all" hooks
         */
        HOOK_TYPE_AFTER_ALL: 'afterAll',

        /**
         * Namespace for collection of a `Suite`'s "after each" hooks
         */
        HOOK_TYPE_AFTER_EACH: 'afterEach',

        /**
         * Namespace for collection of a `Suite`'s "before all" hooks
         */
        HOOK_TYPE_BEFORE_ALL: 'beforeAll',

        /**
         * Namespace for collection of a `Suite`'s "before all" hooks
         */
        HOOK_TYPE_BEFORE_EACH: 'beforeEach',
        // the following events are all deprecated

        /**
         * Emitted after an "after all" `Hook` has been added to a `Suite`. Deprecated
         */
        EVENT_SUITE_ADD_HOOK_AFTER_ALL: 'afterAll',

        /**
         * Emitted after an "after each" `Hook` has been added to a `Suite` Deprecated
         */
        EVENT_SUITE_ADD_HOOK_AFTER_EACH: 'afterEach',

        /**
         * Emitted after an "before all" `Hook` has been added to a `Suite` Deprecated
         */
        EVENT_SUITE_ADD_HOOK_BEFORE_ALL: 'beforeAll',

        /**
         * Emitted after an "before each" `Hook` has been added to a `Suite` Deprecated
         */
        EVENT_SUITE_ADD_HOOK_BEFORE_EACH: 'beforeEach',

        /**
         * Emitted after a child `Suite` has been added to a `Suite`. Deprecated
         */
        EVENT_SUITE_ADD_SUITE: 'suite',

        /**
         * Emitted after a `Test` has been added to a `Suite`. Deprecated
         */
        EVENT_SUITE_ADD_TEST: 'test',
      },
    );
    /**
     * @summary There are no known use cases for these events.
     * @desc This is a `Set`-like object having all keys being the constant's string value and the value being `true`.
     * @todo Remove eventually
     * @type {Object<string,boolean>}
     * @ignore
     */

    var deprecatedEvents = Object.keys(constants)
      .filter(constant => {
        return constant.slice(0, 15) === 'EVENT_SUITE_ADD';
      })
      .reduce((acc, constant) => {
        acc[constants[constant]] = true;
        return acc;
      }, createMap());
    Suite.constants = constants;
  });

  /**
   * Module dependencies.
   * @private
   */

  const EventEmitter$2 = EventEmitter.EventEmitter;
  const debug$2 = browser$2('mocha:runner');
  const HOOK_TYPE_BEFORE_EACH = suite.constants.HOOK_TYPE_BEFORE_EACH;
  const HOOK_TYPE_AFTER_EACH = suite.constants.HOOK_TYPE_AFTER_EACH;
  const HOOK_TYPE_AFTER_ALL = suite.constants.HOOK_TYPE_AFTER_ALL;
  const HOOK_TYPE_BEFORE_ALL = suite.constants.HOOK_TYPE_BEFORE_ALL;
  const EVENT_ROOT_SUITE_RUN = suite.constants.EVENT_ROOT_SUITE_RUN;
  const STATE_FAILED = runnable.constants.STATE_FAILED;
  const STATE_PASSED = runnable.constants.STATE_PASSED;
  const STATE_PENDING = runnable.constants.STATE_PENDING;
  const dQuote = utils.dQuote;
  const sQuote = utils.sQuote;
  const stackFilter = utils.stackTraceFilter();
  const stringify = utils.stringify;
  const createInvalidExceptionError$2 = errors.createInvalidExceptionError,
    createUnsupportedError$1 = errors.createUnsupportedError,
    createFatalError$1 = errors.createFatalError,
    isMochaError$1 = errors.isMochaError,
    errorConstants = errors.constants;
  /**
   * Non-enumerable globals.
   * @private
   * @readonly
   */

  const globals = [
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'XMLHttpRequest',
    'Date',
    'setImmediate',
    'clearImmediate',
  ];
  const constants$3 = utils.defineConstants(
    /**
     * {@link Runner}-related constants.
     * @public
     * @memberof Runner
     * @readonly
     * @alias constants
     * @static
     * @enum {string}
     */
    {
      /**
       * Emitted when {@link Hook} execution begins
       */
      EVENT_HOOK_BEGIN: 'hook',

      /**
       * Emitted when {@link Hook} execution ends
       */
      EVENT_HOOK_END: 'hook end',

      /**
       * Emitted when Root {@link Suite} execution begins (all files have been parsed and hooks/tests are ready for execution)
       */
      EVENT_RUN_BEGIN: 'start',

      /**
       * Emitted when Root {@link Suite} execution has been delayed via `delay` option
       */
      EVENT_DELAY_BEGIN: 'waiting',

      /**
       * Emitted when delayed Root {@link Suite} execution is triggered by user via `global.run()`
       */
      EVENT_DELAY_END: 'ready',

      /**
       * Emitted when Root {@link Suite} execution ends
       */
      EVENT_RUN_END: 'end',

      /**
       * Emitted when {@link Suite} execution begins
       */
      EVENT_SUITE_BEGIN: 'suite',

      /**
       * Emitted when {@link Suite} execution ends
       */
      EVENT_SUITE_END: 'suite end',

      /**
       * Emitted when {@link Test} execution begins
       */
      EVENT_TEST_BEGIN: 'test',

      /**
       * Emitted when {@link Test} execution ends
       */
      EVENT_TEST_END: 'test end',

      /**
       * Emitted when {@link Test} execution fails
       */
      EVENT_TEST_FAIL: 'fail',

      /**
       * Emitted when {@link Test} execution succeeds
       */
      EVENT_TEST_PASS: 'pass',

      /**
       * Emitted when {@link Test} becomes pending
       */
      EVENT_TEST_PENDING: 'pending',

      /**
       * Emitted when {@link Test} execution has failed, but will retry
       */
      EVENT_TEST_RETRY: 'retry',

      /**
       * Initial state of Runner
       */
      STATE_IDLE: 'idle',

      /**
       * State set to this value when the Runner has started running
       */
      STATE_RUNNING: 'running',

      /**
       * State set to this value when the Runner has stopped
       */
      STATE_STOPPED: 'stopped',
    },
  );

  const Runner = /*#__PURE__*/ (function (_EventEmitter) {
    _inherits(Runner, _EventEmitter);

    const _super = _createSuper(Runner);

    /**
     * Initialize a `Runner` at the Root {@link Suite}, which represents a hierarchy of {@link Suite|Suites} and {@link Test|Tests}.
     *
     * @extends external:EventEmitter
     * @public
     * @class
     * @param {Suite} suite - Root suite
     * @param {Object|boolean} [opts] - Options. If `boolean`, whether or not to delay execution of root suite until ready (for backwards compatibility).
     * @param {boolean} [opts.delay] - Whether to delay execution of root suite until ready.
     * @param {boolean} [opts.cleanReferencesAfterRun] - Whether to clean references to test fns and hooks when a suite is done.
     */
    function Runner(suite, opts) {
      let _this;

      _classCallCheck(this, Runner);

      _this = _super.call(this);

      if (opts === undefined) {
        opts = {};
      }

      if (typeof opts === 'boolean') {
        // TODO: deprecate this
        _this._delay = opts;
        opts = {};
      } else {
        _this._delay = opts.delay;
      }

      const self = _assertThisInitialized(_this);

      _this._globals = [];
      _this._abort = false;
      _this.suite = suite;
      _this._opts = opts;
      _this.state = constants$3.STATE_IDLE;
      _this.total = suite.total();
      _this.failures = 0;
      /**
       * @type {Map<EventEmitter,Map<string,Set<EventListener>>>}
       */

      _this._eventListeners = new Map();

      _this.on(constants$3.EVENT_TEST_END, test => {
        if (test.type === 'test' && test.retriedTest() && test.parent) {
          let idx =
            test.parent.tests && test.parent.tests.indexOf(test.retriedTest());
          if (idx > -1) test.parent.tests[idx] = test;
        }

        self.checkGlobals(test);
      });

      _this.on(constants$3.EVENT_HOOK_END, hook => {
        self.checkGlobals(hook);
      });

      _this._defaultGrep = /.*/;

      _this.grep(_this._defaultGrep);

      _this.globals(_this.globalProps());

      _this.uncaught = _this._uncaught.bind(_assertThisInitialized(_this));

      _this.unhandled = function (reason, promise) {
        if (isMochaError$1(reason)) {
          debug$2(
            'trapped unhandled rejection coming out of Mocha; forwarding to uncaught handler:',
            reason,
          );

          _this.uncaught(reason);
        } else {
          debug$2(
            'trapped unhandled rejection from (probably) user code; re-emitting on process',
          );

          _this._removeEventListener(
            process$1,
            'unhandledRejection',
            _this.unhandled,
          );

          try {
            process$1.emit('unhandledRejection', reason, promise);
          } finally {
            _this._addEventListener(
              process$1,
              'unhandledRejection',
              _this.unhandled,
            );
          }
        }
      };

      return _this;
    }

    return Runner;
  })(EventEmitter$2);
  /**
   * Wrapper for setImmediate, process.nextTick, or browser polyfill.
   *
   * @param {Function} fn
   * @private
   */

  Runner.immediately = commonjsGlobal.setImmediate || nextTick;
  /**
   * Replacement for `target.on(eventName, listener)` that does bookkeeping to remove them when this runner instance is disposed.
   * @param {EventEmitter} target - The `EventEmitter`
   * @param {string} eventName - The event name
   * @param {string} fn - Listener function
   * @private
   */

  Runner.prototype._addEventListener = function (target, eventName, listener) {
    debug$2(
      '_addEventListener(): adding for event %s; %d current listeners',
      eventName,
      target.listenerCount(eventName),
    );
    /* istanbul ignore next */

    if (
      this._eventListeners.has(target) &&
      this._eventListeners.get(target).has(eventName) &&
      this._eventListeners.get(target).get(eventName).has(listener)
    ) {
      debug$2(
        'warning: tried to attach duplicate event listener for %s',
        eventName,
      );
      return;
    }

    target.on(eventName, listener);
    const targetListeners = this._eventListeners.has(target)
      ? this._eventListeners.get(target)
      : new Map();
    const targetEventListeners = targetListeners.has(eventName)
      ? targetListeners.get(eventName)
      : new Set();
    targetEventListeners.add(listener);
    targetListeners.set(eventName, targetEventListeners);

    this._eventListeners.set(target, targetListeners);
  };
  /**
   * Replacement for `target.removeListener(eventName, listener)` that also updates the bookkeeping.
   * @param {EventEmitter} target - The `EventEmitter`
   * @param {string} eventName - The event name
   * @param {function} listener - Listener function
   * @private
   */

  Runner.prototype._removeEventListener = function (
    target,
    eventName,
    listener,
  ) {
    target.removeListener(eventName, listener);

    if (this._eventListeners.has(target)) {
      const targetListeners = this._eventListeners.get(target);

      if (targetListeners.has(eventName)) {
        const targetEventListeners = targetListeners.get(eventName);
        targetEventListeners['delete'](listener);

        if (targetEventListeners.size === 0) {
          targetListeners['delete'](eventName);
        }
      }

      if (targetListeners.size === 0) {
        this._eventListeners['delete'](target);
      }
    } else {
      debug$2('trying to remove listener for untracked object %s', target);
    }
  };
  /**
   * Removes all event handlers set during a run on this instance.
   * Remark: this does _not_ clean/dispose the tests or suites themselves.
   */

  Runner.prototype.dispose = function () {
    this.removeAllListeners();

    this._eventListeners.forEach((targetListeners, target) => {
      targetListeners.forEach((targetEventListeners, eventName) => {
        targetEventListeners.forEach(listener => {
          target.removeListener(eventName, listener);
        });
      });
    });

    this._eventListeners.clear();
  };
  /**
   * Run tests with full titles matching `re`. Updates runner.total
   * with number of tests matched.
   *
   * @public
   * @memberof Runner
   * @param {RegExp} re
   * @param {boolean} invert
   * @return {Runner} Runner instance.
   */

  Runner.prototype.grep = function (re, invert) {
    debug$2('grep(): setting to %s', re);
    this._grep = re;
    this._invert = invert;
    this.total = this.grepTotal(this.suite);
    return this;
  };
  /**
   * Returns the number of tests matching the grep search for the
   * given suite.
   *
   * @memberof Runner
   * @public
   * @param {Suite} suite
   * @return {number}
   */

  Runner.prototype.grepTotal = function (suite) {
    const self = this;
    let total = 0;
    suite.eachTest(test => {
      let match = self._grep.test(test.fullTitle());

      if (self._invert) {
        match = !match;
      }

      if (match) {
        total++;
      }
    });
    return total;
  };
  /**
   * Return a list of global properties.
   *
   * @return {Array}
   * @private
   */

  Runner.prototype.globalProps = function () {
    const props = Object.keys(commonjsGlobal); // non-enumerables

    for (const global_ of globals) {
      if (~props.indexOf(global_)) {
        continue;
      }

      props.push(global_);
    }

    return props;
  };
  /**
   * Allow the given `arr` of globals.
   *
   * @public
   * @memberof Runner
   * @param {Array} arr
   * @return {Runner} Runner instance.
   */

  Runner.prototype.globals = function (arr) {
    if (arguments.length === 0) {
      return this._globals;
    }

    debug$2('globals(): setting to %O', arr);
    this._globals = this._globals.concat(arr);
    return this;
  };
  /**
   * Check for global variable leaks.
   *
   * @private
   */

  Runner.prototype.checkGlobals = function (test) {
    if (!this.checkLeaks) {
      return;
    }

    let ok = this._globals;
    const globals = this.globalProps();
    let leaks;

    if (test) {
      ok = ok.concat(test._allowedGlobals || []);
    }

    if (this.prevGlobalsLength === globals.length) {
      return;
    }

    this.prevGlobalsLength = globals.length;
    leaks = filterLeaks(ok, globals);
    this._globals = this._globals.concat(leaks);

    if (leaks.length > 0) {
      const msg = 'global leak(s) detected: %s';
      const error = new Error(util.format(msg, leaks.map(sQuote).join(', ')));
      this.fail(test, error);
    }
  };
  /**
   * Fail the given `test`.
   *
   * If `test` is a hook, failures work in the following pattern:
   * - If bail, run corresponding `after each` and `after` hooks,
   *   then exit
   * - Failed `before` hook skips all tests in a suite and subsuites,
   *   but jumps to corresponding `after` hook
   * - Failed `before each` hook skips remaining tests in a
   *   suite and jumps to corresponding `after each` hook,
   *   which is run only once
   * - Failed `after` hook does not alter execution order
   * - Failed `after each` hook skips remaining tests in a
   *   suite and subsuites, but executes other `after each`
   *   hooks
   *
   * @private
   * @param {Runnable} test
   * @param {Error} err
   * @param {boolean} [force=false] - Whether to fail a pending test.
   */

  Runner.prototype.fail = function (test, err, force) {
    force = force === true;

    if (test.isPending() && !force) {
      return;
    }

    if (this.state === constants$3.STATE_STOPPED) {
      if (err.code === errorConstants.MULTIPLE_DONE) {
        throw err;
      }

      throw createFatalError$1(
        'Test failed after root suite execution completed!',
        err,
      );
    }

    ++this.failures;
    debug$2('total number of failures: %d', this.failures);
    test.state = STATE_FAILED;

    if (!isError$1(err)) {
      err = thrown2Error(err);
    }

    try {
      err.stack =
        this.fullStackTrace || !err.stack ? err.stack : stackFilter(err.stack);
    } catch {
      // some environments do not take kindly to monkeying with the stack
    }

    this.emit(constants$3.EVENT_TEST_FAIL, test, err);
  };
  /**
   * Run hook `name` callbacks and then invoke `fn()`.
   *
   * @private
   * @param {string} name
   * @param {Function} fn
   */

  Runner.prototype.hook = function (name, fn) {
    const suite = this.suite;
    let hooks = suite.getHooks(name);
    const self = this;

    function next(i) {
      const hook = hooks[i];

      if (!hook) {
        return fn();
      }

      self.currentRunnable = hook;

      if (name === HOOK_TYPE_BEFORE_ALL) {
        hook.ctx.currentTest = hook.parent.tests[0];
      } else if (name === HOOK_TYPE_AFTER_ALL) {
        hook.ctx.currentTest = hook.parent.tests[hook.parent.tests.length - 1];
      } else {
        hook.ctx.currentTest = self.test;
      }

      setHookTitle(hook);
      hook.allowUncaught = self.allowUncaught;
      self.emit(constants$3.EVENT_HOOK_BEGIN, hook);

      if (hook.listeners('error').length === 0) {
        self._addEventListener(hook, 'error', err => {
          self.fail(hook, err);
        });
      }

      hook.run(err => {
        const testError = hook.error();

        if (testError) {
          self.fail(self.test, testError);
        } // conditional skip

        if (hook.pending) {
          if (name === HOOK_TYPE_AFTER_EACH) {
            // TODO define and implement use case
            if (self.test) {
              self.test.pending = true;
            }
          } else if (name === HOOK_TYPE_BEFORE_EACH) {
            if (self.test) {
              self.test.pending = true;
            }

            self.emit(constants$3.EVENT_HOOK_END, hook);
            hook.pending = false; // activates hook for next test

            return fn(new Error('abort hookDown'));
          } else if (name === HOOK_TYPE_BEFORE_ALL) {
            suite.tests.forEach(test => {
              test.pending = true;
            });
            suite.suites.forEach(suite => {
              suite.pending = true;
            });
            hooks = [];
          } else {
            hook.pending = false;
            const errForbid = createUnsupportedError$1('`this.skip` forbidden');
            self.fail(hook, errForbid);
            return fn(errForbid);
          }
        } else if (err) {
          self.fail(hook, err); // stop executing hooks, notify callee of hook err

          return fn(err);
        }

        self.emit(constants$3.EVENT_HOOK_END, hook);
        delete hook.ctx.currentTest;
        setHookTitle(hook);
        next(++i);
      });

      function setHookTitle(hook) {
        hook.originalTitle = hook.originalTitle || hook.title;

        if (hook.ctx && hook.ctx.currentTest) {
          hook.title = `${hook.originalTitle} for ${dQuote(
            hook.ctx.currentTest.title,
          )}`;
        } else {
          let parentTitle;

          if (hook.parent.title) {
            parentTitle = hook.parent.title;
          } else {
            parentTitle = hook.parent.root ? '{root}' : '';
          }

          hook.title = `${hook.originalTitle} in ${dQuote(parentTitle)}`;
        }
      }
    }

    Runner.immediately(() => {
      next(0);
    });
  };
  /**
   * Run hook `name` for the given array of `suites`
   * in order, and callback `fn(err, errSuite)`.
   *
   * @private
   * @param {string} name
   * @param {Array} suites
   * @param {Function} fn
   */

  Runner.prototype.hooks = function (name, suites, fn) {
    const self = this;
    const orig = this.suite;

    function next(suite) {
      self.suite = suite;

      if (!suite) {
        self.suite = orig;
        return fn();
      }

      self.hook(name, err => {
        if (err) {
          const errSuite = self.suite;
          self.suite = orig;
          return fn(err, errSuite);
        }

        next(suites.pop());
      });
    }

    next(suites.pop());
  };
  /**
   * Run hooks from the top level down.
   *
   * @param {String} name
   * @param {Function} fn
   * @private
   */

  Runner.prototype.hookUp = function (name, fn) {
    const suites = [this.suite].concat(this.parents()).reverse();
    this.hooks(name, suites, fn);
  };
  /**
   * Run hooks from the bottom up.
   *
   * @param {String} name
   * @param {Function} fn
   * @private
   */

  Runner.prototype.hookDown = function (name, fn) {
    const suites = [this.suite].concat(this.parents());
    this.hooks(name, suites, fn);
  };
  /**
   * Return an array of parent Suites from
   * closest to furthest.
   *
   * @return {Array}
   * @private
   */

  Runner.prototype.parents = function () {
    let suite = this.suite;
    const suites = [];

    while (suite.parent) {
      suite = suite.parent;
      suites.push(suite);
    }

    return suites;
  };
  /**
   * Run the current test and callback `fn(err)`.
   *
   * @param {Function} fn
   * @private
   */

  Runner.prototype.runTest = function (fn) {
    const self = this;
    const test = this.test;

    if (!test) {
      return;
    }

    if (this.asyncOnly) {
      test.asyncOnly = true;
    }

    this._addEventListener(test, 'error', err => {
      self.fail(test, err);
    });

    if (this.allowUncaught) {
      test.allowUncaught = true;
      return test.run(fn);
    }

    try {
      test.run(fn);
    } catch (err) {
      fn(err);
    }
  };
  /**
   * Run tests in the given `suite` and invoke the callback `fn()` when complete.
   *
   * @private
   * @param {Suite} suite
   * @param {Function} fn
   */

  Runner.prototype.runTests = function (suite, fn) {
    const self = this;
    let tests = suite.tests.slice();
    let test;

    function hookErr(_, errSuite, after) {
      // before/after Each hook for errSuite failed:
      const orig = self.suite; // for failed 'after each' hook start from errSuite parent,
      // otherwise start from errSuite itself

      self.suite = after ? errSuite.parent : errSuite;

      if (self.suite) {
        // call hookUp afterEach
        self.hookUp(HOOK_TYPE_AFTER_EACH, (err2, errSuite2) => {
          self.suite = orig; // some hooks may fail even now

          if (err2) {
            return hookErr(err2, errSuite2, true);
          } // report error suite

          fn(errSuite);
        });
      } else {
        // there is no need calling other 'after each' hooks
        self.suite = orig;
        fn(errSuite);
      }
    }

    function next(err, errSuite) {
      // if we bail after first err
      if (self.failures && suite._bail) {
        tests = [];
      }

      if (self._abort) {
        return fn();
      }

      if (err) {
        return hookErr(err, errSuite, true);
      } // next test

      test = tests.shift(); // all done

      if (!test) {
        return fn();
      } // grep

      let match = self._grep.test(test.fullTitle());

      if (self._invert) {
        match = !match;
      }

      if (!match) {
        // Run immediately only if we have defined a grep. When we
        // define a grep — It can cause maximum callstack error if
        // the grep is doing a large recursive loop by neglecting
        // all tests. The run immediately function also comes with
        // a performance cost. So we don't want to run immediately
        // if we run the whole test suite, because running the whole
        // test suite don't do any immediate recursive loops. Thus,
        // allowing a JS runtime to breathe.
        if (self._grep !== self._defaultGrep) {
          Runner.immediately(next);
        } else {
          next();
        }

        return;
      } // static skip, no hooks are executed

      if (test.isPending()) {
        if (self.forbidPending) {
          self.fail(test, new Error('Pending test forbidden'), true);
        } else {
          test.state = STATE_PENDING;
          self.emit(constants$3.EVENT_TEST_PENDING, test);
        }

        self.emit(constants$3.EVENT_TEST_END, test);
        return next();
      } // execute test and hook(s)

      self.emit(constants$3.EVENT_TEST_BEGIN, (self.test = test));
      self.hookDown(HOOK_TYPE_BEFORE_EACH, (err, errSuite) => {
        // conditional skip within beforeEach
        if (test.isPending()) {
          if (self.forbidPending) {
            self.fail(test, new Error('Pending test forbidden'), true);
          } else {
            test.state = STATE_PENDING;
            self.emit(constants$3.EVENT_TEST_PENDING, test);
          }

          self.emit(constants$3.EVENT_TEST_END, test); // skip inner afterEach hooks below errSuite level

          const origSuite = self.suite;
          self.suite = errSuite || self.suite;
          return self.hookUp(HOOK_TYPE_AFTER_EACH, (e, eSuite) => {
            self.suite = origSuite;
            next(e, eSuite);
          });
        }

        if (err) {
          return hookErr(err, errSuite, false);
        }

        self.currentRunnable = self.test;
        self.runTest(err => {
          test = self.test; // conditional skip within it

          if (test.pending) {
            if (self.forbidPending) {
              self.fail(test, new Error('Pending test forbidden'), true);
            } else {
              test.state = STATE_PENDING;
              self.emit(constants$3.EVENT_TEST_PENDING, test);
            }

            self.emit(constants$3.EVENT_TEST_END, test);
            return self.hookUp(HOOK_TYPE_AFTER_EACH, next);
          } else if (err) {
            const retry = test.currentRetry();

            if (retry < test.retries()) {
              const clonedTest = test.clone();
              clonedTest.currentRetry(retry + 1);
              tests.unshift(clonedTest);
              self.emit(constants$3.EVENT_TEST_RETRY, test, err); // Early return + hook trigger so that it doesn't
              // increment the count wrong

              return self.hookUp(HOOK_TYPE_AFTER_EACH, next);
            } else {
              self.fail(test, err);
            }

            self.emit(constants$3.EVENT_TEST_END, test);
            return self.hookUp(HOOK_TYPE_AFTER_EACH, next);
          }

          test.state = STATE_PASSED;
          self.emit(constants$3.EVENT_TEST_PASS, test);
          self.emit(constants$3.EVENT_TEST_END, test);
          self.hookUp(HOOK_TYPE_AFTER_EACH, next);
        });
      });
    }

    this.next = next;
    this.hookErr = hookErr;
    next();
  };
  /**
   * Run the given `suite` and invoke the callback `fn()` when complete.
   *
   * @private
   * @param {Suite} suite
   * @param {Function} fn
   */

  Runner.prototype.runSuite = function (suite, fn) {
    let i = 0;
    const self = this;
    const total = this.grepTotal(suite);
    debug$2('runSuite(): running %s', suite.fullTitle());

    if (!total || (self.failures && suite._bail)) {
      debug$2('runSuite(): bailing');
      return fn();
    }

    this.emit(constants$3.EVENT_SUITE_BEGIN, (this.suite = suite));

    function next(errSuite) {
      if (errSuite) {
        // current suite failed on a hook from errSuite
        if (errSuite === suite) {
          // if errSuite is current suite
          // continue to the next sibling suite
          return done();
        } // errSuite is among the parents of current suite
        // stop execution of errSuite and all sub-suites

        return done(errSuite);
      }

      if (self._abort) {
        return done();
      }

      const curr = suite.suites[i++];

      if (!curr) {
        return done();
      } // Avoid grep neglecting large number of tests causing a
      // huge recursive loop and thus a maximum call stack error.
      // See comment in `this.runTests()` for more information.

      if (self._grep !== self._defaultGrep) {
        Runner.immediately(() => {
          self.runSuite(curr, next);
        });
      } else {
        self.runSuite(curr, next);
      }
    }

    function done(errSuite) {
      self.suite = suite;
      self.nextSuite = next; // remove reference to test

      delete self.test;
      self.hook(HOOK_TYPE_AFTER_ALL, () => {
        self.emit(constants$3.EVENT_SUITE_END, suite);
        fn(errSuite);
      });
    }

    this.nextSuite = next;
    this.hook(HOOK_TYPE_BEFORE_ALL, err => {
      if (err) {
        return done();
      }

      self.runTests(suite, next);
    });
  };
  /**
   * Handle uncaught exceptions within runner.
   *
   * This function is bound to the instance as `Runner#uncaught` at instantiation
   * time. It's intended to be listening on the `Process.uncaughtException` event.
   * In order to not leak EE listeners, we need to ensure no more than a single
   * `uncaughtException` listener exists per `Runner`.  The only way to do
   * this--because this function needs the context (and we don't have lambdas)--is
   * to use `Function.prototype.bind`. We need strict equality to unregister and
   * _only_ unregister the _one_ listener we set from the
   * `Process.uncaughtException` event; would be poor form to just remove
   * everything. See {@link Runner#run} for where the event listener is registered
   * and unregistered.
   * @param {Error} err - Some uncaught error
   * @private
   */

  Runner.prototype._uncaught = function (err) {
    // this is defensive to prevent future developers from mis-calling this function.
    // it's more likely that it'd be called with the incorrect context--say, the global
    // `process` object--than it would to be called with a context that is not a "subclass"
    // of `Runner`.
    if (!(this instanceof Runner)) {
      throw createFatalError$1(
        'Runner#uncaught() called with invalid context',
        this,
      );
    }

    if (err instanceof pending) {
      debug$2('uncaught(): caught a Pending');
      return;
    } // browser does not exit script when throwing in global.onerror()

    if (this.allowUncaught && !utils.isBrowser()) {
      debug$2('uncaught(): bubbling exception due to --allow-uncaught');
      throw err;
    }

    if (this.state === constants$3.STATE_STOPPED) {
      debug$2('uncaught(): throwing after run has completed!');
      throw err;
    }

    if (err) {
      debug$2('uncaught(): got truthy exception %O', err);
    } else {
      debug$2('uncaught(): undefined/falsy exception');
      err = createInvalidExceptionError$2(
        'Caught falsy/undefined exception which would otherwise be uncaught. No stack trace found; try a debugger',
        err,
      );
    }

    if (!isError$1(err)) {
      err = thrown2Error(err);
      debug$2('uncaught(): converted "error" %o to Error', err);
    }

    err.uncaught = true;
    let runnable$1 = this.currentRunnable;

    if (!runnable$1) {
      runnable$1 = new runnable('Uncaught error outside test suite');
      debug$2('uncaught(): no current Runnable; created a phony one');
      runnable$1.parent = this.suite;

      if (this.state === constants$3.STATE_RUNNING) {
        debug$2('uncaught(): failing gracefully');
        this.fail(runnable$1, err);
      } else {
        // Can't recover from this failure
        debug$2('uncaught(): test run has not yet started; unrecoverable');
        this.emit(constants$3.EVENT_RUN_BEGIN);
        this.fail(runnable$1, err);
        this.emit(constants$3.EVENT_RUN_END);
      }

      return;
    }

    runnable$1.clearTimeout();

    if (runnable$1.isFailed()) {
      debug$2('uncaught(): Runnable has already failed'); // Ignore error if already failed

      return;
    } else if (runnable$1.isPending()) {
      debug$2('uncaught(): pending Runnable wound up failing!'); // report 'pending test' retrospectively as failed

      this.fail(runnable$1, err, true);
      return;
    } // we cannot recover gracefully if a Runnable has already passed
    // then fails asynchronously

    if (runnable$1.isPassed()) {
      debug$2('uncaught(): Runnable has already passed; bailing gracefully');
      this.fail(runnable$1, err);
      this.abort();
    } else {
      debug$2('uncaught(): forcing Runnable to complete with Error');
      return runnable$1.callback(err);
    }
  };
  /**
   * Run the root suite and invoke `fn(failures)`
   * on completion.
   *
   * @public
   * @memberof Runner
   * @param {Function} fn - Callback when finished
   * @param {{files: string[], options: Options}} [opts] - For subclasses
   * @returns {Runner} Runner instance.
   */

  Runner.prototype.run = function (fn) {
    const _this2 = this;

    const opts =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const rootSuite = this.suite;
    const options = opts.options || {};
    debug$2('run(): got options: %O', options);

    fn = fn || function () {};

    const end = function end() {
      debug$2(
        'run(): root suite completed; emitting %s',
        constants$3.EVENT_RUN_END,
      );

      _this2.emit(constants$3.EVENT_RUN_END);
    };

    const begin = function begin() {
      debug$2('run(): emitting %s', constants$3.EVENT_RUN_BEGIN);

      _this2.emit(constants$3.EVENT_RUN_BEGIN);

      debug$2('run(): emitted %s', constants$3.EVENT_RUN_BEGIN);

      _this2.runSuite(rootSuite, end);
    };

    const prepare = function prepare() {
      debug$2('run(): starting'); // If there is an `only` filter

      if (rootSuite.hasOnly()) {
        rootSuite.filterOnly();
        debug$2('run(): filtered exclusive Runnables');
      }

      _this2.state = constants$3.STATE_RUNNING;

      if (_this2._delay) {
        _this2.emit(constants$3.EVENT_DELAY_END);

        debug$2('run(): "delay" ended');
      }

      return begin();
    }; // references cleanup to avoid memory leaks

    if (this._opts.cleanReferencesAfterRun) {
      this.on(constants$3.EVENT_SUITE_END, suite => {
        suite.cleanReferences();
      });
    } // callback

    this.on(constants$3.EVENT_RUN_END, function () {
      this.state = constants$3.STATE_STOPPED;
      debug$2('run(): emitted %s', constants$3.EVENT_RUN_END);
      fn(this.failures);
    });

    this._removeEventListener(process$1, 'uncaughtException', this.uncaught);

    this._removeEventListener(process$1, 'unhandledRejection', this.unhandled);

    this._addEventListener(process$1, 'uncaughtException', this.uncaught);

    this._addEventListener(process$1, 'unhandledRejection', this.unhandled);

    if (this._delay) {
      // for reporters, I guess.
      // might be nice to debounce some dots while we wait.
      this.emit(constants$3.EVENT_DELAY_BEGIN, rootSuite);
      rootSuite.once(EVENT_ROOT_SUITE_RUN, prepare);
      debug$2('run(): waiting for green light due to --delay');
    } else {
      Runner.immediately(prepare);
    }

    return this;
  };
  /**
	 * Toggle partial object linking behavior; used for building object references from
	 * unique ID's. Does nothing in serial mode, because the object references already exist.
	 * Subclasses can implement this (e.g., `ParallelBufferedRunner`)
	 * @abstract
	 * @param {boolean} [value] - If `true`, enable partial object linking, otherwise disable
	 * @returns {Runner}
	 * @chainable
	 * @public
	 * @example
	 * // this reporter needs proper object references when run in parallel mode
	 * class MyReporter() {
	 *   constructor(runner) {
	 *     this.runner.linkPartialObjects(true)
	 *       .on(EVENT_SUITE_BEGIN, suite => {
	           // this Suite may be the same object...
	 *       })
	 *       .on(EVENT_TEST_BEGIN, test => {
	 *         // ...as the `test.parent` property
	 *       });
	 *   }
	 * }
	 */

  Runner.prototype.linkPartialObjects = function (value) {
    return this;
  };
  /*
   * Like {@link Runner#run}, but does not accept a callback and returns a `Promise` instead of a `Runner`.
   * This function cannot reject; an `unhandledRejection` event will bubble up to the `process` object instead.
   * @public
   * @memberof Runner
   * @param {Object} [opts] - Options for {@link Runner#run}
   * @returns {Promise<number>} Failure count
   */

  Runner.prototype.runAsync = /*#__PURE__*/ (function () {
    const _runAsync = _asyncToGenerator(
      /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
        const _this3 = this;

        let opts,
          _args = arguments;
        return regeneratorRuntime.wrap(_context => {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                opts =
                  _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                return _context.abrupt(
                  'return',
                  new Promise(resolve => {
                    _this3.run(resolve, opts);
                  }),
                );

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee);
      }),
    );

    function runAsync() {
      return Reflect.apply(_runAsync, this, arguments);
    }

    return runAsync;
  })();
  /**
   * Cleanly abort execution.
   *
   * @memberof Runner
   * @public
   * @return {Runner} Runner instance.
   */

  Runner.prototype.abort = function () {
    debug$2('abort(): aborting');
    this._abort = true;
    return this;
  };
  /**
   * Returns `true` if Mocha is running in parallel mode.  For reporters.
   *
   * Subclasses should return an appropriate value.
   * @public
   * @returns {false}
   */

  Runner.prototype.isParallelMode = function isParallelMode() {
    return false;
  };
  /**
   * Configures an alternate reporter for worker processes to use. Subclasses
   * using worker processes should implement this.
   * @public
   * @param {string} path - Absolute path to alternate reporter for worker processes to use
   * @returns {Runner}
   * @throws When in serial mode
   * @chainable
   * @abstract
   */

  Runner.prototype.workerReporter = function () {
    throw createUnsupportedError$1(
      'workerReporter() not supported in serial mode',
    );
  };
  /**
   * Filter leaks with the given globals flagged as `ok`.
   *
   * @private
   * @param {Array} ok
   * @param {Array} globals
   * @return {Array}
   */

  function filterLeaks(ok, globals) {
    return globals.filter(key => {
      // Firefox and Chrome exposes iframes as index inside the window object
      if (/^\d+/.test(key)) {
        return false;
      } // in firefox
      // if runner runs in an iframe, this iframe's window.getInterface method
      // not init at first it is assigned in some seconds

      if (commonjsGlobal.navigator && key.startsWith('getInterface')) {
        return false;
      } // an iframe could be approached by window[iframeIndex]
      // in ie6,7,8 and opera, iframeIndex is enumerable, this could cause leak

      if (commonjsGlobal.navigator && /^\d+/.test(key)) {
        return false;
      } // Opera and IE expose global variables for HTML element IDs (issue #243)

      if (key.startsWith('mocha-')) {
        return false;
      }

      const matched = ok.filter(ok => {
        if (~ok.indexOf('*')) {
          return key.indexOf(ok.split('*')[0]) === 0;
        }

        return key === ok;
      });
      return (
        matched.length === 0 && (!commonjsGlobal.navigator || key !== 'onerror')
      );
    });
  }
  /**
   * Check if argument is an instance of Error object or a duck-typed equivalent.
   *
   * @private
   * @param {Object} err - object to check
   * @param {string} err.message - error message
   * @returns {boolean}
   */

  function isError$1(err) {
    return err instanceof Error || (err && typeof err.message === 'string');
  }
  /**
   *
   * Converts thrown non-extensible type into proper Error.
   *
   * @private
   * @param {*} thrown - Non-extensible type thrown by code
   * @return {Error}
   */

  function thrown2Error(err) {
    return new Error(
      'the '
        .concat(utils.canonicalType(err), ' ')
        .concat(stringify(err), ' was thrown, throw an Error :)'),
    );
  }

  Runner.constants = constants$3;
  /**
   * Node.js' `EventEmitter`
   * @external EventEmitter
   * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter}
   */

  const runner$1 = Runner;

  const base = createCommonjsModule((module, exports) => {
    /**
     * @module Base
     */

    /**
     * Module dependencies.
     */

    const constants = runner$1.constants;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    const isBrowser = utils.isBrowser();

    function getBrowserWindowSize() {
      if ('innerHeight' in commonjsGlobal) {
        return [commonjsGlobal.innerHeight, commonjsGlobal.innerWidth];
      } // In a Web Worker, the DOM Window is not available.

      return [640, 480];
    }
    /**
     * Expose `Base`.
     */

    exports = module.exports = Base;
    /**
     * Check if both stdio streams are associated with a tty.
     */

    let isatty =
      isBrowser || (process$1.stdout.isTTY && process$1.stderr.isTTY);
    /**
     * Save log references to avoid tests interfering (see GH-3604).
     */

    const consoleLog = console.log;
    /**
     * Enable coloring by default, except in the browser interface.
     */

    exports.useColors =
      !isBrowser &&
      (require$$11.stdout || process$1.env.MOCHA_COLORS !== undefined);
    /**
     * Inline diffs instead of +/-
     */

    exports.inlineDiffs = false;
    /**
     * Default color map.
     */

    exports.colors = {
      pass: 90,
      fail: 31,
      'bright pass': 92,
      'bright fail': 91,
      'bright yellow': 93,
      pending: 36,
      suite: 0,
      'error title': 0,
      'error message': 31,
      'error stack': 90,
      checkmark: 32,
      fast: 90,
      medium: 33,
      slow: 31,
      green: 32,
      light: 90,
      'diff gutter': 90,
      'diff added': 32,
      'diff removed': 31,
      'diff added inline': '30;42',
      'diff removed inline': '30;41',
    };
    /**
     * Default symbol map.
     */

    exports.symbols = {
      ok: '✓',
      err: '✖',
      dot: '․',
      comma: ',',
      bang: '!',
    }; // With node.js on Windows: use symbols available in terminal default fonts

    if (process$1.platform === 'win32') {
      exports.symbols.ok = '\u221A';
      exports.symbols.err = '\u00D7';
      exports.symbols.dot = '.';
    }
    /**
     * Color `str` with the given `type`,
     * allowing colors to be disabled,
     * as well as user-defined color
     * schemes.
     *
     * @private
     * @param {string} type
     * @param {string} str
     * @return {string}
     */

    let color = (exports.color = function (type, str) {
      if (!exports.useColors) {
        return String(str);
      }

      return '\u001B[' + exports.colors[type] + 'm' + str + '\u001B[0m';
    });
    /**
     * Expose term window size, with some defaults for when stderr is not a tty.
     */

    exports.window = {
      width: 75,
    };

    if (isatty) {
      if (isBrowser) {
        exports.window.width = getBrowserWindowSize()[1];
      } else {
        exports.window.width = process$1.stdout.getWindowSize(1)[0];
      }
    }
    /**
     * Expose some basic cursor interactions that are common among reporters.
     */

    exports.cursor = {
      hide: function hide() {
        isatty && process$1.stdout.write('\u001B[?25l');
      },
      show: function show() {
        isatty && process$1.stdout.write('\u001B[?25h');
      },
      deleteLine: function deleteLine() {
        isatty && process$1.stdout.write('\u001B[2K');
      },
      beginningOfLine: function beginningOfLine() {
        isatty && process$1.stdout.write('\u001B[0G');
      },
      CR: function CR() {
        if (isatty) {
          exports.cursor.deleteLine();
          exports.cursor.beginningOfLine();
        } else {
          process$1.stdout.write('\r');
        }
      },
    };

    let showDiff = (exports.showDiff = function (err) {
      return (
        err &&
        err.showDiff !== false &&
        sameType(err.actual, err.expected) &&
        err.expected !== undefined
      );
    });

    function stringifyDiffObjs(err) {
      if (!utils.isString(err.actual) || !utils.isString(err.expected)) {
        err.actual = utils.stringify(err.actual);
        err.expected = utils.stringify(err.expected);
      }
    }
    /**
     * Returns a diff between 2 strings with coloured ANSI output.
     *
     * @description
     * The diff will be either inline or unified dependent on the value
     * of `Base.inlineDiff`.
     *
     * @param {string} actual
     * @param {string} expected
     * @return {string} Diff
     */

    let generateDiff = (exports.generateDiff = function (actual, expected) {
      try {
        return exports.inlineDiffs
          ? inlineDiff(actual, expected)
          : unifiedDiff(actual, expected);
      } catch {
        let msg =
          `\n      ${ 
          color('diff added', '+ expected') 
          } ${ 
          color('diff removed', '- actual:  failed to generate Mocha diff') 
          }\n`;
        return msg;
      }
    });
    /**
     * Outputs the given `failures` as a list.
     *
     * @public
     * @memberof Mocha.reporters.Base
     * @variation 1
     * @param {Object[]} failures - Each is Test instance with corresponding
     *     Error property
     */

    exports.list = function (failures) {
      let multipleErr, multipleTest;
      Base.consoleLog();
      failures.forEach((test, i) => {
        // format
        let fmt =
          color('error title', '  %s) %s:\n') +
          color('error message', '     %s') +
          color('error stack', '\n%s\n'); // msg

        let msg;
        let err;

        if (test.err && test.err.multiple) {
          if (multipleTest !== test) {
            multipleTest = test;
            multipleErr = [test.err].concat(test.err.multiple);
          }

          err = multipleErr.shift();
        } else {
          err = test.err;
        }

        let message;

        if (err.message && typeof err.message.toString === 'function') {
          message = `${err.message}`;
        } else if (typeof err.inspect === 'function') {
          message = `${err.inspect()}`;
        } else {
          message = '';
        }

        let stack = err.stack || message;
        let index = message ? stack.indexOf(message) : -1;

        if (index === -1) {
          msg = message;
        } else {
          index += message.length;
          msg = stack.slice(0, index); // remove msg from stack

          stack = stack.slice(index + 1);
        } // uncaught

        if (err.uncaught) {
          msg = `Uncaught ${msg}`;
        } // explicitly show diff

        if (!exports.hideDiff && showDiff(err)) {
          stringifyDiffObjs(err);
          fmt =
            color('error title', '  %s) %s:\n%s') +
            color('error stack', '\n%s\n');
          const match = message.match(/^([^:]+): expected/);
          msg = `\n      ${color('error message', match ? match[1] : msg)}`;
          msg += generateDiff(err.actual, err.expected);
        } // indent stack trace

        stack = stack.replace(/^/gm, '  '); // indented test title

        let testTitle = '';
        test.titlePath().forEach((str, index) => {
          if (index !== 0) {
            testTitle += '\n     ';
          }

          for (let i = 0; i < index; i++) {
            testTitle += '  ';
          }

          testTitle += str;
        });
        Base.consoleLog(fmt, i + 1, testTitle, msg, stack);
      });
    };
    /**
     * Constructs a new `Base` reporter instance.
     *
     * @description
     * All other reporters generally inherit from this reporter.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function Base(runner, options) {
      let failures = (this.failures = []);

      if (!runner) {
        throw new TypeError('Missing runner argument');
      }

      this.options = options || {};
      this.runner = runner;
      this.stats = runner.stats; // assigned so Reporters keep a closer reference

      runner.on(EVENT_TEST_PASS, test => {
        if (test.duration > test.slow()) {
          test.speed = 'slow';
        } else if (test.duration > test.slow() / 2) {
          test.speed = 'medium';
        } else {
          test.speed = 'fast';
        }
      });
      runner.on(EVENT_TEST_FAIL, (test, err) => {
        if (showDiff(err)) {
          stringifyDiffObjs(err);
        } // more than one error per test

        if (test.err && err instanceof Error) {
          test.err.multiple = (test.err.multiple || []).concat(err);
        } else {
          test.err = err;
        }

        failures.push(test);
      });
    }
    /**
     * Outputs common epilogue used by many of the bundled reporters.
     *
     * @public
     * @memberof Mocha.reporters
     */

    Base.prototype.epilogue = function () {
      const stats = this.stats;
      let fmt;
      Base.consoleLog(); // passes

      fmt =
        color('bright pass', ' ') +
        color('green', ' %d passing') +
        color('light', ' (%s)');
      Base.consoleLog(fmt, stats.passes || 0, ms(stats.duration)); // pending

      if (stats.pending) {
        fmt = color('pending', ' ') + color('pending', ' %d pending');
        Base.consoleLog(fmt, stats.pending);
      } // failures

      if (stats.failures) {
        fmt = color('fail', '  %d failing');
        Base.consoleLog(fmt, stats.failures);
        Base.list(this.failures);
        Base.consoleLog();
      }

      Base.consoleLog();
    };
    /**
     * Pads the given `str` to `len`.
     *
     * @private
     * @param {string} str
     * @param {string} len
     * @return {string}
     */

    function pad(str, len) {
      str = String(str);
      return Array.from({length: len - str.length + 1}).join(' ') + str;
    }
    /**
     * Returns inline diff between 2 strings with coloured ANSI output.
     *
     * @private
     * @param {String} actual
     * @param {String} expected
     * @return {string} Diff
     */

    function inlineDiff(actual, expected) {
      let msg = errorDiff(actual, expected); // linenos

      const lines = msg.split('\n');

      if (lines.length > 4) {
        const width = String(lines.length).length;
        msg = lines
          .map((str, i) => {
            return `${pad(++i, width)} |` + ` ${str}`;
          })
          .join('\n');
      } // legend

      msg =
        `\n${ 
        color('diff removed inline', 'actual') 
        } ${ 
        color('diff added inline', 'expected') 
        }\n\n${ 
        msg 
        }\n`; // indent

      msg = msg.replace(/^/gm, '      ');
      return msg;
    }
    /**
     * Returns unified diff between two strings with coloured ANSI output.
     *
     * @private
     * @param {String} actual
     * @param {String} expected
     * @return {string} The diff.
     */

    function unifiedDiff(actual, expected) {
      const indent = '      ';

      function cleanUp(line) {
        if (line[0] === '+') {
          return indent + colorLines('diff added', line);
        }

        if (line[0] === '-') {
          return indent + colorLines('diff removed', line);
        }

        if (line.match(/@@/)) {
          return '--';
        }

        if (line.match(/\\ No newline/)) {
          return null;
        }

        return indent + line;
      }

      function notBlank(line) {
        return typeof line !== 'undefined' && line !== null;
      }

      const msg = diff.createPatch('string', actual, expected);
      const lines = msg.split('\n').splice(5);
      return (
        `\n      ${ 
        colorLines('diff added', '+ expected') 
        } ${ 
        colorLines('diff removed', '- actual') 
        }\n\n${ 
        lines.map(cleanUp).filter(notBlank).join('\n')}`
      );
    }
    /**
     * Returns character diff for `err`.
     *
     * @private
     * @param {String} actual
     * @param {String} expected
     * @return {string} the diff
     */

    function errorDiff(actual, expected) {
      return diff
        .diffWordsWithSpace(actual, expected)
        .map(str => {
          if (str.added) {
            return colorLines('diff added inline', str.value);
          }

          if (str.removed) {
            return colorLines('diff removed inline', str.value);
          }

          return str.value;
        })
        .join('');
    }
    /**
     * Colors lines for `str`, using the color `name`.
     *
     * @private
     * @param {string} name
     * @param {string} str
     * @return {string}
     */

    function colorLines(name, str) {
      return str
        .split('\n')
        .map(str => {
          return color(name, str);
        })
        .join('\n');
    }
    /**
     * Object#toString reference.
     */

    let objToString = Object.prototype.toString;
    /**
     * Checks that a / b have the same type.
     *
     * @private
     * @param {Object} a
     * @param {Object} b
     * @return {boolean}
     */

    function sameType(a, b) {
      return objToString.call(a) === objToString.call(b);
    }

    Base.consoleLog = consoleLog;
    Base['abstract'] = true;
  });

  const dot = createCommonjsModule((module, exports) => {
    /**
     * @module Dot
     */

    /**
     * Module dependencies.
     */

    const inherits = utils.inherits;
    const constants = runner$1.constants;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    let EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    /**
     * Expose `Dot`.
     */

    module.exports = Dot;
    /**
     * Constructs a new `Dot` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function Dot(runner, options) {
      base.call(this, runner, options);
      const self = this;
      let width = (base.window.width * 0.75) | 0;
      let n = -1;
      runner.on(EVENT_RUN_BEGIN, () => {
        process$1.stdout.write('\n');
      });
      runner.on(EVENT_TEST_PENDING, () => {
        if (++n % width === 0) {
          process$1.stdout.write('\n  ');
        }

        process$1.stdout.write(base.color('pending', base.symbols.comma));
      });
      runner.on(EVENT_TEST_PASS, test => {
        if (++n % width === 0) {
          process$1.stdout.write('\n  ');
        }

        if (test.speed === 'slow') {
          process$1.stdout.write(base.color('bright yellow', base.symbols.dot));
        } else {
          process$1.stdout.write(base.color(test.speed, base.symbols.dot));
        }
      });
      runner.on(EVENT_TEST_FAIL, () => {
        if (++n % width === 0) {
          process$1.stdout.write('\n  ');
        }

        process$1.stdout.write(base.color('fail', base.symbols.bang));
      });
      runner.once(EVENT_RUN_END, () => {
        process$1.stdout.write('\n');
        self.epilogue();
      });
    }
    /**
     * Inherit from `Base.prototype`.
     */

    inherits(Dot, base);
    Dot.description = 'dot matrix representation';
  });

  const doc = createCommonjsModule((module, exports) => {
    /**
     * @module Doc
     */

    /**
     * Module dependencies.
     */

    const constants = runner$1.constants;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    const EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    const EVENT_SUITE_END = constants.EVENT_SUITE_END;
    /**
     * Expose `Doc`.
     */

    module.exports = Doc;
    /**
     * Constructs a new `Doc` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function Doc(runner, options) {
      base.call(this, runner, options);
      let indents = 2;

      function indent() {
        return new Array(indents).join('  ');
      }

      runner.on(EVENT_SUITE_BEGIN, suite => {
        if (suite.root) {
          return;
        }

        ++indents;
        base.consoleLog('%s<section class="suite">', indent());
        ++indents;
        base.consoleLog('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
        base.consoleLog('%s<dl>', indent());
      });
      runner.on(EVENT_SUITE_END, suite => {
        if (suite.root) {
          return;
        }

        base.consoleLog('%s</dl>', indent());
        --indents;
        base.consoleLog('%s</section>', indent());
        --indents;
      });
      runner.on(EVENT_TEST_PASS, test => {
        base.consoleLog('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
        base.consoleLog('%s  <dt>%s</dt>', indent(), utils.escape(test.file));
        const code = utils.escape(utils.clean(test.body));
        base.consoleLog(
          '%s  <dd><pre><code>%s</code></pre></dd>',
          indent(),
          code,
        );
      });
      runner.on(EVENT_TEST_FAIL, (test, err) => {
        base.consoleLog(
          '%s  <dt class="error">%s</dt>',
          indent(),
          utils.escape(test.title),
        );
        base.consoleLog(
          '%s  <dt class="error">%s</dt>',
          indent(),
          utils.escape(test.file),
        );
        let code = utils.escape(utils.clean(test.body));
        base.consoleLog(
          '%s  <dd class="error"><pre><code>%s</code></pre></dd>',
          indent(),
          code,
        );
        base.consoleLog(
          '%s  <dd class="error">%s</dd>',
          indent(),
          utils.escape(err),
        );
      });
    }

    Doc.description = 'HTML documentation';
  });

  const tap = createCommonjsModule((module, exports) => {
    /**
     * @module TAP
     */

    /**
     * Module dependencies.
     */

    const constants = runner$1.constants;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    let EVENT_RUN_END = constants.EVENT_RUN_END;
    const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    const EVENT_TEST_END = constants.EVENT_TEST_END;
    const inherits = utils.inherits;
    const sprintf = util.format;
    /**
     * Expose `TAP`.
     */

    module.exports = TAP;
    /**
     * Constructs a new `TAP` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function TAP(runner, options) {
      base.call(this, runner, options);
      const self = this;
      let n = 1;
      let tapVersion = '12';

      if (
        options &&
        options.reporterOptions &&
        options.reporterOptions.tapVersion
      ) {
        tapVersion = options.reporterOptions.tapVersion.toString();
      }

      this._producer = createProducer(tapVersion);
      runner.once(EVENT_RUN_BEGIN, () => {
        self._producer.writeVersion();
      });
      runner.on(EVENT_TEST_END, () => {
        ++n;
      });
      runner.on(EVENT_TEST_PENDING, test => {
        self._producer.writePending(n, test);
      });
      runner.on(EVENT_TEST_PASS, test => {
        self._producer.writePass(n, test);
      });
      runner.on(EVENT_TEST_FAIL, (test, err) => {
        self._producer.writeFail(n, test, err);
      });
      runner.once(EVENT_RUN_END, () => {
        self._producer.writeEpilogue(runner.stats);
      });
    }
    /**
     * Inherit from `Base.prototype`.
     */

    inherits(TAP, base);
    /**
     * Returns a TAP-safe title of `test`.
     *
     * @private
     * @param {Test} test - Test instance.
     * @return {String} title with any hash character removed
     */

    function title(test) {
      return test.fullTitle().replaceAll('#', '');
    }
    /**
     * Writes newline-terminated formatted string to reporter output stream.
     *
     * @private
     * @param {string} format - `printf`-like format string
     * @param {...*} [varArgs] - Format string arguments
     */

    function println(format, varArgs) {
      const vargs = Array.from(arguments);
      vargs[0] += '\n';
      process$1.stdout.write(sprintf.apply(null, vargs));
    }
    /**
     * Returns a `tapVersion`-appropriate TAP producer instance, if possible.
     *
     * @private
     * @param {string} tapVersion - Version of TAP specification to produce.
     * @returns {TAPProducer} specification-appropriate instance
     * @throws {Error} if specification version has no associated producer.
     */

    function createProducer(tapVersion) {
      const producers = {
        12: new TAP12Producer(),
        13: new TAP13Producer(),
      };
      const producer = producers[tapVersion];

      if (!producer) {
        throw new Error(
          `invalid or unsupported TAP version: ${  JSON.stringify(tapVersion)}`,
        );
      }

      return producer;
    }
    /**
     * @summary
     * Constructs a new TAPProducer.
     *
     * @description
     * <em>Only</em> to be used as an abstract base class.
     *
     * @private
     * @constructor
     */

    function TAPProducer() {}
    /**
     * Writes the TAP version to reporter output stream.
     *
     * @abstract
     */

    TAPProducer.prototype.writeVersion = function () {};
    /**
     * Writes the plan to reporter output stream.
     *
     * @abstract
     * @param {number} ntests - Number of tests that are planned to run.
     */

    TAPProducer.prototype.writePlan = function (ntests) {
      println('%d..%d', 1, ntests);
    };
    /**
     * Writes that test passed to reporter output stream.
     *
     * @abstract
     * @param {number} n - Index of test that passed.
     * @param {Test} test - Instance containing test information.
     */

    TAPProducer.prototype.writePass = function (n, test) {
      println('ok %d %s', n, title(test));
    };
    /**
     * Writes that test was skipped to reporter output stream.
     *
     * @abstract
     * @param {number} n - Index of test that was skipped.
     * @param {Test} test - Instance containing test information.
     */

    TAPProducer.prototype.writePending = function (n, test) {
      println('ok %d %s # SKIP -', n, title(test));
    };
    /**
     * Writes that test failed to reporter output stream.
     *
     * @abstract
     * @param {number} n - Index of test that failed.
     * @param {Test} test - Instance containing test information.
     * @param {Error} err - Reason the test failed.
     */

    TAPProducer.prototype.writeFail = function (n, test, err) {
      println('not ok %d %s', n, title(test));
    };
    /**
     * Writes the summary epilogue to reporter output stream.
     *
     * @abstract
     * @param {Object} stats - Object containing run statistics.
     */

    TAPProducer.prototype.writeEpilogue = function (stats) {
      // :TBD: Why is this not counting pending tests?
      println(`# tests ${stats.passes + stats.failures}`);
      println(`# pass ${stats.passes}`); // :TBD: Why are we not showing pending results?

      println(`# fail ${stats.failures}`);
      this.writePlan(stats.passes + stats.failures + stats.pending);
    };
    /**
     * @summary
     * Constructs a new TAP12Producer.
     *
     * @description
     * Produces output conforming to the TAP12 specification.
     *
     * @private
     * @constructor
     * @extends TAPProducer
     * @see {@link https://testanything.org/tap-specification.html|Specification}
     */

    function TAP12Producer() {
      /**
       * Writes that test failed to reporter output stream, with error formatting.
       * @override
       */
      this.writeFail = function (n, test, err) {
        TAPProducer.prototype.writeFail.call(this, n, test, err);

        if (err.message) {
          println(err.message.replace(/^/gm, '  '));
        }

        if (err.stack) {
          println(err.stack.replace(/^/gm, '  '));
        }
      };
    }
    /**
     * Inherit from `TAPProducer.prototype`.
     */

    inherits(TAP12Producer, TAPProducer);
    /**
     * @summary
     * Constructs a new TAP13Producer.
     *
     * @description
     * Produces output conforming to the TAP13 specification.
     *
     * @private
     * @constructor
     * @extends TAPProducer
     * @see {@link https://testanything.org/tap-version-13-specification.html|Specification}
     */

    function TAP13Producer() {
      /**
       * Writes the TAP version to reporter output stream.
       * @override
       */
      this.writeVersion = function () {
        println('TAP version 13');
      };
      /**
       * Writes that test failed to reporter output stream, with error formatting.
       * @override
       */

      this.writeFail = function (n, test, err) {
        TAPProducer.prototype.writeFail.call(this, n, test, err);
        let emitYamlBlock = err.message != null || err.stack != null;

        if (emitYamlBlock) {
          println(`${indent(1)}---`);

          if (err.message) {
            println(`${indent(2)}message: |-`);
            println(err.message.replace(/^/gm, indent(3)));
          }

          if (err.stack) {
            println(`${indent(2)}stack: |-`);
            println(err.stack.replace(/^/gm, indent(3)));
          }

          println(`${indent(1)}...`);
        }
      };

      function indent(level) {
        return new Array(level + 1).join('  ');
      }
    }
    /**
     * Inherit from `TAPProducer.prototype`.
     */

    inherits(TAP13Producer, TAPProducer);
    TAP.description = 'TAP-compatible output';
  });

  const json = createCommonjsModule((module, exports) => {
    /**
     * @module JSON
     */

    /**
     * Module dependencies.
     */

    const constants = runner$1.constants;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    let EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    const EVENT_TEST_END = constants.EVENT_TEST_END;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    /**
     * Expose `JSON`.
     */

    module.exports = JSONReporter;
    /**
     * Constructs a new `JSON` reporter instance.
     *
     * @public
     * @class JSON
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function JSONReporter(runner, options) {
      base.call(this, runner, options);
      const self = this;
      const tests = [];
      const pending = [];
      let failures = [];
      let passes = [];
      runner.on(EVENT_TEST_END, test => {
        tests.push(test);
      });
      runner.on(EVENT_TEST_PASS, test => {
        passes.push(test);
      });
      runner.on(EVENT_TEST_FAIL, test => {
        failures.push(test);
      });
      runner.on(EVENT_TEST_PENDING, test => {
        pending.push(test);
      });
      runner.once(EVENT_RUN_END, () => {
        const obj = {
          stats: self.stats,
          tests: tests.map(clean),
          pending: pending.map(clean),
          failures: failures.map(clean),
          passes: passes.map(clean),
        };
        runner.testResults = obj;
        process$1.stdout.write(JSON.stringify(obj, null, 2));
      });
    }
    /**
     * Return a plain-object representation of `test`
     * free of cyclic properties etc.
     *
     * @private
     * @param {Object} test
     * @return {Object}
     */

    function clean(test) {
      let err = test.err || {};

      if (err instanceof Error) {
        err = errorJSON(err);
      }

      return {
        title: test.title,
        fullTitle: test.fullTitle(),
        file: test.file,
        duration: test.duration,
        currentRetry: test.currentRetry(),
        speed: test.speed,
        err: cleanCycles(err),
      };
    }
    /**
     * Replaces any circular references inside `obj` with '[object Object]'
     *
     * @private
     * @param {Object} obj
     * @return {Object}
     */

    function cleanCycles(obj) {
      const cache = [];
      return JSON.parse(
        JSON.stringify(obj, (key, value) => {
          if (_typeof(value) === 'object' && value !== null) {
            if (cache.includes(value)) {
              // Instead of going in a circle, we'll print [object Object]
              return `${value}`;
            }

            cache.push(value);
          }

          return value;
        }),
      );
    }
    /**
     * Transform an Error object into a JSON object.
     *
     * @private
     * @param {Error} err
     * @return {Object}
     */

    function errorJSON(err) {
      const res = {};
      Object.getOwnPropertyNames(err).forEach(key => {
        res[key] = err[key];
      });
      return res;
    }

    JSONReporter.description = 'single JSON object';
  });

  // `thisNumberValue` abstract operation
  // https://tc39.es/ecma262/#sec-thisnumbervalue
  const thisNumberValue = function (value) {
    if (typeof value !== 'number' && classofRaw(value) != 'Number') {
      throw new TypeError('Incorrect invocation');
    }
    return +value;
  };

  // `String.prototype.repeat` method implementation
  // https://tc39.es/ecma262/#sec-string.prototype.repeat
  const stringRepeat =
    ''.repeat ||
    function repeat(count) {
      let str = String(requireObjectCoercible(this));
      let result = '';
      let n = toInteger(count);
      if (n < 0 || n == Number.POSITIVE_INFINITY)
        throw new RangeError('Wrong number of repetitions');
      for (; n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
      return result;
    };

  const nativeToFixed = (1.0).toFixed;
  const floor$4 = Math.floor;

  const pow$1 = function (x, n, acc) {
    return n === 0
      ? acc
      : n % 2 === 1
      ? pow$1(x, n - 1, acc * x)
      : pow$1(x * x, n / 2, acc);
  };

  const log$2 = function (x) {
    let n = 0;
    let x2 = x;
    while (x2 >= 4096) {
      n += 12;
      x2 /= 4096;
    }
    while (x2 >= 2) {
      n += 1;
      x2 /= 2;
    }
    return n;
  };

  const FORCED$8 =
    (nativeToFixed &&
      ((0.00008).toFixed(3) !== '0.000' ||
        (0.9).toFixed(0) !== '1' ||
        (1.255).toFixed(2) !== '1.25' ||
        (1000000000000000128.0).toFixed(0) !== '1000000000000000128')) ||
    !fails(() => {
      // V8 ~ Android 4.3-
      nativeToFixed.call({});
    });

  // `Number.prototype.toFixed` method
  // https://tc39.es/ecma262/#sec-number.prototype.tofixed
  _export(
    { target: 'Number', proto: true, forced: FORCED$8 },
    {
      // eslint-disable-next-line max-statements
      toFixed: function toFixed(fractionDigits) {
        let number = thisNumberValue(this);
        const fractDigits = toInteger(fractionDigits);
        const data = [0, 0, 0, 0, 0, 0];
        let sign = '';
        let result = '0';
        let e, z, j, k;

        const multiply = function (n, c) {
          let index = -1;
          let c2 = c;
          while (++index < 6) {
            c2 += n * data[index];
            data[index] = c2 % 1e7;
            c2 = floor$4(c2 / 1e7);
          }
        };

        const divide = function (n) {
          let index = 6;
          let c = 0;
          while (--index >= 0) {
            c += data[index];
            data[index] = floor$4(c / n);
            c = (c % n) * 1e7;
          }
        };

        const dataToString = function () {
          let index = 6;
          let s = '';
          while (--index >= 0) {
            if (s !== '' || index === 0 || data[index] !== 0) {
              const t = String(data[index]);
              s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
            }
          }
          return s;
        };

        if (fractDigits < 0 || fractDigits > 20)
          throw new RangeError('Incorrect fraction digits');
        // eslint-disable-next-line no-self-compare
        if (number != number) return 'NaN';
        if (number <= -1e21 || number >= 1e21) return String(number);
        if (number < 0) {
          sign = '-';
          number = -number;
        }
        if (number > 1e-21) {
          e = log$2(number * pow$1(2, 69, 1)) - 69;
          z = e < 0 ? number * pow$1(2, -e, 1) : number / pow$1(2, e, 1);
          z *= 0x10000000000000;
          e = 52 - e;
          if (e > 0) {
            multiply(0, z);
            j = fractDigits;
            while (j >= 7) {
              multiply(1e7, 0);
              j -= 7;
            }
            multiply(pow$1(10, j, 1), 0);
            j = e - 1;
            while (j >= 23) {
              divide(1 << 23);
              j -= 23;
            }
            divide(1 << j);
            multiply(1, 1);
            divide(2);
            result = dataToString();
          } else {
            multiply(0, z);
            multiply(1 << -e, 0);
            result = dataToString() + stringRepeat.call('0', fractDigits);
          }
        }
        if (fractDigits > 0) {
          k = result.length;
          result =
            sign +
            (k <= fractDigits
              ? `0.${stringRepeat.call('0', fractDigits - k)}${result}`
              : `${result.slice(0, k - fractDigits)
                  k - fractDigits,
                )}`);
        } else {
          result = sign + result;
        }
        return result;
      },
    },
  );

  /**
	 @module browser/Progress
	*/

  /**
   * Expose `Progress`.
   */

  const progress = Progress;
  /**
   * Initialize a new `Progress` indicator.
   */

  function Progress() {
    this.percent = 0;
    this.size(0);
    this.fontSize(11);
    this.font('helvetica, arial, sans-serif');
  }
  /**
   * Set progress size to `size`.
   *
   * @public
   * @param {number} size
   * @return {Progress} Progress instance.
   */

  Progress.prototype.size = function (size) {
    this._size = size;
    return this;
  };
  /**
   * Set text to `text`.
   *
   * @public
   * @param {string} text
   * @return {Progress} Progress instance.
   */

  Progress.prototype.text = function (text) {
    this._text = text;
    return this;
  };
  /**
   * Set font size to `size`.
   *
   * @public
   * @param {number} size
   * @return {Progress} Progress instance.
   */

  Progress.prototype.fontSize = function (size) {
    this._fontSize = size;
    return this;
  };
  /**
   * Set font to `family`.
   *
   * @param {string} family
   * @return {Progress} Progress instance.
   */

  Progress.prototype.font = function (family) {
    this._font = family;
    return this;
  };
  /**
   * Update percentage to `n`.
   *
   * @param {number} n
   * @return {Progress} Progress instance.
   */

  Progress.prototype.update = function (n) {
    this.percent = n;
    return this;
  };
  /**
   * Draw on `ctx`.
   *
   * @param {CanvasRenderingContext2d} ctx
   * @return {Progress} Progress instance.
   */

  Progress.prototype.draw = function (ctx) {
    try {
      const percent = Math.min(this.percent, 100);
      const size = this._size;
      const half = size / 2;
      const x = half;
      const y = half;
      const rad = half - 1;
      const fontSize = this._fontSize;
      ctx.font = `${fontSize}px ${this._font}`;
      const angle = Math.PI * 2 * (percent / 100);
      ctx.clearRect(0, 0, size, size); // outer circle

      ctx.strokeStyle = '#9f9f9f';
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, angle, false);
      ctx.stroke(); // inner circle

      ctx.strokeStyle = '#eee';
      ctx.beginPath();
      ctx.arc(x, y, rad - 1, 0, angle, true);
      ctx.stroke(); // text

      const text = this._text || `${percent | 0}%`;
      const w = ctx.measureText(text).width;
      ctx.fillText(text, x - w / 2 + 1, y + fontSize / 2 - 1);
    } catch {
      // don't fail if we can't render progress
    }

    return this;
  };

  const html$1 = createCommonjsModule((module, exports) => {
    /* eslint-env browser */

    /**
     * @module HTML
     */

    /**
     * Module dependencies.
     */

    let constants = runner$1.constants;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    const EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    const EVENT_SUITE_END = constants.EVENT_SUITE_END;
    const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    const escape = utils.escape;
    /**
     * Save timer references to avoid Sinon interfering (see GH-237).
     */

    const Date = commonjsGlobal.Date;
    /**
     * Expose `HTML`.
     */

    module.exports = HTML;
    /**
     * Stats template.
     */

    let statsTemplate =
      '<ul id="mocha-stats">' +
      '<li class="progress"><canvas width="40" height="40"></canvas></li>' +
      '<li class="passes"><a href="javascript:void(0);">passes:</a> <em>0</em></li>' +
      '<li class="failures"><a href="javascript:void(0);">failures:</a> <em>0</em></li>' +
      '<li class="duration">duration: <em>0</em>s</li>' +
      '</ul>';
    const playIcon = '&#x2023;';
    /**
     * Constructs a new `HTML` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function HTML(runner, options) {
      base.call(this, runner, options);
      const self = this;
      const stats = this.stats;
      const stat = fragment(statsTemplate);
      const items = stat.querySelectorAll('li');
      const passes = items[1].querySelectorAll('em')[0];
      let passesLink = items[1].querySelectorAll('a')[0];
      const failures = items[2].querySelectorAll('em')[0];
      const failuresLink = items[2].querySelectorAll('a')[0];
      const duration = items[3].querySelectorAll('em')[0];
      let canvas = stat.querySelectorAll('canvas')[0];
      const report = fragment('<ul id="mocha-report"></ul>');
      const stack = [report];
      let progress$1;
      let ctx;
      const root = document.querySelector('#mocha');

      if (canvas.getContext) {
        let ratio = window.devicePixelRatio || 1;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;
        canvas.width *= ratio;
        canvas.height *= ratio;
        ctx = canvas.getContext('2d');
        ctx.scale(ratio, ratio);
        progress$1 = new progress();
      }

      if (!root) {
        return error('#mocha div missing, add it to your document');
      } // pass toggle

      on(passesLink, 'click', evt => {
        evt.preventDefault();
        unhide();
        const name = /pass/.test(report.className) ? '' : ' pass';
        report.className = report.className.replaceAll('fail|pass', '') + name;

        if (report.className.trim()) {
          hideSuitesWithout('test pass');
        }
      }); // failure toggle

      on(failuresLink, 'click', evt => {
        evt.preventDefault();
        unhide();
        const name = /fail/.test(report.className) ? '' : ' fail';
        report.className = report.className.replaceAll('fail|pass', '') + name;

        if (report.className.trim()) {
          hideSuitesWithout('test fail');
        }
      });
      root.append(stat);
      root.append(report);

      if (progress$1) {
        progress$1.size(40);
      }

      runner.on(EVENT_SUITE_BEGIN, suite => {
        if (suite.root) {
          return;
        } // suite

        const url = self.suiteURL(suite);
        let el = fragment(
          '<li class="suite"><h1><a href="%s">%s</a></h1></li>',
          url,
          escape(suite.title),
        ); // container

        stack[0].append(el);
        stack.unshift(document.createElement('ul'));
        el.append(stack[0]);
      });
      runner.on(EVENT_SUITE_END, suite => {
        if (suite.root) {
          updateStats();
          return;
        }

        stack.shift();
      });
      runner.on(EVENT_TEST_PASS, test => {
        const url = self.testURL(test);
        let markup =
          `<li class="test pass %e"><h2>%e<span class="duration">%ems</span> ` +
          `<a href="%s" class="replay">${ 
          playIcon 
          }</a></h2></li>`;
        const el = fragment(markup, test.speed, test.title, test.duration, url);
        self.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
      });
      runner.on(EVENT_TEST_FAIL, test => {
        let el = fragment(
          `<li class="test fail"><h2>%e <a href="%e" class="replay">${ 
            playIcon 
            }</a></h2></li>`,
          test.title,
          self.testURL(test),
        );
        let stackString; // Note: Includes leading newline

        let message = test.err.toString(); // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
        // check for the result of the stringifying.

        if (message === '[object Error]') {
          message = test.err.message;
        }

        if (test.err.stack) {
          let indexOfMessage = test.err.stack.indexOf(test.err.message);

          if (indexOfMessage === -1) {
            stackString = test.err.stack;
          } else {
            stackString = test.err.stack.slice(
              test.err.message.length + indexOfMessage,
            );
          }
        } else if (test.err.sourceURL && test.err.line !== undefined) {
          // Safari doesn't give you a stack. Let's at least provide a source line.
          stackString = `\n(${test.err.sourceURL}:${test.err.line})`;
        }

        stackString = stackString || '';

        if (test.err.htmlMessage && stackString) {
          el.append(
            fragment(
              '<div class="html-error">%s\n<pre class="error">%e</pre></div>',
              test.err.htmlMessage,
              stackString,
            ),
          );
        } else if (test.err.htmlMessage) {
          el.append(
            fragment('<div class="html-error">%s</div>', test.err.htmlMessage),
          );
        } else {
          el.append(
            fragment('<pre class="error">%e%e</pre>', message, stackString),
          );
        }

        self.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
      });
      runner.on(EVENT_TEST_PENDING, test => {
        let el = fragment(
          '<li class="test pass pending"><h2>%e</h2></li>',
          test.title,
        );
        appendToStack(el);
        updateStats();
      });

      function appendToStack(el) {
        // Don't call .appendChild if #mocha-report was already .shift()'ed off the stack.
        if (stack[0]) {
          stack[0].append(el);
        }
      }

      function updateStats() {
        // TODO: add to stats
        let percent = ((stats.tests / runner.total) * 100) | 0;

        if (progress$1) {
          progress$1.update(percent).draw(ctx);
        } // update stats

        const ms = Date.now() - stats.start;
        text(passes, stats.passes);
        text(failures, stats.failures);
        text(duration, (ms / 1000).toFixed(2));
      }
    }
    /**
     * Makes a URL, preserving querystring ("search") parameters.
     *
     * @param {string} s
     * @return {string} A new URL.
     */

    function makeUrl(s) {
      let search = window.location.search; // Remove previous grep query parameter if present

      if (search) {
        search = search.replace(/[&?]grep=[^\s&]*/g, '').replace(/^&/, '?');
      }

      return (
        `${window.location.pathname +
        (search ? search + '&' : '?') 
        }grep=${ 
        encodeURIComponent(escapeStringRegexp(s))}`
      );
    }
    /**
     * Provide suite URL.
     *
     * @param {Object} [suite]
     */

    HTML.prototype.suiteURL = function (suite) {
      return makeUrl(suite.fullTitle());
    };
    /**
     * Provide test URL.
     *
     * @param {Object} [test]
     */

    HTML.prototype.testURL = function (test) {
      return makeUrl(test.fullTitle());
    };
    /**
     * Adds code toggle functionality for the provided test's list element.
     *
     * @param {HTMLLIElement} el
     * @param {string} contents
     */

    HTML.prototype.addCodeToggle = function (el, contents) {
      const h2 = el.querySelectorAll('h2')[0];
      on(h2, 'click', () => {
        pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
      });
      var pre = fragment('<pre><code>%e</code></pre>', utils.clean(contents));
      el.append(pre);
      pre.style.display = 'none';
    };
    /**
     * Display error `msg`.
     *
     * @param {string} msg
     */

    function error(msg) {
      document.body.append(
        fragment('<div id="mocha-error">%s</div>', msg),
      );
    }
    /**
     * Return a DOM fragment from `html`.
     *
     * @param {string} html
     */

    function fragment(html) {
      const args = arguments;
      const div = document.createElement('div');
      let i = 1;
      div.innerHTML = html.replace(/%([es])/g, (_, type) => {
        switch (type) {
          case 's':
            return String(args[i++]);

          case 'e':
            return escape(args[i++]);
          // no default
        }
      });
      return div.firstChild;
    }
    /**
     * Check for suites that do not have elements
     * with `classname`, and hide them.
     *
     * @param {text} classname
     */

    function hideSuitesWithout(classname) {
      const suites = document.querySelectorAll('.suite');

      for (const suite_ of suites) {
        let els = suite_.getElementsByClassName(classname);

        if (els.length === 0) {
          suite_.className += ' hidden';
        }
      }
    }
    /**
     * Unhide .hidden suites.
     */

    function unhide() {
      const els = document.querySelectorAll('.suite.hidden');

      while (els.length > 0) {
        els[0].className = els[0].className.replace('suite hidden', 'suite');
      }
    }
    /**
     * Set an element's text contents.
     *
     * @param {HTMLElement} el
     * @param {string} contents
     */

    function text(el, contents) {
      if (el.textContent) {
        el.textContent = contents;
      } else {
        el.innerText = contents;
      }
    }
    /**
     * Listen on `event` with callback `fn`.
     */

    function on(el, event, fn) {
      if (el.addEventListener) {
        el.addEventListener(event, fn, false);
      } else {
        el.attachEvent(`on${event}`, fn);
      }
    }

    HTML.browserOnly = true;
  });

  const list = createCommonjsModule((module, exports) => {
    /**
     * @module List
     */

    /**
     * Module dependencies.
     */

    const inherits = utils.inherits;
    const constants = runner$1.constants;
    const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    const EVENT_TEST_BEGIN = constants.EVENT_TEST_BEGIN;
    const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    const color = base.color;
    const cursor = base.cursor;
    /**
     * Expose `List`.
     */

    module.exports = List;
    /**
     * Constructs a new `List` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function List(runner, options) {
      base.call(this, runner, options);
      const self = this;
      let n = 0;
      runner.on(EVENT_RUN_BEGIN, () => {
        base.consoleLog();
      });
      runner.on(EVENT_TEST_BEGIN, test => {
        process$1.stdout.write(color('pass', `    ${test.fullTitle()}: `));
      });
      runner.on(EVENT_TEST_PENDING, test => {
        let fmt = color('checkmark', '  -') + color('pending', ' %s');
        base.consoleLog(fmt, test.fullTitle());
      });
      runner.on(EVENT_TEST_PASS, test => {
        let fmt =
          color('checkmark', `  ${  base.symbols.ok}`) +
          color('pass', ' %s: ') +
          color(test.speed, '%dms');
        cursor.CR();
        base.consoleLog(fmt, test.fullTitle(), test.duration);
      });
      runner.on(EVENT_TEST_FAIL, test => {
        cursor.CR();
        base.consoleLog(color('fail', '  %d) %s'), ++n, test.fullTitle());
      });
      runner.once(EVENT_RUN_END, self.epilogue.bind(self));
    }
    /**
     * Inherit from `Base.prototype`.
     */

    inherits(List, base);
    List.description = 'like "spec" reporter but flat';
  });

  const min$7 = createCommonjsModule((module, exports) => {
    /**
     * @module Min
     */

    /**
     * Module dependencies.
     */

    const inherits = utils.inherits;
    const constants = runner$1.constants;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    /**
     * Expose `Min`.
     */

    module.exports = Min;
    /**
     * Constructs a new `Min` reporter instance.
     *
     * @description
     * This minimal test reporter is best used with '--watch'.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function Min(runner, options) {
      base.call(this, runner, options);
      runner.on(EVENT_RUN_BEGIN, () => {
        // clear screen
        process$1.stdout.write('\u001B[2J'); // set cursor position

        process$1.stdout.write('\u001B[1;3H');
      });
      runner.once(EVENT_RUN_END, this.epilogue.bind(this));
    }
    /**
     * Inherit from `Base.prototype`.
     */

    inherits(Min, base);
    Min.description = 'essentially just a summary';
  });

  const spec = createCommonjsModule((module, exports) => {
    /**
     * @module Spec
     */

    /**
     * Module dependencies.
     */

    const constants = runner$1.constants;
    const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    const EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    const EVENT_SUITE_END = constants.EVENT_SUITE_END;
    const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    let EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    const inherits = utils.inherits;
    const color = base.color;
    /**
     * Expose `Spec`.
     */

    module.exports = Spec;
    /**
     * Constructs a new `Spec` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function Spec(runner, options) {
      base.call(this, runner, options);
      const self = this;
      let indents = 0;
      let n = 0;

      function indent() {
        return new Array(indents).join('  ');
      }

      runner.on(EVENT_RUN_BEGIN, () => {
        base.consoleLog();
      });
      runner.on(EVENT_SUITE_BEGIN, suite => {
        ++indents;
        base.consoleLog(color('suite', '%s%s'), indent(), suite.title);
      });
      runner.on(EVENT_SUITE_END, () => {
        --indents;

        if (indents === 1) {
          base.consoleLog();
        }
      });
      runner.on(EVENT_TEST_PENDING, test => {
        let fmt = indent() + color('pending', '  - %s');
        base.consoleLog(fmt, test.title);
      });
      runner.on(EVENT_TEST_PASS, test => {
        let fmt;

        if (test.speed === 'fast') {
          fmt =
            indent() +
            color('checkmark', `  ${  base.symbols.ok}`) +
            color('pass', ' %s');
          base.consoleLog(fmt, test.title);
        } else {
          fmt =
            indent() +
            color('checkmark', `  ${  base.symbols.ok}`) +
            color('pass', ' %s') +
            color(test.speed, ' (%dms)');
          base.consoleLog(fmt, test.title, test.duration);
        }
      });
      runner.on(EVENT_TEST_FAIL, test => {
        base.consoleLog(indent() + color('fail', '  %d) %s'), ++n, test.title);
      });
      runner.once(EVENT_RUN_END, self.epilogue.bind(self));
    }
    /**
     * Inherit from `Base.prototype`.
     */

    inherits(Spec, base);
    Spec.description = 'hierarchical & verbose [default]';
  });

  const nyan = createCommonjsModule((module, exports) => {
    /**
     * @module Nyan
     */

    /**
     * Module dependencies.
     */

    const constants = runner$1.constants;
    let inherits = utils.inherits;
    const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    /**
     * Expose `Dot`.
     */

    module.exports = NyanCat;
    /**
     * Constructs a new `Nyan` reporter instance.
     *
     * @public
     * @class Nyan
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function NyanCat(runner, options) {
      base.call(this, runner, options);
      const self = this;
      let width = (base.window.width * 0.75) | 0;
      let nyanCatWidth = (this.nyanCatWidth = 11);
      this.colorIndex = 0;
      this.numberOfLines = 4;
      this.rainbowColors = self.generateColors();
      this.scoreboardWidth = 5;
      this.tick = 0;
      this.trajectories = [[], [], [], []];
      this.trajectoryWidthMax = width - nyanCatWidth;
      runner.on(EVENT_RUN_BEGIN, () => {
        base.cursor.hide();
        self.draw();
      });
      runner.on(EVENT_TEST_PENDING, () => {
        self.draw();
      });
      runner.on(EVENT_TEST_PASS, () => {
        self.draw();
      });
      runner.on(EVENT_TEST_FAIL, () => {
        self.draw();
      });
      runner.once(EVENT_RUN_END, () => {
        base.cursor.show();

        for (let i = 0; i < self.numberOfLines; i++) {
          write('\n');
        }

        self.epilogue();
      });
    }
    /**
     * Inherit from `Base.prototype`.
     */

    inherits(NyanCat, base);
    /**
     * Draw the nyan cat
     *
     * @private
     */

    NyanCat.prototype.draw = function () {
      this.appendRainbow();
      this.drawScoreboard();
      this.drawRainbow();
      this.drawNyanCat();
      this.tick = !this.tick;
    };
    /**
     * Draw the "scoreboard" showing the number
     * of passes, failures and pending tests.
     *
     * @private
     */

    NyanCat.prototype.drawScoreboard = function () {
      const stats = this.stats;

      function draw(type, n) {
        write(' ');
        write(base.color(type, n));
        write('\n');
      }

      draw('green', stats.passes);
      draw('fail', stats.failures);
      draw('pending', stats.pending);
      write('\n');
      this.cursorUp(this.numberOfLines);
    };
    /**
     * Append the rainbow.
     *
     * @private
     */

    NyanCat.prototype.appendRainbow = function () {
      const segment = this.tick ? '_' : '-';
      const rainbowified = this.rainbowify(segment);

      for (let index = 0; index < this.numberOfLines; index++) {
        const trajectory = this.trajectories[index];

        if (trajectory.length >= this.trajectoryWidthMax) {
          trajectory.shift();
        }

        trajectory.push(rainbowified);
      }
    };
    /**
     * Draw the rainbow.
     *
     * @private
     */

    NyanCat.prototype.drawRainbow = function () {
      const self = this;
      this.trajectories.forEach(line => {
        write('\u001B[' + self.scoreboardWidth + 'C');
        write(line.join(''));
        write('\n');
      });
      this.cursorUp(this.numberOfLines);
    };
    /**
     * Draw the nyan cat
     *
     * @private
     */

    NyanCat.prototype.drawNyanCat = function () {
      const self = this;
      const startWidth = this.scoreboardWidth + this.trajectories[0].length;
      let dist = '\u001B[' + startWidth + 'C';
      let padding = '';
      write(dist);
      write('_,------,');
      write('\n');
      write(dist);
      padding = self.tick ? '  ' : '   ';
      write(`_|${padding}/\\_/\\ `);
      write('\n');
      write(dist);
      padding = self.tick ? '_' : '__';
      const tail = self.tick ? '~' : '^';
      write(`${tail}|${padding}${this.face()} `);
      write('\n');
      write(dist);
      padding = self.tick ? ' ' : '  ';
      write(`${padding}""  "" `);
      write('\n');
      this.cursorUp(this.numberOfLines);
    };
    /**
     * Draw nyan cat face.
     *
     * @private
     * @return {string}
     */

    NyanCat.prototype.face = function () {
      const stats = this.stats;

      if (stats.failures) {
        return '( x .x)';
      } else if (stats.pending) {
        return '( o .o)';
      } else if (stats.passes) {
        return '( ^ .^)';
      }

      return '( - .-)';
    };
    /**
     * Move cursor up `n`.
     *
     * @private
     * @param {number} n
     */

    NyanCat.prototype.cursorUp = function (n) {
      write('\u001B[' + n + 'A');
    };
    /**
     * Move cursor down `n`.
     *
     * @private
     * @param {number} n
     */

    NyanCat.prototype.cursorDown = function (n) {
      write('\u001B[' + n + 'B');
    };
    /**
     * Generate rainbow colors.
     *
     * @private
     * @return {Array}
     */

    NyanCat.prototype.generateColors = function () {
      const colors = [];

      for (let i = 0; i < 6 * 7; i++) {
        const pi3 = Math.floor(Math.PI / 3);
        const n = i * (1.0 / 6);
        const r = Math.floor(3 * Math.sin(n) + 3);
        const g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
        const b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
        colors.push(36 * r + 6 * g + b + 16);
      }

      return colors;
    };
    /**
     * Apply rainbow to the given `str`.
     *
     * @private
     * @param {string} str
     * @return {string}
     */

    NyanCat.prototype.rainbowify = function (str) {
      if (!base.useColors) {
        return str;
      }

      let color =
        this.rainbowColors[this.colorIndex % this.rainbowColors.length];
      this.colorIndex += 1;
      return '\u001B[38;5;' + color + 'm' + str + '\u001B[0m';
    };
    /**
     * Stdout helper.
     *
     * @param {string} string A message to write to stdout.
     */

    function write(string) {
      process$1.stdout.write(string);
    }

    NyanCat.description = '"nyan cat"';
  });

  const fs = {};

  const xunit = createCommonjsModule((module, exports) => {
    /**
     * @module XUnit
     */

    /**
     * Module dependencies.
     */

    const createUnsupportedError = errors.createUnsupportedError;
    const constants = runner$1.constants;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    let EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    const STATE_FAILED = runnable.constants.STATE_FAILED;
    let inherits = utils.inherits;
    const escape = utils.escape;
    /**
     * Save timer references to avoid Sinon interfering (see GH-237).
     */

    const Date = commonjsGlobal.Date;
    /**
     * Expose `XUnit`.
     */

    module.exports = XUnit;
    /**
     * Constructs a new `XUnit` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function XUnit(runner, options) {
      base.call(this, runner, options);
      const stats = this.stats;
      let tests = [];
      const self = this; // the name of the test suite, as it will appear in the resulting XML file

      let suiteName; // the default name of the test suite if none is provided

      const DEFAULT_SUITE_NAME = 'Mocha Tests';

      if (options && options.reporterOptions) {
        if (options.reporterOptions.output) {
          if (!fs.createWriteStream) {
            throw createUnsupportedError(
              'file output not supported in browser',
            );
          }

          fs.mkdirSync(path$1.dirname(options.reporterOptions.output), {
            recursive: true,
          });
          self.fileStream = fs.createWriteStream(
            options.reporterOptions.output,
          );
        } // get the suite name from the reporter options (if provided)

        suiteName = options.reporterOptions.suiteName;
      } // fall back to the default suite name

      suiteName = suiteName || DEFAULT_SUITE_NAME;
      runner.on(EVENT_TEST_PENDING, test => {
        tests.push(test);
      });
      runner.on(EVENT_TEST_PASS, test => {
        tests.push(test);
      });
      runner.on(EVENT_TEST_FAIL, test => {
        tests.push(test);
      });
      runner.once(EVENT_RUN_END, () => {
        self.write(
          tag(
            'testsuite',
            {
              name: suiteName,
              tests: stats.tests,
              failures: 0,
              errors: stats.failures,
              skipped: stats.tests - stats.failures - stats.passes,
              timestamp: new Date().toUTCString(),
              time: stats.duration / 1000 || 0,
            },
            false,
          ),
        );
        tests.forEach(t => {
          self.test(t);
        });
        self.write('</testsuite>');
      });
    }
    /**
     * Inherit from `Base.prototype`.
     */

    inherits(XUnit, base);
    /**
     * Override done to close the stream (if it's a file).
     *
     * @param failures
     * @param {Function} fn
     */

    XUnit.prototype.done = function (failures, fn) {
      if (this.fileStream) {
        this.fileStream.end(() => {
          fn(failures);
        });
      } else {
        fn(failures);
      }
    };
    /**
     * Write out the given line.
     *
     * @param {string} line
     */

    XUnit.prototype.write = function (line) {
      if (this.fileStream) {
        this.fileStream.write(`${line}\n`);
      } else if (_typeof(process$1) === 'object' && process$1.stdout) {
        process$1.stdout.write(`${line}\n`);
      } else {
        base.consoleLog(line);
      }
    };
    /**
     * Output tag for the given `test.`
     *
     * @param {Test} test
     */

    XUnit.prototype.test = function (test) {
      base.useColors = false;
      const attrs = {
        classname: test.parent.fullTitle(),
        name: test.title,
        time: test.duration / 1000 || 0,
      };

      if (test.state === STATE_FAILED) {
        const err = test.err;
        let diff =
          !base.hideDiff && base.showDiff(err)
            ? `\n${  base.generateDiff(err.actual, err.expected)}`
            : '';
        this.write(
          tag(
            'testcase',
            attrs,
            false,
            tag(
              'failure',
              {},
              false,
              `${escape(err.message) + escape(diff)  }\n${  escape(err.stack)}`,
            ),
          ),
        );
      } else if (test.isPending()) {
        this.write(tag('testcase', attrs, false, tag('skipped', {}, true)));
      } else {
        this.write(tag('testcase', attrs, true));
      }
    };
    /**
     * HTML tag helper.
     *
     * @param name
     * @param attrs
     * @param close
     * @param content
     * @return {string}
     */

    function tag(name, attrs, close, content) {
      const end = close ? '/>' : '>';
      const pairs = [];
      let tag;

      for (const key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
          pairs.push(`${key}="${escape(attrs[key])}"`);
        }
      }

      tag = `<${name}${pairs.length ? ' ' + pairs.join(' ') : ''}${end}`;

      if (content) {
        tag += `${content}</${name}${end}`;
      }

      return tag;
    }

    XUnit.description = 'XUnit-compatible XML output';
  });

  const markdown = createCommonjsModule((module, exports) => {
    /**
     * @module Markdown
     */

    /**
     * Module dependencies.
     */

    const constants = runner$1.constants;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    const EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    const EVENT_SUITE_END = constants.EVENT_SUITE_END;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    /**
     * Constants
     */

    const SUITE_PREFIX = '$';
    /**
     * Expose `Markdown`.
     */

    module.exports = Markdown;
    /**
     * Constructs a new `Markdown` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function Markdown(runner, options) {
      base.call(this, runner, options);
      let level = 0;
      let buf = '';

      function title(str) {
        return `${new Array(level).join('#')  } ${  str}`;
      }

      function mapTOC(suite, obj) {
        const ret = obj;
        const key = SUITE_PREFIX + suite.title;
        obj = obj[key] = obj[key] || {
          suite,
        };
        suite.suites.forEach(suite => {
          mapTOC(suite, obj);
        });
        return ret;
      }

      function stringifyTOC(obj, level) {
        ++level;
        let buf = '';
        let link;

        for (const key in obj) {
          if (key === 'suite') {
            continue;
          }

          if (key !== SUITE_PREFIX) {
            link = ` - [${key.substring(1)}]`;
            link += `(#${utils.slug(obj[key].suite.fullTitle())})\n`;
            buf += new Array(level).join('  ') + link;
          }

          buf += stringifyTOC(obj[key], level);
        }

        return buf;
      }

      function generateTOC(suite) {
        const obj = mapTOC(suite, {});
        return stringifyTOC(obj, 0);
      }

      generateTOC(runner.suite);
      runner.on(EVENT_SUITE_BEGIN, suite => {
        ++level;
        const slug = utils.slug(suite.fullTitle());
        buf += `<a name="${slug}"></a>` + `\n`;
        buf += `${title(suite.title)}\n`;
      });
      runner.on(EVENT_SUITE_END, () => {
        --level;
      });
      runner.on(EVENT_TEST_PASS, test => {
        const code = utils.clean(test.body);
        buf += `${test.title}.\n`;
        buf += '\n```js\n';
        buf += `${code}\n`;
        buf += '```\n\n';
      });
      runner.once(EVENT_RUN_END, () => {
        process$1.stdout.write('# TOC\n');
        process$1.stdout.write(generateTOC(runner.suite));
        process$1.stdout.write(buf);
      });
    }

    Markdown.description = 'GitHub Flavored Markdown';
  });

  const progress$1 = createCommonjsModule((module, exports) => {
    /**
     * @module Progress
     */

    /**
     * Module dependencies.
     */

    const constants = runner$1.constants;
    const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    const EVENT_TEST_END = constants.EVENT_TEST_END;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    const inherits = utils.inherits;
    const color = base.color;
    const cursor = base.cursor;
    /**
     * Expose `Progress`.
     */

    module.exports = Progress;
    /**
     * General progress bar color.
     */

    base.colors.progress = 90;
    /**
     * Constructs a new `Progress` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function Progress(runner, options) {
      base.call(this, runner, options);
      const self = this;
      let width = (base.window.width * 0.5) | 0;
      let total = runner.total;
      let complete = 0;
      let lastN = -1; // default chars

      options = options || {};
      const reporterOptions = options.reporterOptions || {};
      options.open = reporterOptions.open || '[';
      options.complete = reporterOptions.complete || '▬';
      options.incomplete = reporterOptions.incomplete || base.symbols.dot;
      options.close = reporterOptions.close || ']';
      options.verbose = reporterOptions.verbose || false; // tests started

      runner.on(EVENT_RUN_BEGIN, () => {
        process$1.stdout.write('\n');
        cursor.hide();
      }); // tests complete

      runner.on(EVENT_TEST_END, () => {
        complete++;
        const percent = complete / total;
        let n = (width * percent) | 0;
        let i = width - n;

        if (n === lastN && !options.verbose) {
          // Don't re-render the line if it hasn't changed
          return;
        }

        lastN = n;
        cursor.CR();
        process$1.stdout.write('\u001B[J');
        process$1.stdout.write(color('progress', `  ${options.open}`));
        process$1.stdout.write(new Array(n).join(options.complete));
        process$1.stdout.write(new Array(i).join(options.incomplete));
        process$1.stdout.write(color('progress', options.close));

        if (options.verbose) {
          process$1.stdout.write(
            color('progress', ` ${  complete  } of ${  total}`),
          );
        }
      }); // tests are complete, output some stats
      // and the failures if any

      runner.once(EVENT_RUN_END, () => {
        cursor.show();
        process$1.stdout.write('\n');
        self.epilogue();
      });
    }
    /**
     * Inherit from `Base.prototype`.
     */

    inherits(Progress, base);
    Progress.description = 'a progress bar';
  });

  const landing = createCommonjsModule((module, exports) => {
    /**
     * @module Landing
     */

    /**
     * Module dependencies.
     */

    const inherits = utils.inherits;
    const constants = runner$1.constants;
    const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    const EVENT_RUN_END = constants.EVENT_RUN_END;
    const EVENT_TEST_END = constants.EVENT_TEST_END;
    const STATE_FAILED = runnable.constants.STATE_FAILED;
    const cursor = base.cursor;
    const color = base.color;
    /**
     * Expose `Landing`.
     */

    module.exports = Landing;
    /**
     * Airplane color.
     */

    base.colors.plane = 0;
    /**
     * Airplane crash color.
     */

    base.colors['plane crash'] = 31;
    /**
     * Runway color.
     */

    base.colors.runway = 90;
    /**
     * Constructs a new `Landing` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function Landing(runner, options) {
      base.call(this, runner, options);
      const self = this;
      let width = (base.window.width * 0.75) | 0;
      const stream = process$1.stdout;
      let plane = color('plane', '✈');
      let crashed = -1;
      let n = 0;
      let total = 0;

      function runway() {
        const buf = new Array(width).join('-');
        return `  ${color('runway', buf)}`;
      }

      runner.on(EVENT_RUN_BEGIN, () => {
        stream.write('\n\n\n  ');
        cursor.hide();
      });
      runner.on(EVENT_TEST_END, test => {
        // check if the plane crashed
        let col = crashed === -1 ? ((width * ++n) / ++total) | 0 : crashed; // show the crash

        if (test.state === STATE_FAILED) {
          plane = color('plane crash', '✈');
          crashed = col;
        } // render landing strip

        stream.write('\u001B[' + (width + 1) + 'D\u001B[2A');
        stream.write(runway());
        stream.write('\n  ');
        stream.write(color('runway', new Array(col).join('⋅')));
        stream.write(plane);
        stream.write(color('runway', `${new Array(width - col).join('⋅')  }\n`));
        stream.write(runway());
        stream.write('\u001B[0m');
      });
      runner.once(EVENT_RUN_END, () => {
        cursor.show();
        process$1.stdout.write('\n');
        self.epilogue();
      }); // if cursor is hidden when we ctrl-C, then it will remain hidden unless...

      process$1.once('SIGINT', () => {
        cursor.show();
        nextTick(() => {
          process$1.kill(process$1.pid, 'SIGINT');
        });
      });
    }
    /**
     * Inherit from `Base.prototype`.
     */

    inherits(Landing, base);
    Landing.description = 'Unicode landing strip';
  });

  const jsonStream = createCommonjsModule((module, exports) => {
    /**
     * @module JSONStream
     */

    /**
     * Module dependencies.
     */

    const constants = runner$1.constants;
    const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    let EVENT_RUN_END = constants.EVENT_RUN_END;
    /**
     * Expose `JSONStream`.
     */

    module.exports = JSONStream;
    /**
     * Constructs a new `JSONStream` reporter instance.
     *
     * @public
     * @class
     * @memberof Mocha.reporters
     * @extends Mocha.reporters.Base
     * @param {Runner} runner - Instance triggers reporter actions.
     * @param {Object} [options] - runner options
     */

    function JSONStream(runner, options) {
      base.call(this, runner, options);
      const self = this;
      let total = runner.total;
      runner.once(EVENT_RUN_BEGIN, () => {
        writeEvent([
          'start',
          {
            total,
          },
        ]);
      });
      runner.on(EVENT_TEST_PASS, test => {
        writeEvent(['pass', clean(test)]);
      });
      runner.on(EVENT_TEST_FAIL, (test, err) => {
        test = clean(test);
        test.err = err.message;
        test.stack = err.stack || null;
        writeEvent(['fail', test]);
      });
      runner.once(EVENT_RUN_END, () => {
        writeEvent(['end', self.stats]);
      });
    }
    /**
     * Mocha event to be written to the output stream.
     * @typedef {Array} JSONStream~MochaEvent
     */

    /**
     * Writes Mocha event to reporter output stream.
     *
     * @private
     * @param {JSONStream~MochaEvent} event - Mocha event to be output.
     */

    function writeEvent(event) {
      process$1.stdout.write(`${JSON.stringify(event)}\n`);
    }
    /**
     * Returns an object literal representation of `test`
     * free of cyclic properties, etc.
     *
     * @private
     * @param {Test} test - Instance used as data source.
     * @return {Object} object containing pared-down test instance data
     */

    function clean(test) {
      return {
        title: test.title,
        fullTitle: test.fullTitle(),
        file: test.file,
        duration: test.duration,
        currentRetry: test.currentRetry(),
        speed: test.speed,
      };
    }

    JSONStream.description = 'newline delimited JSON events';
  });

  const reporters = createCommonjsModule((module, exports) => {
    // for dynamic (try/catch) requires, which Browserify doesn't handle.

    exports.Base = exports.base = base;
    exports.Dot = exports.dot = dot;
    exports.Doc = exports.doc = doc;
    exports.TAP = exports.tap = tap;
    exports.JSON = exports.json = json;
    exports.HTML = exports.html = html$1;
    exports.List = exports.list = list;
    exports.Min = exports.min = min$7;
    exports.Spec = exports.spec = spec;
    exports.Nyan = exports.nyan = nyan;
    exports.XUnit = exports.xunit = xunit;
    exports.Markdown = exports.markdown = markdown;
    exports.Progress = exports.progress = progress$1;
    exports.Landing = exports.landing = landing;
    exports.JSONStream = exports['json-stream'] = jsonStream;
  });

  const name = 'mocha';
  const version$2 = '8.3.0';
  const homepage = 'https://mochajs.org/';
  const notifyLogo = 'https://ibin.co/4QuRuGjXvl36.png';
  const _package = {
    name,
    version: version$2,
    homepage,
    notifyLogo,
  };

  const _package$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    name,
    version: version$2,
    homepage,
    notifyLogo,
    default: _package,
  });

  const require$$10 = getCjsExportFromNamespace(_package$1);

  /**
   * Web Notifications module.
   * @module Growl
   */

  /**
   * Save timer references to avoid Sinon interfering (see GH-237).
   */

  const Date$2 = commonjsGlobal.Date;
  const setTimeout$2 = commonjsGlobal.setTimeout;
  const EVENT_RUN_END = runner$1.constants.EVENT_RUN_END;
  const isBrowser = utils.isBrowser;
  /**
   * Checks if browser notification support exists.
   *
   * @public
   * @see {@link https://caniuse.com/#feat=notifications|Browser support (notifications)}
   * @see {@link https://caniuse.com/#feat=promises|Browser support (promises)}
   * @see {@link Mocha#growl}
   * @see {@link Mocha#isGrowlCapable}
   * @return {boolean} whether browser notification support exists
   */

  const isCapable = function isCapable() {
    let hasNotificationSupport = 'Notification' in window;
    const hasPromiseSupport = typeof Promise === 'function';
    return isBrowser() && hasNotificationSupport && hasPromiseSupport;
  };
  /**
   * Implements browser notifications as a pseudo-reporter.
   *
   * @public
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/notification|Notification API}
   * @see {@link https://developers.google.com/web/fundamentals/push-notifications/display-a-notification|Displaying a Notification}
   * @see {@link Growl#isPermitted}
   * @see {@link Mocha#_growl}
   * @param {Runner} runner - Runner instance.
   */

  const notify$2 = function notify(runner) {
    const promise = isPermitted();
    /**
     * Attempt notification.
     */

    const sendNotification = function sendNotification() {
      // If user hasn't responded yet... "No notification for you!" (Seinfeld)
      Promise.race([promise, Promise.resolve(undefined)])
        .then(canNotify)
        .then(() => {
          display(runner);
        })
        ['catch'](notPermitted);
    };

    runner.once(EVENT_RUN_END, sendNotification);
  };
  /**
   * Checks if browser notification is permitted by user.
   *
   * @private
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Notification/permission|Notification.permission}
   * @see {@link Mocha#growl}
   * @see {@link Mocha#isGrowlPermitted}
   * @returns {Promise<boolean>} promise determining if browser notification
   *     permissible when fulfilled.
   */

  function isPermitted() {
    const permitted = {
      granted: function allow() {
        return Promise.resolve(true);
      },
      denied: function deny() {
        return Promise.resolve(false);
      },
      default: function ask() {
        return Notification.requestPermission().then(permission => {
          return permission === 'granted';
        });
      },
    };
    return permitted[Notification.permission]();
  }
  /**
   * @summary
   * Determines if notification should proceed.
   *
   * @description
   * Notification shall <strong>not</strong> proceed unless `value` is true.
   *
   * `value` will equal one of:
   * <ul>
   *   <li><code>true</code> (from `isPermitted`)</li>
   *   <li><code>false</code> (from `isPermitted`)</li>
   *   <li><code>undefined</code> (from `Promise.race`)</li>
   * </ul>
   *
   * @private
   * @param {boolean|undefined} value - Determines if notification permissible.
   * @returns {Promise<undefined>} Notification can proceed
   */

  function canNotify(value) {
    if (!value) {
      const why = value === false ? 'blocked' : 'unacknowledged';
      const reason = `not permitted by user (${why})`;
      return Promise.reject(new Error(reason));
    }

    return Promise.resolve();
  }
  /**
   * Displays the notification.
   *
   * @private
   * @param {Runner} runner - Runner instance.
   */

  function display(runner) {
    const stats = runner.stats;
    const symbol = {
      cross: '\u274C',
      tick: '\u2705',
    };
    const logo = require$$10.notifyLogo;

    let _message;

    let message;
    let title;

    if (stats.failures) {
      _message = `${stats.failures} of ${stats.tests} tests failed`;
      message = `${symbol.cross} ${_message}`;
      title = 'Failed';
    } else {
      _message = `${stats.passes} tests passed in ${stats.duration}ms`;
      message = `${symbol.tick} ${_message}`;
      title = 'Passed';
    } // Send notification

    const options = {
      badge: logo,
      body: message,
      dir: 'ltr',
      icon: logo,
      lang: 'en-US',
      name: 'mocha',
      requireInteraction: false,
      timestamp: Date$2.now(),
    };
    const notification = new Notification(title, options); // Autoclose after brief delay (makes various browsers act same)

    const FORCE_DURATION = 4000;
    setTimeout$2(notification.close.bind(notification), FORCE_DURATION);
  }
  /**
   * As notifications are tangential to our purpose, just log the error.
   *
   * @private
   * @param {Error} err - Why notification didn't happen.
   */

  function notPermitted(err) {
    console.error('notification error:', err.message);
  }

  const growl = {
    isCapable,
    notify: notify$2,
  };

  const diff$1 = true;
  const extension = ['js', 'cjs', 'mjs'];
  const reporter = 'spec';
  const slow = 75;
  const timeout = 2000;
  const ui = 'bdd';
  const mocharc = {
    diff: diff$1,
    extension,
    package: './package.json',
    reporter,
    slow,
    timeout,
    ui,
    'watch-ignore': ['node_modules', '.git'],
  };

  const mocharc$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    diff: diff$1,
    extension,
    reporter,
    slow,
    timeout,
    ui,
    default: mocharc,
  });

  /**
   * Provides a factory function for a {@link StatsCollector} object.
   * @module
   */

  const constants$4 = runner$1.constants;
  const EVENT_TEST_PASS = constants$4.EVENT_TEST_PASS;
  const EVENT_TEST_FAIL = constants$4.EVENT_TEST_FAIL;
  const EVENT_SUITE_BEGIN = constants$4.EVENT_SUITE_BEGIN;
  const EVENT_RUN_BEGIN = constants$4.EVENT_RUN_BEGIN;
  const EVENT_TEST_PENDING = constants$4.EVENT_TEST_PENDING;
  const EVENT_RUN_END$1 = constants$4.EVENT_RUN_END;
  const EVENT_TEST_END = constants$4.EVENT_TEST_END;
  /**
   * Test statistics collector.
   *
   * @public
   * @typedef {Object} StatsCollector
   * @property {number} suites - integer count of suites run.
   * @property {number} tests - integer count of tests run.
   * @property {number} passes - integer count of passing tests.
   * @property {number} pending - integer count of pending tests.
   * @property {number} failures - integer count of failed tests.
   * @property {Date} start - time when testing began.
   * @property {Date} end - time when testing concluded.
   * @property {number} duration - number of msecs that testing took.
   */

  const Date$3 = commonjsGlobal.Date;
  /**
   * Provides stats such as test duration, number of tests passed / failed etc., by listening for events emitted by `runner`.
   *
   * @private
   * @param {Runner} runner - Runner instance
   * @throws {TypeError} If falsy `runner`
   */

  function createStatsCollector(runner) {
    /**
     * @type StatsCollector
     */
    const stats = {
      suites: 0,
      tests: 0,
      passes: 0,
      pending: 0,
      failures: 0,
    };

    if (!runner) {
      throw new TypeError('Missing runner argument');
    }

    runner.stats = stats;
    runner.once(EVENT_RUN_BEGIN, () => {
      stats.start = new Date$3();
    });
    runner.on(EVENT_SUITE_BEGIN, suite => {
      suite.root || stats.suites++;
    });
    runner.on(EVENT_TEST_PASS, () => {
      stats.passes++;
    });
    runner.on(EVENT_TEST_FAIL, () => {
      stats.failures++;
    });
    runner.on(EVENT_TEST_PENDING, () => {
      stats.pending++;
    });
    runner.on(EVENT_TEST_END, () => {
      stats.tests++;
    });
    runner.once(EVENT_RUN_END$1, () => {
      stats.end = new Date$3();
      stats.duration = stats.end - stats.start;
    });
  }

  const statsCollector = createStatsCollector;

  const createInvalidArgumentTypeError$1 = errors.createInvalidArgumentTypeError;
  const isString$1 = utils.isString;
  const MOCHA_ID_PROP_NAME$1 = utils.constants.MOCHA_ID_PROP_NAME;
  const test$1 = Test;
  /**
   * Initialize a new `Test` with the given `title` and callback `fn`.
   *
   * @public
   * @class
   * @extends Runnable
   * @param {String} title - Test title (required)
   * @param {Function} [fn] - Test callback.  If omitted, the Test is considered "pending"
   */

  function Test(title, fn) {
    if (!isString$1(title)) {
      throw createInvalidArgumentTypeError$1(
        `Test argument "title" should be a string. Received type "${
          title,
        )}"`,
        'title',
        'string',
      );
    }

    this.type = 'test';
    runnable.call(this, title, fn);
    this.reset();
  }
  /**
   * Inherit from `Runnable.prototype`.
   */

  utils.inherits(Test, runnable);
  /**
   * Resets the state initially or for a next run.
   */

  Test.prototype.reset = function () {
    runnable.prototype.reset.call(this);
    this.pending = !this.fn;
    delete this.state;
  };
  /**
   * Set or get retried test
   *
   * @private
   */

  Test.prototype.retriedTest = function (n) {
    if (arguments.length === 0) {
      return this._retriedTest;
    }

    this._retriedTest = n;
  };
  /**
   * Add test to the list of tests marked `only`.
   *
   * @private
   */

  Test.prototype.markOnly = function () {
    this.parent.appendOnlyTest(this);
  };

  Test.prototype.clone = function () {
    const test = new Test(this.title, this.fn);
    test.timeout(this.timeout());
    test.slow(this.slow());
    test.retries(this.retries());
    test.currentRetry(this.currentRetry());
    test.retriedTest(this.retriedTest() || this);
    test.globals(this.globals());
    test.parent = this.parent;
    test.file = this.file;
    test.ctx = this.ctx;
    return test;
  };
  /**
   * Returns an minimal object suitable for transmission over IPC.
   * Functions are represented by keys beginning with `$$`.
   * @private
   * @returns {Object}
   */

  Test.prototype.serialize = function serialize() {
    return _defineProperty(
      {
        $$currentRetry: this._currentRetry,
        $$fullTitle: this.fullTitle(),
        $$isPending: this.pending,
        $$retriedTest: this._retriedTest || null,
        $$slow: this._slow,
        $$titlePath: this.titlePath(),
        body: this.body,
        duration: this.duration,
        err: this.err,
        parent: _defineProperty(
          {
            $$fullTitle: this.parent.fullTitle(),
          },
          MOCHA_ID_PROP_NAME$1,
          this.parent.id,
        ),
        speed: this.speed,
        state: this.state,
        title: this.title,
        type: this.type,
        file: this.file,
      },
      MOCHA_ID_PROP_NAME$1,
      this.id,
    );
  };

  /**
	 @module interfaces/common
	*/

  const createMissingArgumentError$1 = errors.createMissingArgumentError;
  const createUnsupportedError$2 = errors.createUnsupportedError;
  const createForbiddenExclusivityError$1 =
    errors.createForbiddenExclusivityError;
  /**
   * Functions common to more than one interface.
   *
   * @private
   * @param {Suite[]} suites
   * @param {Context} context
   * @param {Mocha} mocha
   * @return {Object} An object containing common functions.
   */

  const common$1 = function common(suites, context, mocha) {
    /**
     * Check if the suite should be tested.
     *
     * @private
     * @param {Suite} suite - suite to check
     * @returns {boolean}
     */
    function shouldBeTested(suite) {
      return (
        !mocha.options.grep ||
        (mocha.options.grep &&
          mocha.options.grep.test(suite.fullTitle()) &&
          !mocha.options.invert)
      );
    }

    return {
      /**
       * This is only present if flag --delay is passed into Mocha. It triggers
       * root suite execution.
       *
       * @param {Suite} suite The root suite.
       * @return {Function} A function which runs the root suite
       */
      runWithSuite: function runWithSuite(suite) {
        return function run() {
          suite.run();
        };
      },

      /**
       * Execute before running tests.
       *
       * @param {string} name
       * @param {Function} fn
       */
      before: function before(name, fn) {
        suites[0].beforeAll(name, fn);
      },

      /**
       * Execute after running tests.
       *
       * @param {string} name
       * @param {Function} fn
       */
      after: function after(name, fn) {
        suites[0].afterAll(name, fn);
      },

      /**
       * Execute before each test case.
       *
       * @param {string} name
       * @param {Function} fn
       */
      beforeEach: function beforeEach(name, fn) {
        suites[0].beforeEach(name, fn);
      },

      /**
       * Execute after each test case.
       *
       * @param {string} name
       * @param {Function} fn
       */
      afterEach: function afterEach(name, fn) {
        suites[0].afterEach(name, fn);
      },
      suite: {
        /**
         * Create an exclusive Suite; convenience function
         * See docstring for create() below.
         *
         * @param {Object} opts
         * @returns {Suite}
         */
        only: function only(opts) {
          if (mocha.options.forbidOnly) {
            throw createForbiddenExclusivityError$1(mocha);
          }

          opts.isOnly = true;
          return this.create(opts);
        },

        /**
         * Create a Suite, but skip it; convenience function
         * See docstring for create() below.
         *
         * @param {Object} opts
         * @returns {Suite}
         */
        skip: function skip(opts) {
          opts.pending = true;
          return this.create(opts);
        },

        /**
         * Creates a suite.
         *
         * @param {Object} opts Options
         * @param {string} opts.title Title of Suite
         * @param {Function} [opts.fn] Suite Function (not always applicable)
         * @param {boolean} [opts.pending] Is Suite pending?
         * @param {string} [opts.file] Filepath where this Suite resides
         * @param {boolean} [opts.isOnly] Is Suite exclusive?
         * @returns {Suite}
         */
        create: function create(opts) {
          const suite$1 = suite.create(suites[0], opts.title);
          suite$1.pending = Boolean(opts.pending);
          suite$1.file = opts.file;
          suites.unshift(suite$1);

          if (opts.isOnly) {
            suite$1.markOnly();
          }

          if (
            suite$1.pending &&
            mocha.options.forbidPending &&
            shouldBeTested(suite$1)
          ) {
            throw createUnsupportedError$2('Pending test forbidden');
          }

          if (typeof opts.fn === 'function') {
            opts.fn.call(suite$1);
            suites.shift();
          } else if (typeof opts.fn === 'undefined' && !suite$1.pending) {
            throw createMissingArgumentError$1(
              `Suite "${ 
                suite$1.fullTitle() 
                }" was defined but no callback was supplied. ` +
                `Supply a callback or explicitly skip the suite.`,
              'callback',
              'function',
            );
          } else if (!opts.fn && suite$1.pending) {
            suites.shift();
          }

          return suite$1;
        },
      },
      test: {
        /**
         * Exclusive test-case.
         *
         * @param {Object} mocha
         * @param {Function} test
         * @returns {*}
         */
        only: function only(mocha, test) {
          if (mocha.options.forbidOnly) {
            throw createForbiddenExclusivityError$1(mocha);
          }

          test.markOnly();
          return test;
        },

        /**
         * Pending test case.
         *
         * @param {string} title
         */
        skip: function skip(title) {
          context.test(title);
        },

        /**
         * Number of retry attempts
         *
         * @param {number} n
         */
        retries: function retries(n) {
          context.retries(n);
        },
      },
    };
  };

  const EVENT_FILE_PRE_REQUIRE = suite.constants.EVENT_FILE_PRE_REQUIRE;
  /**
   * BDD-style interface:
   *
   *      describe('Array', function() {
   *        describe('#indexOf()', function() {
   *          it('should return -1 when not present', function() {
   *            // ...
   *          });
   *
   *          it('should return the index when present', function() {
   *            // ...
   *          });
   *        });
   *      });
   *
   * @param {Suite} suite Root suite.
   */

  const bdd = function bddInterface(suite) {
    const suites = [suite];
    suite.on(EVENT_FILE_PRE_REQUIRE, (context, file, mocha) => {
      const common = common$1(suites, context, mocha);
      context.before = common.before;
      context.after = common.after;
      context.beforeEach = common.beforeEach;
      context.afterEach = common.afterEach;
      context.run = mocha.options.delay && common.runWithSuite(suite);
      /**
       * Describe a "suite" with the given `title`
       * and callback `fn` containing nested suites
       * and/or tests.
       */

      context.describe = context.context = function (title, fn) {
        return common.suite.create({
          title,
          file,
          fn,
        });
      };
      /**
       * Pending describe.
       */

      context.xdescribe =
        context.xcontext =
        context.describe.skip =
          function (title, fn) {
            return common.suite.skip({
              title,
              file,
              fn,
            });
          };
      /**
       * Exclusive suite.
       */

      context.describe.only = function (title, fn) {
        return common.suite.only({
          title,
          file,
          fn,
        });
      };
      /**
       * Describe a specification or test-case
       * with the given `title` and callback `fn`
       * acting as a thunk.
       */

      context.it = context.specify = function (title, fn) {
        const suite = suites[0];

        if (suite.isPending()) {
          fn = null;
        }

        const test = new test$1(title, fn);
        test.file = file;
        suite.addTest(test);
        return test;
      };
      /**
       * Exclusive test-case.
       */

      context.it.only = function (title, fn) {
        return common.test.only(mocha, context.it(title, fn));
      };
      /**
       * Pending test case.
       */

      context.xit =
        context.xspecify =
        context.it.skip =
          function (title) {
            return context.it(title);
          };
      /**
       * Number of attempts to retry.
       */

      context.it.retries = function (n) {
        context.retries(n);
      };
    });
  };

  const description = 'BDD or RSpec style [default]';
  bdd.description = description;

  const EVENT_FILE_PRE_REQUIRE$1 = suite.constants.EVENT_FILE_PRE_REQUIRE;
  /**
   * TDD-style interface:
   *
   *      suite('Array', function() {
   *        suite('#indexOf()', function() {
   *          suiteSetup(function() {
   *
   *          });
   *
   *          test('should return -1 when not present', function() {
   *
   *          });
   *
   *          test('should return the index when present', function() {
   *
   *          });
   *
   *          suiteTeardown(function() {
   *
   *          });
   *        });
   *      });
   *
   * @param {Suite} suite Root suite.
   */

  const tdd = function tdd(suite) {
    const suites = [suite];
    suite.on(EVENT_FILE_PRE_REQUIRE$1, (context, file, mocha) => {
      const common = common$1(suites, context, mocha);
      context.setup = common.beforeEach;
      context.teardown = common.afterEach;
      context.suiteSetup = common.before;
      context.suiteTeardown = common.after;
      context.run = mocha.options.delay && common.runWithSuite(suite);
      /**
       * Describe a "suite" with the given `title` and callback `fn` containing
       * nested suites and/or tests.
       */

      context.suite = function (title, fn) {
        return common.suite.create({
          title,
          file,
          fn,
        });
      };
      /**
       * Pending suite.
       */

      context.suite.skip = function (title, fn) {
        return common.suite.skip({
          title,
          file,
          fn,
        });
      };
      /**
       * Exclusive test-case.
       */

      context.suite.only = function (title, fn) {
        return common.suite.only({
          title,
          file,
          fn,
        });
      };
      /**
       * Describe a specification or test-case with the given `title` and
       * callback `fn` acting as a thunk.
       */

      context.test = function (title, fn) {
        const suite = suites[0];

        if (suite.isPending()) {
          fn = null;
        }

        const test = new test$1(title, fn);
        test.file = file;
        suite.addTest(test);
        return test;
      };
      /**
       * Exclusive test-case.
       */

      context.test.only = function (title, fn) {
        return common.test.only(mocha, context.test(title, fn));
      };

      context.test.skip = common.test.skip;
      context.test.retries = common.test.retries;
    });
  };

  const description$1 =
    'traditional "suite"/"test" instead of BDD\'s "describe"/"it"';
  tdd.description = description$1;

  const EVENT_FILE_PRE_REQUIRE$2 = suite.constants.EVENT_FILE_PRE_REQUIRE;
  /**
   * QUnit-style interface:
   *
   *     suite('Array');
   *
   *     test('#length', function() {
   *       var arr = [1,2,3];
   *       ok(arr.length == 3);
   *     });
   *
   *     test('#indexOf()', function() {
   *       var arr = [1,2,3];
   *       ok(arr.indexOf(1) == 0);
   *       ok(arr.indexOf(2) == 1);
   *       ok(arr.indexOf(3) == 2);
   *     });
   *
   *     suite('String');
   *
   *     test('#length', function() {
   *       ok('foo'.length == 3);
   *     });
   *
   * @param {Suite} suite Root suite.
   */

  const qunit = function qUnitInterface(suite) {
    const suites = [suite];
    suite.on(EVENT_FILE_PRE_REQUIRE$2, (context, file, mocha) => {
      const common = common$1(suites, context, mocha);
      context.before = common.before;
      context.after = common.after;
      context.beforeEach = common.beforeEach;
      context.afterEach = common.afterEach;
      context.run = mocha.options.delay && common.runWithSuite(suite);
      /**
       * Describe a "suite" with the given `title`.
       */

      context.suite = function (title) {
        if (suites.length > 1) {
          suites.shift();
        }

        return common.suite.create({
          title,
          file,
          fn: false,
        });
      };
      /**
       * Exclusive Suite.
       */

      context.suite.only = function (title) {
        if (suites.length > 1) {
          suites.shift();
        }

        return common.suite.only({
          title,
          file,
          fn: false,
        });
      };
      /**
       * Describe a specification or test-case
       * with the given `title` and callback `fn`
       * acting as a thunk.
       */

      context.test = function (title, fn) {
        const test = new test$1(title, fn);
        test.file = file;
        suites[0].addTest(test);
        return test;
      };
      /**
       * Exclusive test-case.
       */

      context.test.only = function (title, fn) {
        return common.test.only(mocha, context.test(title, fn));
      };

      context.test.skip = common.test.skip;
      context.test.retries = common.test.retries;
    });
  };

  const description$2 = 'QUnit style';
  qunit.description = description$2;

  /**
   * Exports-style (as Node.js module) interface:
   *
   *     exports.Array = {
   *       '#indexOf()': {
   *         'should return -1 when the value is not present': function() {
   *
   *         },
   *
   *         'should return the correct index when the value is present': function() {
   *
   *         }
   *       }
   *     };
   *
   * @param {Suite} suite Root suite.
   */

  const exports$1 = function exports(suite$1) {
    const suites = [suite$1];
    suite$1.on(suite.constants.EVENT_FILE_REQUIRE, visit);

    function visit(obj, file) {
      let suite$1;

      for (const key in obj) {
        if (typeof obj[key] === 'function') {
          const fn = obj[key];

          switch (key) {
            case 'before':
              suites[0].beforeAll(fn);
              break;

            case 'after':
              suites[0].afterAll(fn);
              break;

            case 'beforeEach':
              suites[0].beforeEach(fn);
              break;

            case 'afterEach':
              suites[0].afterEach(fn);
              break;

            default:
              var test = new test$1(key, fn);
              test.file = file;
              suites[0].addTest(test);
          }
        } else {
          suite$1 = suite.create(suites[0], key);
          suites.unshift(suite$1);
          visit(obj[key], file);
          suites.shift();
        }
      }
    }
  };

  const description$3 = 'Node.js module ("exports") style';
  exports$1.description = description$3;

  const bdd$1 = bdd;
  const tdd$1 = tdd;
  const qunit$1 = qunit;
  const exports$2 = exports$1;
  const interfaces = {
    bdd: bdd$1,
    tdd: tdd$1,
    qunit: qunit$1,
    exports: exports$2,
  };

  /**
   * @module Context
   */

  /**
   * Expose `Context`.
   */

  const context = Context;
  /**
   * Initialize a new `Context`.
   *
   * @private
   */

  function Context() {}
  /**
   * Set or get the context `Runnable` to `runnable`.
   *
   * @private
   * @param {Runnable} runnable
   * @return {Context} context
   */

  Context.prototype.runnable = function (runnable) {
    if (arguments.length === 0) {
      return this._runnable;
    }

    this.test = this._runnable = runnable;
    return this;
  };
  /**
   * Set or get test timeout `ms`.
   *
   * @private
   * @param {number} ms
   * @return {Context} self
   */

  Context.prototype.timeout = function (ms) {
    if (arguments.length === 0) {
      return this.runnable().timeout();
    }

    this.runnable().timeout(ms);
    return this;
  };
  /**
   * Set or get test slowness threshold `ms`.
   *
   * @private
   * @param {number} ms
   * @return {Context} self
   */

  Context.prototype.slow = function (ms) {
    if (arguments.length === 0) {
      return this.runnable().slow();
    }

    this.runnable().slow(ms);
    return this;
  };
  /**
   * Mark a test as skipped.
   *
   * @private
   * @throws Pending
   */

  Context.prototype.skip = function () {
    this.runnable().skip();
  };
  /**
   * Set or get a number of allowed retries on failed tests
   *
   * @private
   * @param {number} n
   * @return {Context} self
   */

  Context.prototype.retries = function (n) {
    if (arguments.length === 0) {
      return this.runnable().retries();
    }

    this.runnable().retries(n);
    return this;
  };

  const mocharc$2 = getCjsExportFromNamespace(mocharc$1);

  const mocha = createCommonjsModule((module, exports) => {
    /*!
     * mocha
     * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
     * MIT Licensed
     */

    const esmUtils = utils.supportsEsModules(true) ? require$$11 : undefined;
    const warn = errors.warn,
      createInvalidReporterError = errors.createInvalidReporterError,
      createInvalidInterfaceError = errors.createInvalidInterfaceError,
      createMochaInstanceAlreadyDisposedError =
        errors.createMochaInstanceAlreadyDisposedError,
      createMochaInstanceAlreadyRunningError =
        errors.createMochaInstanceAlreadyRunningError,
      createUnsupportedError = errors.createUnsupportedError;
    const _Suite$constants = suite.constants,
      EVENT_FILE_PRE_REQUIRE = _Suite$constants.EVENT_FILE_PRE_REQUIRE,
      EVENT_FILE_POST_REQUIRE = _Suite$constants.EVENT_FILE_POST_REQUIRE,
      EVENT_FILE_REQUIRE = _Suite$constants.EVENT_FILE_REQUIRE;
    const sQuote = utils.sQuote;
    const debug = browser$2('mocha:mocha');
    exports = module.exports = Mocha;
    /**
     * A Mocha instance is a finite state machine.
     * These are the states it can be in.
     * @private
     */

    const mochaStates = utils.defineConstants({
      /**
       * Initial state of the mocha instance
       * @private
       */
      INIT: 'init',

      /**
       * Mocha instance is running tests
       * @private
       */
      RUNNING: 'running',

      /**
       * Mocha instance is done running tests and references to test functions and hooks are cleaned.
       * You can reset this state by unloading the test files.
       * @private
       */
      REFERENCES_CLEANED: 'referencesCleaned',

      /**
       * Mocha instance is disposed and can no longer be used.
       * @private
       */
      DISPOSED: 'disposed',
    });
    /**
     * To require local UIs and reporters when running in node.
     */

    if (!utils.isBrowser() && typeof module.paths !== 'undefined') {
      let cwd = utils.cwd();
      module.paths.push(cwd, path$1.join(cwd, 'node_modules'));
    }
    /**
     * Expose internals.
     * @private
     */

    exports.utils = utils;
    exports.interfaces = interfaces;
    /**
     * @public
     * @memberof Mocha
     */

    exports.reporters = reporters;
    exports.Runnable = runnable;
    exports.Context = context;
    /**
     *
     * @memberof Mocha
     */

    exports.Runner = runner$1;
    exports.Suite = suite;
    exports.Hook = hook;
    exports.Test = test$1;
    /**
     * Constructs a new Mocha instance with `options`.
     *
     * @public
     * @class Mocha
     * @param {Object} [options] - Settings object.
     * @param {boolean} [options.allowUncaught] - Propagate uncaught errors?
     * @param {boolean} [options.asyncOnly] - Force `done` callback or promise?
     * @param {boolean} [options.bail] - Bail after first test failure?
     * @param {boolean} [options.checkLeaks] - Check for global variable leaks?
     * @param {boolean} [options.color] - Color TTY output from reporter?
     * @param {boolean} [options.delay] - Delay root suite execution?
     * @param {boolean} [options.diff] - Show diff on failure?
     * @param {string} [options.fgrep] - Test filter given string.
     * @param {boolean} [options.forbidOnly] - Tests marked `only` fail the suite?
     * @param {boolean} [options.forbidPending] - Pending tests fail the suite?
     * @param {boolean} [options.fullTrace] - Full stacktrace upon failure?
     * @param {string[]} [options.global] - Variables expected in global scope.
     * @param {RegExp|string} [options.grep] - Test filter given regular expression.
     * @param {boolean} [options.growl] - Enable desktop notifications?
     * @param {boolean} [options.inlineDiffs] - Display inline diffs?
     * @param {boolean} [options.invert] - Invert test filter matches?
     * @param {boolean} [options.noHighlighting] - Disable syntax highlighting?
     * @param {string|constructor} [options.reporter] - Reporter name or constructor.
     * @param {Object} [options.reporterOption] - Reporter settings object.
     * @param {number} [options.retries] - Number of times to retry failed tests.
     * @param {number} [options.slow] - Slow threshold value.
     * @param {number|string} [options.timeout] - Timeout threshold value.
     * @param {string} [options.ui] - Interface name.
     * @param {boolean} [options.parallel] - Run jobs in parallel
     * @param {number} [options.jobs] - Max number of worker processes for parallel runs
     * @param {MochaRootHookObject} [options.rootHooks] - Hooks to bootstrap the root
     * suite with
     * @param {boolean} [options.isWorker] - Should be `true` if `Mocha` process is running in a worker process.
     */

    function Mocha() {
      let options =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      options = _objectSpread2(_objectSpread2({}, mocharc$2), options);
      this.files = [];
      this.options = options; // root suite

      this.suite = new exports.Suite('', new exports.Context(), true);
      this._cleanReferencesAfterRun = true;
      this._state = mochaStates.INIT;
      this.grep(options.grep)
        .fgrep(options.fgrep)
        .ui(options.ui)
        .reporter(
          options.reporter,
          options.reporterOption || options.reporterOptions, // reporterOptions was previously the only way to specify options to reporter
        )
        .slow(options.slow)
        .global(options.global); // this guard exists because Suite#timeout does not consider `undefined` to be valid input

      if (typeof options.timeout !== 'undefined') {
        this.timeout(options.timeout === false ? 0 : options.timeout);
      }

      if ('retries' in options) {
        this.retries(options.retries);
      }

      [
        'allowUncaught',
        'asyncOnly',
        'bail',
        'checkLeaks',
        'color',
        'delay',
        'diff',
        'forbidOnly',
        'forbidPending',
        'fullTrace',
        'growl',
        'inlineDiffs',
        'invert',
      ].forEach(function (opt) {
        if (options[opt]) {
          this[opt]();
        }
      }, this);

      if (options.rootHooks) {
        this.rootHooks(options.rootHooks);
      }
      /**
       * The class which we'll instantiate in {@link Mocha#run}.  Defaults to
       * {@link Runner} in serial mode; changes in parallel mode.
       * @memberof Mocha
       * @private
       */

      this._runnerClass = exports.Runner;
      /**
       * Whether or not to call {@link Mocha#loadFiles} implicitly when calling
       * {@link Mocha#run}.  If this is `true`, then it's up to the consumer to call
       * {@link Mocha#loadFiles} _or_ {@link Mocha#loadFilesAsync}.
       * @private
       * @memberof Mocha
       */

      this._lazyLoadFiles = false;
      /**
       * It's useful for a Mocha instance to know if it's running in a worker process.
       * We could derive this via other means, but it's helpful to have a flag to refer to.
       * @memberof Mocha
       * @private
       */

      this.isWorker = Boolean(options.isWorker);
      this.globalSetup(options.globalSetup)
        .globalTeardown(options.globalTeardown)
        .enableGlobalSetup(options.enableGlobalSetup)
        .enableGlobalTeardown(options.enableGlobalTeardown);

      if (
        options.parallel &&
        (typeof options.jobs === 'undefined' || options.jobs > 1)
      ) {
        debug('attempting to enable parallel mode');
        this.parallelMode(true);
      }
    }
    /**
     * Enables or disables bailing on the first failure.
     *
     * @public
     * @see [CLI option](../#-bail-b)
     * @param {boolean} [bail=true] - Whether to bail on first error.
     * @returns {Mocha} this
     * @chainable
     */

    Mocha.prototype.bail = function (bail) {
      this.suite.bail(bail !== false);
      return this;
    };
    /**
     * @summary
     * Adds `file` to be loaded for execution.
     *
     * @description
     * Useful for generic setup code that must be included within test suite.
     *
     * @public
     * @see [CLI option](../#-file-filedirectoryglob)
     * @param {string} file - Pathname of file to be loaded.
     * @returns {Mocha} this
     * @chainable
     */

    Mocha.prototype.addFile = function (file) {
      this.files.push(file);
      return this;
    };
    /**
     * Sets reporter to `reporter`, defaults to "spec".
     *
     * @public
     * @see [CLI option](../#-reporter-name-r-name)
     * @see [Reporters](../#reporters)
     * @param {String|Function} reporterName - Reporter name or constructor.
     * @param {Object} [reporterOptions] - Options used to configure the reporter.
     * @returns {Mocha} this
     * @chainable
     * @throws {Error} if requested reporter cannot be loaded
     * @example
     *
     * // Use XUnit reporter and direct its output to file
     * mocha.reporter('xunit', { output: '/path/to/testspec.xunit.xml' });
     */

    Mocha.prototype.reporter = function (reporterName, reporterOptions) {
      if (typeof reporterName === 'function') {
        this._reporter = reporterName;
      } else {
        reporterName = reporterName || 'spec';
        let reporter; // Try to load a built-in reporter.

        if (reporters[reporterName]) {
          reporter = reporters[reporterName];
        } // Try to load reporters from process.cwd() and node_modules

        if (!reporter) {
          try {
            reporter = commonjsRequire(reporterName);
          } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
              // Try to load reporters from a path (absolute or relative)
              try {
                reporter = commonjsRequire(
                  path$1.resolve(utils.cwd(), reporterName),
                );
              } catch (_err) {
                _err.code === 'MODULE_NOT_FOUND'
                  ? warn(`${sQuote(reporterName)  } reporter not found`)
                  : warn(
                      `${sQuote(reporterName) 
                        } reporter blew up with error:\n${ 
                        err.stack}`,
                    );
              }
            } else {
              warn(
                `${sQuote(reporterName) 
                  } reporter blew up with error:\n${ 
                  err.stack}`,
              );
            }
          }
        }

        if (!reporter) {
          throw createInvalidReporterError(
            `invalid reporter ${  sQuote(reporterName)}`,
            reporterName,
          );
        }

        this._reporter = reporter;
      }

      this.options.reporterOption = reporterOptions; // alias option name is used in public reporters xunit/tap/progress

      this.options.reporterOptions = reporterOptions;
      return this;
    };
    /**
     * Sets test UI `name`, defaults to "bdd".
     *
     * @public
     * @see [CLI option](../#-ui-name-u-name)
     * @see [Interface DSLs](../#interfaces)
     * @param {string|Function} [ui=bdd] - Interface name or class.
     * @returns {Mocha} this
     * @chainable
     * @throws {Error} if requested interface cannot be loaded
     */

    Mocha.prototype.ui = function (ui) {
      let bindInterface;

      if (typeof ui === 'function') {
        bindInterface = ui;
      } else {
        ui = ui || 'bdd';
        bindInterface = exports.interfaces[ui];

        if (!bindInterface) {
          try {
            bindInterface = commonjsRequire(ui);
          } catch {
            throw createInvalidInterfaceError(
              `invalid interface ${  sQuote(ui)}`,
              ui,
            );
          }
        }
      }

      bindInterface(this.suite);
      this.suite.on(EVENT_FILE_PRE_REQUIRE, context => {
        exports.afterEach = context.afterEach || context.teardown;
        exports.after = context.after || context.suiteTeardown;
        exports.beforeEach = context.beforeEach || context.setup;
        exports.before = context.before || context.suiteSetup;
        exports.describe = context.describe || context.suite;
        exports.it = context.it || context.test;
        exports.xit = context.xit || (context.test && context.test.skip);
        exports.setup = context.setup || context.beforeEach;
        exports.suiteSetup = context.suiteSetup || context.before;
        exports.suiteTeardown = context.suiteTeardown || context.after;
        exports.suite = context.suite || context.describe;
        exports.teardown = context.teardown || context.afterEach;
        exports.test = context.test || context.it;
        exports.run = context.run;
      });
      return this;
    };
    /**
     * Loads `files` prior to execution. Does not support ES Modules.
     *
     * @description
     * The implementation relies on Node's `require` to execute
     * the test interface functions and will be subject to its cache.
     * Supports only CommonJS modules. To load ES modules, use Mocha#loadFilesAsync.
     *
     * @private
     * @see {@link Mocha#addFile}
     * @see {@link Mocha#run}
     * @see {@link Mocha#unloadFiles}
     * @see {@link Mocha#loadFilesAsync}
     * @param {Function} [fn] - Callback invoked upon completion.
     */

    Mocha.prototype.loadFiles = function (fn) {
      const self = this;
      const suite = this.suite;
      this.files.forEach(file => {
        file = path$1.resolve(file);
        suite.emit(EVENT_FILE_PRE_REQUIRE, commonjsGlobal, file, self);
        suite.emit(EVENT_FILE_REQUIRE, commonjsRequire(), file, self);
        suite.emit(EVENT_FILE_POST_REQUIRE, commonjsGlobal, file, self);
      });
      fn && fn();
    };
    /**
     * Loads `files` prior to execution. Supports Node ES Modules.
     *
     * @description
     * The implementation relies on Node's `require` and `import` to execute
     * the test interface functions and will be subject to its cache.
     * Supports both CJS and ESM modules.
     *
     * @public
     * @see {@link Mocha#addFile}
     * @see {@link Mocha#run}
     * @see {@link Mocha#unloadFiles}
     * @returns {Promise}
     * @example
     *
     * // loads ESM (and CJS) test files asynchronously, then runs root suite
     * mocha.loadFilesAsync()
     *   .then(() => mocha.run(failures => process.exitCode = failures ? 1 : 0))
     *   .catch(() => process.exitCode = 1);
     */

    Mocha.prototype.loadFilesAsync = function () {
      const self = this;
      const suite = this.suite;
      this.lazyLoadFiles(true);

      if (!esmUtils) {
        return new Promise(resolve => {
          self.loadFiles(resolve);
        });
      }

      return esmUtils.loadFilesAsync(
        this.files,
        file => {
          suite.emit(EVENT_FILE_PRE_REQUIRE, commonjsGlobal, file, self);
        },
        (file, resultModule) => {
          suite.emit(EVENT_FILE_REQUIRE, resultModule, file, self);
          suite.emit(EVENT_FILE_POST_REQUIRE, commonjsGlobal, file, self);
        },
      );
    };
    /**
     * Removes a previously loaded file from Node's `require` cache.
     *
     * @private
     * @static
     * @see {@link Mocha#unloadFiles}
     * @param {string} file - Pathname of file to be unloaded.
     */

    Mocha.unloadFile = function (file) {
      if (utils.isBrowser()) {
        throw createUnsupportedError(
          'unloadFile() is only suported in a Node.js environment',
        );
      }

      return require$$11.unloadFile(file);
    };
    /**
     * Unloads `files` from Node's `require` cache.
     *
     * @description
     * This allows required files to be "freshly" reloaded, providing the ability
     * to reuse a Mocha instance programmatically.
     * Note: does not clear ESM module files from the cache
     *
     * <strong>Intended for consumers &mdash; not used internally</strong>
     *
     * @public
     * @see {@link Mocha#run}
     * @returns {Mocha} this
     * @chainable
     */

    Mocha.prototype.unloadFiles = function () {
      if (this._state === mochaStates.DISPOSED) {
        throw createMochaInstanceAlreadyDisposedError(
          'Mocha instance is already disposed, it cannot be used again.',
          this._cleanReferencesAfterRun,
          this,
        );
      }

      this.files.forEach(file => {
        Mocha.unloadFile(file);
      });
      this._state = mochaStates.INIT;
      return this;
    };
    /**
     * Sets `grep` filter after escaping RegExp special characters.
     *
     * @public
     * @see {@link Mocha#grep}
     * @param {string} str - Value to be converted to a regexp.
     * @returns {Mocha} this
     * @chainable
     * @example
     *
     * // Select tests whose full title begins with `"foo"` followed by a period
     * mocha.fgrep('foo.');
     */

    Mocha.prototype.fgrep = function (str) {
      if (!str) {
        return this;
      }

      return this.grep(new RegExp(escapeStringRegexp(str)));
    };
    /**
     * @summary
     * Sets `grep` filter used to select specific tests for execution.
     *
     * @description
     * If `re` is a regexp-like string, it will be converted to regexp.
     * The regexp is tested against the full title of each test (i.e., the
     * name of the test preceded by titles of each its ancestral suites).
     * As such, using an <em>exact-match</em> fixed pattern against the
     * test name itself will not yield any matches.
     * <br>
     * <strong>Previous filter value will be overwritten on each call!</strong>
     *
     * @public
     * @see [CLI option](../#-grep-regexp-g-regexp)
     * @see {@link Mocha#fgrep}
     * @see {@link Mocha#invert}
     * @param {RegExp|String} re - Regular expression used to select tests.
     * @return {Mocha} this
     * @chainable
     * @example
     *
     * // Select tests whose full title contains `"match"`, ignoring case
     * mocha.grep(/match/i);
     * @example
     *
     * // Same as above but with regexp-like string argument
     * mocha.grep('/match/i');
     * @example
     *
     * // ## Anti-example
     * // Given embedded test `it('only-this-test')`...
     * mocha.grep('/^only-this-test$/');    // NO! Use `.only()` to do this!
     */

    Mocha.prototype.grep = function (re) {
      if (utils.isString(re)) {
        // extract args if it's regex-like, i.e: [string, pattern, flag]
        const arg = re.match(/^\/(.*)\/(g|i|)$|.*/);
        this.options.grep = new RegExp(arg[1] || arg[0], arg[2]);
      } else {
        this.options.grep = re;
      }

      return this;
    };
    /**
     * Inverts `grep` matches.
     *
     * @public
     * @see {@link Mocha#grep}
     * @return {Mocha} this
     * @chainable
     * @example
     *
     * // Select tests whose full title does *not* contain `"match"`, ignoring case
     * mocha.grep(/match/i).invert();
     */

    Mocha.prototype.invert = function () {
      this.options.invert = true;
      return this;
    };
    /**
     * Enables or disables checking for global variables leaked while running tests.
     *
     * @public
     * @see [CLI option](../#-check-leaks)
     * @param {boolean} [checkLeaks=true] - Whether to check for global variable leaks.
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.checkLeaks = function (checkLeaks) {
      this.options.checkLeaks = checkLeaks !== false;
      return this;
    };
    /**
     * Enables or disables whether or not to dispose after each test run.
     * Disable this to ensure you can run the test suite multiple times.
     * If disabled, be sure to dispose mocha when you're done to prevent memory leaks.
     * @public
     * @see {@link Mocha#dispose}
     * @param {boolean} cleanReferencesAfterRun
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.cleanReferencesAfterRun = function (
      cleanReferencesAfterRun,
    ) {
      this._cleanReferencesAfterRun = cleanReferencesAfterRun !== false;
      return this;
    };
    /**
     * Manually dispose this mocha instance. Mark this instance as `disposed` and unable to run more tests.
     * It also removes function references to tests functions and hooks, so variables trapped in closures can be cleaned by the garbage collector.
     * @public
     */

    Mocha.prototype.dispose = function () {
      if (this._state === mochaStates.RUNNING) {
        throw createMochaInstanceAlreadyRunningError(
          'Cannot dispose while the mocha instance is still running tests.',
        );
      }

      this.unloadFiles();
      this._previousRunner && this._previousRunner.dispose();
      this.suite.dispose();
      this._state = mochaStates.DISPOSED;
    };
    /**
     * Displays full stack trace upon test failure.
     *
     * @public
     * @see [CLI option](../#-full-trace)
     * @param {boolean} [fullTrace=true] - Whether to print full stacktrace upon failure.
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.fullTrace = function (fullTrace) {
      this.options.fullTrace = fullTrace !== false;
      return this;
    };
    /**
     * Enables desktop notification support if prerequisite software installed.
     *
     * @public
     * @see [CLI option](../#-growl-g)
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.growl = function () {
      this.options.growl = this.isGrowlCapable();

      if (!this.options.growl) {
        let detail = utils.isBrowser()
          ? 'notification support not available in this browser...'
          : 'notification support prerequisites not installed...';
        console.error(`${detail} cannot enable!`);
      }

      return this;
    };
    /**
     * @summary
     * Determines if Growl support seems likely.
     *
     * @description
     * <strong>Not available when run in browser.</strong>
     *
     * @private
     * @see {@link Growl#isCapable}
     * @see {@link Mocha#growl}
     * @return {boolean} whether Growl support can be expected
     */

    Mocha.prototype.isGrowlCapable = growl.isCapable;
    /**
     * Implements desktop notifications using a pseudo-reporter.
     *
     * @private
     * @see {@link Mocha#growl}
     * @see {@link Growl#notify}
     * @param {Runner} runner - Runner instance.
     */

    Mocha.prototype._growl = growl.notify;
    /**
     * Specifies whitelist of variable names to be expected in global scope.
     *
     * @public
     * @see [CLI option](../#-global-variable-name)
     * @see {@link Mocha#checkLeaks}
     * @param {String[]|String} global - Accepted global variable name(s).
     * @return {Mocha} this
     * @chainable
     * @example
     *
     * // Specify variables to be expected in global scope
     * mocha.global(['jQuery', 'MyLib']);
     */

    Mocha.prototype.global = function (global) {
      this.options.global = (this.options.global || [])
        .concat(global)
        .filter(Boolean)
        .filter((elt, idx, arr) => {
          return arr.indexOf(elt) === idx;
        });
      return this;
    }; // for backwards compability, 'globals' is an alias of 'global'

    Mocha.prototype.globals = Mocha.prototype.global;
    /**
     * Enables or disables TTY color output by screen-oriented reporters.
     *
     * @public
     * @see [CLI option](../#-color-c-colors)
     * @param {boolean} [color=true] - Whether to enable color output.
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.color = function (color) {
      this.options.color = color !== false;
      return this;
    };
    /**
     * Enables or disables reporter to use inline diffs (rather than +/-)
     * in test failure output.
     *
     * @public
     * @see [CLI option](../#-inline-diffs)
     * @param {boolean} [inlineDiffs=true] - Whether to use inline diffs.
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.inlineDiffs = function (inlineDiffs) {
      this.options.inlineDiffs = inlineDiffs !== false;
      return this;
    };
    /**
     * Enables or disables reporter to include diff in test failure output.
     *
     * @public
     * @see [CLI option](../#-diff)
     * @param {boolean} [diff=true] - Whether to show diff on failure.
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.diff = function (diff) {
      this.options.diff = diff !== false;
      return this;
    };
    /**
     * @summary
     * Sets timeout threshold value.
     *
     * @description
     * A string argument can use shorthand (such as "2s") and will be converted.
     * If the value is `0`, timeouts will be disabled.
     *
     * @public
     * @see [CLI option](../#-timeout-ms-t-ms)
     * @see [Timeouts](../#timeouts)
     * @param {number|string} msecs - Timeout threshold value.
     * @return {Mocha} this
     * @chainable
     * @example
     *
     * // Sets timeout to one second
     * mocha.timeout(1000);
     * @example
     *
     * // Same as above but using string argument
     * mocha.timeout('1s');
     */

    Mocha.prototype.timeout = function (msecs) {
      this.suite.timeout(msecs);
      return this;
    };
    /**
     * Sets the number of times to retry failed tests.
     *
     * @public
     * @see [CLI option](../#-retries-n)
     * @see [Retry Tests](../#retry-tests)
     * @param {number} retry - Number of times to retry failed tests.
     * @return {Mocha} this
     * @chainable
     * @example
     *
     * // Allow any failed test to retry one more time
     * mocha.retries(1);
     */

    Mocha.prototype.retries = function (retry) {
      this.suite.retries(retry);
      return this;
    };
    /**
     * Sets slowness threshold value.
     *
     * @public
     * @see [CLI option](../#-slow-ms-s-ms)
     * @param {number} msecs - Slowness threshold value.
     * @return {Mocha} this
     * @chainable
     * @example
     *
     * // Sets "slow" threshold to half a second
     * mocha.slow(500);
     * @example
     *
     * // Same as above but using string argument
     * mocha.slow('0.5s');
     */

    Mocha.prototype.slow = function (msecs) {
      this.suite.slow(msecs);
      return this;
    };
    /**
     * Forces all tests to either accept a `done` callback or return a promise.
     *
     * @public
     * @see [CLI option](../#-async-only-a)
     * @param {boolean} [asyncOnly=true] - Whether to force `done` callback or promise.
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.asyncOnly = function (asyncOnly) {
      this.options.asyncOnly = asyncOnly !== false;
      return this;
    };
    /**
     * Disables syntax highlighting (in browser).
     *
     * @public
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.noHighlighting = function () {
      this.options.noHighlighting = true;
      return this;
    };
    /**
     * Enables or disables uncaught errors to propagate.
     *
     * @public
     * @see [CLI option](../#-allow-uncaught)
     * @param {boolean} [allowUncaught=true] - Whether to propagate uncaught errors.
     * @return {Mocha} this
     * @chainable
     */

    Mocha.prototype.allowUncaught = function (allowUncaught) {
      this.options.allowUncaught = allowUncaught !== false;
      return this;
    };
    /**
     * @summary
     * Delays root suite execution.
     *
     * @description
     * Used to perform async operations before any suites are run.
     *
     * @public
     * @see [delayed root suite](../#delayed-root-suite)
     * @returns {Mocha} this
     * @chainable
     */

    Mocha.prototype.delay = function delay() {
      this.options.delay = true;
      return this;
    };
    /**
     * Causes tests marked `only` to fail the suite.
     *
     * @public
     * @see [CLI option](../#-forbid-only)
     * @param {boolean} [forbidOnly=true] - Whether tests marked `only` fail the suite.
     * @returns {Mocha} this
     * @chainable
     */

    Mocha.prototype.forbidOnly = function (forbidOnly) {
      this.options.forbidOnly = forbidOnly !== false;
      return this;
    };
    /**
     * Causes pending tests and tests marked `skip` to fail the suite.
     *
     * @public
     * @see [CLI option](../#-forbid-pending)
     * @param {boolean} [forbidPending=true] - Whether pending tests fail the suite.
     * @returns {Mocha} this
     * @chainable
     */

    Mocha.prototype.forbidPending = function (forbidPending) {
      this.options.forbidPending = forbidPending !== false;
      return this;
    };
    /**
     * Throws an error if mocha is in the wrong state to be able to transition to a "running" state.
     * @private
     */

    Mocha.prototype._guardRunningStateTransition = function () {
      if (this._state === mochaStates.RUNNING) {
        throw createMochaInstanceAlreadyRunningError(
          'Mocha instance is currently running tests, cannot start a next test run until this one is done',
          this,
        );
      }

      if (
        this._state === mochaStates.DISPOSED ||
        this._state === mochaStates.REFERENCES_CLEANED
      ) {
        throw createMochaInstanceAlreadyDisposedError(
          'Mocha instance is already disposed, cannot start a new test run. Please create a new mocha instance. Be sure to set disable `cleanReferencesAfterRun` when you want to reuse the same mocha instance for multiple test runs.',
          this._cleanReferencesAfterRun,
          this,
        );
      }
    };
    /**
     * Mocha version as specified by "package.json".
     *
     * @name Mocha#version
     * @type string
     * @readonly
     */

    Object.defineProperty(Mocha.prototype, 'version', {
      value: require$$10.version,
      configurable: false,
      enumerable: true,
      writable: false,
    });
    /**
     * Callback to be invoked when test execution is complete.
     *
     * @private
     * @callback DoneCB
     * @param {number} failures - Number of failures that occurred.
     */

    /**
     * Runs root suite and invokes `fn()` when complete.
     *
     * @description
     * To run tests multiple times (or to run tests in files that are
     * already in the `require` cache), make sure to clear them from
     * the cache first!
     *
     * @public
     * @see {@link Mocha#unloadFiles}
     * @see {@link Runner#run}
     * @param {DoneCB} [fn] - Callback invoked when test execution completed.
     * @returns {Runner} runner instance
     * @example
     *
     * // exit with non-zero status if there were test failures
     * mocha.run(failures => process.exitCode = failures ? 1 : 0);
     */

    Mocha.prototype.run = function (fn) {
      const _this = this;

      this._guardRunningStateTransition();

      this._state = mochaStates.RUNNING;

      if (this._previousRunner) {
        this._previousRunner.dispose();

        this.suite.reset();
      }

      if (this.files.length > 0 && !this._lazyLoadFiles) {
        this.loadFiles();
      }

      const suite = this.suite;
      const options = this.options;
      options.files = this.files;
      const runner = new this._runnerClass(suite, {
        delay: options.delay,
        cleanReferencesAfterRun: this._cleanReferencesAfterRun,
      });
      statsCollector(runner);
      const reporter = new this._reporter(runner, options);
      runner.checkLeaks = options.checkLeaks === true;
      runner.fullStackTrace = options.fullTrace;
      runner.asyncOnly = options.asyncOnly;
      runner.allowUncaught = options.allowUncaught;
      runner.forbidOnly = options.forbidOnly;
      runner.forbidPending = options.forbidPending;

      if (options.grep) {
        runner.grep(options.grep, options.invert);
      }

      if (options.global) {
        runner.globals(options.global);
      }

      if (options.growl) {
        this._growl(runner);
      }

      if (options.color !== undefined) {
        exports.reporters.Base.useColors = options.color;
      }

      exports.reporters.Base.inlineDiffs = options.inlineDiffs;
      exports.reporters.Base.hideDiff = !options.diff;

      const done = function done(failures) {
        _this._previousRunner = runner;
        _this._state = _this._cleanReferencesAfterRun
          ? mochaStates.REFERENCES_CLEANED
          : mochaStates.INIT;
        fn = fn || utils.noop;

        if (typeof reporter.done === 'function') {
          reporter.done(failures, fn);
        } else {
          fn(failures);
        }
      };

      let runAsync = /*#__PURE__*/ (function () {
        let _ref = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee(runner) {
            let context, failureCount;
            return regeneratorRuntime.wrap(_context => {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    if (
                      !(
                        _this.options.enableGlobalSetup &&
                        _this.hasGlobalSetupFixtures()
                      )
                    ) {
                      _context.next = 6;
                      break;
                    }

                    _context.next = 3;
                    return _this.runGlobalSetup(runner);

                  case 3:
                    _context.t0 = _context.sent;
                    _context.next = 7;
                    break;

                  case 6:
                    _context.t0 = {};

                  case 7:
                    context = _context.t0;
                    _context.next = 10;
                    return runner.runAsync({
                      files: _this.files,
                      options,
                    });

                  case 10:
                    failureCount = _context.sent;

                    if (
                      !(
                        _this.options.enableGlobalTeardown &&
                        _this.hasGlobalTeardownFixtures()
                      )
                    ) {
                      _context.next = 14;
                      break;
                    }

                    _context.next = 14;
                    return _this.runGlobalTeardown(runner, {
                      context,
                    });

                  case 14:
                    return _context.abrupt('return', failureCount);

                  case 15:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee);
          }),
        );

        return function runAsync(_x) {
          return Reflect.apply(_ref, this, arguments);
        };
      })(); // no "catch" here is intentional. errors coming out of
      // Runner#run are considered uncaught/unhandled and caught
      // by the `process` event listeners.
      // also: returning anything other than `runner` would be a breaking
      // change

      runAsync(runner).then(done);
      return runner;
    };
    /**
     * Assigns hooks to the root suite
     * @param {MochaRootHookObject} [hooks] - Hooks to assign to root suite
     * @chainable
     */

    Mocha.prototype.rootHooks = function rootHooks() {
      const _this2 = this;

      let _ref2 =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {},
        _ref2$beforeAll = _ref2.beforeAll,
        beforeAll = _ref2$beforeAll === void 0 ? [] : _ref2$beforeAll,
        _ref2$beforeEach = _ref2.beforeEach,
        beforeEach = _ref2$beforeEach === void 0 ? [] : _ref2$beforeEach,
        _ref2$afterAll = _ref2.afterAll,
        afterAll = _ref2$afterAll === void 0 ? [] : _ref2$afterAll,
        _ref2$afterEach = _ref2.afterEach,
        afterEach = _ref2$afterEach === void 0 ? [] : _ref2$afterEach;

      beforeAll = utils.castArray(beforeAll);
      beforeEach = utils.castArray(beforeEach);
      afterAll = utils.castArray(afterAll);
      afterEach = utils.castArray(afterEach);
      beforeAll.forEach(hook => {
        _this2.suite.beforeAll(hook);
      });
      beforeEach.forEach(hook => {
        _this2.suite.beforeEach(hook);
      });
      afterAll.forEach(hook => {
        _this2.suite.afterAll(hook);
      });
      afterEach.forEach(hook => {
        _this2.suite.afterEach(hook);
      });
      return this;
    };
    /**
     * Toggles parallel mode.
     *
     * Must be run before calling {@link Mocha#run}. Changes the `Runner` class to
     * use; also enables lazy file loading if not already done so.
     *
     * Warning: when passed `false` and lazy loading has been enabled _via any means_ (including calling `parallelMode(true)`), this method will _not_ disable lazy loading. Lazy loading is a prerequisite for parallel
     * mode, but parallel mode is _not_ a prerequisite for lazy loading!
     * @param {boolean} [enable] - If `true`, enable; otherwise disable.
     * @throws If run in browser
     * @throws If Mocha not in `INIT` state
     * @returns {Mocha}
     * @chainable
     * @public
     */

    Mocha.prototype.parallelMode = function parallelMode() {
      let enable =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : true;

      if (utils.isBrowser()) {
        throw createUnsupportedError(
          'parallel mode is only supported in Node.js',
        );
      }

      const parallel = Boolean(enable);

      if (
        parallel === this.options.parallel &&
        this._lazyLoadFiles &&
        this._runnerClass !== exports.Runner
      ) {
        return this;
      }

      if (this._state !== mochaStates.INIT) {
        throw createUnsupportedError(
          'cannot change parallel mode after having called run()',
        );
      }

      this.options.parallel = parallel; // swap Runner class

      this._runnerClass = parallel ? require$$11 : exports.Runner; // lazyLoadFiles may have been set `true` otherwise (for ESM loading),
      // so keep `true` if so.

      return this.lazyLoadFiles(this._lazyLoadFiles || parallel);
    };
    /**
     * Disables implicit call to {@link Mocha#loadFiles} in {@link Mocha#run}. This
     * setting is used by watch mode, parallel mode, and for loading ESM files.
     * @todo This should throw if we've already loaded files; such behavior
     * necessitates adding a new state.
     * @param {boolean} [enable] - If `true`, disable eager loading of files in
     * {@link Mocha#run}
     * @chainable
     * @public
     */

    Mocha.prototype.lazyLoadFiles = function lazyLoadFiles(enable) {
      this._lazyLoadFiles = enable === true;
      debug('set lazy load to %s', enable);
      return this;
    };
    /**
     * Configures one or more global setup fixtures.
     *
     * If given no parameters, _unsets_ any previously-set fixtures.
     * @chainable
     * @public
     * @param {MochaGlobalFixture|MochaGlobalFixture[]} [setupFns] - Global setup fixture(s)
     * @returns {Mocha}
     */

    Mocha.prototype.globalSetup = function globalSetup() {
      let setupFns =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      setupFns = utils.castArray(setupFns);
      this.options.globalSetup = setupFns;
      debug('configured %d global setup functions', setupFns.length);
      return this;
    };
    /**
     * Configures one or more global teardown fixtures.
     *
     * If given no parameters, _unsets_ any previously-set fixtures.
     * @chainable
     * @public
     * @param {MochaGlobalFixture|MochaGlobalFixture[]} [teardownFns] - Global teardown fixture(s)
     * @returns {Mocha}
     */

    Mocha.prototype.globalTeardown = function globalTeardown() {
      let teardownFns =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      teardownFns = utils.castArray(teardownFns);
      this.options.globalTeardown = teardownFns;
      debug('configured %d global teardown functions', teardownFns.length);
      return this;
    };
    /**
     * Run any global setup fixtures sequentially, if any.
     *
     * This is _automatically called_ by {@link Mocha#run} _unless_ the `runGlobalSetup` option is `false`; see {@link Mocha#enableGlobalSetup}.
     *
     * The context object this function resolves with should be consumed by {@link Mocha#runGlobalTeardown}.
     * @param {object} [context] - Context object if already have one
     * @public
     * @returns {Promise<object>} Context object
     */

    Mocha.prototype.runGlobalSetup = /*#__PURE__*/ (function () {
      let _runGlobalSetup = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee2() {
          let context,
            globalSetup,
            _args2 = arguments;
          return regeneratorRuntime.wrap(
            function _callee2$(_context2) {
              while (1) {
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    context =
                      _args2.length > 0 && _args2[0] !== undefined
                        ? _args2[0]
                        : {};
                    globalSetup = this.options.globalSetup;

                    if (!(globalSetup && globalSetup.length > 0)) {
                      _context2.next = 7;
                      break;
                    }

                    debug('run(): global setup starting');
                    _context2.next = 6;
                    return this._runGlobalFixtures(globalSetup, context);

                  case 6:
                    debug('run(): global setup complete');

                  case 7:
                    return _context2.abrupt('return', context);

                  case 8:
                  case 'end':
                    return _context2.stop();
                }
              }
            },
            _callee2,
            this,
          );
        }),
      );

      function runGlobalSetup() {
        return Reflect.apply(_runGlobalSetup, this, arguments);
      }

      return runGlobalSetup;
    })();
    /**
     * Run any global teardown fixtures sequentially, if any.
     *
     * This is _automatically called_ by {@link Mocha#run} _unless_ the `runGlobalTeardown` option is `false`; see {@link Mocha#enableGlobalTeardown}.
     *
     * Should be called with context object returned by {@link Mocha#runGlobalSetup}, if applicable.
     * @param {object} [context] - Context object if already have one
     * @public
     * @returns {Promise<object>} Context object
     */

    Mocha.prototype.runGlobalTeardown = /*#__PURE__*/ (function () {
      let _runGlobalTeardown = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee3() {
          let context,
            globalTeardown,
            _args3 = arguments;
          return regeneratorRuntime.wrap(
            function _callee3$(_context3) {
              while (1) {
                switch ((_context3.prev = _context3.next)) {
                  case 0:
                    context =
                      _args3.length > 0 && _args3[0] !== undefined
                        ? _args3[0]
                        : {};
                    globalTeardown = this.options.globalTeardown;

                    if (!(globalTeardown && globalTeardown.length > 0)) {
                      _context3.next = 6;
                      break;
                    }

                    debug('run(): global teardown starting');
                    _context3.next = 6;
                    return this._runGlobalFixtures(globalTeardown, context);

                  case 6:
                    debug('run(): global teardown complete');
                    return _context3.abrupt('return', context);

                  case 8:
                  case 'end':
                    return _context3.stop();
                }
              }
            },
            _callee3,
            this,
          );
        }),
      );

      function runGlobalTeardown() {
        return Reflect.apply(_runGlobalTeardown, this, arguments);
      }

      return runGlobalTeardown;
    })();
    /**
     * Run global fixtures sequentially with context `context`
     * @private
     * @param {MochaGlobalFixture[]} [fixtureFns] - Fixtures to run
     * @param {object} [context] - context object
     * @returns {Promise<object>} context object
     */

    Mocha.prototype._runGlobalFixtures = /*#__PURE__*/ (function () {
      let _runGlobalFixtures2 = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee4() {
          let fixtureFns,
            context,
            _iteratorNormalCompletion,
            _didIteratorError,
            _iteratorError,
            _iterator,
            _step,
            _value,
            fixtureFn,
            _args4 = arguments;

          return regeneratorRuntime.wrap(
            (_context4) => {
              while (1) {
                switch ((_context4.prev = _context4.next)) {
                  case 0:
                    fixtureFns =
                      _args4.length > 0 && _args4[0] !== undefined
                        ? _args4[0]
                        : [];
                    context =
                      _args4.length > 1 && _args4[1] !== undefined
                        ? _args4[1]
                        : {};
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _context4.prev = 4;
                    _iterator = _asyncIterator(fixtureFns);

                  case 6:
                    _context4.next = 8;
                    return _iterator.next();

                  case 8:
                    _step = _context4.sent;
                    _iteratorNormalCompletion = _step.done;
                    _context4.next = 12;
                    return _step.value;

                  case 12:
                    _value = _context4.sent;

                    if (_iteratorNormalCompletion) {
                      _context4.next = 20;
                      break;
                    }

                    fixtureFn = _value;
                    _context4.next = 17;
                    return fixtureFn.call(context);

                  case 17:
                    _iteratorNormalCompletion = true;
                    _context4.next = 6;
                    break;

                  case 20:
                    _context4.next = 26;
                    break;

                  case 22:
                    _context4.prev = 22;
                    _context4.t0 = _context4['catch'](4);
                    _didIteratorError = true;
                    _iteratorError = _context4.t0;

                  case 26:
                    _context4.prev = 26;
                    _context4.prev = 27;

                    if (
                      !(
                        !_iteratorNormalCompletion &&
                        _iterator['return'] != null
                      )
                    ) {
                      _context4.next = 31;
                      break;
                    }

                    _context4.next = 31;
                    return _iterator['return']();

                  case 31:
                    _context4.prev = 31;

                    if (!_didIteratorError) {
                      _context4.next = 34;
                      break;
                    }

                    throw _iteratorError;

                  case 34:
                    return _context4.finish(31);

                  case 35:
                    return _context4.finish(26);

                  case 36:
                    return _context4.abrupt('return', context);

                  case 37:
                  case 'end':
                    return _context4.stop();
                }
              }
            },
            _callee4,
            null,
            [
              [4, 22, 26, 36],
              [27, , 31, 35],
            ],
          );
        }),
      );

      function _runGlobalFixtures() {
        return Reflect.apply(_runGlobalFixtures2, this, arguments);
      }

      return _runGlobalFixtures;
    })();
    /**
     * Toggle execution of any global setup fixture(s)
     *
     * @chainable
     * @public
     * @param {boolean } [enabled=true] - If `false`, do not run global setup fixture
     * @returns {Mocha}
     */

    Mocha.prototype.enableGlobalSetup = function enableGlobalSetup() {
      let enabled =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : true;
      this.options.enableGlobalSetup = Boolean(enabled);
      return this;
    };
    /**
     * Toggle execution of any global teardown fixture(s)
     *
     * @chainable
     * @public
     * @param {boolean } [enabled=true] - If `false`, do not run global teardown fixture
     * @returns {Mocha}
     */

    Mocha.prototype.enableGlobalTeardown = function enableGlobalTeardown() {
      let enabled =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : true;
      this.options.enableGlobalTeardown = Boolean(enabled);
      return this;
    };
    /**
     * Returns `true` if one or more global setup fixtures have been supplied.
     * @public
     * @returns {boolean}
     */

    Mocha.prototype.hasGlobalSetupFixtures = function hasGlobalSetupFixtures() {
      return this.options.globalSetup.length > 0;
    };
    /**
     * Returns `true` if one or more global teardown fixtures have been supplied.
     * @public
     * @returns {boolean}
     */

    Mocha.prototype.hasGlobalTeardownFixtures =
      function hasGlobalTeardownFixtures() {
        return this.options.globalTeardown.length > 0;
      };
    /**
     * An alternative way to define root hooks that works with parallel runs.
     * @typedef {Object} MochaRootHookObject
     * @property {Function|Function[]} [beforeAll] - "Before all" hook(s)
     * @property {Function|Function[]} [beforeEach] - "Before each" hook(s)
     * @property {Function|Function[]} [afterAll] - "After all" hook(s)
     * @property {Function|Function[]} [afterEach] - "After each" hook(s)
     */

    /**
	   * An function that returns a {@link MochaRootHookObject}, either sync or async.
	     @callback MochaRootHookFunction
	   * @returns {MochaRootHookObject|Promise<MochaRootHookObject>}
	   */

    /**
     * A function that's invoked _once_ which is either sync or async.
     * Can be a "teardown" or "setup".  These will all share the same context.
     * @callback MochaGlobalFixture
     * @returns {void|Promise<void>}
     */

    /**
     * An object making up all necessary parts of a plugin loader and aggregator
     * @typedef {Object} PluginDefinition
     * @property {string} exportName - Named export to use
     * @property {string} [optionName] - Option name for Mocha constructor (use `exportName` if omitted)
     * @property {PluginValidator} [validate] - Validator function
     * @property {PluginFinalizer} [finalize] - Finalizer/aggregator function
     */

    /**
	   * A (sync) function to assert a user-supplied plugin implementation is valid.
	   *
	   * Defined in a {@link PluginDefinition}.

	   * @callback PluginValidator
	   * @param {*} value - Value to check
	   * @this {PluginDefinition}
	   * @returns {void}
	   */

    /**
     * A function to finalize plugins impls of a particular ilk
     * @callback PluginFinalizer
     * @param {Array<*>} impls - User-supplied implementations
     * @returns {Promise<*>|*}
     */
  });

  /* eslint no-unused-vars: off */

  /* eslint-env commonjs */

  /**
   * Shim process.stdout.
   */

  process$1.stdout = browserStdout({
    label: false,
  });
  /**
   * Create a Mocha instance.
   *
   * @return {undefined}
   */

  const mocha$1 = new mocha({
    reporter: 'html',
  });
  /**
   * Save timer references to avoid Sinon interfering (see GH-237).
   */

  const Date$4 = commonjsGlobal.Date;
  const setTimeout$3 = commonjsGlobal.setTimeout;
  const uncaughtExceptionHandlers = [];
  const originalOnerrorHandler = commonjsGlobal.onerror;
  /**
   * Remove uncaughtException listener.
   * Revert to original onerror handler if previously defined.
   */

  process$1.removeListener = function (e, fn) {
    if (e === 'uncaughtException') {
      if (originalOnerrorHandler) {
        commonjsGlobal.onerror = originalOnerrorHandler;
      } else {
        commonjsGlobal.onerror = function () {};
      }

      const i = uncaughtExceptionHandlers.indexOf(fn);

      if (i !== -1) {
        uncaughtExceptionHandlers.splice(i, 1);
      }
    }
  };
  /**
   * Implements listenerCount for 'uncaughtException'.
   */

  process$1.listenerCount = function (name) {
    if (name === 'uncaughtException') {
      return uncaughtExceptionHandlers.length;
    }

    return 0;
  };
  /**
   * Implements uncaughtException listener.
   */

  process$1.on = function (e, fn) {
    if (e === 'uncaughtException') {
      commonjsGlobal.onerror = function (err, url, line) {
        fn(new Error(`${err} (${url}:${line})`));
        return !mocha$1.options.allowUncaught;
      };

      uncaughtExceptionHandlers.push(fn);
    }
  };

  process$1.listeners = function (e) {
    if (e === 'uncaughtException') {
      return uncaughtExceptionHandlers;
    }

    return [];
  }; // The BDD UI is registered by default, but no UI will be functional in the
  // browser without an explicit call to the overridden `mocha.ui` (see below).
  // Ensure that this default UI does not expose its methods to the global scope.

  mocha$1.suite.removeAllListeners('pre-require');
  const immediateQueue = [];
  let immediateTimeout;

  function timeslice() {
    const immediateStart = new Date$4().getTime();

    while (
      immediateQueue.length > 0 &&
      new Date$4().getTime() - immediateStart < 100
    ) {
      immediateQueue.shift()();
    }

    if (immediateQueue.length > 0) {
      immediateTimeout = setTimeout$3(timeslice, 0);
    } else {
      immediateTimeout = null;
    }
  }
  /**
   * High-performance override of Runner.immediately.
   */

  mocha.Runner.immediately = function (callback) {
    immediateQueue.push(callback);

    if (!immediateTimeout) {
      immediateTimeout = setTimeout$3(timeslice, 0);
    }
  };
  /**
   * Function to allow assertion libraries to throw errors directly into mocha.
   * This is useful when running tests in a browser because window.onerror will
   * only receive the 'message' attribute of the Error.
   */

  mocha$1.throwError = function (err) {
    uncaughtExceptionHandlers.forEach(fn => {
      fn(err);
    });
    throw err;
  };
  /**
   * Override ui to ensure that the ui functions are initialized.
   * Normally this would happen in Mocha.prototype.loadFiles.
   */

  mocha$1.ui = function (ui) {
    mocha.prototype.ui.call(this, ui);
    this.suite.emit('pre-require', commonjsGlobal, null, this);
    return this;
  };
  /**
   * Setup mocha with the given setting options.
   */

  mocha$1.setup = function (opts) {
    if (typeof opts === 'string') {
      opts = {
        ui: opts,
      };
    }

    if (opts.delay === true) {
      this.delay();
    }

    const self = this;
    Object.keys(opts)
      .filter(opt => {
        return opt !== 'delay';
      })
      .forEach(opt => {
        if (Object.prototype.hasOwnProperty.call(opts, opt)) {
          self[opt](opts[opt]);
        }
      });
    return this;
  };
  /**
   * Run mocha, returning the Runner.
   */

  mocha$1.run = function (fn) {
    const options = mocha$1.options;
    mocha$1.globals('location');
    const query = parseQuery(commonjsGlobal.location.search || '');

    if (query.grep) {
      mocha$1.grep(query.grep);
    }

    if (query.fgrep) {
      mocha$1.fgrep(query.fgrep);
    }

    if (query.invert) {
      mocha$1.invert();
    }

    return mocha.prototype.run.call(mocha$1, err => {
      // The DOM Document is not available in Web Workers.
      const document = commonjsGlobal.document;

      if (
        document &&
        document.querySelector('#mocha') &&
        options.noHighlighting !== true
      ) {
        highlightTags('code');
      }

      if (fn) {
        fn(err);
      }
    });
  };
  /**
   * Expose the process shim.
   * https://github.com/mochajs/mocha/pull/916
   */

  mocha.process = process$1;
  /**
   * Expose mocha.
   */

  commonjsGlobal.Mocha = mocha;
  commonjsGlobal.mocha = mocha$1; // this allows test/acceptance/required-tokens.js to pass; thus,
  // you can now do `const describe = require('mocha').describe` in a
  // browser context (assuming browserification).  should fix #880

  const browserEntry = Object.assign(mocha$1, commonjsGlobal);

  return browserEntry;
});
//# sourceMappingURL=mocha.js.map
