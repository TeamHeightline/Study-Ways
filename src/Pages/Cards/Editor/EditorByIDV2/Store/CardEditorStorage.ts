import { makeAutoObservable, reaction, toJS } from "mobx";
import { ClientStorage } from "../../../../../Shared/Store/ApolloStorage/ClientStorage";
import {
  GET_CONNECTED_THEMES,
  GET_MY_CARD_AUTHOR,
  GET_QUESTION_TEXT_BY_ID,
  UPDATE_CARD,
} from "./Struct";
import {
  CardAuthorNode,
  Mutation,
  Query,
  QuestionNode,
  UnstructuredThemesNode,
} from "../../../../../SchemaTypes";
import { computedFn } from "mobx-utils";
import { SERVER_BASE_URL } from "../../../../../settings";
import message from "antd/es/message";
import "js-video-url-parser/lib/provider/youtube";
import urlParser from "js-video-url-parser";
import axiosClient from "../../../../../Shared/ServerLayer/QueryLayer/config";
import haveStatus from "../../../../../Shared/Store/UserStore/utils/HaveStatus";
import { getCardData } from "../API/get-card-data";
import { ICardDataInStore } from "../TYPES/card-data-in-store";
import { saveCard } from "../API/save-card";

class CardEditorStorage {
  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.getField("test_in_card_id", ""),
      () => this.loadTestInCardText(),
    );
    reaction(
      () => this.getField("test_before_card_id", ""),
      () => this.loadTestBeforeCardText(),
    );
    reaction(
      () => toJS(this.card_object),
      () => this.autoSave(),
    );
    reaction(
      () => toJS(this.TagArray),
      () => this.autoSave(),
    );
  }

  // Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
  clientStorage = ClientStorage;

  cardDataLoaded = false;

  loadCardDataFromServer(id: string | number | undefined) {
    if (id) {
      this.cardDataLoaded = false;
      if (haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])) {
        this.loadConnectedThemes();

        getCardData(Number(id)).then((card_data) => {
          // ----- достаем id тем через промежуточную таблицу
          const connectedTheme = card_data?.cards_card_connected_theme?.map(
            (theme) => theme.unstructuredtheme_id,
          );
          // ----------------------------------------------------------------

          this.card_object = { ...card_data, connectedTheme };
          this.cardDataLoaded = true;
          this.get_card_image();
        });
      }
    }
  }

  // Таймер для сохранения
  savingTimer: any;

  stateOfSave = true;

  // Функция для авто сохранений
  autoSave() {
    if (this.card_object && this.card_object.id) {
      this.stateOfSave = false;
      clearTimeout(this.savingTimer);
      this.savingTimer = setTimeout(() => {
        // TODO заблочено на время переписывания работы с данными
        this.saveDataOnServer();
      }, 2000);
    }
  }

  saveDataOnServer(editor_context = this, card_object = this.card_object) {
    const data_object = toJS(card_object);
    if (!haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"]) || !data_object) {
      return;
    }
    saveCard(data_object)
      .then((response) => {
        this.stateOfSave = true;
        axiosClient.post("/page/edit-card-by-id/clear-card-cache");
      })
      .catch(console.log);
  }

  // ---------------------раздел работы с авторами карточек---------------------------------------
  all_my_card_authors: CardAuthorNode[] | undefined = undefined;
  authorsDataLoaded = false;

  loadCardAuthorsFromServer() {
    if (haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])) {
      this.clientStorage.client
        .query({ query: GET_MY_CARD_AUTHOR, fetchPolicy: "network-only" })
        .then((response) => response.data.me.cardauthorSet)
        .then((authors_data) => {
          this.all_my_card_authors = authors_data;
          this.authorsDataLoaded = true;
        });
    }
  }

  // ----------------------раздел работы с данными в самом редакторе ------------------------------

  card_object?: ICardDataInStore;

  // Умный Getter позволяет получать кэшированные значения сразу для все полей объекта, принимает поле и дефолтное значение
  getField = computedFn(
    (
      field_name: keyof ICardDataInStore,
      default_value: string | number | boolean | [] = "",
      card_object = this.card_object,
    ) => card_object?.[field_name] ?? default_value,
  );
  // number в field - это грязный хак, чтобы не было ошибки из строчки с присвоением, как только TS видит что используются
  // конкретные ключи, начинает сразу говорить, что это never тип
  changeField =
    (
      field: keyof ICardDataInStore | number,
      eventField: "value" | "checked" = "value",
      card_object = this.card_object,
    ) =>
    ({ target }) => {
      if (card_object && field in card_object) {
        card_object[field] = target[eventField];
      }
    };

  changeFieldByValue(
    field: keyof ICardDataInStore | number,
    value: string | number | boolean | string[] | undefined | null,
    card_object = this.card_object,
  ) {
    if (card_object && field in card_object) {
      card_object[field] = value;
    } else {
      throw "pass unexpected field to changeFieldByValue";
    }
  }

  // -----------------Работа со ссылкой на видео

  changeYoutubeUrl = (e) => {
    if (this.card_object && "videoUrl" in this.card_object) {
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
  image_url = "";
  update_image_counter = 0;

  get fakeImageUrl() {
    return `${this.image_url}?${this.update_image_counter}`;
  }

  // Загрузка изображения для карточки
  handleUploadImage(e, card_id) {
    const formData = new FormData();
    formData.append("image", e.file);
    formData.append("card", String(card_id));
    fetch(`${SERVER_BASE_URL}/cardfiles/card?update_id=${String(card_id)}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        this.update_image_counter = this.update_image_counter + 1;
        // console.log('Success:', result);
        message.success(`${e.file.name} успешно загружен.`);
        this.image_url = result.image;
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error(`${e.file.name} не удалось загрузить`);
      });
  }

  // Получение с сервера изображения ------------------------------------------------
  get_card_image() {
    fetch(
      `${SERVER_BASE_URL}/cardfiles/card?id=${String(this?.card_object?.id)}`,
    )
      .then((response) => response.json())
      .then((data) => {
        try {
          this.update_image_counter = this.update_image_counter + 1;
          // console.log(data)
          this.image_url = data[0].image;
        } catch (e) {
          console.log(e);
        }
      });
  }

  // ----------------------------------------------------------------

  TagArray?: string[] = undefined;

  // ----------------------------------------------------------------
  // Валидация ссылки
  get UrlValidation() {
    if (this.getField("site_url", "").length == 0) {
      return true;
    } else {
      let url;

      try {
        url = new URL(this.getField("site_url", ""));
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    }
  }

  // ----------------------------------------------------------------
  // Работа с объединенными темами
  allConnectedThemes?: UnstructuredThemesNode[] = [];
  isAllConnectedThemesLoaded = false;

  loadConnectedThemes(useCache = true) {
    this.clientStorage.client
      .query({
        query: GET_CONNECTED_THEMES,
        fetchPolicy: useCache ? "cache-first" : "network-only",
      })
      .then((response) => response.data.unstructuredTheme)
      .then((connectedThemes) => {
        this.allConnectedThemes = connectedThemes;
        this.isAllConnectedThemesLoaded = true;
        if (useCache) {
          this.loadConnectedThemes(false);
        }
      });
  }

  get connectedThemesForSelector() {
    return toJS(this.allConnectedThemes)?.map((theme) => ({
      id: theme.id,
      value: theme.id,
      title: theme.text,
      pId: theme?.parent?.id || 0,
    }));
  }

  // --------Работа с тестом перед и в карточки-----------------
  testInCardData?: QuestionNode | null = undefined;

  loadTestInCardText() {
    if (haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])) {
      if (this.getField("test_in_card_id", "")) {
        try {
          this.clientStorage.client
            .query<Query>({
              query: GET_QUESTION_TEXT_BY_ID,
              variables: {
                id: this.getField("test_in_card_id", ""),
              },
            })
            .then((response) => response.data.questionById)
            .then((question) => (this.testInCardData = question));
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  testBeforeCardData?: QuestionNode | null = undefined;

  loadTestBeforeCardText() {
    if (haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])) {
      if (this.getField("test_before_card_id", "")) {
        try {
          this.clientStorage.client
            .query<Query>({
              query: GET_QUESTION_TEXT_BY_ID,
              variables: {
                id: this.getField("test_before_card_id", ""),
              },
            })
            .then((response) => response.data.questionById)
            .then((question) => (this.testBeforeCardData = question));
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  // -------Работа с выбором карточки --------------------
  arrowForCardIsSelecting:
    | ""
    | "card_before_id"
    | "card_down_id"
    | "card_next_id"
    | "card_up_id" = "";

  onStartSelectCard = (
    card_direction:
      | "card_before_id"
      | "card_down_id"
      | "card_next_id"
      | "card_up_id",
  ) => {
    this.arrowForCardIsSelecting = card_direction;
  };
  onCloseSelectCard = () => {
    this.arrowForCardIsSelecting = "";
  };
  onCardSelect = (card_id: number) => {
    if (this.arrowForCardIsSelecting !== "") {
      this.changeFieldByValue(this.arrowForCardIsSelecting, card_id);
    }
    this.onCloseSelectCard();
  };

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
    if (this?.card_object?.id) {
      this.isPendingCreateCopy = true;
      // / TODO разобраться с темами и проверить работоспособность в целом
      const copyCard = await axiosClient.post(
        `/page/edit-card-by-id/create-card-copy/${this.card_object.id}`,
      );
      this.isPendingCreateCopy = false;
      this.isOpenCopyCardDialog = false;
      return copyCard;
    }
  };
}

// Мапер, который удаляет из типа __typename, для стрелок, которые являются массивами Card Node, делает тип string, для
// объектов, которые являются темами, авторами и тд, делает массив строк, чтобы хранить ID[]
export type RemoveTypename<O> = Omit<O, "__typename">;
export type object_properties_to_array_mapper<MainObject> = {
  [Field in keyof MainObject]: MainObject[Field] extends object
    ? MainObject[Field] extends Array<MainObject>
      ? string
      : string[]
    : MainObject[Field];
};
export const CESObject = new CardEditorStorage();
