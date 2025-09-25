import { autorun, makeAutoObservable } from "mobx";
import { Query } from "../../../../SchemaTypes";
import { ClientStorage } from "../../../../Shared/Store/ApolloStorage/ClientStorage";
import {
  GET_MY_QUESTIONS_ID_ARRAY,
  GET_QUESTIONS_ID_ARRAY_FOY_USER,
  GET_USERS_WITH_QUESTION_CREATOR_STATUS,
} from "./query";

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

  get activePageForPagination() {
    return Number(this.activePage);
  }

  usersWithQuestions: { id: number; username: string }[] = [];

  selectedAuthorID: SelectedAuthorVariantsType =
    SelectedAuthorVariants.ALLQuestions;

  changeSelectedAuthorID = (e) => {
    this.selectedAuthorID = e.target.value;
  };

  changeActivePage = (e, value) => {
    this.activePage = value;
  };

  get QuestionsIDArrayForDisplay() {
    if (this.selectedAuthorID == "-1") {
      return this.myQuestions;
    } else {
      return this.questionsIDForSelectedAuthor;
    }
  }

  get numPagesForPagination() {
    return Number(this.numPages);
  }

  loadMyQuestionsIDArray(useCache = true) {
    this.clientStorage.client
      .query({
        query: GET_MY_QUESTIONS_ID_ARRAY,
        variables: {
          page: this.activePage,
        },
        fetchPolicy: useCache ? "cache-only" : "network-only",
      })
      .then((response) => response.data.myQuestionsId)
      .then((my_questions_data) => {
        if (my_questions_data) {
          if (my_questions_data.IDs) {
            this.myQuestions = my_questions_data.IDs;
          }
          this.activePage = my_questions_data.activePage;
          this.numPages = my_questions_data.numPages;
        }
        if (useCache) {
          this.loadMyQuestionsIDArray(false);
        }
      })
      .catch((e) => console.log(e));
  }

  loadUsersWithQuestion(useCache = true) {
    this.clientStorage.client
      .query({
        query: GET_USERS_WITH_QUESTION_CREATOR_STATUS,
        fetchPolicy: useCache ? "cache-first" : "network-only",
      })
      .then((response) => response.data.userWithQuestion)
      .then((usersWithQuestions) => {
        if (usersWithQuestions) {
          this.usersWithQuestions = usersWithQuestions;
        }
        if (useCache) {
          this.loadUsersWithQuestion(false);
        }
      })
      .catch((e) => console.log(e));
  }

  loadQuestionsIDOnSelectAuthor(useCache = true) {
    if (this.selectedAuthorID !== SelectedAuthorVariants.MYQuestions) {
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
          fetchPolicy: useCache ? "cache-only" : "network-only",
        })
        .then((response) => response.data.questionsId)
        .then((QuestionsIDObject) => {
          if (
            String(QuestionsIDObject?.ownerUserId) ==
            String(this.selectedAuthorID)
          ) {
            if (
              QuestionsIDObject?.activePage &&
              QuestionsIDObject?.numPages &&
              QuestionsIDObject?.IDs
            ) {
              this.activePage = QuestionsIDObject.activePage;
              this.numPages = QuestionsIDObject.numPages;
              this.questionsIDForSelectedAuthor = QuestionsIDObject.IDs;
            }
          }
          if (useCache) {
            this.loadQuestionsIDOnSelectAuthor(false);
          }
        })
        .catch((e) => console.log(e));
    } else {
      this.loadMyQuestionsIDArray();
    }
  }
}

export enum SelectedAuthorVariants {
  ALLQuestions = "-2",
  MYQuestions = "-1",
}

export type SelectedAuthorVariantsType = SelectedAuthorVariants | string;

const QSSObject = new QuestionSelectorStore();

export default QSSObject;
