import { makeAutoObservable, reaction, toJS } from "mobx";
import { ClientStorage } from "../../../../../Shared/Store/ApolloStorage/ClientStorage";
import {
  getAutocompleteCardDataAsync,
  selectRecommendedCardReport,
} from "./Query";
import { UnstructuredThemesNode } from "../../../../../SchemaTypes";
import { GET_CONNECTED_THEME } from "../../../Selector/Store/Query";
import { cardContentType } from "../../../Selector/Store/CardSelectorStore";
import axiosClient from "../../../../../Shared/ServerLayer/QueryLayer/config";

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
    reaction(
      () => this.cardConnectedTheme,
      () => this.calculateThemeWithParent(),
    );
  }

  clientStorage = ClientStorage;

  loadAutocompleteDefaultData() {
    getAutocompleteCardDataAsync("", undefined, this.convertMatchToCardData);
  }

  changeAISearchString = async (value) => {
    this.AISearchString = value;
    this.getAutocompleteCardsData();
  };
  AISearchString = "";

  // Фильтры ------------------------------------------------------
  // function for build RrQL filter string
  get AIQueryFilterString() {
    let queryString = "";
    if (this.hardLevel != "-1") {
      queryString += `'hard_level' == ${this.hardLevel}`;
    }
    if (this.themeWithPatentIDArray.length > 0) {
      if (queryString.length > 0) {
        queryString += " and ";
      }
      const itemInRecombeeStyleString = this.themeWithPatentIDArray
        .map((item) => `"${item}"`)
        .join(", ");

      queryString += `({${itemInRecombeeStyleString}} & 'connected_theme') != {}`;
    }

    if (this.contentType !== "undefined") {
      if (queryString.length > 0) {
        queryString += " and ";
      }
      queryString += `'card_content_type' == ${Number(this.contentType)}`;
    }

    if (this.selectedCardAuthor !== undefined) {
      if (queryString.length > 0) {
        queryString += " and ";
      }
      queryString += `'created_by_id' == ${this.selectedCardAuthor}`;
    }

    return queryString;
  }

  hardLevel: "-1" | "0" | "1" | "2" | "3" = "-1";

  changeHardLevel = (e) => {
    this.hardLevel = e.target.value;
  };

  allConnectedThemes: UnstructuredThemesNode[] = [];
  connectedThemesHasBeenLoaded = false;

  get connectedThemesForSelector() {
    return toJS(this.allConnectedThemes)?.map((theme) => ({
      id: theme.id,
      value: theme.id,
      title: theme.text,
      pId: theme?.parent?.id || 0,
    }));
  }

  loadCardConnectedThemes() {
    try {
      this.clientStorage.client
        .query({
          query: GET_CONNECTED_THEME,
          fetchPolicy: "network-only",
          variables: {},
        })
        .then((response) => response.data.unstructuredTheme)
        .then((connected_themes) => {
          this.allConnectedThemes = connected_themes;
          for (const theme of connected_themes) {
            if (this.themeParentToThemeMap.has(theme.parent?.id)) {
              const themesArray =
                this.themeParentToThemeMap.get(theme.parent?.id) || [];
              this.themeParentToThemeMap.set(theme?.parent?.id, [
                ...themesArray,
                theme?.id,
              ]);
            } else {
              this.themeParentToThemeMap.set(theme?.parent?.id, [theme?.id]);
            }
          }
          this.connectedThemesHasBeenLoaded = true;
        });
    } catch (e) {
      console.log(e);
    }
  }

  calculateThemeWithParent() {
    this.themeWithPatentIDArray = [];
    if (this.cardConnectedTheme) {
      this.themeWithPatentIDArray.push(String(this.cardConnectedTheme));
      this.recursiveThemeCollector(this.cardConnectedTheme);
    }
  }

  recursiveThemeCollector(themeID) {
    if (this.themeParentToThemeMap.has(themeID)) {
      const themesArray = this.themeParentToThemeMap.get(themeID) || [];
      for (const theme of themesArray) {
        this.themeWithPatentIDArray.push(theme);
        this.recursiveThemeCollector(theme);
      }
    }
  }

  themeWithPatentIDArray: string[] = [];

  cardConnectedTheme?: number;
  themeParentToThemeMap: Map<string, string[]> = new Map();

  contentType: cardContentType = "undefined";
  changeContentType = (e) => {
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

  convertMatchToCardData = (recommendation) => {
    if (recommendation?.recomms) {
      const cardData = recommendation?.recomms?.map((recommItem) => ({
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
  autocompleteRecommendationID = "";

  getAISearchResult() {
    getAutocompleteCardDataAsync(
      this.AISearchString,
      this.AIQueryFilterString,
      this.changeCardIDArrayFromSearch,
      50,
    );
  }

  changeCardIDArrayFromSearch = (recommendation) => {
    if (recommendation?.recomms) {
      this.cardsIDArrayFromSearch = recommendation?.recomms?.map(
        (recommItem) => recommItem?.id,
      );
    }
  };

  cardsIDArrayFromSearch: string[] = [];

  get cardsIDArray() {
    return toJS(this.cardsIDArrayFromSearch);
  }

  cardAuthors: Author[] = [];

  loadCardAuthors() {
    axiosClient.get<Author[]>("/page/card-page/authors").then((res) => {
      this.cardAuthors = res.data;
    });
  }

  get cardAuthorsForSelector() {
    return [
      ...new Set(
        toJS(this.cardAuthors)?.map((author) => ({
          id: author.id,
          label:
            author?.users_userprofile?.firstname ||
            author?.users_userprofile?.lastname
              ? `${author?.users_userprofile?.firstname} ${author?.users_userprofile?.lastname}`
              : author?.username,
        })),
      ),
    ];
  }

  selectedCardAuthor: number | undefined = undefined;

  changeCardAuthor = (value) => {
    this.selectedCardAuthor = value?.id;
    console.log(this.selectedCardAuthor);
  };
}

export const AISObject = new AISearch();

export interface UsersUserprofile {
  firstname: string;
  lastname: string;
}

export interface Author {
  id: number;
  username: string;
  users_userprofile: UsersUserprofile;
}
