import { action, makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import { ClientStorage } from '../../../../../Shared/Store/ApolloStorage/ClientStorage';
import {
  CREATE_DEEP_QUESTION_COPY,
  CREATE_NEW_ANSWER,
  CREATE_NEW_QUESTION,
} from './Struct';
import { AnswerNode, Mutation } from '../../../../../SchemaTypes';
import { EditorAnswer, QuestionEditorData } from '../../../question-read-api';
import { Answer, answerStoreType } from './AnswersStorage';
import { UserStorage } from '../../../../../Shared/Store/UserStore/UserStore';
import { FILE_URL, SERVER_BASE_URL } from '../../../../../settings';
import axiosClient from '../../../../../Shared/ServerLayer/QueryLayer/config';

export enum variantsOfStateOfSave {
  SAVED = 'SAVED',
  SAVING = 'SAVING',
  ERROR = 'ERROR',
}

class QuestionEditor {
  constructor() {
    makeAutoObservable<this, 'applyingServerData' | 'editVersion'>(this, {
      fetchQuestionData: false,
      invalidateQuestionData: false,
      applyingServerData: false,
      editVersion: false,
    });
    reaction(
      () => this.selectedQuestionText,
      () => this.autoSave(),
    );
    reaction(
      () => this.selectedQuestionThemesArray,
      () => this.autoSave(),
    );
    reaction(
      () => this.selectedQuestionAuthorsArray,
      () => this.autoSave(),
    );
    reaction(
      () => this.selectedQuestionNumberOfShowingAnswers,
      () => this.autoSave(),
    );
    reaction(
      () => this.selectedConnectedTheme,
      () => this.autoSave(),
    );
  }

  // Existing write operations use Apollo; server reads are provided by RTK Query.
  clientStorage = ClientStorage;

  // доступ к данным о пользователе, чтобы можно было проверять уровень доступа
  userStorage = UserStorage;

  // Флаг, указывающий на то, был ли выбран вопрос в селекторе
  questionHasBeenSelected = false;

  selectedConnectedTheme?: string;

  registeredAnswersID = new Set();

  registerAnswerID(answerID: string) {
    this.registeredAnswersID.add(answerID);
  }

  removeAnswerID(answerID: string) {
    if (this.registeredAnswersID.has(answerID)) {
      this.registeredAnswersID.delete(answerID);
    }
    if (this.registeredRequireAnswersID.has(answerID)) {
      this.registeredRequireAnswersID.delete(answerID);
    }
    if (this.registeredOnlyExamAnswersID.has(answerID)) {
      this.registeredOnlyExamAnswersID.delete(answerID);
    }
  }

  // Статистика по ответам
  get NumberOfAllAnswers() {
    return this.registeredAnswersID.size;
  }

  registeredRequireAnswersID = new Set();

  addOrDeleterRequiredAnswerID(
    isRequired: boolean | undefined,
    answer_ID: string | undefined,
  ) {
    if (answer_ID) {
      if (isRequired) {
        this.registeredRequireAnswersID.add(answer_ID);
      } else {
        if (this.registeredRequireAnswersID.has(answer_ID)) {
          this.registeredRequireAnswersID.delete(answer_ID);
        }
      }
    }
  }

  get NumberOfRequiredAnswers() {
    return this.registeredRequireAnswersID.size;
  }

  get ErrorRequiredAnswerSoMuch() {
    return (
      Number(this.NumberOfRequiredAnswers) >=
      Number(this.selectedQuestionNumberOfShowingAnswers)
    );
  }

  registeredOnlyExamAnswersID = new Set();

  addOrDeleteOnlyExamAnswersID(
    onlyForExam: boolean | undefined,
    answer_ID: string | undefined,
  ) {
    if (answer_ID) {
      if (onlyForExam) {
        this.registeredOnlyExamAnswersID.add(answer_ID);
      } else {
        if (this.registeredOnlyExamAnswersID.has(answer_ID)) {
          this.registeredOnlyExamAnswersID.delete(answer_ID);
        }
      }
    }
  }

  get NumberOfAnswersInTrainingMode() {
    return (
      Number(this.NumberOfAllAnswers) -
      Number(this.registeredOnlyExamAnswersID.size)
    );
  }

  // ----------------------------------------------------------------

  // Флаг, указывающий на то, использовать превью или нет
  showPreview = false;

  loadingQuestionData = false;
  questionLoadError = false;
  private questionLoadRequest = 0;

  fetchQuestionData?: (id: number) => Promise<QuestionEditorData | null>;
  invalidateQuestionData?: (id: number) => unknown;
  private applyingServerData = false;
  selectQuestionClickHandler(id: number) {
    const request = ++this.questionLoadRequest;
    clearTimeout(this.savingTimer);
    this.stateOfSave = variantsOfStateOfSave.SAVED;
    this.clearAllStatisticData();
    this.questionHasBeenSelected = false;
    this.loadingQuestionData = true;
    this.questionLoadError = false;

    if (
      this.userStorage.userAccessLevel === 'TEACHER' ||
      this.userStorage.userAccessLevel === 'ADMIN'
    ) {
      this.fetchQuestionData?.(id)
        .then(question_data => {
          if (request !== this.questionLoadRequest) return;
          if (!question_data) throw new Error('Question not found');
          this.applyingServerData = true;
          runInAction(() => {
            this.selectedQuestionID = Number(question_data.id);
            this.selectedQuestionText = question_data.text;
            this.selectedQuestionImageURL = question_data.image
              ? `${FILE_URL}/${question_data.image}`
              : '';
            this.showPreview = false;
            if (question_data.numberOfShowingAnswers) {
              this.selectedQuestionNumberOfShowingAnswers = String(
                question_data.numberOfShowingAnswers,
              );
            }

            this.selectedConnectedTheme = question_data?.connectedTheme?.id;

            if (question_data) {
              this.answers_id_array = question_data.answers.map(
                answer => answer.id,
              );
            }
            const __QuestionAuthors = question_data.author.map(author =>
              String(author.id),
            );
            this.selectedQuestionAuthorsArray = __QuestionAuthors
              ? __QuestionAuthors
              : [];
            const __QuestionThemes = question_data.theme.map(theme =>
              String(theme.id),
            );
            this.selectedQuestionThemesArray = __QuestionThemes
              ? __QuestionThemes
              : [];

            if (question_data.answers) {
              const __Answers: Answer[] = [];
              [...question_data.answers]
                .sort((a, b) => Number(a.id) - Number(b.id))
                .filter((answer: EditorAnswer) => !answer.isDeleted)
                .map((answer: EditorAnswer) =>
                  __Answers.push(new Answer(this, answer)),
                );
              this.answers = __Answers;
            }
            this.questionHasBeenSelected = true;
            this.loadingQuestionData = false;
          });
          this.applyingServerData = false;
        })
        .catch(
          action(() => {
            this.applyingServerData = false;
            if (request === this.questionLoadRequest) {
              this.loadingQuestionData = false;
              this.questionLoadError = true;
            }
          }),
        );
    }
  }

  answers_id_array: string[] = [];

  get answersIDForUI() {
    return toJS(this.answers_id_array).sort();
  }

  // Геттер, нужен чтобы можно было без преобразований использовать allQuestionsData

  deliverFromServerImageURL() {
    const questionID = this.selectedQuestionID;
    fetch(`${SERVER_BASE_URL}/files/question?id=${questionID}`)
      .then(response => response.json())
      .then(jResponse => {
        if (questionID === this.selectedQuestionID)
          this.selectedQuestionImageURL = jResponse?.[0]?.image || '';
      })
      .catch(() => {
        if (questionID === this.selectedQuestionID)
          this.selectedQuestionImageURL = '';
      });
  }

  // Функция для загрузки нового изображения на сервер (обработчик нажатия на кнопку для загрузки изображения)
  uploadNewQuestionImage(event) {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    formData.append('owner_question', String(this.selectedQuestionID));
    fetch(
      `${SERVER_BASE_URL}/files/question?update_id=${String(this.selectedQuestionID)}`,
      {
        method: 'POST',
        body: formData,
      },
    )
      .then(response => response.json())
      .then(() => {
        this.deliverFromServerImageURL();
        this.invalidateQuestionData?.(this.selectedQuestionID);
      })
      .catch(() => {
        this.deliverFromServerImageURL();
      });
  }

  // Авто сохранение ---------------------------------------------

  // Таймер для сохранения
  savingTimer: any;
  private editVersion = 0;

  // Функция для сохранения даных на сервере
  saveDataOnServer() {
    if (
      this.userStorage.userAccessLevel === 'TEACHER' ||
      this.userStorage.userAccessLevel === 'ADMIN'
    ) {
      const id = this.selectedQuestionID;
      const version = this.editVersion;
      axiosClient
        .post('/page/edit-question-by-id/update-question', {
          id: this.selectedQuestionID,
          connected_theme_id: Number(this.selectedConnectedTheme),
          text: this.selectedQuestionText,
          number_of_showing_answers: Number(
            this.selectedQuestionNumberOfShowingAnswers,
          ),
        })
        .then(
          action(response => {
            if (
              this.selectedQuestionID === id &&
              this.editVersion === version
            ) {
              this.stateOfSave = response.data.id
                ? variantsOfStateOfSave.SAVED
                : variantsOfStateOfSave.ERROR;
            }
            if (response.data.id) this.invalidateQuestionData?.(id);
            this.simpleUpdateFlag = true;
          }),
        )
        .catch(
          action(() => {
            if (this.selectedQuestionID === id && this.editVersion === version)
              this.stateOfSave = variantsOfStateOfSave.ERROR;
          }),
        );
    }
  }

  // сохранен/не сохранен / ошибка

  stateOfSave: variantsOfStateOfSave = variantsOfStateOfSave.SAVED;

  // Функция для авто сохранений
  autoSave() {
    if (this.applyingServerData || !this.questionHasBeenSelected) return;
    this.editVersion += 1;
    this.stateOfSave = variantsOfStateOfSave.SAVING;
    clearTimeout(this.savingTimer);
    this.savingTimer = setTimeout(() => {
      this.saveDataOnServer();
    }, 1500);
  }

  // Поля вопроса ------------------------------------

  // ID выбранного вопроса
  selectedQuestionID = 0;

  // Текст выбранного вопроса
  selectedQuestionText: string | undefined = '';

  // Темы выбранного вопроса
  selectedQuestionThemesArray: string[] = [];

  // Авторы выбранного вопроса
  selectedQuestionAuthorsArray: string[] = [];

  // Ссылка на изображение для вопроса
  selectedQuestionImageURL = '';

  // Количество отображаемых ответов
  selectedQuestionNumberOfShowingAnswers = '8';

  // Геттеры для полей вопроса ------------------------

  // Геттер для тем вопроса которые выбрал автор
  get SelectedQuestionThemesForSelector() {
    return toJS(this.selectedQuestionThemesArray);
  }

  // Геттер для аторов вопроса которые выбрал автор
  get SelectedQuestionAuthorForSelector() {
    return toJS(this.selectedQuestionAuthorsArray) || [];
  }

  // Геттер имени фотографии вопроса (приводит ссылку к красивому виду)
  get QuestionImageName() {
    return this.selectedQuestionImageURL.slice(70).split('?')[0];
  }

  // Раздел ответов ----------------------------------------------------------
  answers: answerStoreType[] = [];

  // Флаг который позволяет игнорировать пересоздание сторов для ответов в случае если это просто обновление
  // ответа
  simpleUpdateFlag = false;

  // флаг блокировки закрытия вопроса, если не сохранен вопрос или какой-лбо из его ответов
  get unsavedFlag() {
    return !(this.stateOfSave === variantsOfStateOfSave.SAVED);
    // || !this.isAnyoneOfAnswersNotSaved
  }

  // Создаем новый вопрос
  async createNewQuestion() {
    return this.clientStorage.client
      .mutate<Mutation>({ mutation: CREATE_NEW_QUESTION })
      .then(response => response?.data?.updateQuestion?.question?.id);
  }

  // Создаем копию этого вопроса со всеми ответами и переходим в нее
  createDeepCopyInProgress = false;
  deepQuestionCopyWithAnswers = () => {
    this.createDeepCopyInProgress = true;
    try {
      this.clientStorage.client
        .mutate<Mutation>({
          mutation: CREATE_DEEP_QUESTION_COPY,
          variables: {
            questionId: this.selectedQuestionID,
          },
        })
        .then(response => response?.data?.copyQuestionWithAnswers)
        .then(create_question_data => {
          if (create_question_data?.ok && create_question_data.newQuestionId) {
            this.createDeepCopyInProgress = false;
            this.selectQuestionClickHandler(
              Number(create_question_data.newQuestionId),
            );
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  addCreatedAnswerToAnswersObjectArray = (answer: AnswerNode) => {
    this.answers_id_array.push(String(answer.id));
    this.answers.push(new Answer(this, answer));
  };

  // Создаем новый ответ
  createNewAnswer() {
    this.clientStorage.client
      .mutate({
        mutation: CREATE_NEW_ANSWER,
        variables: {
          question: this.selectedQuestionID,
        },
      })
      .then(response => {
        this.addCreatedAnswerToAnswersObjectArray(
          response.data.createAnswer.answer,
        );
        this.invalidateQuestionData?.(this.selectedQuestionID);
        // this.selectQuestionClickHandler(this.selectedQuestionID)
      })
      .catch(() => void 0);
  }

  clearAllStatisticData() {
    this.registeredAnswersID = new Set();
    this.registeredRequireAnswersID = new Set();
    this.registeredOnlyExamAnswersID = new Set();
    this.loadingQuestionData = true;
    this.answers_id_array = [];
    this.answers = [];
  }
}

export const QuestionEditorStorage = new QuestionEditor();
