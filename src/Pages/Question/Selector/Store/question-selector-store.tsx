import { autorun, makeAutoObservable } from 'mobx';
import { Query } from '../../../../SchemaTypes';
import { ClientStorage } from '../../../../Shared/Store/ApolloStorage/ClientStorage';
import {
  GET_MY_QUESTIONS_ID_ARRAY,
  GET_QUESTIONS_ID_ARRAY_FOY_USER,
} from './query';

class QuestionSelectorStore {
  constructor() {
    makeAutoObservable(this);
    autorun(() => this.loadQuestionsIDOnSelectAuthor());
  }

  clientStorage = ClientStorage;

  myQuestions: string[] = [];
  questionsIDForSelectedAuthor: string[] = [];
  numPages = 1;
  activePage = 1;
  isQuestionsLoading = true;
  questionsLoadError = false;

  get activePageForPagination() {
    return Number(this.activePage);
  }

  selectedAuthorID: SelectedAuthorVariantsType =
    SelectedAuthorVariants.ALLQuestions;

  changeSelectedAuthorID = e => {
    this.selectedAuthorID = String(e.target.value);
    this.activePage = 1;
  };

  changeActivePage = (e, value) => {
    this.activePage = value;
  };

  get QuestionsIDArrayForDisplay() {
    if (this.selectedAuthorID == '-1') {
      return this.myQuestions;
    } else {
      return this.questionsIDForSelectedAuthor;
    }
  }

  get numPagesForPagination() {
    return Number(this.numPages);
  }

  loadMyQuestionsIDArray(useCache = true) {
    const requestedPage = this.activePage;
    if (this.selectedAuthorID === SelectedAuthorVariants.MYQuestions) {
      this.isQuestionsLoading = true;
      this.questionsLoadError = false;
    }
    this.clientStorage.client
      .query({
        query: GET_MY_QUESTIONS_ID_ARRAY,
        variables: {
          page: this.activePage,
        },
        fetchPolicy: useCache ? 'cache-only' : 'network-only',
      })
      .then(response => response.data.myQuestionsId)
      .then(my_questions_data => {
        if (my_questions_data) {
          if (my_questions_data.IDs) {
            this.myQuestions = my_questions_data.IDs;
          }
          if (
            this.selectedAuthorID === SelectedAuthorVariants.MYQuestions &&
            this.activePage === requestedPage
          ) {
            this.activePage = Number(my_questions_data.activePage) || 1;
            this.numPages = Math.max(
              1,
              Number(my_questions_data.numPages) || 1,
            );
          }
        }
        if (useCache) {
          this.loadMyQuestionsIDArray(false);
        } else if (
          this.selectedAuthorID === SelectedAuthorVariants.MYQuestions &&
          this.activePage === requestedPage
        ) {
          this.isQuestionsLoading = false;
        }
      })
      .catch(() => {
        if (useCache) {
          this.loadMyQuestionsIDArray(false);
        } else if (
          this.selectedAuthorID === SelectedAuthorVariants.MYQuestions &&
          this.activePage === requestedPage
        ) {
          this.isQuestionsLoading = false;
          this.questionsLoadError = true;
        }
      });
  }

  loadQuestionsIDOnSelectAuthor(useCache = true) {
    if (this.selectedAuthorID !== SelectedAuthorVariants.MYQuestions) {
      const requestedAuthor = this.selectedAuthorID;
      const requestedPage = this.activePage;
      this.isQuestionsLoading = true;
      this.questionsLoadError = false;
      if (useCache) {
        this.questionsIDForSelectedAuthor = [];
      }
      this.clientStorage.client
        .query<Query>({
          query: GET_QUESTIONS_ID_ARRAY_FOY_USER,
          variables: {
            page: this.activePage,
            ownerUserId: this.selectedAuthorID,
          },
          fetchPolicy: useCache ? 'cache-only' : 'network-only',
        })
        .then(response => response.data.questionsId)
        .then(QuestionsIDObject => {
          if (
            this.selectedAuthorID !== requestedAuthor ||
            this.activePage !== requestedPage
          )
            return;
          if (
            String(QuestionsIDObject?.ownerUserId) ==
            String(this.selectedAuthorID)
          ) {
            if (QuestionsIDObject?.IDs) {
              this.activePage = Number(QuestionsIDObject.activePage) || 1;
              this.numPages = Math.max(
                1,
                Number(QuestionsIDObject.numPages) || 1,
              );
              this.questionsIDForSelectedAuthor = QuestionsIDObject.IDs;
            }
          }
          if (useCache) {
            this.loadQuestionsIDOnSelectAuthor(false);
          } else {
            this.isQuestionsLoading = false;
          }
        })
        .catch(() => {
          if (
            this.selectedAuthorID !== requestedAuthor ||
            this.activePage !== requestedPage
          )
            return;
          if (useCache) {
            this.loadQuestionsIDOnSelectAuthor(false);
          } else {
            this.isQuestionsLoading = false;
            this.questionsLoadError = true;
          }
        });
    } else {
      this.loadMyQuestionsIDArray();
    }
  }
}

export enum SelectedAuthorVariants {
  ALLQuestions = '-2',
  MYQuestions = '-1',
}

export type SelectedAuthorVariantsType = SelectedAuthorVariants | string;

const QSSObject = new QuestionSelectorStore();

export default QSSObject;
