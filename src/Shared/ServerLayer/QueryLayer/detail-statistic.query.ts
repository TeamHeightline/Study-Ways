import axiosClient from './config';
import { IDetailStatistic } from '../Types/detail-statistic.types';
import { UserStorage } from '../../Store/UserStore/UserStore';
import CryptoJS from 'crypto-js';

interface detailDataForSave extends IDetailStatistic {
  answers_id_array: number[];
}

async function getKey() {
  const user = UserStorage.username;
  const date = new Date(Date.now()).toLocaleDateString('ru-RU');
  const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  const keyString = [user, date, salt].join('-');
  const key = CryptoJS.SHA256(keyString).toString(CryptoJS.enc.Hex);
  return { key, salt };
}

async function encryptMessage(data: detailDataForSave) {
  const { key, salt } = await getKey();
  const dataString = JSON.stringify(data);
  const encodedText = CryptoJS.AES.encrypt(dataString, key).toString();
  return { salt, encodedText };
}

function SWKeys(count = 5) {
  const result: Record<string, string> = {};

  const swString = (length: number): string => {
    const chars = 'abcdefghijklmnopqruvwxyz';
    let str = '';
    for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  };

  for (let i = 0; i < count; i++) {
    result[swString(1)] = swString(32);
  }

  return result;
}

async function beautifyMessage(data: detailDataForSave) {
  const { encodedText, salt } = await encryptMessage(data);

  return { s: salt, t: encodedText, ...SWKeys(8) };
}

export const createDetailStatistic = async (
  statisticData: detailDataForSave,
): Promise<IDetailStatistic> => {
  const obj = await beautifyMessage(statisticData);

  return axiosClient
    .post('/detail-statistic/create', {
      obj,
    })
    .then(res => res.data.createdStatistic);
};
