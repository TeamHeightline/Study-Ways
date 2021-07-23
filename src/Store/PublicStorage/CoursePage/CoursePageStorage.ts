import {action, makeObservable, observable, reaction} from "mobx";
import {ClientStorage} from "../../ApolloStorage/ClientStorage";
import {GET_ALL_COURSE} from "./Struct";

class CoursePage{
    constructor() {
        makeObservable(this,{
            clientStorage: observable,
            get_course_data: action,
            courseArr: observable,

        })
        reaction(()=>this.clientStorage.client, ()=>this.get_course_data())
    }
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage
    //Массив всех курсов
    courseArr = []
    get_course_data(){
        this.clientStorage.client.query({query: GET_ALL_COURSE})
            .then((data) => {
                    console.log(data)
            })
    }
}
export const  CoursePageStorage =  new CoursePage()