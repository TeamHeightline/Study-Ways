import {autorun, makeAutoObservable, toJS} from "mobx";
import {GET_COURSES_ID} from "./Query";
import {ClientStorage} from "../../../../../Store/ApolloStorage/ClientStorage";

class CoursePageStore {
    constructor() {
        makeAutoObservable(this)
        autorun(() => this.loadCoursesID())
    }

    courses_array?: string[]

    get courseArray() {
        return (toJS(this.courses_array))
    }

    clientStorage = ClientStorage

    loadCoursesID() {
        try {
            this.clientStorage.client.query({
                query: GET_COURSES_ID,
                fetchPolicy: "network-only",
                variables: {}
            })
                .then((response) => response.data.cardCourse)
                .then((courses_array) => {
                    if (courses_array) {
                        this.courses_array = courses_array?.map((course_object) => course_object.id)
                    }
                })

        } catch (e) {
            console.log(e)
        }
    }
}

export const CPSObject = new CoursePageStore()

