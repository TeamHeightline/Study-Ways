import {autorun, makeAutoObservable, toJS} from "mobx";
import {ClientStorage} from "../../../../../../../Store/ApolloStorage/ClientStorage";
import {GET_QUESTION_TEXT_BY_ID, LOAD_ATTEMPTS_ID} from "./Query";
import {Query, QuestionNode} from "../../../../../../../SchemaTypes";

class SelectAttemptStoreS{
    constructor() {
        makeAutoObservable(this)
        autorun(() =>this.loadAttemptFromServer())
        autorun(()=> this.loadQuestionsTextFromServer())
        setInterval( () =>{this.loadAttemptFromServer()}, 7000)
    }
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    selectedQs?: number = undefined

    changeSelectedSQ(qs_id){
        this.selectedQs = qs_id
    }

    selectedQuestions: number[] | [] = []

    changeSelectedQuestions(newArray: number[]): void {
        this.selectedQuestions = newArray
    }

    todayTimeWithZeroHours(): Date{
        const actualTime = new Date(Date.now())
        actualTime.setHours(0,0,0,0)
        return(actualTime)
    }

    loadingAttempts = true
    page = 1
    userName = ""
    afterTime: Date = this.todayTimeWithZeroHours()
    onlyInExam = false
    onlyInQs = false

    specificQuestion: string  = "-1"
    totalPages: number = 1

    changePage = (e: any, value: number) =>{
        if(value){
            this.page = value
        }
    }

    changeSpecificQuestion = (e) => {
        this.specificQuestion = e.target.value
    }

    get QuestionArrayForSearch(){
        if(this.specificQuestion != "-1"){
            return [this.specificQuestion]
        }else{
            return(toJS(this.selectedQuestions))
        }
    }

    changeAfterTime = (newValue: Date | null) => {
        if(newValue){
            this.afterTime = (newValue);
        }
    };

    arrayForQuestionSelector: [] | QuestionNode[] = []


    loadQuestionsTextFromServer(){
        if(this.selectedQuestions){
            try{
                const promisesArray: Promise<QuestionNode>[] = []
                for (let question_id of this.selectedQuestions){
                    promisesArray.push(new Promise((resolve, reject) =>{
                        this.clientStorage.client.query<Query>({query: GET_QUESTION_TEXT_BY_ID, variables:{
                            id: question_id
                            }})
                            .then((response) => response.data.questionById)
                            .then((question_data) => {if(question_data){resolve(question_data)}})
                            .catch((error) => reject(error))
                    }))
                }
                Promise.all(promisesArray)
                    .then((data_for_question_selector) => this.arrayForQuestionSelector = data_for_question_selector)
            }catch (e) {
                console.log(e)
            }
        }
    }

    loadAttemptFromServer(){
        if(this.selectedQuestions){
            try{
                this.clientStorage.client.query({query: LOAD_ATTEMPTS_ID,
                    fetchPolicy: "network-only",
                    variables:{
                        page: this.page,
                        questions: this.QuestionArrayForSearch,
                        userName: this.userName,
                        afterTime: this.afterTime,
                        onlyInExam: this.onlyInExam,
                        onlyInQs: this.onlyInQs
                    }})
                    .then((response) =>{
                        if(response.data.detailStatIdArray.IDs){
                            this.attemptsForDisplay = response.data.detailStatIdArray.IDs

                            if(this.totalPages !=response.data.detailStatIdArray.numPages){
                                this.totalPages = response.data.detailStatIdArray.numPages
                            }

                            if(this.page != response.data.detailStatIdArray.activePage){
                                this.page = response.data.detailStatIdArray.activePage
                            }
                        }
                        this.loadingAttempts = false
                        })
            }catch (e) {
                console.log(e)
            }
        }
    }
    attemptsForDisplay: string[] | [] = []

    get selectedAttempts(){
        return(this.attemptsForDisplay)
    }
}

export const SASObject = new SelectAttemptStoreS()