import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { ClientStorage } from '../../../Shared/Store/ApolloStorage/ClientStorage';
import { GET_QUESTION_TEXT_BY_ID, LOAD_ATTEMPT_BY_ID } from './Query';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';

export class DetailStatisticStoreByID {
  constructor(id?: number) {
    this.attempt_id = id;
    makeAutoObservable(this);
    autorun(() => this.loadAttemptFromServer());
    autorun(() => this.loadQuestionText());
  }

  changeAttemptID(new_attempt_id: number) {
    this.attempt_id = new_attempt_id;
  }

  attempt_id: number | undefined = undefined;
  // Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
  clientStorage = ClientStorage;
  // доступ к данным о пользователе, чтобы можно было проверять уровень доступа
  userStorage = UserStorage;

  loadError = false;

  async loadAttemptFromServer() {
    const attemptID = this.attempt_id;
    if (!attemptID) return;
    runInAction(() => {
      this.loadError = false;
      this.attemptData = undefined;
    });

    try {
      const response = await this.clientStorage.client.query({
        query: LOAD_ATTEMPT_BY_ID,
        variables: { ID: attemptID },
        fetchPolicy: 'network-only',
        // Empty names violate the server's non-null profile fields. GraphQL
        // nulls userprofile, but the remaining attempt data is still valid.
        errorPolicy: 'all',
      });
      const attemptData = response.data?.detailStatisticById;
      const hasStatisticError = response.errors?.some(
        error =>
          error.path?.[0] !== 'detailStatisticById' ||
          error.path?.[1] !== 'authorizedUser' ||
          error.path?.[2] !== 'userprofile',
      );
      if (!attemptData || hasStatisticError) {
        throw new Error('Failed to load statistic');
      }
      runInAction(() => {
        if (this.attempt_id !== attemptID) return;
        this.attemptData = {
          ...attemptData,
          userName: attemptData.userName?.trim() || 'Анонимный пользователь',
        };
      });
    } catch {
      runInAction(() => {
        if (this.attempt_id === attemptID) this.loadError = true;
      });
    }
  }

  questionText = '';

  get QuestionTextForStatistic() {
    if (
      this.userStorage.userAccessLevel === 'ADMIN' ||
      this.userStorage.userAccessLevel === 'TEACHER'
    ) {
      return this.questionText;
    } else {
      return this.questionText.slice(0, 200);
    }
  }

  async loadQuestionText() {
    const questionID = this.attemptData?.question?.id;
    runInAction(() => {
      this.questionText = '';
    });
    if (!questionID) return;
    try {
      const response = await this.clientStorage.client.query({
        query: GET_QUESTION_TEXT_BY_ID,
        variables: { id: questionID },
      });
      runInAction(() => {
        if (this.attemptData?.question?.id === questionID) {
          this.questionText = response.data?.questionText?.text || '';
        }
      });
    } catch {
      // Question text is optional and must not prevent showing the result.
    }
  }

  // Массив индексов попыток, которые открыты для детальной статистики
  openAttemptForDetailStatistic = new Set();

  // Функция обработчик для того, чтобы открывать на редактирование конкретную попытку
  changeOpenAttemptForDetailStatistic(attemptIndex) {
    if (this.openAttemptForDetailStatistic.has(attemptIndex)) {
      this.openAttemptForDetailStatistic.delete(attemptIndex);
    } else {
      this.openAttemptForDetailStatistic.add(attemptIndex);
    }
  }

  attemptData: any = undefined;

  isOpenDetailStatistic = false;

  changeIsOpenDetailStatistic() {
    this.isOpenDetailStatistic = !this.isOpenDetailStatistic;
  }

  // Вычисляемое значение среднего балла за попытку
  get arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints() {
    let __sumOfAnswerPoints = 0;
    this.attemptData?.statistic?.ArrayForShowAnswerPoints?.map(attempt => {
      __sumOfAnswerPoints += Number(attempt.answerPoints);
    });
    const arithmeticMeanNumberOfAnswersPoints = Math.ceil(
      __sumOfAnswerPoints /
        Math.ceil(Number(this.attemptData?.statistic?.numberOfPasses)),
    );
    const dividePercent = Math.ceil(
      (arithmeticMeanNumberOfAnswersPoints / this.maxSumOfAnswersPoint) * 100,
    );
    return `${arithmeticMeanNumberOfAnswersPoints}/${this.maxSumOfAnswersPoint} (${dividePercent}%)`;
  }

  // Минимальны балл за попытку
  get minAnswerPoint() {
    return (
      this.attemptData?.statistic?.ArrayForShowAnswerPoints?.reduce(
        (minimum, attempt) => Math.min(minimum, Number(attempt.answerPoints)),
        100000,
      ) ?? 100000
    );
  }

  get arithmeticMeanNumberOfWrongAnswer() {
    const __sumOfWrongAnswers = this.numberOfWrongAnswers;
    return __sumOfWrongAnswers > 0
      ? (
          __sumOfWrongAnswers /
          (Number(this.attemptData?.statistic?.numberOfPasses) - 1)
        ).toFixed(1)
      : 'Ошибок нет';
  }

  // Максимальное число баллов для того набора ответов, который попался ученику
  get maxSumOfAnswersPoint() {
    return this?.attemptData?.maxSumOfAnswersPoint
      ? this?.attemptData?.maxSumOfAnswersPoint
      : this.attemptData?.questionHasBeenCompleted
        ? this.attemptData?.statistic?.ArrayForShowAnswerPoints[
            this.attemptData?.statistic?.ArrayForShowAnswerPoints.length - 1
          ].answerPoints
        : 0;
  }

