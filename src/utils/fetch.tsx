import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export const BASE_URL = 'http://localhost:8000';
// export const BASE_URL = 'https://clato-api.suss.edu.sg';

class HttpClient {
  private api: AxiosInstance;

  public constructor(config: AxiosRequestConfig) {
    this.api = axios.create({
      ...config,
      timeout: 10000,
      headers: {
        // Authorization: localStorage.getItem('token'),
        ...config.headers
      }
    });

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: any) => {
        // Add more error handling logic here.
        throw error;
      }
    );
  }

  public get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.api.get(url, config);
  }

  public post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.api.post(url, data, config);
  }

  // Add more methods (PUT, DELETE)...
}

// Now we can create an instance of HttpClient
const httpClient = new HttpClient({
  baseURL: window.location.href.includes('https')
    ? 'https://suss-django.zeabur.app'
    : BASE_URL
});

export const post = async (url: string, body: any): Promise<any> => {
  if (url.includes('no_auth')) {
    return await httpClient.post(url, body);
  }
  return await httpClient.post(url, body, {
    headers: {
      Authorization: localStorage.getItem('token')
    }
  });
};
