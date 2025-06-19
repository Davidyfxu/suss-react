import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const BASE_URL = 'http://localhost:8000';
// export const BASE_URL = 'https://clato-api.suss.edu.sg';

// 重试配置
interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryCondition: (error: any) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error: any) => {
    // 网络错误或5xx服务器错误时重试
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  }
};

// 延迟函数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 带重试的请求函数
async function requestWithRetry<T>(
  requestFn: () => Promise<T>,
  retryConfig: RetryConfig = defaultRetryConfig
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;

      // 如果是最后一次尝试或者不符合重试条件，直接抛出错误
      if (
        attempt === retryConfig.maxRetries ||
        !retryConfig.retryCondition(error)
      ) {
        throw error;
      }

      // 等待后重试
      await delay(retryConfig.retryDelay * (attempt + 1));
    }
  }

  throw lastError;
}

// 创建axios实例
const api = axios.create({
  baseURL: window.location.href.includes('https')
    ? 'https://clato-api.suss.edu.sg'
    : BASE_URL,
  timeout: 30000
});

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: any) => {
    if (error.response?.status === 401) {
      // 清除token并跳转到登录页
      localStorage.clear();
      setTimeout(() => (window.location.href = '/login'), 500);
    }
    throw error;
  }
);

// 带重试的POST请求
export const post = async <T = any,>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  retryConfig?: RetryConfig
): Promise<T> => {
  const finalConfig = {
    ...config,
    headers: {
      ...config?.headers,
      ...(url.includes('no_auth')
        ? {}
        : { Authorization: localStorage.getItem('token') })
    }
  };

  return requestWithRetry(() => api.post(url, data, finalConfig), retryConfig);
};
