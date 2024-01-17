/**
 * @Description: axios封装
 * @Author: daixu
 * @Date: 2023-04-22 21:05:55
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
class Http {
  instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    //创建axios实例
    this.instance = axios.create(config);
    //请求拦截器
    this.instance.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    //响应拦截器
    this.instance.interceptors.response.use(
      response => {
        return response.data;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  get<T = any>(url: string, params: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>({ url, params, ...config, method: "GET" });
  }
  post<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>({ url, data, ...config, method: "POST" });
  }
  delete<T = any>(url: string, params: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>({ url, params, ...config, method: "DELETE" });
  }
  put<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>({ url, data, ...config, method: "PUT" });
  }
  patch<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>({ url, data, ...config, method: "PATCH" });
  }
}

export default new Http({
  baseURL: "",
  timeout: 1000 * 30
});
