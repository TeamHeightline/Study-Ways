import axiosClient from "../../../../../Shared/ServerLayer/QueryLayer/config";
import { ICardByID } from "../TYPES/card-data-in-store";

export async function getCardData(cardID: number) {
  return axiosClient
    .get<ICardByID>(`/page/edit-card-by-id/card-by-id/${cardID}`)
    .then((res) => res.data);
}
