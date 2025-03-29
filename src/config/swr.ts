import { Cache, SWRConfiguration } from 'swr';
import localforage from 'localforage';

// 初始化 localforage
const storage = localforage.createInstance({
  name: 'suss-react-cache'
});

// 创建持久化 provider
export const localStorageProvider = () => {
  const map = new Map(
    JSON.parse(localStorage.getItem('suss-app-cache') || '[]')
  );

  // 在组件卸载前将数据同步到 localStorage
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem('suss-app-cache', appCache);
  });

  // 同时使用 localforage 做持久化
  map.forEach(async (value, key) => {
    await storage.setItem(key, value);
  });

  return map as Cache;
};

// 添加清理函数
export const clearSWRCache = async (): Promise<void> => {
  // 清空 localStorage 中的缓存
  localStorage.removeItem('suss-app-cache');

  // 清空 localforage 中的缓存
  await storage.clear();

  // 如果你需要立即清空内存中的 SWR 缓存，可以调用 mutate 来清除
  // 需要在使用时传入 mutate 函数
};

// SWR 全局配置
export const swrConfig: SWRConfiguration = {
  provider: localStorageProvider,
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5 * 60 * 1000, // 5 minutes
  shouldRetryOnError: false
};