  divideValueForCalculations = 0.7;

  changeDivideValue() {}

  get SumOFPointsWithNewMethod() {
    const divideValue = this.divideValueForCalculations;
    let sumOfAnswerPoints = 0;
    let sumOfAnswerPointsNewMethod = 0;
    let maxSumNewMethod = 0;

    this.attemptData?.statistic?.ArrayForShowAnswerPoints?.map(
      (attempt, aIndex) => {
        sumOfAnswerPoints += Number(attempt.answerPoints);
        sumOfAnswerPointsNewMethod +=
          Number(attempt.answerPoints) * divideValue ** aIndex;
        maxSumNewMethod +=
          Number(this.maxSumOfAnswersPoint) * divideValue ** aIndex;
      },
    );
    const result = Math.ceil(
      (sumOfAnswerPointsNewMethod / maxSumNewMethod) * 100,
    );
    // if(result < 0){
    //     result = 0
    // }

    if (
      !this?.attemptData?.maxSumOfAnswersPoint &&
      !this.attemptData?.questionHasBeenCompleted
    ) {
      return 'Невозможно рассчитать';
    } else {
      return result;
    }
    // return(sumOfAnswerPointsNewMethod + "/" + sumOfAnswerPoints)
  }

  get FormattedCreatedAt() {
    if (!this?.attemptData?.createdAt) {
      return 'Дата не сохранена';
    }
    const createdAtDate = new Date(
      Date.parse(this.attemptData?.createdAt),
    ).toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    return String(createdAtDate);
  }

  get numberOfWrongAnswers() {
    return (
      this.attemptData?.statistic?.ArrayForShowWrongAnswers?.reduce(
        (sum, attempt) => sum + (attempt.numberOfWrongAnswers?.length ?? 0),
        0,
      ) ?? 0
    );
  }

  get maxNumberOfWrongAnswers() {
    return (
      this.attemptData?.statistic?.ArrayForShowWrongAnswers?.reduce(
        (maximum, attempt) =>
          Math.max(maximum, attempt.numberOfWrongAnswers?.length ?? 0),
        0,
      ) ?? 0
    );
  }

  get ArrayOfNumberOfWrongAnswers() {
    const ArrayOfNumberOfWrongAnswers: any[] = [];
    this?.attemptData?.statistic?.ArrayForShowWrongAnswers.map(attempt => {
      ArrayOfNumberOfWrongAnswers.push({
        numberOfPasses: attempt?.numberOfPasses,
        numberOfWrongAnswers: attempt?.numberOfWrongAnswers?.length,
      });
    });
    return ArrayOfNumberOfWrongAnswers;
  }

  get loadingData() {
    return !this?.attemptData?.id;
  }

  get ShowStepByStepStatistic() {
    return (
      this.userStorage.userAccessLevel == 'ADMIN' ||
      this.userStorage.userAccessLevel == 'TEACHER'
    );
  }

  openedSteps = new Set();

  addOrRemoveOpenedSteps(index) {
    if (this.openedSteps.has(index)) {
      this.openedSteps.delete(index);
    } else {
      this.openedSteps.add(index);
    }
  }

  get dataForRow() {
    return {
      username: this?.attemptData?.userName,
      lastname: this?.attemptData?.authorizedUser?.userprofile?.lastname,
      firstname: this?.attemptData?.authorizedUser?.userprofile?.firstname,
      profileName:
        [
          this.attemptData?.authorizedUser?.userprofile?.firstname,
          this.attemptData?.authorizedUser?.userprofile?.lastname,
        ]
          .map(name => name?.trim())
          .filter(Boolean)
          .join(' ') || 'Не указаны',
      avatarSrc: this?.attemptData?.authorizedUser?.userprofile?.avatarSrc,
      isLogin: this?.attemptData?.isLogin ? 'да' : 'нет',
      numberOfPasses: this?.attemptData?.statistic?.numberOfPasses,
      arithmeticMeanNumberOfWrongAnswer:
        this?.arithmeticMeanNumberOfWrongAnswer,
      numberOfWrongAnswers: this?.numberOfWrongAnswers,
      arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints:
        this?.arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints,
      minAnswerPoint: this?.minAnswerPoint,
      questionID: this?.attemptData?.question?.id,
      attemptID: this?.attemptData?.id,
      ArrayForShowAnswerPoints:
        this?.attemptData?.statistic?.ArrayForShowAnswerPoints,
      ArrayOfNumberOfWrongAnswers: this.ArrayOfNumberOfWrongAnswers,
      ArrayForShowWrongAnswers:
        this?.attemptData?.statistic?.ArrayForShowWrongAnswers,
      passedQuestion: this,
      questionHasBeenCompleted: this?.attemptData?.questionHasBeenCompleted,
      SumOFPointsWithNewMethod: this?.SumOFPointsWithNewMethod,
      FormattedCreatedAt: this?.FormattedCreatedAt,
      QuestionTextForStatistic: this.QuestionTextForStatistic,
    };
  }
}

export const DetailStatisticStoreByIDObject = new DetailStatisticStoreByID();
export type DSSObjectType = typeof DetailStatisticStoreByIDObject;
export type rowType = (typeof DetailStatisticStoreByIDObject)['dataForRow'];
