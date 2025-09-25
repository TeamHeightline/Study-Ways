import axiosClient from "../../../../Shared/ServerLayer/QueryLayer/config";
import { ICardData } from "../TYPES/card-data";

export async function getCardDataById(cardID: number) {
  return axiosClient
    .get<ICardData>(`/page/card-by-id/card-data-by-id/${cardID}`)
    .then((res) => res.data);
}
