import React from 'react';

/**
 * 实现一个 useStorageState() 的 React Hooks
 * 在管理状态的同时可以把状态储存在 localstorage 中，下次组件渲染时优先使用本地缓存值作为初始值（而非传入的 initialData）
 * 1. 每次 setValue 时，需要同步更新 localstorage 的缓存值，并且刷新过期时间
 * 2. 如果缓存超过设置的过期时间，则在使用此 hook 的时候忽略缓存数据，优先使用 initialData
 * @param initialData 初始化数据
 * @param cacheKey 缓存的key
 * @param expired 过期时间，单位（秒）
 */
const useStorageState = (initialData: any, cacheKey: string, expired: number) => {
  const cacheTimeKey = `${cacheKey}_expired_time`;
  const [storageValue, setStorageValue] = React.useState(() => {
    const storageValue = localStorage.getItem(cacheKey);
    const expiredDate = localStorage.getItem(cacheTimeKey);

    if (expiredDate) {
      const expired = +expiredDate;
      const now = Date.now();
      if (now > expired) {
        return initialData;
      }
    } else {
      localStorage.setItem(cacheTimeKey, (Date.now() + expired * 1000).toString());
    }

    // 下次组件渲染时优先使用本地缓存值作为初始值（而非传入的 initialData）
    if (storageValue) {
      return JSON.parse(storageValue);
    } else {
      return initialData;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(storageValue));
    } catch (e) {
      console.warn(e);
    }
  }, [cacheKey, storageValue]);

  return [storageValue, setStorageValue];
};

export {useStorageState};
