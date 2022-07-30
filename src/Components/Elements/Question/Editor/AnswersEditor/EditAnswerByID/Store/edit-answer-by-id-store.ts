import {autorun, makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../../../../../Store/ApolloStorage/ClientStorage";
import {UserStorage} from "../../../../../../../Store/UserStore/UserStore";
import {CREATE_NEW_ANSWER_BASED_ON_DATA, LOAD_ANSWER_BY_ID, UPDATE_ANSWER} from "./Query";
import {AnswerHardLevelOfAnswer, AnswerNode, Mutation} from "../../../../../../../SchemaTypes";
import {
    object_properties_to_array_mapper,
    RemoveTypename
} from "../../../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import {computedFn} from "mobx-utils";
import {SERVER_BASE_URL} from "../../../../../../../settings";
import {QuestionEditorStorage} from "../../../QuestionEditor/Store/QuestionEditorStorage";
import axiosClient from "../../../../../../../ServerLayer/QueryLayer/config";

export class EditAnswerByIdStore {
    constructor(answer_id?: number) {
        makeAutoObservable(this)
        autorun(() => this.loadAnswerData())
        autorun(() => this.getImageUrlFromServer())
        reaction(() => toJS(this.answer_object), () => this.autoSave())
        reaction(() => this.answer_object?.isDeleted,
            () => this.removeOrAddAnswerIDForStatistic())
        reaction(() => this.answer_object?.isRequired,
            () => this.fillRequiredArray())
        reaction(() => this.answer_object?.onlyForExam,
            () => this.fillOnlyForExam())

        reaction(() => this.answer_object?.isImageDeleted,
            () => this.fakeAnswerIndexForUpdatePreview = this.fakeAnswerIndexForUpdatePreview + 1)


        if (answer_id) {
            this.answer_id = answer_id
        }

    }

    clientStorage = ClientStorage
    userStorage = UserStorage
    questionStore = QuestionEditorStorage
    answer_id?: number
    answer_object?: answer_data_object

    isAnswerDataLoaded = false
    isEditTextInSimpleMode = false

    //Работа с данными ответа----------------------------------------
    getField = computedFn((field_name: answer_object_field | number,
                           default_value: string | number | boolean | [] = "",
                           answer_object = this.answer_object) => {
        return (answer_object && answer_object[field_name]) ?
            answer_object[field_name] : default_value
    })

    changeField = (field: answer_object_field | number,
                   eventField: "value" | "checked" = "value",
                   answer_object = this.answer_object) => ({target}) => {
        if (answer_object && field in answer_object) {
            answer_object[field] = target[eventField]
        }
    }

    fillRequiredArray() {
        if (!toJS(this.answer_object)?.isDeleted) {
            this.questionStore.addOrDeleterRequiredAnswerID(
                this.answer_object?.isRequired,
                this.answer_object?.id)
        }
    }

    fillOnlyForExam() {
        if (!toJS(this.answer_object)?.isDeleted) {
            this.questionStore.addOrDeleteOnlyExamAnswersID(
                this.answer_object?.onlyForExam,
                this.answer_object?.id
            )
        }
    }

    get isTrue() {
        if (this.answer_object) {
            return String(this.answer_object?.isTrue)
        } else {
            return "true"
        }
    }

    changeIsRequired = () => {
        if (this.answer_object) {
            this.answer_object.isRequired = !this.answer_object.isRequired
        }
    }
    changeOnlyForExam = () => {
        if (this.answer_object) {
            this.answer_object.onlyForExam = !this.answer_object.onlyForExam
        }
    }

    changeIsTrue = () => {
        if (this.answer_object) {
            if (this.answer_object.isTrue == "true") {
                this.answer_object.isTrue = "false"
                this.changeBoilerPlateHelpText("false")
            } else {
                this.answer_object.isTrue = "true"
                this.changeBoilerPlateHelpText("true")

            }
        }
    }
    setHardLevel = (hardLevel: AnswerHardLevelOfAnswer) => {
        if (this.answer_object) {
            this.answer_object.hardLevelOfAnswer = hardLevel
        }
    }

    changeHardLevelSimpleMode = () => {
        if (this.answer_object) {
            const hardLevel = this.answer_object.hardLevelOfAnswer
            if (hardLevel == AnswerHardLevelOfAnswer.Easy) {
                this.setHardLevel(AnswerHardLevelOfAnswer.Medium)
            } else if (hardLevel == AnswerHardLevelOfAnswer.Medium) {
                this.setHardLevel(AnswerHardLevelOfAnswer.Hard)
            } else if (hardLevel == AnswerHardLevelOfAnswer.Hard) {
                this.setHardLevel(AnswerHardLevelOfAnswer.Easy)
            }
        }
    }

    removeOrAddAnswerIDForStatistic() {
        if (this.answer_object) {
            if (!!toJS(this.answer_object)?.isDeleted) {
                this.questionStore.removeAnswerID(this.answer_object.id)
            } else if (!toJS(this.answer_object)?.isDeleted) {
                this.questionStore.registerAnswerID(this.answer_object.id)
            }
        }
    }

    //Открыто ли окно в котором спрашивается, Уверены ли вы, что хотите удалить этот вопрос
    isOpenDeleteDialog = false

    edittextInSimpleMode = () => {
        this.isEditTextInSimpleMode = !this.isEditTextInSimpleMode
    }
    stopTextEditingInSimpleMode = () => {
        if (this.isEditTextInSimpleMode) {
            this.isEditTextInSimpleMode = !this.isEditTextInSimpleMode
        }
    }


    changeBoilerPlateHelpText = (isTrue: "true" | "false") => {
        for (let i of [1, 2, 3]) {
            if (this.answer_object) {
                const activeHelpText = this.answer_object["helpTextv" + i]
                if (isTrue !== "true") {
                    if (activeHelpText == "Ваш ответ следует дополнить" || activeHelpText == "") {
                        this.answer_object["helpTextv" + i] = "Вы допустили одну или более ошибок"
                    }
                } else {
                    if (activeHelpText == "Вы допустили одну или более ошибок" || activeHelpText == "") {
                        this.answer_object["helpTextv" + i] = "Ваш ответ следует дополнить"
                    }
                }
            }
        }
    }


    //----------------------------------------------------------------

    isOpenForEdit = false

    changeIsOpenForEdit = () => {
        this.isOpenForEdit = !this.isOpenForEdit
    }

    loadAnswerData = () => {
        if (this.answer_id && !this.isAnswerDataLoaded) {
            this.clientStorage.client.query({
                query: LOAD_ANSWER_BY_ID,
                fetchPolicy: "network-only",
                variables: {
                    answer_id: this.answer_id

                }
            })
                .then((response) => response.data.answerById)
                .then((answer_object) => {
                    const isTrue = String(answer_object.isTrue)
                    const question = answer_object.question.id
                    this.answer_object = {...answer_object, isTrue, question}
                    this.isAnswerDataLoaded = true
                })
                .catch((e) => console.log(e))
        }
    }

    isFirstLoadingIgnore = true
    //сохранен/не сохранен
    stateOfSave = true
    //Таймер для сохранения
    savingTimer: any

    //Функция для авто сохранений
    autoSave = () => {
        if (this.isFirstLoadingIgnore) {
            this.isFirstLoadingIgnore = false
        } else {
            if (this.answer_object) {
                this.stateOfSave = false
                clearTimeout(this.savingTimer)
                this.savingTimer = setTimeout(() => {
                    this.updateAnswerData()
                }, 1500)
            }
        }
    }

    updateAnswerData() {
        if (this.answer_object) {
            const rawAnswerObject = toJS(this.answer_object)
            this.clientStorage.client.mutate<Mutation>({
                mutation: UPDATE_ANSWER,
                variables: {
                    ...rawAnswerObject,
                    isTrue: rawAnswerObject.isTrue == "true"
                }
            })
                .then((response) => response?.data?.updateAnswer)
                .then((new_answer) => {
                    console.log(new_answer)
                    this.stateOfSave = true
                })
                .catch((e) => console.log(e))
        }
    }

    //Очередь проверки ----------------------------------------------------------------

    changeCheckQueue = (e) => {
        if (this.answer_object) {
            this.answer_object.checkQueue = e.target.value.replace(/[^\d]/g, '')
        }
    }

    //Изображение ----------------------------------------------------------------

    imageUrl = ''
    fakeAnswerIndexForUpdatePreview = 0


    getImageUrlFromServer() {
        if (this.answer_object) {
            fetch(SERVER_BASE_URL + "/files/answer?id=" + this.answer_object?.id)
                .then(response => response.json())
                .then(data => this.imageUrl = data[0].image)
                .then(() => this.fakeAnswerIndexForUpdatePreview = this.fakeAnswerIndexForUpdatePreview + 1)
                .catch(() => void (0))
        }
    }

    get imageName() {
        if (this.imageUrl === '') {
            return ('')
        }
        return (this.imageUrl.slice(68).split('?')[0])
    }

    updateImage(e) {
        const answer_id = this.answer_object?.id
        if (answer_id) {
            const formData = new FormData();
            console.log(e.target.files[0])
            formData.append('image', e.target.files[0]);
            formData.append('owner_answer', String(answer_id));
            fetch(
                SERVER_BASE_URL + '/files/answer?update_id=' + String(answer_id),
                {
                    method: 'POST',
                    body: formData
                })
                .then((response) => response.json())
                .then(() => {
                    this.getImageUrlFromServer()
                })
                .catch(() => {
                    this.getImageUrlFromServer()
                })

        }
    }

    deleteAnswer = () => {
        if (this.answer_object) {
            this.answer_object.isDeleted = true
        }
    }

    createNewAnswerBasedOnExist() {
        if (this.answer_object && this.answer_object.id) {
            const answer_object: answer_data_object_witch_out_id = toJS(this.answer_object)
            const objectForSave = {
                ...answer_object,
                isTrue: this.answer_object?.isTrue == "true"
            }

            delete objectForSave?.id;

            this.clientStorage.client.mutate<Mutation>({
                mutation: CREATE_NEW_ANSWER_BASED_ON_DATA,
                variables: {
                    ...objectForSave
                }
            })
                .then((response) => response?.data?.createAnswer)
                .then((answer) => {
                    if (answer?.answer?.id) {
                        this.questionStore.addCreatedAnswerToAnswersObjectArray(answer?.answer)

                    }

                })
        }
    }


    //----------------------------------------------------------------

    isShowAnswerPreview = false


    //------Сообщения о ошибках в ответах ----------------------------------------------------------

    answerErrorMessage: answerReportType[] = []

    loadAnswerErrorMessage = async () => {
        if (this.answer_id) {
            this.answerErrorMessage = await axiosClient.get('page/edit-answer-by-id/answer-report-by-id/' + this.answer_id).then((res) => res.data)
        }
    }

    isOpenAnswerErrorMessageDialog = false

    openAnswerErrorMessageDialog = () => {
        this.isOpenAnswerErrorMessageDialog = true
    }

    closeAnswerErrorMessageDialog = () => {
        this.isOpenAnswerErrorMessageDialog = false
    }
    updatingAnswerErrorMessageID: null | number = null

    updateAnswerErrorMessageID = async () => {
        await axiosClient.post('page/edit-answer-by-id/close-answer-report/' + this.updatingAnswerErrorMessageID)
            .then(() => this.errorMessageClosedSuccessArray.push(true))
            .catch(() => this.errorMessageClosedSuccessArray.push(false))
        this.updatingAnswerErrorMessageID = null
        this.loadAnswerErrorMessage()
    }

    onCloseAnswerReportClick = (answer_report_id) => {
        this.updatingAnswerErrorMessageID = answer_report_id
        this.updateAnswerErrorMessageID()
    }

    errorMessageClosedSuccessArray: boolean[] = []

    removeElementFromErrorMessageClosedSuccessArray = () => {
        this.errorMessageClosedSuccessArray.shift()
    }


}

type answerReportType = {
    id: number
    created_by_id: number
    answer_id: number
    text: string
    createdAt: string
    is_closed: string
    users_customuser: UsersCustomuser
}

interface UsersCustomuser {
    users_userprofile: UsersUserprofile
    username: string
}

interface UsersUserprofile {
    firstname: string
    lastname: string
}

type answer_data_with_wrong_is_true_type = object_properties_to_array_mapper<RemoveTypename<AnswerNode>>
export type answer_data_object = Omit<answer_data_with_wrong_is_true_type, "isTrue"> & { isTrue: "true" | "false" }
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type answer_data_object_witch_out_id = PartialBy<answer_data_object, "id">
export type answer_object_field = keyof answer_data_object
