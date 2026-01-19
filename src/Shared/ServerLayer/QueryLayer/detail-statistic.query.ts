import axiosClient from './config';
import { IDetailStatistic } from '../Types/detail-statistic.types';
import { UserStorage } from '../../Store/UserStore/UserStore';
import CryptoJS from 'crypto-js';

interface detailDataForSave extends IDetailStatistic {
  answers_id_array: number[];
}

function getDate() {
  return new Date(Date.now()).toLocaleDateString('ru-RU');
}

function getSlt() {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
}

function getU() {
  return UserStorage.username;
}
async function getKey() {
  const u = getU();
  const d = getDate();
  const s = getSlt();
  const keyString = [u, d, s].join('-');
  const key = CryptoJS.SHA256(keyString).toString(CryptoJS.enc.Hex);
  return { key, s };
}

async function encryptMessage(data: detailDataForSave) {
  const { key, s } = await getKey();
  const dataString = JSON.stringify(data);
  const t = CryptoJS.AES.encrypt(dataString, key).toString();
  return { s, t };
}

function getChr() {
  return 'abcdefghijklmnopqruvwxyz';
}
function SWKeys(count = 5) {
  const result: Record<string, string> = {};

  const swString = (length: number): string => {
    const chars = getChr();
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
  const { t, s } = await encryptMessage(data);

  return { ...SWKeys(8), s, t };
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
