import { makeAutoObservable, reaction, toJS } from 'mobx';
import {
  getAutocompleteCardDataAsync,
  selectRecommendedCardReport,
} from './Query';
import { cardContentType } from '../../../Selector/Store/CardSelectorStore';

class AISearch {
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.AIQueryFilterString,
      () => this.getAutocompleteCardsData(),
    );
    reaction(
      () => this.AIQueryFilterString,
      () => this.getAISearchResult(),
    );
  }

  loadAutocompleteDefaultData() {
    getAutocompleteCardDataAsync('', undefined, this.convertMatchToCardData);
  }

  changeAISearchString = async value => {
    this.AISearchString = value;
    this.getAutocompleteCardsData();
  };
  AISearchString = '';

  // Фильтры ------------------------------------------------------
  // function for build RrQL filter string
  get AIQueryFilterString() {
    let queryString = '';
    if (this.hardLevel != '-1') {
      queryString += `'hard_level' == ${this.hardLevel}`;
    }
    if (this.themeWithPatentIDArray.length > 0) {
      if (queryString.length > 0) {
        queryString += ' and ';
      }
      const itemInRecombeeStyleString = this.themeWithPatentIDArray
        .map(item => `"${item}"`)
        .join(', ');

      queryString += `({${itemInRecombeeStyleString}} & 'connected_theme') != {}`;
    }

    if (this.contentType !== 'undefined') {
      if (queryString.length > 0) {
        queryString += ' and ';
      }
      queryString += `'card_content_type' == ${Number(this.contentType)}`;
    }

    if (this.selectedCardAuthor !== undefined) {
      if (queryString.length > 0) {
        queryString += ' and ';
      }
      queryString += `'created_by_id' == ${this.selectedCardAuthor}`;
    }

    return queryString;
  }

  hardLevel: '-1' | '0' | '1' | '2' | '3' = '-1';

  changeHardLevel = e => {
    this.hardLevel = e.target.value;
  };

  themeWithPatentIDArray: string[] = [];
  cardConnectedTheme?: number;

  setThemeFilter(selectedId: number | undefined, themeIds: string[]) {
    this.cardConnectedTheme = selectedId;
    if (
      this.themeWithPatentIDArray.length !== themeIds.length ||
      this.themeWithPatentIDArray.some((id, index) => id !== themeIds[index])
    ) {
      this.themeWithPatentIDArray = themeIds;
    }
  }

  contentType: cardContentType = 'undefined';
  changeContentType = e => {
    this.contentType = e.target.value;
  };

  //

  async getAutocompleteCardsData() {
    const searchString = this?.AISearchString;
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      getAutocompleteCardDataAsync(
        searchString || undefined,
        this.AIQueryFilterString,
        this.convertMatchToCardData,
      );
    }, 500);
  }

  convertMatchToCardData = recommendation => {
    if (recommendation?.recomms) {
      const cardData = recommendation?.recomms?.map(recommItem => ({
        label: recommItem?.values?.title,
        id: recommItem?.id,
      }));
      this.changeCardDataForAutocomplete(cardData);
      this.changeAutocompleteRecommendationID(recommendation?.recommId);
    }
  };

  onSelectCardInAutocomplete = (event, value) => {
    this.changeAISearchString(value.label);
    this.getAISearchResult();
    selectRecommendedCardReport(this.autocompleteRecommendationID, value?.id);
  };

  changeCardDataForAutocomplete(cardData) {
    this.cardDataForAutocomplete = cardData;
  }

  changeAutocompleteRecommendationID(id) {
    this.autocompleteRecommendationID = id;
  }

  debounceTimer: any = null;

  cardDataForAutocomplete: { label: string; id: number }[] = [];
  autocompleteRecommendationID = '';

  getAISearchResult() {
    getAutocompleteCardDataAsync(
      this.AISearchString,
      this.AIQueryFilterString,
      this.changeCardIDArrayFromSearch,
      50,
    );
  }

  changeCardIDArrayFromSearch = recommendation => {
    if (recommendation?.recomms) {
      this.cardsIDArrayFromSearch = recommendation?.recomms?.map(
        recommItem => recommItem?.id,
      );
    }
  };

  cardsIDArrayFromSearch: string[] = [];

  get cardsIDArray() {
    return toJS(this.cardsIDArrayFromSearch);
  }

  selectedCardAuthor: number | undefined = undefined;

  changeCardAuthor = value => {
    this.selectedCardAuthor = value?.id;
  };
}

export const AISObject = new AISearch();
