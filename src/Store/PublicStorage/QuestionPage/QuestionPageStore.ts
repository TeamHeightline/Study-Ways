import {action, computed, makeObservable, observable, toJS} from "mobx";
import {ClientStorage} from "../../ApolloStorage/ClientStorage";
import {GET_ALL_QUESTIONS} from "./Struct";
import {some} from "lodash";
import {Maybe, QuestionNode, QuestionThemesNode} from "../../../SchemaTypes";
import {sort} from "fast-sort";

class QuestionPage {
    constructor() {
        makeObservable(this, {
            questionsData: observable,
            clientStorage: observable,
            useSearchByThemeOrAuthor: observable,
            selectedAuthorID: observable,
            dataHasBeenDelivered: observable,
            selectedThemeID: observable,
            selectedQuestionID: observable,
            helpLevel: observable,
            isOpenQuestionPlayer: observable,

            changeSelectedTheme: action,
            closeQuestion: action,
            startQuestion: action,
            changeHelpLevel: action,
            getQuestionData: action,
            changeSelectedAuthorID: action,
            changeUseSearchByThemeOrAuthor: action,

            //включаем keepAlive, чтобы при переключение на другие страницы или запуске вопроса,
            //настройки не слетали
            authorsForSelect: computed({keepAlive: true}),
            QuestionsAfterAuthorSelection: computed({keepAlive: true}),
            themesForSelect: computed({keepAlive: true}),
            QuestionsAfterSelectTheme: computed({keepAlive: true}),
        })
    }

    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    //Данные обо всех вопросах
    questionsData: Maybe<QuestionNode>[] = []

    //Флаг, предназначенный отслеживать момент, когда данные придут с сервера
    dataHasBeenDelivered = false

    //Открыт ли в этот момент проигрыватель вопроса
    isOpenQuestionPlayer = false

    //ID выбранного вопроса
    selectedQuestionID = 0

    //Уровень сложности подсказок
    helpLevel = "0"

    //Функция для изменения ID вопроса
    changeSelectedQuestionID = (e) => {
        this.selectedQuestionID = e.target.value
    }

    //
    changeHelpLevel(newLevel) {
        this.helpLevel = newLevel
    }

    //Функция, чтобы вернуться в меню выбора вопроса
    closeQuestion() {
        this.isOpenQuestionPlayer = false
    }

    //Функция, чтобы начать выполнять вопрос
    startQuestion = () => {
        this.isOpenQuestionPlayer = true
    }

    //функция для получения всех данных о вопросе
    getQuestionData() {

        //Функция для удаления вопросов, которые называются "Новый вопрос"
        function removeQuestionsTatNotFilled(questions: Maybe<QuestionNode>[]) {
            const questionsCopyWitchoutUnfilledQuestions: Maybe<QuestionNode>[] = []
            questions?.map((question) => {
                if (question?.text !== "Новый вопрос") {
                    questionsCopyWitchoutUnfilledQuestions.push(question)
                }
            })
            return (questionsCopyWitchoutUnfilledQuestions)
        }

        this.clientStorage.client.query({query: GET_ALL_QUESTIONS, fetchPolicy: "network-only"})
            .then((response) => {
                this.questionsData = removeQuestionsTatNotFilled(response.data.question)
                this.dataHasBeenDelivered = true
            })
    }

    //Использовать ли фильтрацию по темам и авторам
    useSearchByThemeOrAuthor = false

    //Handle функция для useSearchByThemeOrAuthor
    changeUseSearchByThemeOrAuthor = (e) => {
        this.useSearchByThemeOrAuthor = e.target.checked
    }

    //Вычисляет авторов для фильтрации
    get authorsForSelect() {
        if (!this.dataHasBeenDelivered) {
            return []
        }
        const authors: any = []
        toJS(this.questionsData).map((sameQuestion) => {
            sameQuestion?.author.map(async (sameAuthor) => {
                if (!some(authors, sameAuthor)) {
                    authors.push(sameAuthor)
                }
            })
        })
        this.selectedAuthorID = authors[0].id
        return (authors)
    }

    //ID выбранного автора
    selectedAuthorID = 0

    //Handle функция для изменения ID автора
    changeSelectedAuthorID = (e) => {
        this.selectedAuthorID = e.target.value
        console.log(this.selectedAuthorID)
    }

    //Карточки, оставшиеся после первого уровня фильтрации
    get QuestionsAfterAuthorSelection() {
        if (!this.dataHasBeenDelivered) {
            return []
        }
        const questionsAfterSelectedAuthor: any = []
        toJS(this.questionsData)?.map((sameQuestion) => {
            let newQuestionHasBeenAddedToArray = false
            sameQuestion?.author?.forEach((sameAuthor) => {
                if (!newQuestionHasBeenAddedToArray && Number(sameAuthor?.id) === Number(this.selectedAuthorID)) {
                    questionsAfterSelectedAuthor.push(sameQuestion)
                    newQuestionHasBeenAddedToArray = true
                }
            })
        })
        return (questionsAfterSelectedAuthor)
    }

    get themesForSelect() {
        if (!this.dataHasBeenDelivered) {
            return []
        }

        const themesArray: Array<QuestionThemesNode> = []
        const themesIDArray = new Set()
        toJS(this.QuestionsAfterAuthorSelection)?.map((question) => {
            question.theme.map((sameTheme) => {
                if (!themesIDArray.has(sameTheme.id)) {
                    themesArray.push(sameTheme)
                    themesIDArray.add(sameTheme.id)
                }
            })
        })
        this.selectedThemeID = Number(sort(themesArray).asc((theme) => theme.name)[0]?.id)
        return (sort(themesArray).asc((theme) => theme.name))
    }

    //ID выбранной темы
    selectedThemeID = 0

    //Функция для изменения выбранной темы
    changeSelectedTheme = (e) => {
        this.selectedThemeID = e.target.value
    }

    //Вопросы после выборе темы (вопросы оставшиеся после всех фильтраций)
    get QuestionsAfterSelectTheme() {
        if (!this.dataHasBeenDelivered) {
            return []
        }
        if (!this.useSearchByThemeOrAuthor) {
            this.selectedQuestionID = Number(toJS(this.questionsData)[0]?.id)
            return toJS(this.questionsData)
        }
        const QuestionAfterThemeSelectIDArray = new Set()
        const QuestionAfterThemeSelect: Array<QuestionNode> = []
        this.QuestionsAfterAuthorSelection.map((sameQuestion) => {
            sameQuestion.theme.map((sameTheme) => {
                if (Number(sameTheme.id) === Number(this.selectedThemeID) &&
                    !QuestionAfterThemeSelectIDArray.has(sameQuestion.id)) {
                    QuestionAfterThemeSelect.push(sameQuestion)
                }
            })
        })
        this.selectedQuestionID = Number(QuestionAfterThemeSelect[0].id)
        return QuestionAfterThemeSelect
    }
}

export const QuestionPageStorage = new QuestionPage()