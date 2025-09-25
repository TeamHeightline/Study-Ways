import axiosClient from "../../../../../Shared/ServerLayer/QueryLayer/config";
import { ICardDataInStore } from "../TYPES/card-data-in-store";

export async function saveCard(cardData: ICardDataInStore) {
  return axiosClient.post("/page/edit-card-by-id/save-card", cardData);
}
