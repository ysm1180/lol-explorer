import axios, { AxiosError } from 'axios';

const ENDPOINT = 'http://gasi.asuscomm.com:3100';

export interface IApiError {
  code: number;
  message: string;
  errorData: any;
}

export function request(url: string, params?: any): Promise<any> {
  return axios
    .get(`${ENDPOINT}/${url}`, {
      params: params,
    })
    .then(res => res.data)
    .catch((err: AxiosError) => {
      let responseData = undefined;
      if (err.response) {
        responseData = err.response.data;
      }
      return Promise.reject({
        code: err.code,
        message: err.message,
        data: responseData,
      });
    });
}

export function postToRiotApi(url: string, data: any = {}) {
  return axios.post(`${ENDPOINT}${url}`, data);
}
