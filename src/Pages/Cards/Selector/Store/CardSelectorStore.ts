import { makeAutoObservable, reaction } from 'mobx';
import { ClientStorage } from '../../../../Shared/Store/ApolloStorage/ClientStorage';
import { CREATE_NEW_CARD } from './Query';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';
import {
  CardCardContentType,
  CardHardLevel,
  Mutation,
} from '../../../../SchemaTypes';

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

  clientStorage = ClientStorage;
  // доступ к данным о пользователе, чтобы можно было проверять уровень доступа
  userStorage = UserStorage;

  // ---Создание новых карточек--------------------------------------------------------
  createNewCard() {
    try {
      this.clientStorage.client
        .mutate<Mutation>({
          mutation: CREATE_NEW_CARD,
          variables: {},
        })
        .then(response => response?.data?.card?.card)
        .then(new_card => {
          if (new_card) {
            this.selectedCardID = new_card.id;
          }
          this.refreshResults?.();
        })
        .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  }

  // -------------------------------------------------------------------------------

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
export type cardContentType = CardCardContentType | 'undefined';

export const CSSObject = new CardSelectorStore();
