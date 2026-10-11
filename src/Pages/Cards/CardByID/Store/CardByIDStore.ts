import { makeAutoObservable } from 'mobx';
import { executeMutation } from '../../../../Shared/ServerLayer/QueryLayer/execute-mutation';
import { writeApi } from '../../../../Shared/ServerLayer/QueryLayer/write-api';
import { FILE_URL } from '../../../../settings';
import React, { RefObject } from 'react';
import { ICardData } from '../TYPES/card-data';

// UI interactions remain local to a card; RTK Query owns server data and requests.
export class CardByIDStore {
  constructor() {
    makeAutoObservable(this, { reloadCardData: false });
  }
  id?: number;
  card_data?: ICardData;
  reloadCardData?: () => unknown;
  is_test_in_card_closed = false;
  changeID = (id?: number | string) => {
    const next = id === undefined ? undefined : Number(id);
    if (this.id !== next) {
      this.card_data = undefined;
      this.is_test_in_card_closed = false;
      this.isOpenGoToTestDialogAfterVideo = false;
    }
    this.id = next;
  };
  loadCardData() {
    this.reloadCardData?.();
  }
  get cardImageURLForUI() {
    const image = this.card_data?.cards_cardimage?.image;
    return image
      ? `${FILE_URL}/${image}`
      : this.card_data?.id
        ? `${FILE_URL}/cards-images/card/${this.card_data.id}`
        : '';
  }
  removeCardFromBookmark = () =>
    this.card_data?.id
      ? executeMutation(
          writeApi.endpoints.setCardBookmark.initiate({
            id: this.card_data.id,
            bookmarked: false,
          }),
        )
      : Promise.resolve();
  addToBookmark = () =>
    this.card_data?.id
      ? executeMutation(
          writeApi.endpoints.setCardBookmark.initiate({
            id: this.card_data.id,
            bookmarked: true,
          }),
        )
      : Promise.resolve();
  setRating = (rating: number | null) =>
    this.card_data?.id
      ? executeMutation(
          writeApi.endpoints.setCardRating.initiate({
            id: this.card_data.id,
            rating,
          }),
        )
      : Promise.resolve();

  isOpenGoToTestDialogAfterVideo = false;
  testElementRef = React.createRef() as RefObject<HTMLDivElement>;
}
