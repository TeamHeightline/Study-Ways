import {action, autorun, makeObservable, observable} from "mobx";
import {ClientStorage} from "../../ApolloStorage/ClientStorage";
import {GET_ALL_COURSE} from "./Struct";
import {CardCourseNode, Maybe} from "../../../../SchemaTypes";
import {sort} from "fast-sort";

class CoursePage{
    constructor() {
        makeObservable(this,{
            clientStorage: observable,
            courseArr: observable,
            positionData: observable,
            get_course_data: action,
            get_card_id_by_position: action,

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
    //action для получения всех данных о !курсах! и записывание их в courseArr
    get_course_data(){
        this.clientStorage.client.query({query: GET_ALL_COURSE})
            .then((data) => {
                    console.log(data?.data?.cardCourse)
                    this.courseArr = sort(data?.data?.cardCourse).asc((c: any) => c?.id)
            })
    }
    //парсит courseArr для получения id конкретной карточки в опрделенной позиции
    get_card_id_by_position(cardPositionData, stepRight = 0, stepUp = 0){
        // console.log(cardPositionData.row + stepUp)
        if(cardPositionData.buttonIndex + stepRight >= 0 && cardPositionData.buttonIndex + stepRight <= 11 &&
            Number(cardPositionData.row) + stepUp >= 0 && Number(cardPositionData.row) + stepUp <= 3){
            return(CoursePageStorage.courseArr[cardPositionData.courseIndex].courseData[Number(cardPositionData.row) + stepUp]
                .SameLine[cardPositionData.fragment].CourseFragment[Number(cardPositionData.buttonIndex) + stepRight].CourseElement.id)
        }else{
            return null
        }
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