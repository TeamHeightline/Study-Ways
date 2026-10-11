import axiosClient from '../../../../shared/server-layer/query-layer/config';
import { ICardData } from '../types/card-data';

export async function getCardDataById(cardID: number) {
  return axiosClient
    .get<ICardData>(`/page/card-by-id/card-data-by-id/${cardID}`)
    .then((res) => res.data);
}
