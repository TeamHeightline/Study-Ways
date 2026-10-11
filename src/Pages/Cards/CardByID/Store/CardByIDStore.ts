import { makeAutoObservable } from 'mobx';
import { Mutation } from '../../../../SchemaTypes';
import { ClientStorage } from '../../../../Shared/Store/ApolloStorage/ClientStorage';
import {
  ADD_TO_BOOKMARK,
  REMOVE_CARD_FROM_BOOKMARK,
  SET_RATING,
} from './Query';
import { FILE_URL } from '../../../../settings';
import React, { RefObject } from 'react';
import { ICardData } from '../TYPES/card-data';

// UI interactions remain local to a card; RTK Query owns server data and requests.
export class CardByIDStore {
  constructor() {
    makeAutoObservable(this, { reloadCardData: false });
  }
  clientStorage = ClientStorage;
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
  removeCardFromBookmark = () => {
    if (this.card_data?.id) {
      this.clientStorage.client
        .mutate<Mutation>({
          mutation: REMOVE_CARD_FROM_BOOKMARK,
          variables: {
            id: Number(this.card_data?.id),
          },
        })
        .then(response => response?.data?.removeCardFromBookmark)
        .then(() => {
          this.loadCardData();
        })
        .catch(e => console.log(e));
    }
  };

  addToBookmark = () => {
    if (this.card_data?.id) {
      this.clientStorage.client
        .mutate<Mutation>({
          mutation: ADD_TO_BOOKMARK,
          variables: {
            id: Number(this.card_data?.id),
          },
        })
        .then(response => response?.data?.addCardToBookmark)
        .then(response => {
          if (response?.ok) {
            this.loadCardData();
          }
        })
        .catch(e => console.log(e));
    }
  };

  setRating = (rating: number | null) => {
    if (rating && this.card_data?.id) {
      this.rating = rating;
      this.clientStorage.client
        .mutate<Mutation>({
          mutation: SET_RATING,
          variables: {
            id: Number(this.card_data?.id),
            rating,
          },
        })
        .then(response => response?.data?.setCardRating)
        .then(response => {
          if (response?.ok) {
            this.loadCardData();
          }
        })
        .catch(e => console.log(e));
    }
  };

  rating?: number;
  isBookmarked = false;

  isOpenGoToTestDialogAfterVideo = false;
  testElementRef = React.createRef() as RefObject<HTMLDivElement>;
}
