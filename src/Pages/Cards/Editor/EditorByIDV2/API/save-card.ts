import {
  executeMutation,
  executeQueuedMutation,
} from '../../../../../Shared/ServerLayer/QueryLayer/execute-mutation';
import { writeApi } from '../../../../../Shared/ServerLayer/QueryLayer/write-api';
import { ICardDataInStore } from '../TYPES/card-data-in-store';
export function saveCard(cardData: ICardDataInStore) {
  return executeQueuedMutation(
    `card-${cardData.id}`,
    writeApi.endpoints.saveCard.initiate({
      id: Number(cardData.id),
      data: cardData,
    }),
  );
}
