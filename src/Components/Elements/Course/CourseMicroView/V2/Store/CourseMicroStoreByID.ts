import {autorun, makeAutoObservable, toJS} from "mobx";
import {SERVER_BASE_URL} from "../../../../../../settings";
import {ClientStorage} from "../../../../../../Store/ApolloStorage/ClientStorage";
import {GET_COURSE_DATA_BY_ID} from "../UI/Query";
import {CourseLines} from "../../../Editor/EditCourseByID";

export interface positionDataI {
    activePage: number,
    selectedPage?: number,
    selectedRow?: number,
    selectedIndex?: number,
}

export class CourseMicroStoreByID {
    constructor(id: number) {
        this.id = id
        makeAutoObservable(this)
        autorun(() => this.getCourseImage())
        autorun(() => this.getCourseData())
    }

    clientStorage = ClientStorage
    id?: number


    changeID = (course_id?: number) => {
        this.id = course_id;
    }

    //-------Данные курса -----------------------
    courseName?: string
    courseData = CourseLines

    positionData: positionDataI = {
        activePage: 1
    }

    get course() {
        return (toJS(this.courseData))
    }

    get position() {
        return (toJS(this.positionData))
    }

    //------Стрелочная навигация и получение ID карточки--------------

    get_card_id_by_position(selected_position: positionDataI): number | null {
        if (selected_position &&
            Number(selected_position.selectedIndex) >= 0 &&
            Number(selected_position.selectedIndex) <= 9 &&
            Number(selected_position.selectedRow) >= 0 &&
            Number(selected_position.selectedRow) <= 3) {
            try {
                return (this.course[Number(selected_position.selectedRow)]
                    .SameLine[Number(selected_position.selectedPage) - 1]
                    .CourseFragment[Number(selected_position.selectedIndex)]?.CourseElement?.id)
            } catch {
                return null
            }
        } else {
            return null
        }
    }

    getPositionByArrow = (arrow: "Back" | "Down" | "Up" | "Next") => {
        let scannedPosition = toJS(this.positionData)
        if (arrow == "Back") {
            scannedPosition.selectedIndex = Number(scannedPosition.selectedIndex) - 1
        }
        if (arrow == "Down") {
            scannedPosition.selectedRow = Number(scannedPosition.selectedRow) + 1
        }
        if (arrow == "Up") {
            scannedPosition.selectedRow = Number(scannedPosition.selectedRow) - 1
        }
        if (arrow == "Next") {
            scannedPosition.selectedIndex = Number(scannedPosition.selectedIndex) + 1
        }
        return scannedPosition
    }

    getCardIDByArrow(arrow: "Back" | "Down" | "Up" | "Next") {
        const scannedPosition = this.getPositionByArrow(arrow)
        return (this.get_card_id_by_position(scannedPosition))
    }

    // arrowClick(arrow: "Back" | "Down" | "Up" | "Next"){
    //     this.isPositionChanged = true
    //     this.positionData = this.getPositionByArrow(arrow)
    // }


    //----------------------------------------------------------------

    isPositionChanged = false

    changeActivePage = (e, value: number) => {
        this.isPositionChanged = true
        this.positionData.activePage = value
    }
    setActivePage = (value: number) => {
        this.changeActivePage(null, value)
    }

    changeCourseName = (course_name?: string) => {
        if (course_name) {
            this.courseName = course_name
        } else {
            this.courseName = "Название курса по умолчанию"
        }
    }

    getCourseData(useCache = true) {
        if (this.id) {
            try {
                this.clientStorage.client.query({
                    query: GET_COURSE_DATA_BY_ID,
                    fetchPolicy: useCache ? "cache-only" : "network-only",
                    variables: {
                        id: this.id
                    }
                })
                    .then((response) => response.data.cardCourseById)
                    .then((course_data) => {
                        if (course_data && course_data.id) {
                            this.changeCourseName(course_data.name)
                            this.courseData = course_data.courseData
                        }
                        if (useCache) {
                            this.getCourseData(false)
                        }
                    })

            } catch (e) {
                console.log(e)
                if (useCache) {
                    this.getCourseData(false)
                }
            }
        }
    }

    //Игнорирование URL роутинга, нужно для использования в качестве селектора

    isIgnoreRouteAfterSelect?: boolean = false
    changeIsIgnoreRouteAfterSelect = (ignore_or_not: boolean | undefined) => {
        this.isIgnoreRouteAfterSelect = ignore_or_not
    }


    //--------Изображение для курса------------------------------------------------
    courseImage?: string

    getCourseImage(useCache = true) {
        if (this.id) {
            fetch(SERVER_BASE_URL + "/cardfiles/course?id=" + this.id,
                {cache: useCache ? "force-cache" : "default"})
                .then((response) => response.json())
                .then((result) => {
                    // console.log('Success:', result);
                    if (result[0].image !== this.courseImage) {
                        this.courseImage = result[0].image
                    }
                    if (useCache) {
                        this.getCourseImage(false)
                    }
                })
                .catch(() => {
                    void (0)
                });
        }
    }

    //------------------------------------------------------------------------------------------------
}
