import { action, makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import { computedFn } from 'mobx-utils';
import { SERVER_BASE_URL } from '../../../../../settings';
import message from 'antd/es/message';
import 'js-video-url-parser/lib/provider/youtube';
import urlParser from 'js-video-url-parser';
import { executeMutation } from '../../../../../Shared/ServerLayer/QueryLayer/execute-mutation';
import { writeApi } from '../../../../../Shared/ServerLayer/QueryLayer/write-api';
import { FILE_URL } from '../../../../../settings';
import haveStatus from '../../../../../Shared/Store/UserStore/utils/HaveStatus';
import { getCardData } from '../API/get-card-data';
import { ICardDataInStore } from '../TYPES/card-data-in-store';
import { saveCard } from '../API/save-card';
export class CardEditorStorage {
  constructor() {
    makeAutoObservable(this, { invalidateCardData: false });
    reaction(
      () => toJS(this.card_object),
      (current, previous) => {
        if (current && previous) this.autoSave();
      },
    );
    reaction(
      () => toJS(this.TagArray),
      () => this.autoSave(),
    );
  }

  invalidateCardData?: (id: number) => unknown;
  cardDataLoaded = false;
  cardLoadError = false;
  private loadRequest = 0;
  private editVersion = 0;
  async loadCardDataFromServer(id: string | number | undefined) {
    if (!id || !haveStatus(['ADMIN', 'TEACHER', 'CARD_EDITOR'])) return;
    const request = ++this.loadRequest;
    clearTimeout(this.savingTimer);
    this.cardDataLoaded = false;
    this.cardLoadError = false;
    this.hasSaveError = false;
    this.stateOfSave = true;
    this.card_object = undefined;
    this.image_url = '';
    try {
      const cardData = await getCardData(Number(id));
      if (request !== this.loadRequest) return;
      if (!cardData?.id) throw new Error('Card not found');
      const connectedTheme =
        cardData.cards_card_connected_theme?.map(
          theme => theme.unstructuredtheme_id,
        ) || [];
      runInAction(() => {
        this.card_object = {
          ...cardData,
          connectedTheme,
        };
        this.cardDataLoaded = true;
      });
      this.get_card_image();
    } catch {
      runInAction(() => {
        if (request === this.loadRequest) this.cardLoadError = true;
      });
    }
  }

  // Таймер для сохранения
  savingTimer: any;
  stateOfSave = true;
  hasSaveError = false;
  autoSave() {
    if (!this.cardDataLoaded || !this.card_object?.id) return;
    this.editVersion += 1;
    this.hasSaveError = false;
    this.stateOfSave = false;
    clearTimeout(this.savingTimer);
    this.savingTimer = setTimeout(() => this.saveDataOnServer(), 2000);
  }
  saveDataOnServer(editor_context = this, card_object = this.card_object) {
    const data = toJS(card_object);
    if (!haveStatus(['ADMIN', 'TEACHER', 'CARD_EDITOR']) || !data) return;
    const version = this.editVersion;
    this.hasSaveError = false;
    this.stateOfSave = false;
    return saveCard(data)
      .then(
        action(() => {
          if (this.card_object?.id === data.id && version === this.editVersion)
            this.stateOfSave = true;
          this.invalidateCardData?.(Number(data.id));
        }),
      )
      .catch(
        action(() => {
          if (this.card_object?.id === data.id && version === this.editVersion)
            this.hasSaveError = true;
        }),
      );
  }

  // ----------------------раздел работы с данными в самом редакторе ------------------------------

  card_object?: ICardDataInStore;

  // Умный Getter позволяет получать кэшированные значения сразу для все полей объекта, принимает поле и дефолтное значение
  getField = computedFn(
    (
      field_name: keyof ICardDataInStore,
      default_value: string | number | boolean | [] = '',
      card_object = this.card_object,
    ) => card_object?.[field_name] ?? default_value,
  );
  // number в field - это грязный хак, чтобы не было ошибки из строчки с присвоением, как только TS видит что используются
  // конкретные ключи, начинает сразу говорить, что это never тип
  changeField = (
    field: keyof ICardDataInStore | number,
    eventField: 'value' | 'checked' = 'value',
    card_object = this.card_object,
  ) =>
    action(({ target }) => {
      if (card_object && field in card_object) {
        card_object[field] = target[eventField];
      }
    });
  changeFieldByValue(
    field: keyof ICardDataInStore | number,
    value: string | number | boolean | string[] | undefined | null,
    card_object = this.card_object,
  ) {
    if (card_object && field in card_object) {
      card_object[field] = value;
    } else {
      throw 'pass unexpected field to changeFieldByValue';
    }
  }

  // -----------------Работа со ссылкой на видео

  changeYoutubeUrl = e => {
    if (this.card_object && 'videoUrl' in this.card_object) {
      const parsed_url = urlParser.parse(e.target.value);
      const unified_url = urlParser.create({
        videoInfo: {
          provider: parsed_url?.provider,
          id: String(parsed_url?.id),
          mediaType: parsed_url?.mediaType,
        },
        params: {
          start: parsed_url?.params?.start,
        },
      });
      this.card_object.videoUrl = unified_url;
    }
  };

  // ---------------ИЗОБРАЖЕНИЕ КАРТОЧКИ----------------------------------------------

  // Ссылка на изображение
  image_url = '';
  update_image_counter = 0;
  get fakeImageUrl() {
    return `${this.image_url}?${this.update_image_counter}`;
  }

  // Загрузка изображения для карточки
  handleUploadImage(e, card_id) {
    executeMutation(
      writeApi.endpoints.uploadMaterialImage.initiate({
        kind: 'card',
        id: Number(card_id),
        file: e.file,
      }),
    )
      .then(
        action(result => {
          this.update_image_counter = this.update_image_counter + 1;
          // console.log('Success:', result);
          message.success(`${e.file.name} успешно загружен.`);
          this.image_url = `${FILE_URL}/${result.image}`;
          this.invalidateCardData?.(Number(card_id));
        }),
      )
      .catch(
        action(error => {
          console.error('Error:', error);
          message.error(`${e.file.name} не удалось загрузить`);
        }),
      );
  }

  // Получение с сервера изображения ------------------------------------------------
  get_card_image() {
    const id = this.card_object?.id;
    fetch(`${SERVER_BASE_URL}/cardfiles/card?id=${id}`)
      .then(response => response.json())
      .then(
        action(data => {
          if (this.card_object?.id !== id) return;
          this.update_image_counter += 1;
          this.image_url = data?.[0]?.image || '';
        }),
      )
      .catch(
        action(() => {
          if (this.card_object?.id === id) this.image_url = '';
        }),
      );
  }

  // ----------------------------------------------------------------

  TagArray?: string[] = undefined;

  // ----------------------------------------------------------------
  // Валидация ссылки
  get UrlValidation() {
    if (this.getField('site_url', '').length == 0) {
      return true;
    } else {
      let url;
      try {
        url = new URL(this.getField('site_url', ''));
      } catch (_) {
        return false;
      }
      return url.protocol === 'http:' || url.protocol === 'https:';
    }
  }

  // ----------------------------------------------------------------
  // -------Работа с созданием копии --------------------

  isOpenCopyCardDialog = false;
  openCopyCardDialog = () => {
    this.isOpenCopyCardDialog = true;
  };
  closeCopyCardDialog = () => {
    this.isOpenCopyCardDialog = false;
  };
  isPendingCreateCopy = false;
  createCopyCard = async () => {
    if (!this.card_object?.id) return;
    this.isPendingCreateCopy = true;
    try {
      const card = await executeMutation(
        writeApi.endpoints.copyCard.initiate(Number(this.card_object.id)),
      );
      return { data: card };
    } finally {
      runInAction(() => {
        this.isPendingCreateCopy = false;
      });
    }
  };
}

// Мапер, который удаляет из типа __typename, для стрелок, которые являются массивами Card Node, делает тип string, для
// объектов, которые являются темами, авторами и тд, делает массив строк, чтобы хранить ID[]
export type RemoveTypename<O> = Omit<O, '__typename'>;
export type object_properties_to_array_mapper<MainObject> = {
  [Field in keyof MainObject]: MainObject[Field] extends object
    ? MainObject[Field] extends Array<MainObject>
      ? string
      : string[]
    : MainObject[Field];
};
export const CESObject = new CardEditorStorage();
