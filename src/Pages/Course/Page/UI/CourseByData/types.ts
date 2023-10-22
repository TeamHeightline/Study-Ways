export interface CourseElement {
    CourseElement: {
        id: string
    }
}

export interface CourseFragment {
    CourseFragment: CourseElement[]
}

export interface CourseLine {
    SameLine: CourseFragment[]
}


export interface ICourseData {
    id: number,
    name: string,
    course_data: CourseLine[],
    cards_cardcourseimage?: {
        image: string
    }
}

export interface ICoursePosition {
    activePage: number,
    selectedPage: number,
    selectedRow: number,
    selectedIndex: number,
}
