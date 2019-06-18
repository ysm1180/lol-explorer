import axios, { AxiosError } from 'axios';
import { ILCUData, LcuSummonerData } from 'models';

export function loadCurrentSummoner(data: ILCUData): Promise<LcuSummonerData> {
  const { protocol, address, port, username, password } = data;
  return axios
    .get(`${protocol}://${address}:${port}/lol-summoner/v1/current-summoner`, {
      headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
    })
    .then((res) => {
      return res.data as LcuSummonerData;
    })
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
