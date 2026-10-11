import { action, makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import {
  executeMutation,
  executeQueuedMutation,
} from '../../../../../Shared/ServerLayer/QueryLayer/execute-mutation';
import { writeApi } from '../../../../../Shared/ServerLayer/QueryLayer/write-api';
import { QuestionEditorData } from '../../../question-read-api';
import haveStatus from '../../../../../Shared/Store/UserStore/utils/HaveStatus';
import { FILE_URL, SERVER_BASE_URL } from '../../../../../settings';

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

  // Флаг, указывающий на то, был ли выбран вопрос в селекторе
  questionHasBeenSelected = false;

  selectedConnectedTheme?: string;

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

    if (haveStatus(['TEACHER', 'ADMIN'])) {
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
  async uploadNewQuestionImage(event) {
    const file = event.target.files?.[0];
    const id = this.selectedQuestionID;
    if (!file || !id) return;
    try {
      const result = await executeMutation(
        writeApi.endpoints.uploadMaterialImage.initiate({
          kind: 'question',
          id,
          file,
        }),
      );
      runInAction(() => {
        if (this.selectedQuestionID === id)
          this.selectedQuestionImageURL = `${FILE_URL}/${result.image}`;
      });
    } catch {
      runInAction(() => {
        this.stateOfSave = variantsOfStateOfSave.ERROR;
      });
    }
  }

  // Авто сохранение ---------------------------------------------

  // Таймер для сохранения
  savingTimer: any;
  private editVersion = 0;

  // Функция для сохранения даных на сервере
  saveDataOnServer() {
    if (haveStatus(['TEACHER', 'ADMIN'])) {
      const id = this.selectedQuestionID;
      const version = this.editVersion;
      executeQueuedMutation(
        `question-${id}`,
        writeApi.endpoints.saveQuestion.initiate({
          id,
          data: {
            connected_theme_id: this.selectedConnectedTheme
              ? Number(this.selectedConnectedTheme)
              : null,
            text: this.selectedQuestionText,
            number_of_showing_answers: Number(
              this.selectedQuestionNumberOfShowingAnswers,
            ),
          },
        }),
      )
        .then(
          action(response => {
            if (
              this.selectedQuestionID === id &&
              this.editVersion === version
            ) {
              this.stateOfSave = response.id
                ? variantsOfStateOfSave.SAVED
                : variantsOfStateOfSave.ERROR;
            }
            if (response.id) this.invalidateQuestionData?.(id);
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

  // флаг блокировки закрытия вопроса, если не сохранен вопрос или какой-лбо из его ответов
  get unsavedFlag() {
    return !(this.stateOfSave === variantsOfStateOfSave.SAVED);
    // || !this.isAnyoneOfAnswersNotSaved
  }

  // Создаем новый вопрос
  async createNewQuestion() {
    const question = await executeMutation(
      writeApi.endpoints.createQuestion.initiate(),
    );
    return String(question.id);
  }
  createDeepCopyInProgress = false;
  deepQuestionCopyWithAnswers = async () => {
    if (this.createDeepCopyInProgress || !this.selectedQuestionID) return;
    this.createDeepCopyInProgress = true;
    try {
      const question = await executeMutation(
        writeApi.endpoints.copyQuestion.initiate(this.selectedQuestionID),
      );
      runInAction(() => this.selectQuestionClickHandler(question.id));
    } catch {
      runInAction(() => {
        this.stateOfSave = variantsOfStateOfSave.ERROR;
      });
    } finally {
      runInAction(() => {
        this.createDeepCopyInProgress = false;
      });
    }
  };

  clearAllStatisticData() {
    this.loadingQuestionData = true;
  }
}

export const QuestionEditorStorage = new QuestionEditor();
