import { action, makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import {
  executeMutation,
  executeQueuedMutation,
} from '../../../../../../Shared/ServerLayer/QueryLayer/execute-mutation';
import { writeApi } from '../../../../../../Shared/ServerLayer/QueryLayer/write-api';
import {
  answerWriteData,
  writtenAnswerData,
} from '../../../../../../Shared/ServerLayer/QueryLayer/answer-write-data';
import { AnswerDifficulty } from '../../../../../../Shared/ServerLayer/Types/question.type';
import { computedFn } from 'mobx-utils';
import { SERVER_BASE_URL } from '../../../../../../settings';
import { QuestionEditorStorage } from '../../../QuestionEditor/Store/QuestionEditorStorage';
import axiosClient from '../../../../../../Shared/ServerLayer/QueryLayer/config';
import { EditorAnswer } from '../../../../question-read-api';
import { FILE_URL } from '../../../../../../settings';

export class EditAnswerByIdStore {
  constructor(answer_id?: number) {
    makeAutoObservable<this, 'editVersion'>(this, {
      editVersion: false,
      reload: false,
      invalidate: false,
    });
    reaction(
      () => toJS(this.answer_object),
      () => this.autoSave(),
    );
    reaction(
      () => this.answer_object?.isDeleted,
      () => this.removeOrAddAnswerIDForStatistic(),
    );
    reaction(
      () => this.answer_object?.isRequired,
      () => this.fillRequiredArray(),
    );
    reaction(
      () => this.answer_object?.onlyForExam,
      () => this.fillOnlyForExam(),
    );

    reaction(
      () => this.answer_object?.isImageDeleted,
      () =>
        (this.fakeAnswerIndexForUpdatePreview =
          this.fakeAnswerIndexForUpdatePreview + 1),
    );

    if (answer_id) {
      this.answer_id = answer_id;
    }
  }

  questionStore = QuestionEditorStorage;
  answer_id?: number;
  answer_object?: answer_data_object;

  isAnswerDataLoaded = false;
  hasLoadError = false;
  hasSaveError = false;
  isEditTextInSimpleMode = false;

  // Работа с данными ответа----------------------------------------
  getField = computedFn(
    (
      field_name: answer_object_field | number,
      default_value: string | number | boolean | [] = '',
      answer_object = this.answer_object,
    ) =>
      answer_object && answer_object[field_name]
        ? answer_object[field_name]
        : default_value,
  );

  changeField = (
    field: answer_object_field | number,
    eventField: 'value' | 'checked' = 'value',
    answer_object = this.answer_object,
  ) =>
    action(({ target }) => {
      if (answer_object && field in answer_object) {
        answer_object[field] = target[eventField];
      }
    });

  fillRequiredArray() {
    if (!toJS(this.answer_object)?.isDeleted) {
      this.questionStore.addOrDeleterRequiredAnswerID(
        this.answer_object?.isRequired,
        this.answer_object?.id,
      );
    }
  }

  fillOnlyForExam() {
    if (!toJS(this.answer_object)?.isDeleted) {
      this.questionStore.addOrDeleteOnlyExamAnswersID(
        this.answer_object?.onlyForExam,
        this.answer_object?.id,
      );
    }
  }

  get isTrue() {
    if (this.answer_object) {
      return String(this.answer_object?.isTrue);
    } else {
      return 'true';
    }
  }

  changeIsRequired = () => {
    if (this.answer_object) {
      this.answer_object.isRequired = !this.answer_object.isRequired;
    }
  };
  changeOnlyForExam = () => {
    if (this.answer_object) {
      this.answer_object.onlyForExam = !this.answer_object.onlyForExam;
    }
  };

  changeIsTrue = () => {
    if (this.answer_object) {
      if (this.answer_object.isTrue == 'true') {
        this.answer_object.isTrue = 'false';
        this.changeBoilerPlateHelpText('false');
      } else {
        this.answer_object.isTrue = 'true';
        this.changeBoilerPlateHelpText('true');
      }
    }
  };
  setHardLevel = (hardLevel: AnswerDifficulty) => {
    if (this.answer_object) {
      this.answer_object.hardLevelOfAnswer = hardLevel;
    }
  };

  changeHardLevelSimpleMode = () => {
    if (this.answer_object) {
      const hardLevel = this.answer_object.hardLevelOfAnswer;
      if (hardLevel == AnswerDifficulty.Easy) {
        this.setHardLevel(AnswerDifficulty.Medium);
      } else if (hardLevel == AnswerDifficulty.Medium) {
        this.setHardLevel(AnswerDifficulty.Hard);
      } else if (hardLevel == AnswerDifficulty.Hard) {
        this.setHardLevel(AnswerDifficulty.Easy);
      }
    }
  };

  removeOrAddAnswerIDForStatistic() {
    if (this.answer_object) {
      if (toJS(this.answer_object)?.isDeleted) {
        this.questionStore.removeAnswerID(this.answer_object.id);
      } else if (!toJS(this.answer_object)?.isDeleted) {
        this.questionStore.registerAnswerID(this.answer_object.id);
      }
    }
  }

  // Открыто ли окно в котором спрашивается, Уверены ли вы, что хотите удалить этот вопрос
  isOpenDeleteDialog = false;

  edittextInSimpleMode = () => {
    this.isEditTextInSimpleMode = !this.isEditTextInSimpleMode;
  };
  stopTextEditingInSimpleMode = () => {
    if (this.isEditTextInSimpleMode) {
      this.isEditTextInSimpleMode = !this.isEditTextInSimpleMode;
    }
  };

  changeBoilerPlateHelpText = (isTrue: 'true' | 'false') => {
    for (const i of [1, 2, 3]) {
      if (this.answer_object) {
        const activeHelpText = this.answer_object[`helpTextv${i}`];
        if (isTrue !== 'true') {
          if (
            activeHelpText == 'Ваш ответ следует дополнить' ||
            activeHelpText == ''
          ) {
            this.answer_object[`helpTextv${i}`] =
              'Вы допустили одну или более ошибок';
          }
        } else {
          if (
            activeHelpText == 'Вы допустили одну или более ошибок' ||
            activeHelpText == ''
          ) {
            this.answer_object[`helpTextv${i}`] = 'Ваш ответ следует дополнить';
          }
        }
      }
    }
  };

  // ----------------------------------------------------------------

  isOpenForEdit = false;

  changeIsOpenForEdit = () => {
    this.isOpenForEdit = !this.isOpenForEdit;
  };

  reload?: () => unknown;
  invalidate?: () => unknown;
  loadAnswerData = () => {
    this.reload?.();
  };
  initializeAnswerData(data: EditorAnswer) {
    if (this.isAnswerDataLoaded) return;
    const { image, ...answer } = data;
    this.answer_object = {
      ...answer,
      isTrue: String(data.isTrue) as 'true' | 'false',
      question: data.question.id,
    };
    this.imageUrl = image ? `${FILE_URL}/${image}` : '';
    this.isAnswerDataLoaded = true;
    this.hasLoadError = false;
  }

  isFirstLoadingIgnore = true;
  // сохранен/не сохранен
  stateOfSave = true;
  // Таймер для сохранения
  savingTimer: any;
  private editVersion = 0;

  // Функция для авто сохранений
  autoSave = () => {
    if (this.isFirstLoadingIgnore) {
      this.isFirstLoadingIgnore = false;
    } else {
      if (this.answer_object) {
        this.editVersion += 1;
        this.hasSaveError = false;
        this.stateOfSave = false;
        clearTimeout(this.savingTimer);
        this.savingTimer = setTimeout(() => {
          this.updateAnswerData();
        }, 1500);
      }
    }
  };

  updateAnswerData() {
    if (this.answer_object) {
      this.hasSaveError = false;
      this.stateOfSave = false;
      const rawAnswerObject = toJS(this.answer_object);
      const version = this.editVersion;
      executeQueuedMutation(
        `answer-${rawAnswerObject.id}`,
        writeApi.endpoints.saveAnswer.initiate({
          id: Number(rawAnswerObject.id),
          data: answerWriteData(rawAnswerObject),
        }),
      )
        .then(
          action(new_answer => {
            if (version === this.editVersion) this.stateOfSave = true;
            this.invalidate?.();
          }),
        )
        .catch(
          action(() => {
            if (version === this.editVersion) this.hasSaveError = true;
          }),
        );
    }
  }

  // Изображение ----------------------------------------------------------------

  imageUrl = '';
  fakeAnswerIndexForUpdatePreview = 0;

  getImageUrlFromServer() {
    if (this.answer_object) {
      fetch(`${SERVER_BASE_URL}/files/answer?id=${this.answer_object?.id}`)
        .then(response => response.json())
        .then(data => (this.imageUrl = data[0].image))
        .then(
          () =>
            (this.fakeAnswerIndexForUpdatePreview =
              this.fakeAnswerIndexForUpdatePreview + 1),
        )
        .catch(() => void 0);
    }
  }

  get imageName() {
    if (this.imageUrl === '') {
      return '';
    }
    return this.imageUrl.slice(68).split('?')[0];
  }

  async updateImage(e) {
    const id = Number(this.answer_object?.id);
    const file = e.target.files?.[0];
    if (!id || !file) return;
    try {
      const result = await executeMutation(
        writeApi.endpoints.uploadMaterialImage.initiate({
          kind: 'answer',
          id,
          file,
        }),
      );
      runInAction(() => {
        this.imageUrl = `${FILE_URL}/${result.image}`;
        this.fakeAnswerIndexForUpdatePreview++;
      });
    } catch {
      runInAction(() => {
        this.hasSaveError = true;
      });
    }
  }

  deleteAnswer = () => {
    if (this.answer_object) {
      this.answer_object.isDeleted = true;
    }
  };

  async createNewAnswerBasedOnExist() {
    if (!this.answer_object) return;
    const questionId = Number(this.answer_object.question);
    try {
      const answer = await executeMutation(
        writeApi.endpoints.createAnswer.initiate({
          questionId,
          data: answerWriteData(toJS(this.answer_object)),
        }),
      );
      runInAction(() => {
        if (this.questionStore.selectedQuestionID === questionId)
          this.questionStore.addCreatedAnswerToAnswersObjectArray(
            writtenAnswerData(answer),
          );
      });
    } catch {
      runInAction(() => {
        this.hasSaveError = true;
      });
    }
  }

  // ----------------------------------------------------------------

  isShowAnswerPreview = false;

  // ------Сообщения о ошибках в ответах ----------------------------------------------------------

  answerErrorMessage: answerReportType[] = [];

  loadAnswerErrorMessage = async () => {
    if (this.answer_id) {
      const reports = await axiosClient
        .get(`page/edit-answer-by-id/answer-report-by-id/${this.answer_id}`)
        .then(res => res.data);
      runInAction(() => {
        this.answerErrorMessage = reports;
      });
    }
  };

  isOpenAnswerErrorMessageDialog = false;

  openAnswerErrorMessageDialog = () => {
    this.isOpenAnswerErrorMessageDialog = true;
  };

  closeAnswerErrorMessageDialog = () => {
    this.isOpenAnswerErrorMessageDialog = false;
  };
  updatingAnswerErrorMessageID: null | number = null;

  updateAnswerErrorMessageID = async () => {
    await executeMutation(
      writeApi.endpoints.closeAnswerReport.initiate(
        Number(this.updatingAnswerErrorMessageID),
      ),
    )
      .then(() => this.errorMessageClosedSuccessArray.push(true))
      .catch(() => this.errorMessageClosedSuccessArray.push(false));
    this.updatingAnswerErrorMessageID = null;
    this.loadAnswerErrorMessage();
  };

  onCloseAnswerReportClick = answer_report_id => {
    this.updatingAnswerErrorMessageID = answer_report_id;
    this.updateAnswerErrorMessageID();
  };

  errorMessageClosedSuccessArray: boolean[] = [];

  removeElementFromErrorMessageClosedSuccessArray = () => {
    this.errorMessageClosedSuccessArray.shift();
  };
}

type answerReportType = {
  id: number;
  created_by_id: number;
  answer_id: number;
  text: string;
  createdAt: string;
  is_closed: string;
  users_customuser: UsersCustomuser;
};

interface UsersCustomuser {
  users_userprofile: UsersUserprofile;
  username: string;
}

interface UsersUserprofile {
  firstname: string;
  lastname: string;
}

export type answer_data_object = Omit<
  EditorAnswer,
  'question' | 'image' | 'isTrue'
> & { question: string; isTrue: 'true' | 'false' };
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type answer_data_object_witch_out_id = PartialBy<answer_data_object, 'id'>;
export type answer_object_field = keyof answer_data_object;
