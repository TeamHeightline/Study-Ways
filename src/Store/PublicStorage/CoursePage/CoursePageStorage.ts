import {action, autorun, computed, makeObservable, observable, toJS} from "mobx";
import {ClientStorage} from "../../ApolloStorage/ClientStorage";
import {GET_ALL_COURSE} from "./Struct";
import {CardCourseNode, Maybe} from "../../../../SchemaTypes";
import {sort} from "fast-sort";

class CoursePage{
    constructor() {
        makeObservable(this,{
            clientStorage: observable ,
            courseArr: observable,
            positionData: observable,
            selectedCardID: observable,
            dataHasBeenGot: observable,
            isOpenCard: observable,
            get_course_data: action,
            get_card_id_by_position: action,
            inCardButtonClickedHandler: action,
            cardSelectInCourseByMouseClick: action,
            goBackButtonHandler: action,
            disabledNext: computed,
            disabledBack: computed,
            disabledUp: computed,
            disabledDown: computed
        })
        autorun(() => this.get_course_data())
    }
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    //Массив всех курсов
    courseArr:  Maybe<CardCourseNode>[] | any[]  = []

    //Позиция карточки, которая выбрана в данный момент
    positionData = {
        courseIndex: 0,
        row: 0,
        fragment: 0,
        buttonIndex: 0,
        courseID: 0
    }

    //ID выбранной карточки
    selectedCardID = 0

    //Выбрал ли пользователь карточку, чтобы просмотреть или находится в главном меню курсов
    isOpenCard = false

    //Успел ли клиент получить все данные с сервера
    dataHasBeenGot = false
    //action для получения всех данных о !курсах! и записывание их в courseArr
    get_course_data(){
        this.clientStorage.client.query({query: GET_ALL_COURSE})
            .then((data) => {
                    //используем сортировку для того, чтобы поставить все курсы в порядке ID
                    this.courseArr = sort(data?.data?.cardCourse).desc((c: any) => c?.id)
                    //Устанавливаем флаг о том, что все данные получены
                    this.dataHasBeenGot = true
            })
    }
    //парсит courseArr для получения id конкретной карточки в опрделенной позиции
    get_card_id_by_position(cardPositionData, stepRight = 0, stepUp = 0){
        if(cardPositionData.buttonIndex + stepRight >= 0 && cardPositionData.buttonIndex + stepRight <= 11 &&
            Number(cardPositionData.row) + stepUp >= 0 && Number(cardPositionData.row) + stepUp <= 3){
            return(CoursePageStorage.courseArr[cardPositionData.courseIndex].courseData[Number(cardPositionData.row) + stepUp]
                .SameLine[cardPositionData.fragment].CourseFragment[Number(cardPositionData.buttonIndex) + stepRight].CourseElement.id)
        }else{
            return null
        }
    }

    //Обработчик реакций на нажатия кнопок навигации в карточке
    inCardButtonClickedHandler(clickedButtonName){
        if(clickedButtonName === "Next"){
            //!!!Очень важно!!! this.positionData - ОБЪЕКТ, его нужно преобразовывать через toJS
            const newCardPositionData = toJS(this.positionData)
            newCardPositionData.buttonIndex = Number(newCardPositionData.buttonIndex) + 1
            this.positionData = newCardPositionData
            this.selectedCardID = this.get_card_id_by_position(newCardPositionData)
        }
        if(clickedButtonName === "Back"){
            const newCardPositionData = toJS(this.positionData)
            newCardPositionData.buttonIndex = Number(newCardPositionData.buttonIndex) - 1
            this.positionData = newCardPositionData
            this.selectedCardID = this.get_card_id_by_position(newCardPositionData)
        }
        if(clickedButtonName === "Up"){
            const newCardPositionData = toJS(this.positionData)
            newCardPositionData.row = Number(newCardPositionData.row) - 1
            this.positionData = newCardPositionData
            this.selectedCardID = this.get_card_id_by_position(newCardPositionData)
        }
        if(clickedButtonName === "Down"){
            const newCardPositionData = toJS(this.positionData)
            newCardPositionData.row = Number(newCardPositionData.row) + 1
            this.positionData = newCardPositionData
            this.selectedCardID = this.get_card_id_by_position(newCardPositionData)
        }
    }

    //Обработчик выбора карточки в курсе по щелчку мыши (пользователь нажимает на кнопку с номером карточки и
    // его перекидывает в нее)
    cardSelectInCourseByMouseClick(data, courseIndex , courseID) {
        data.courseIndex = Number(courseIndex)
        data.courseID = Number(courseID)
        if(this.get_card_id_by_position(data)){
            this.selectedCardID = this.get_card_id_by_position(data)
            this.positionData = data
            this.isOpenCard = true
        }
    }

    //Обработчик нажатия пользователем кнопки "Назад" в карточки
    goBackButtonHandler() {
        this.isOpenCard = false
    }
    //computed для вычислений того, можно ли переклчиться в карточке вперед/назад/вверх/вних
    get disabledNext(){
        return(this.get_card_id_by_position(this.positionData, 1) === null)
    }
    get disabledBack(){
        return(this.get_card_id_by_position(this.positionData, -1) === null)
    }
    get disabledUp(){
        return(this.get_card_id_by_position(this.positionData, 0, -1) === null)
    }
    get disabledDown(){
        return(this.get_card_id_by_position(this.positionData, 0, +1) === null)
    }
}
export const  CoursePageStorage =  new CoursePage()