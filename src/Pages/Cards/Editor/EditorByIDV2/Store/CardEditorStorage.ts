import {makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../../../Store/ApolloStorage/ClientStorage";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
import {
    GET_CARD_DATA_BY_ID,
    GET_CONNECTED_THEMES,
    GET_MY_CARD_AUTHOR,
    GET_QUESTION_TEXT_BY_ID,
    UPDATE_CARD
} from "./Struct";
import {
    CardAuthorNode,
    CardNode,
    Mutation,
    Query,
    QuestionNode,
    UnstructuredThemesNode
} from "../../../../../SchemaTypes";
import {computedFn} from "mobx-utils"
import {sort} from "fast-sort";
import {SERVER_BASE_URL} from "../../../../../settings";
import message from "antd/es/message";
import "js-video-url-parser/lib/provider/youtube";
import urlParser from "js-video-url-parser";
import axiosClient from "../../../../../ServerLayer/QueryLayer/config";
import haveStatus from "../../../../../Store/UserStore/utils/HaveStatus";


export type card_object_fields = keyof CardNode

class CardEditorStorage {
    constructor() {
        makeAutoObservable(this)
        reaction(() => this.getField("testInCard", ''), () => this.loadTestInCardText())
        reaction(() => this.getField("testBeforeCard", ''), () => this.loadTestBeforeCardText())
        reaction(() => toJS(this.card_object), () => this.autoSave())
        reaction(() => toJS(this.TagArray), () => this.autoSave())
    }

    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage
    //доступ к данным о пользователе, чтобы можно было проверять уровень доступа
    userStorage = UserStorage

    cardDataLoaded = false

    loadCardDataFromServer(id: string | number | undefined) {
        if (id) {
            this.cardDataLoaded = false
            if (haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])) {
                this.loadConnectedThemes()
                this.clientStorage.client.query({
                    query: GET_CARD_DATA_BY_ID, fetchPolicy: "network-only",
                    variables: {id: id}
                })
                    .then((response) => (response.data.cardById))
                    .then((card_data) => {

                        //--------для полей, содержащих массивы, делаем дополнительную загрузку уже только айдишников
                        const author = card_data?.author?.map((author) => author.id)
                        const connectedTheme = card_data?.connectedTheme?.map((theme: UnstructuredThemesNode) => theme.id)
                        //----------------------------------------------------------------

                        //-для объектов-----------------------------------
                        const cardBefore = card_data?.cardBefore?.id
                        const cardDown = card_data?.cardDown?.id
                        const cardNext = card_data?.cardNext?.id
                        const cardUp = card_data?.cardUp?.id
                        const testInCard = card_data.testInCard?.id
                        const testBeforeCard = card_data.testBeforeCard?.id

                        //----------------------------------------------------------------
                        this.card_object = {
                            ...card_data, connectedTheme, author, cardBefore, cardDown, cardNext,
                            cardUp, testInCard, testBeforeCard
                        }
                        this.cardDataLoaded = true
                        this.get_card_image()
                    })
            }
        }
    }

    //Таймер для сохранения
    savingTimer: any

    stateOfSave = true

    //Функция для авто сохранений
    autoSave() {
        if (this.card_object && this.card_object.id) {
            this.stateOfSave = false
            clearTimeout(this.savingTimer)
            this.savingTimer = setTimeout(() => {
                this.saveDataOnServer()
            }, 2000)
        }
    }

    saveDataOnServer(editor_context = this, card_object = this.card_object) {
        const data_object = toJS(card_object)
        if (haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])) {
            if (card_object) {
                try {
                    this.clientStorage.client.mutate<Mutation>({
                        mutation: UPDATE_CARD, variables: {
                            ...data_object,
                            tagField: toJS(editor_context.TagArray)?.join(","),
                            cardContentType: card_object?.cardContentType ? String(card_object?.cardContentType).slice(2, 3) : 0,
                            hardLevel: card_object?.hardLevel ? String(card_object?.hardLevel).slice(2, 3) : 0

                        }
                    })
                        .then((response) => {
                            this.stateOfSave = true
                            console.log(response)
                        })

                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    // ---------------------раздел работы с авторами карточек---------------------------------------
    all_my_card_authors: CardAuthorNode[] | undefined = undefined
    authorsDataLoaded = false

    loadCardAuthorsFromServer() {
        if (haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])) {
            this.clientStorage.client.query({query: GET_MY_CARD_AUTHOR, fetchPolicy: "network-only"})
                .then((response) => (response.data.me.cardauthorSet))
                .then((authors_data) => {
                    this.all_my_card_authors = authors_data
                    this.authorsDataLoaded = true
                })
        }
    }

    get allMyCardAuthors() {
        if (this.all_my_card_authors) {
            return (sort(toJS(this.all_my_card_authors ? this.all_my_card_authors : [])).desc((author) => author.id))
        }
    }

    //----------------------раздел работы с данными в самом редакторе ------------------------------

    card_object?: CardObjectForStore = undefined

    //Умный Getter позволяет получать кэшированные значения сразу для все полей объекта, принимает поле и дефолтное значение
    getField = computedFn((field_name: card_object_fields, default_value: string | number | boolean | [] = "",
                           card_object = this.card_object) => {
        return (card_object && card_object[field_name]) ? card_object[field_name] : default_value
    })
    //number в field - это грязный хак, чтобы не было ошибки из строчки с присвоением, как только TS видит что используются
    //конкретные ключи, начинает сразу говорить, что это never тип
    changeField = (field: card_object_fields | number, eventField: "value" | "checked" = "value",
                   card_object = this.card_object) => ({target}) => {
        if (card_object && field in card_object) {
            card_object[field] = target[eventField]
        }
    }

    changeFieldByValue(field: card_object_fields | number, value: string | number | boolean | string[] | undefined,
                       card_object = this.card_object) {
        if (card_object && field in card_object) {
            card_object[field] = value
        } else {
            throw "pass unexpected field to changeFieldByValue"
        }
    }

    //-----------------Работа с ссылкой на видео

    changeYoutubeUrl = (e) => {
        if (this.card_object && 'videoUrl' in this.card_object) {
            const parsed_url = urlParser.parse(e.target.value)
            const unified_url = urlParser.create({
                videoInfo: {
                    provider: parsed_url?.provider,
                    id: String(parsed_url?.id),
                    mediaType: parsed_url?.mediaType
                },
                params: {
                    start: parsed_url?.params?.start,

                }
            })
            this.card_object.videoUrl = unified_url
        }
    }


    //----------------------------------------------------------------
    urlValidation(arrow_url) {
        if (!arrow_url) {
            return true
        }
        try {
            const url = new URL(arrow_url);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    }

    validateUrlField = computedFn((fieldName: card_object_fields, card_object: CardObjectForStore | undefined = this.card_object) => {
        if (card_object && fieldName in card_object) {
            return (
                this.urlValidation(card_object[fieldName])
            )
        }
    })


    //---------------ИЗОБРАЖЕНИЕ КАРТОЧКИ----------------------------------------------

    //Ссылка на изображение
    image_url = ''
    update_image_counter = 0

    get fakeImageUrl() {
        return (this.image_url + "?" + this.update_image_counter)
    }

    //Загрузка изображения для карточки
    handleUploadImage(e, card_id) {
        const formData = new FormData();
        formData.append('image', e.file);
        formData.append('card', String(card_id));
        fetch(
            SERVER_BASE_URL + '/cardfiles/card?update_id=' + String(card_id),
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                this.update_image_counter = this.update_image_counter + 1
                // console.log('Success:', result);
                message.success(`${e.file.name} успешно загружен.`);
                this.image_url = result.image
            })
            .catch((error) => {
                console.error('Error:', error);
                message.error(`${e.file.name} не удалось загрузить`);
            });
    }

    //Получение с сервера изображения ------------------------------------------------
    get_card_image() {
        fetch(SERVER_BASE_URL + "/cardfiles/card?id=" + String(this?.card_object?.id))
            .then((response) => response.json())
            .then((data) => {
                try {
                    this.update_image_counter = this.update_image_counter + 1
                    // console.log(data)
                    this.image_url = data[0].image
                } catch (e) {
                    console.log(e)
                }
            })
    }

    //----------------------------------------------------------------
    //Теги
    get CheckThatTagFieldNotEmpty() {
        return (this.card_object?.tagField && this.card_object?.tagField?.length !== 1
            && this?.card_object?.tagField[0] !== "")
    }

    get DefaultTagValue(): string[] | undefined {
        return this.CheckThatTagFieldNotEmpty ?
            this.getField("tagField", []).split(",") : []
    }

    updateTagField(newValue) {
        this.TagArray = newValue
    }

    TagArray?: string[] = undefined

    //----------------------------------------------------------------
    //Валидация ссылки
    get UrlValidation() {
        if (this.getField("siteUrl", "").length == 0) {
            return true
        } else {
            let url;

            try {
                url = new URL(this.getField("siteUrl", ""));
            } catch (_) {
                return false;
            }

            return url.protocol === "http:" || url.protocol === "https:";
        }
    }

    //----------------------------------------------------------------
    //Работа с объединенными темами
    allConnectedThemes?: UnstructuredThemesNode[] = []
    isAllConnectedThemesLoaded = false

    loadConnectedThemes(useCache = true) {
        this.clientStorage.client.query({
            query: GET_CONNECTED_THEMES,
            fetchPolicy: useCache ? "cache-first" : "network-only"
        })
            .then((response) => (response.data.unstructuredTheme))
            .then((connectedThemes) => {
                this.allConnectedThemes = connectedThemes
                this.isAllConnectedThemesLoaded = true
                if (useCache) {
                    this.loadConnectedThemes(false)
                }
            })
    }

    get connectedThemesForSelector() {
        return toJS(this.allConnectedThemes)
            ?.map((theme) => {
                return ({
                    id: theme.id,
                    value: theme.id,
                    title: theme.text,
                    pId: theme?.parent?.id || 0
                })
            })
    }

    //--------Работа с тестом перед и в карточки-----------------
    testInCardData?: QuestionNode | null = undefined

    loadTestInCardText() {
        if (haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])) {
            if (this.getField("testInCard", '')) {
                try {
                    this.clientStorage.client.query<Query>({
                        query: GET_QUESTION_TEXT_BY_ID, variables: {
                            id: this.getField("testInCard", '')
                        }
                    })
                        .then((response) => response.data.questionById)
                        .then((question) => this.testInCardData = question)

                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    testBeforeCardData?: QuestionNode | null = undefined

    loadTestBeforeCardText() {
        if (haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])) {
            if (this.getField("testBeforeCard", '')) {
                try {
                    this.clientStorage.client.query<Query>({
                        query: GET_QUESTION_TEXT_BY_ID, variables: {
                            id: this.getField("testBeforeCard", '')
                        }
                    })
                        .then((response) => response.data.questionById)
                        .then((question) => this.testBeforeCardData = question)

                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    //-------Работа с выбором карточки --------------------
    arrowForCardIsSelecting: "" | "cardBefore" | "cardDown" | "cardNext" | "cardUp" = ""

    onStartSelectCard = (card_direction: "cardBefore" | "cardDown" | "cardNext" | "cardUp") => {
        this.arrowForCardIsSelecting = card_direction
    }
    onCloseSelectCard = () => {
        this.arrowForCardIsSelecting = ""
    }
    onCardSelect = (card_id: number) => {
        if (this.arrowForCardIsSelecting !== "") {
            this.changeFieldByValue(this.arrowForCardIsSelecting, card_id)
        }
        this.onCloseSelectCard()
    }


    //-------Работа с созданием копии --------------------

    isOpenCopyCardDialog = false

    openCopyCardDialog = () => {
        this.isOpenCopyCardDialog = true
    }
    closeCopyCardDialog = () => {
        this.isOpenCopyCardDialog = false
    }

    isPendingCreateCopy = false

    createCopyCard = async () => {
        if (!!this?.card_object?.id) {
            this.isPendingCreateCopy = true
            const copyCard = await axiosClient.post("/page/edit-card-by-id/create-card-copy/" + this.card_object.id)
            this.isPendingCreateCopy = false
            this.isOpenCopyCardDialog = false
            return copyCard

        }
    }

}

//Мапер, который удаляет из типа __typename, для стрелок, которые являются массивами Card Node, делает тип string, для
//объектов, которые являются темами, авторами и тд, делает массив строк, чтобы хранить ID[]
export type RemoveTypename<O> = Omit<O, "__typename">
export type object_properties_to_array_mapper<MainObject> = {
    [Field in keyof MainObject]: MainObject[Field] extends object ?
        MainObject[Field] extends Array<MainObject> ?
            string :
            string[]
        : MainObject[Field]
}
type CardObjectForStore = object_properties_to_array_mapper<RemoveTypename<CardNode>>
export const CESObject = new CardEditorStorage()
