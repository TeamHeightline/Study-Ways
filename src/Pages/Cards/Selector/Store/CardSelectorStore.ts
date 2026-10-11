import { makeAutoObservable, reaction } from 'mobx';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';
import {
  CardContentType,
  CardHardLevel,
} from '../../../../Shared/ServerLayer/Types/card.types';

export class CardSelectorStore {
  constructor() {
    makeAutoObservable(this, { refreshResults: false });
    reaction(
      () => [
        this.searching_string,
        this.hardLevel,
        this.authorID,
        this.contentType,
        this.cardConnectedTheme,
      ],
      () => {
        this.activePage = 1;
      },
    );
  }

  userStorage = UserStorage;

  activePage = 1;
  maxPages = 1;
  searching_string = '';

  changeActivePage = (e: any, value: number) => {
    this.activePage = value;
  };

  changeSearchString = e => {
    this.searching_string = e.target.value;
  };

  refreshResults?: () => unknown;

  mode?: 'onlyCreatedByMe' | 'standard' = undefined;

  setMode(new_mode) {
    this.mode = new_mode;
  }

  hardLevel: hardLevelTypes = 'undefined';
  authorID: number | undefined = undefined;

  changeAuthor = (id: string | null) => {
    this.authorID = id ? Number(id) : undefined;
    this.activePage = 1;
  };
  changeHardLevel = e => {
    this.hardLevel = e.target.value;
  };

  contentType: cardContentType = 'undefined';
  changeContentType = e => {
    this.contentType = e.target.value;
  };
  cardConnectedTheme?: number;

  selectedCardID?: number | string;

  selectCard(card_id: number | string) {
    this.selectedCardID = card_id;
  }
}

type hardLevelTypes = CardHardLevel | 'undefined';
export type cardContentType = CardContentType | 'undefined';

export const CSSObject = new CardSelectorStore();
