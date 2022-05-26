import {makeAutoObservable, reaction, toJS} from "mobx";
import {sequenceDataI} from "../../../../../../ServerLayer/Types/question-sequence.type";
import {getQSByID, updateQS} from "../../../../../../ServerLayer/QueryLayer/question-sequence.query";
import {IQuestionPreviewData, QuestionAuthorI} from "../../../../../../ServerLayer/Types/question.type";
import {loadAllQuestions, loadQuestionAuthors} from "../../../../../../ServerLayer/QueryLayer/question.query";

class EditQuestionSequenceSoreClass {
    constructor() {
        makeAutoObservable(this)
        reaction(() => this.QuestionSequenceID, () => this.loadQSData())
        reaction(() => toJS(this.qsData), () => this.autoSave())
    }

    qsData?: sequenceDataI
    QuestionSequenceID = ""
    qsDataLoaded = false
    saveStatus = true
    questionAuthors: QuestionAuthorI[] = []
    allQuestions: IQuestionPreviewData[] = []
    selectedAuthorID = "-1"
    searchThemeString = ""
    checkQuestionID: string | null = null

    get QuestionsAfterSelectAuthor() {
        if (this.selectedAuthorID == "-1") {
            return this.allQuestions

        } else {
            return this.allQuestions.filter((questionObj) => questionObj.questionAuthor.id == this.selectedAuthorID)
        }
    }

    get QuestionThemes() {
        let themes = toJS(this.QuestionsAfterSelectAuthor.map((questionObj) => questionObj.themeString))
        themes = [...new Set(themes)]
        return themes.sort()
    }

    get QuestionsAfterThemesSearch() {
        if (!this.searchThemeString) {
            return this.QuestionsAfterSelectAuthor
        } else {
            return this.QuestionsAfterSelectAuthor
                .filter((question) => question.themeString.includes(this.searchThemeString))
        }
    }

    get QuestionsForSelect() {
        return this.QuestionsAfterThemesSearch
    }

    async loadQuestionAuthors() {
        this.questionAuthors = await loadQuestionAuthors()
    }


    async loadQSData() {
        if (this.QuestionSequenceID) {
            this.qsData = await getQSByID(this.QuestionSequenceID)
            this.qsDataLoaded = true
        }
    }

    async loadAllQuestions() {
        this.allQuestions = await loadAllQuestions()
    }

    async updateQSData() {
        this.saveStatus = false
        if (this.qsDataLoaded && this.qsData) {
            await updateQS(this.qsData)
            this.saveStatus = true
        }
    }

    changeQuestionSequenceID = (newID: string) => {
        this.QuestionSequenceID = newID
        this.qsDataLoaded = false

    }

    changeQSName = (e) => {
        if (this.qsData) {
            this.qsData.name = e.target.value
        }
    }

    changeQSDescription = (e) => {
        if (this.qsData) {
            this.qsData.description = e.target.value
        }
    }

    changeSelectedAuthorID = (e) => {
        this.selectedAuthorID = e.target.value
    }

    changeSearchThemeString = (e, value) => {
        this.searchThemeString = value
    }

    addSelectedQuestion = (questionID: string) => {
        if (this.qsData && this.qsData.sequence_data.sequence.indexOf(questionID) == -1) {
            this.qsData.sequence_data.sequence = [...this.qsData?.sequence_data?.sequence, questionID]
        }
    }

    removeSelectedQuestion = (questionIndex: string) => {
        if (this.qsData) {
            this.qsData?.sequence_data?.sequence.splice(questionIndex, 1)
        }
    }

    savingTimer: any

    //Функция для авто сохранений
    autoSave() {
        this.saveStatus = false
        clearTimeout(this.savingTimer)
        this.savingTimer = setTimeout(() => {
            this.updateQSData()
        }, 1500)
    }


}

const editQSStore = new EditQuestionSequenceSoreClass()

export default editQSStore
